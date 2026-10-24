#!/usr/bin/env bash
set -euo pipefail

# Offline tests for fetch_trends.py: the pure parsers of the sources whose
# feeds carry no machine-readable engagement (Techmeme, Reddit, HF Daily
# Papers), tie handling in scoring, disabled_sources, and backfill mode
# (--date) — the day window, source selection, and the guards around state.
#
# Backfill reaches only Hacker News and Hugging Face Daily Papers (the latter
# disabled by default), so it silently produces a much thinner digest than a
# live run. The guards tested here are what keep that from doing damage:
# overwriting a full raw.json with a reduced one, or rewriting seen.json with
# an out-of-order date so later runs mislabel what is new.

TEST_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)"
readonly TEST_DIR

python3 - "$TEST_DIR" <<'PY'
import contextlib
import io
import json
import sys
import tempfile
import urllib.error
from datetime import datetime, timedelta, timezone
from pathlib import Path

TEST_DIR = Path(sys.argv[1])
sys.path.insert(0, str(TEST_DIR))
import fetch_trends as ft  # noqa: E402

SKILL_DIR = TEST_DIR.parent

passed = failed = 0


def check(name, cond, detail=""):
    global passed, failed
    if cond:
        passed += 1
        print(f"  ok   {name}")
    else:
        failed += 1
        print(f"  FAIL {name} {detail}")


# --- day_window -------------------------------------------------------------

print("day_window")
start, end = ft.day_window("2026-08-05")
check("starts at local midnight", (start.hour, start.minute, start.second) == (0, 0, 0), start)
check("spans exactly one day", end - start == timedelta(days=1), end - start)
check("is timezone-aware", start.tzinfo is not None and end.tzinfo is not None)
check("matches the requested date", start.strftime("%Y-%m-%d") == "2026-08-05", start)
try:
    ft.day_window("2026/08/05")
    check("rejects a malformed date", False, "no ValueError")
except ValueError:
    check("rejects a malformed date", True)


# --- backfill source selection ---------------------------------------------

print("backfill source selection")
service_ids = {s["id"] for s in ft.SERVICES}
check("only historical sources are wired up",
      set(ft.BACKFILL_FETCHERS) == {"hackernews", "hfpapers"}, sorted(ft.BACKFILL_FETCHERS))
check("every backfill source is a real service",
      set(ft.BACKFILL_FETCHERS) <= service_ids, sorted(set(ft.BACKFILL_FETCHERS) - service_ids))


# --- parsers for sources without engagement counts ---------------------------

print("techmeme parser")
TM_HTML = """
<CITE>Jane Doe / <A HREF="https://wired.example/">Wired</A>:</CITE>
<span id="s0i1" pml="260812p1"></span>
<DIV CLASS="ii"><STRONG CLASS="L2"><A CLASS="ourh" HREF="https://a.example/one">Story one</A></STRONG>&nbsp; &mdash;&nbsp; First excerpt. </DIV>
<span id="s0i2" pml="260812p2"></span>
<DIV CLASS="dbpt">cluster sub-link without a headline</DIV>
<CITE>Bob / <A HREF="https://bb.example/">Bloomberg</A>:</CITE>
<span id="s0i3" pml="260812p3"></span>
<DIV CLASS="ii"><STRONG CLASS="L2"><A CLASS="ourh" HREF="https://b.example/two">Story two</A></STRONG>&nbsp; &mdash;&nbsp; Second excerpt. </DIV>
"""
tm = ft._techmeme_items(TM_HTML, {"260812p1": "2026-08-12T08:00:00-04:00"})
check("keeps only pml spans with a headline", len(tm) == 2, len(tm))
check("page order becomes the engagement signal",
      [i["engagement"] for i in tm] == [2, 1], [i["engagement"] for i in tm])
check("links the external article", tm[0]["url"] == "https://a.example/one", tm[0]["url"])
check("builds the permalink as comments_url",
      tm[0]["comments_url"] == "https://www.techmeme.com/260812/p1#a260812p1",
      tm[0]["comments_url"])
check("keeps the outlet, not the author", tm[0]["extra"] == "Wired", tm[0]["extra"])
check("finds the byline across a cluster boundary", tm[1]["extra"] == "Bloomberg", tm[1]["extra"])
check("strips the mdash separator from the excerpt",
      tm[0]["excerpt"] == "First excerpt.", repr(tm[0]["excerpt"]))
check("joins the RSS date by permalink id",
      tm[0]["published_at"] == "2026-08-12T08:00:00-04:00" and tm[1]["published_at"] is None,
      (tm[0]["published_at"], tm[1]["published_at"]))

print("reddit parser")
REDDIT_XML = """<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
<entry>
<content type="html">&amp;#32; submitted by &amp;#32; &lt;a href="https://www.reddit.com/user/alice"&gt; /u/alice &lt;/a&gt; &lt;br/&gt; &lt;span&gt;&lt;a href="https://ext.example/post"&gt;[link]&lt;/a&gt;&lt;/span&gt; &amp;#32; &lt;span&gt;&lt;a href="https://www.reddit.com/r/programming/comments/abc/x/"&gt;[comments]&lt;/a&gt;&lt;/span&gt;</content>
<id>t3_abc</id>
<link href="https://www.reddit.com/r/programming/comments/abc/x/" />
<published>2026-08-12T06:00:00+00:00</published>
<title>Link post</title>
</entry>
<entry>
<content type="html">&lt;!-- SC_OFF --&gt;&lt;div class="md"&gt;&lt;p&gt;Self post body.&lt;/p&gt;&lt;/div&gt;&lt;!-- SC_ON --&gt; &amp;#32; submitted by &amp;#32; &lt;a href="https://www.reddit.com/user/bob"&gt; /u/bob &lt;/a&gt; &lt;span&gt;&lt;a href="https://www.reddit.com/r/programming/comments/def/y/"&gt;[link]&lt;/a&gt;&lt;/span&gt; &lt;span&gt;&lt;a href="https://www.reddit.com/r/programming/comments/def/y/"&gt;[comments]&lt;/a&gt;&lt;/span&gt;</content>
<id>t3_def</id>
<link href="https://www.reddit.com/r/programming/comments/def/y/" />
<published>2026-08-12T05:00:00+00:00</published>
<title>Self post</title>
</entry>
</feed>"""
rd = ft._reddit_items(REDDIT_XML, "programming")
check("parses every entry", len(rd) == 2, len(rd))
check("listing order becomes the engagement signal",
      [i["engagement"] for i in rd] == [2, 1], [i["engagement"] for i in rd])
check("extracts the external article link", rd[0]["url"] == "https://ext.example/post", rd[0]["url"])
check("keeps the permalink as comments_url",
      rd[0]["comments_url"] == "https://www.reddit.com/r/programming/comments/abc/x/",
      rd[0]["comments_url"])
check("link posts get no excerpt", rd[0]["excerpt"] == "", repr(rd[0]["excerpt"]))
check("self posts keep their body as the excerpt",
      rd[1]["excerpt"] == "Self post body.", repr(rd[1]["excerpt"]))
check("tags the subreddit", rd[0]["extra"] == "r/programming", rd[0]["extra"])

print("reddit quota scheduling")
import time as _time  # noqa: E402

ft._reddit_schedule({"x-ratelimit-remaining": "3.0", "x-ratelimit-reset": "40"})
gap = ft._reddit_next[0] - _time.monotonic()
check("keeps steady spacing while quota remains",
      0 < gap <= ft._REDDIT_SPACING + 1, gap)
ft._reddit_schedule({"x-ratelimit-remaining": "0.0", "x-ratelimit-reset": "46"})
gap = ft._reddit_next[0] - _time.monotonic()
check("waits out the window once the quota is spent", gap > ft._REDDIT_SPACING, gap)
ft._reddit_schedule({"x-ratelimit-remaining": "0.0", "x-ratelimit-reset": "600"})
gap = ft._reddit_next[0] - _time.monotonic()
check("caps the wait", gap <= ft._REDDIT_MAX_WAIT + 1, gap)
ft._reddit_schedule(None)
gap = ft._reddit_next[0] - _time.monotonic()
check("tolerates missing headers", gap <= ft._REDDIT_SPACING + 1, gap)
ft._reddit_next[0] = 0.0

print("hf papers mapper")
HF_DATA = [
    {"title": "Paper A", "numComments": 4,
     "paper": {"id": "2608.11111", "upvotes": 10,
               "submittedOnDailyAt": "2026-08-12T00:00:00.000Z",
               "summary": "Abstract A", "ai_summary": "Short A"}},
    {"title": "Paper B", "numComments": 0,
     "paper": {"id": "2608.22222", "upvotes": 10,
               "submittedOnDailyAt": "2026-08-12T00:00:00.000Z",
               "summary": "Abstract B"}},
    {"title": "broken entry without a paper id", "paper": {}},
]
hf = ft._hf_items(HF_DATA, 30)
check("drops entries without a paper id", len(hf) == 2, len(hf))
check("engagement is upvotes + comments/2",
      [i["engagement"] for i in hf] == [12, 10], [i["engagement"] for i in hf])
check("links the HF paper page",
      hf[0]["url"] == "https://huggingface.co/papers/2608.11111", hf[0]["url"])
check("labels upvotes and comments",
      hf[0]["engagement_label"] == "▲10 / 4コメント", hf[0]["engagement_label"])
check("prefers ai_summary for the excerpt", hf[0]["excerpt"] == "Short A", hf[0]["excerpt"])
check("falls back to the abstract", hf[1]["excerpt"] == "Abstract B", hf[1]["excerpt"])
check("respects the limit", len(ft._hf_items(HF_DATA, 1)) == 1)


# --- product updates ----------------------------------------------------------

print("parse_date")
check("reads ISO 8601 with Z", ft.parse_date("2026-10-23T23:39:00Z").isoformat() == "2026-10-23T23:39:00+00:00")
check("reads RFC 2822", ft.parse_date("Fri, 23 Oct 2026 21:29:58 +0000").year == 2026)
check("reads a release-note heading", ft.parse_date("October 22, 2026").isoformat() == "2026-10-22T00:00:00+00:00")
check("returns None for prose", ft.parse_date("Later is now To-dos") is None)
check("returns None for empty", ft.parse_date("") is None)

print("update_cutoff")
cut = ft.update_cutoff({"updates_window_days": 3}, datetime(2026, 10, 24, 0, 30, tzinfo=timezone.utc))
check("floors to midnight UTC", cut == datetime(2026, 10, 21, tzinfo=timezone.utc), cut)
check("defaults to a week", ft.update_cutoff({}, datetime(2026, 10, 24, tzinfo=timezone.utc)).day == 17)

NOW = datetime(2026, 10, 24, 0, 30, tzinfo=timezone.utc)
CUTOFF = ft.update_cutoff({}, NOW)

print("feed entries")
RSS_XML = """<?xml version="1.0"?><rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>
<item><title>Copilot in Teams</title><link>https://gh.example/teams</link><pubDate>Fri, 23 Oct 2026 21:29:58 +0000</pubDate>
<category><![CDATA[Improvement]]></category><category><![CDATA[ecosystem &amp; accessibility]]></category><category><![CDATA[copilot]]></category>
<description>Short.</description><content:encoded><![CDATA[<p>Long <b>body</b> with a <!DOCTYPE html> quote.</p>]]></content:encoded></item>
<item><title>Codex CLI Release: 0.164.0</title><link>https://oa.example/#rel</link><pubDate>Fri, 23 Oct 2026 00:00:00 GMT</pubDate><description>0.164.0</description></item>
<item><title>Old story</title><link>https://gh.example/old</link><pubDate>Thu, 01 Oct 2026 00:00:00 +0000</pubDate><category>Release</category><description>old</description></item>
</channel></rss>"""
ATOM_XML = """<?xml version="1.0"?><feed xmlns="http://www.w3.org/2005/Atom">
<entry><title>CLI v4.11.0</title><link rel="alternate" href="https://slack.example/cli"/><link rel="self" href="https://slack.example/self"/>
<published>2026-10-22T00:00:00.000Z</published><category term="release"/><summary>Summary text</summary></entry></feed>"""
rss = list(ft._feed_entries(RSS_XML))
atom = list(ft._feed_entries(ATOM_XML))
check("keeps every category, entities decoded",
      rss[0]["categories"] == ["Improvement", "ecosystem & accessibility", "copilot"], rss[0]["categories"])
check("reads content:encoded", "Long" in rss[0]["encoded"])
check("tolerates a DOCTYPE quoted inside CDATA", len(rss) == 3)
check("reads the Atom alternate link, not self", atom[0]["link"] == "https://slack.example/cli", atom[0].get("link"))
check("reads Atom category terms", atom[0]["categories"] == ["release"])

print("rss update items")
served = {}
original_http_get = ft.http_get
ft.http_get = lambda url, headers=None: served[url]
try:
    served["https://f.example/feed/"] = RSS_XML
    src = {"kind": "rss", "url": "https://f.example/feed/", "name": "Changelog", "extra": "categories"}
    got = ft._rss_update_items(src, CUTOFF)
    check("drops entries older than the window", [i["title"] for i in got] == ["Copilot in Teams", "Codex CLI Release: 0.164.0"], [i["title"] for i in got])
    check("names the feed by the entry's categories",
          got[0]["extra"] == "Improvement, ecosystem & accessibility, copilot", got[0]["extra"])
    check("falls back to the feed name without categories", got[1]["extra"] == "Changelog", got[1]["extra"])
    check("stores the published date in UTC", got[0]["published_at"] == "2026-10-23T21:29:58+00:00", got[0]["published_at"])
    check("content is the stripped body", got[0]["content"] == "Long body with a quote.", repr(got[0]["content"]))
    check("excerpt is the description", got[0]["excerpt"] == "Short.", repr(got[0]["excerpt"]))
    check("no engagement", got[0]["engagement"] == 0 and got[0]["engagement_label"] == "")
    got = ft._rss_update_items({**src, "skip_title": r"^Codex CLI Release:"}, CUTOFF)
    check("skip_title removes matching titles", [i["title"] for i in got] == ["Copilot in Teams"])
    got = ft._rss_update_items({**src, "categories": ["Product"]}, CUTOFF)
    check("categories keeps only entries carrying one", got == [], [i["title"] for i in got])
    got = ft._rss_update_items({**src, "categories": ["copilot"]}, CUTOFF)
    check("categories matches any listed one", [i["title"] for i in got] == ["Copilot in Teams"])
    got = ft._rss_update_items({**src, "title": "Devin release notes ({title})"}, CUTOFF)
    check("title formats the entry title", got[0]["title"] == "Devin release notes (Copilot in Teams)", got[0]["title"])
    served["https://f.example/feed/?paged=2"] = RSS_XML
    served["https://f.example/feed/?paged=3"] = "<rss><channel></channel></rss>"
    fetched = []
    ft.http_get = lambda url, headers=None: (fetched.append(url), served[url])[1]
    got = ft._rss_update_items({**src, "pages": 4}, CUTOFF)
    check("stops paging once a page is older than the window", fetched == ["https://f.example/feed/"], fetched)
    fresh_xml = RSS_XML.replace("Thu, 01 Oct 2026", "Thu, 22 Oct 2026")
    served["https://f.example/feed/"] = fresh_xml
    served["https://f.example/feed/?paged=2"] = fresh_xml
    fetched.clear()
    got = ft._rss_update_items({**src, "pages": 4}, CUTOFF)
    check("reads on while pages stay inside the window and stops at an empty page",
          fetched == ["https://f.example/feed/", "https://f.example/feed/?paged=2", "https://f.example/feed/?paged=3"], fetched)
finally:
    ft.http_get = original_http_get

print("github releases")
RELEASES = [
    {"tag_name": "v2.1.310", "name": "v2.1.310", "draft": False, "prerelease": False,
     "published_at": "2026-10-23T23:39:00Z", "html_url": "https://gh.example/r/310",
     "body": "## What's changed\n- Added the [Monitor](https://x) tool"},
    {"tag_name": "rust-v0.165.0-alpha.1", "name": "0.165.0-alpha.1", "draft": False, "prerelease": True,
     "published_at": "2026-10-23T14:09:53Z", "html_url": "https://gh.example/r/alpha", "body": "Release"},
    {"tag_name": "v2.1.0", "name": "", "draft": False, "prerelease": False,
     "published_at": "2026-09-01T00:00:00Z", "html_url": "https://gh.example/r/old", "body": "old"},
    {"tag_name": "v9", "name": "v9", "draft": True, "prerelease": False,
     "published_at": "2026-10-23T00:00:00Z", "html_url": "https://gh.example/r/draft", "body": "draft"},
]
gh = ft._github_release_items(RELEASES, {"name": "Claude Code"}, CUTOFF)
check("keeps only stable releases inside the window", [i["url"] for i in gh] == ["https://gh.example/r/310"], [i["url"] for i in gh])
check("titles the release with the feed name and version", gh[0]["title"] == "Claude Code v2.1.310", gh[0]["title"])
check("flattens markdown links in the body", gh[0]["content"] == "## What's changed - Added the Monitor tool", repr(gh[0]["content"]))
check("names the feed", gh[0]["extra"] == "Claude Code")

print("claude platform notes")
PLATFORM_MD = """---
title: Claude Platform release notes
---

Intro paragraph.

### October 22, 2026

* We've launched [Claude Models on Google Cloud](https://p.example/gc), operated by Anthropic.
* [Fast mode](https://p.example/fast) is available for Claude Opus 5.5.

### October 1, 2026

* Something older.
"""
pl = ft._claude_platform_items(PLATFORM_MD, CUTOFF)
check("one item per dated section inside the window", len(pl) == 1, len(pl))
check("anchors the rendered heading", pl[0]["url"] == ft.CLAUDE_PLATFORM_URL + "#october-22-2026", pl[0]["url"])
check("joins the bullets as content, links flattened",
      pl[0]["content"] == "We've launched Claude Models on Google Cloud, operated by Anthropic. Fast mode is available for Claude Opus 5.5.",
      repr(pl[0]["content"]))
check("dates the section", pl[0]["published_at"] == "2026-10-22T00:00:00+00:00", pl[0]["published_at"])
check("titles it with the heading", pl[0]["title"] == "Claude Platform release notes (October 22, 2026)", pl[0]["title"])

print("claude apps notes")
APPS_HTML = """<h2 id="h_m">October 2026</h2>
<div><h3 id="h_90213b2c7a">October 21, 2026</h3></div>
<div><p><b>Claude Duet research preview</b></p></div>
<div><p>We just opened a research preview: <b><a href="https://c.example/duet">Introducing Claude Duet</a></b>.</p></div>
<div><p> </p></div>
<div><h3 id="h_7e1">October 7, 2026</h3></div>
<div><p><b>Claude Haiku 5.5 launch</b></p></div>
<div><p>We just launched Claude Haiku 5.5.</p></div>
<div><p><b>Monthly API credits for Max and Team plans</b></p></div>
<div><p>Max and Team plans now include monthly API credits.</p></div>
<div><p>They roll out over a few days.</p></div>
<div><h3 id="h_old">September 1, 2026</h3></div>
<div><p><b>Old entry</b></p></div><div><p>Old.</p></div>
"""
apps = ft._claude_apps_items(APPS_HTML, ft.update_cutoff({"updates_window_days": 20}, NOW))
check("one item per bold title paragraph", [i["title"] for i in apps] ==
      ["Claude Duet research preview", "Claude Haiku 5.5 launch", "Monthly API credits for Max and Team plans"],
      [i["title"] for i in apps])
check("dates entries by their h3", apps[1]["published_at"] == "2026-10-07T00:00:00+00:00", apps[1]["published_at"])
check("gathers the description paragraphs", apps[2]["content"] ==
      "Max and Team plans now include monthly API credits. They roll out over a few days.", repr(apps[2]["content"]))
check("builds a unique anchor per entry", apps[1]["url"] != apps[2]["url"] and apps[1]["url"].startswith(ft.CLAUDE_APPS_URL + "#h_7e1-"), apps[1]["url"])
check("stops at the first section older than the window", all("Old" not in i["title"] for i in apps))

print("slack help page")
SLACK_HTML = """<html><body><nav><h2>Site nav</h2></nav><div class="article_body"><p>See what's new.</p>
<h2 id="h_oct">\n<br>October 2026</h2><h3 id="h_a">Later is now To-dos</h3><p>Stay on top of <a href="https://s.example">deadlines</a>.</p><ul><li>Add a reminder.</li></ul>
<h3 id="h_b">Saved items have moved</h3><p>Previously archived items live in Saved.</p>
<h2 id="h_sep">September 2026</h2><h3 id="h_c">Sign in with a passkey</h3><p>Members can sign in with a fingerprint.</p>
<h2 id="h_aug">August 2026</h2><h3 id="h_d">Too old</h3><p>Dropped.</p></div><footer>Footer</footer></body></html>"""
sl = ft._slack_help_items(SLACK_HTML)
check("reads the two newest month sections only",
      [i["title"] for i in sl] == ["Later is now To-dos", "Saved items have moved", "Sign in with a passkey"], [i["title"] for i in sl])
check("anchors the h3 id", sl[0]["url"] == ft.SLACK_HELP_URL + "#h_a", sl[0]["url"])
check("leaves the date unknown", sl[0]["published_at"] is None)
check("carries the month in the feed name", sl[0]["extra"] == "What's new · October 2026", sl[0]["extra"])
check("content runs to the next heading",
      sl[0]["content"].endswith("Add a reminder.") and "Saved items" not in sl[0]["content"], repr(sl[0]["content"]))
check("the last entry does not swallow the footer", sl[2]["content"] == "Members can sign in with a fingerprint.", repr(sl[2]["content"]))

print("fetch_updates")
original_fetchers = dict(ft.UPDATE_FETCHERS)
try:
    ft.UPDATE_FETCHERS["ok1"] = lambda src, cutoff: [
        ft._update_item("B", "https://u.example/b", datetime(2026, 10, 22, tzinfo=timezone.utc), "", "", src["name"]),
        ft._update_item("dup", "https://u.example/a", None, "", "", src["name"]),
    ]
    ft.UPDATE_FETCHERS["ok2"] = lambda src, cutoff: [
        ft._update_item("A", "https://u.example/a", datetime(2026, 10, 23, tzinfo=timezone.utc), "", "", src["name"]),
        ft._update_item("undated", "https://u.example/c", None, "", "", src["name"]),
    ]
    def boom_fetch(src, cutoff):
        raise urllib.error.HTTPError(src.get("url", "x"), 403, "Forbidden", None, None)
    ft.UPDATE_FETCHERS["boom"] = boom_fetch
    product = {"id": "p", "label": "P", "sources": [
        {"kind": "ok1", "name": "One"}, {"kind": "boom", "name": "Two"}, {"kind": "ok2", "name": "Three"}]}
    res = ft.fetch_updates(product, {})
    check("stays ok while one feed fails", res["status"] == "ok")
    check("names the failed feed in the note", res["note"].startswith("取得失敗: Two (HTTPError"), res["note"])
    check("dedupes by url, first feed wins", [i["title"] for i in res["items"]] == ["B", "undated", "dup"] or
          [i["title"] for i in res["items"]] == ["B", "dup", "undated"], [i["title"] for i in res["items"]])
    check("orders newest first with undated entries last",
          [i["title"] for i in res["items"]][0] == "B" and res["items"][-1]["published_at"] is None, [i["title"] for i in res["items"]])
    try:
        ft.fetch_updates({"id": "p", "label": "P", "sources": [{"kind": "boom", "name": "Only"}]}, {})
        check("fails when every feed fails", False, "no exception")
    except RuntimeError as e:
        check("fails when every feed fails", "Only" in str(e), e)
finally:
    ft.UPDATE_FETCHERS.clear(); ft.UPDATE_FETCHERS.update(original_fetchers)

print("services")
ids = [s["id"] for s in ft.SERVICES]
check("service ids are unique", len(ids) == len(set(ids)), ids)
check("every product is registered under market updates",
      {s["id"] for s in ft.SERVICES if s["market"] == "updates"} == {p["id"] for p in ft.UPDATE_PRODUCTS})
check("every product feed kind has a fetcher",
      all(src["kind"] in ft.UPDATE_FETCHERS for p in ft.UPDATE_PRODUCTS for src in p["sources"]))


# --- tie handling in scoring --------------------------------------------------

print("add_base_scores ties")
score_now = datetime.now(timezone.utc)
tied = [
    ft.make_item("older of the tie", "https://t.example/1", 5, "",
                 (score_now - timedelta(hours=30)).isoformat()),
    ft.make_item("newer of the tie", "https://t.example/2", 5, "",
                 (score_now - timedelta(hours=1)).isoformat()),
    ft.make_item("clear top", "https://t.example/3", 9, "",
                 (score_now - timedelta(hours=1)).isoformat()),
]
ft.add_base_scores(tied, score_now)
check("the top item scores a full percentile", tied[2]["base_score"] == 100, tied[2]["base_score"])
check("ties are separated by freshness only",
      tied[1]["base_score"] > tied[0]["base_score"],
      (tied[0]["base_score"], tied[1]["base_score"]))
check("ties stay below the clear winner",
      max(tied[0]["base_score"], tied[1]["base_score"]) < tied[2]["base_score"])
same = [ft.make_item(f"i{k}", f"https://s.example/{k}", 7, "",
                     (score_now - timedelta(hours=1)).isoformat()) for k in range(3)]
ft.add_base_scores(same, score_now)
check("an all-tied batch scores uniformly",
      len({i["base_score"] for i in same}) == 1, [i["base_score"] for i in same])


# --- map_bounded --------------------------------------------------------------

print("map_bounded")
import threading  # noqa: E402
import time  # noqa: E402

FOREVER = threading.Event()  # never set: stands in for a lookup that never returns

check("keeps input order", ft.map_bounded(lambda x: x * 2, [3, 1, 2], 5) == [6, 2, 4])
check("handles an empty input", ft.map_bounded(lambda x: x, [], 5) == [])

t0 = time.monotonic()
res = ft.map_bounded(lambda x: FOREVER.wait() if x == "hang" else x, ["a", "hang", "b"], 0.5)
elapsed = time.monotonic() - t0
check("returns at the deadline despite a stuck call", elapsed < 2, f"{elapsed:.2f}s")
check("marks the stuck slot PENDING", res[1] is ft.PENDING, res)
check("keeps the results that finished", res[0] == "a" and res[2] == "b", res)


def boom(x):
    raise ValueError(x)


try:
    ft.map_bounded(boom, ["x"], 5)
    check("re-raises an exception from fn", False, "no ValueError")
except ValueError:
    check("re-raises an exception from fn", True)


# --- main() with the network stubbed out ------------------------------------

print("main")

STUB_ITEMS = [
    ft.make_item("stub a", "https://example.com/a", 50, "50pt", "2026-08-05T01:00:00Z"),
    ft.make_item("stub b", "https://example.com/b", 10, "10pt", "2026-08-05T02:00:00Z"),
]


def stub_fetch(cfg, start, end):
    return {"status": "ok", "items": [dict(i) for i in STUB_ITEMS]}


def failing_fetch(cfg, start, end):
    raise RuntimeError("stub failure")


def run_main(state_dir, argv_extra, fetchers):
    ft.BACKFILL_FETCHERS = fetchers
    ft.attach_comments = lambda services, cfg: None
    ft.attach_article_content = lambda services, cfg: None
    sys.argv = ["fetch_trends.py", "--skill-dir", str(SKILL_DIR),
                "--state-dir", str(state_dir), *argv_extra]
    return ft.main()


original_fetchers = dict(ft.BACKFILL_FETCHERS)
original_attach = ft.attach_comments
original_attach_content = ft.attach_article_content
original_live = [s["fetch"] for s in ft.SERVICES]
# The live path must never reach the network from a test.
for svc in ft.SERVICES:
    svc["fetch"] = lambda cfg: {"status": "ok", "items": [dict(i) for i in STUB_ITEMS]}
try:
    with tempfile.TemporaryDirectory() as tmp:
        state = Path(tmp)
        rc = run_main(state, ["--date", "2026-08-05"], {"hackernews": stub_fetch})
        raw_path = state / "runs" / "2026-08-05" / "raw.json"
        check("succeeds when a backfill source returns items", rc == 0, rc)
        check("writes raw.json under the target date", raw_path.exists())

        raw = json.loads(raw_path.read_text(encoding="utf-8"))
        by_id = {s["id"]: s for s in raw["services"]}
        check("stamps the target date, not today", raw["date"] == "2026-08-05", raw["date"])
        check("flags the run as a backfill", raw["backfill"] is True)
        check("fetches the historical source", by_id["hackernews"]["status"] == "ok")
        check("skips sources with no archive",
              all(by_id[i]["status"] == "skipped"
                  for i in ("lobsters", "reddit", "github", "techmeme",
                            "hatena", "zenn", "qiita")))
        check("skips the product updates too",
              all(by_id[p["id"]]["status"] == "skipped" for p in ft.UPDATE_PRODUCTS),
              [(p["id"], by_id[p["id"]]["status"]) for p in ft.UPDATE_PRODUCTS])
        check("the default config leaves dev.to and HF Papers out entirely",
              not ({"devto", "hfpapers"} & set(by_id)), sorted(by_id))
        check("explains why they were skipped",
              by_id["zenn"]["note"] == ft.BACKFILL_NOTE, by_id["zenn"]["note"])
        check("leaves seen.json alone", not (state / "seen.json").exists())

        # A second backfill must not clobber the first without --force.
        raw_path.write_text('{"sentinel": true}', encoding="utf-8")
        rc = run_main(state, ["--date", "2026-08-05"], {"hackernews": stub_fetch})
        check("refuses to overwrite an existing run", isinstance(rc, str), rc)
        check("names --force in the refusal", isinstance(rc, str) and "--force" in rc, rc)
        check("leaves the existing file untouched",
              json.loads(raw_path.read_text(encoding="utf-8")) == {"sentinel": True})

        rc = run_main(state, ["--date", "2026-08-05", "--force"], {"hackernews": stub_fetch})
        check("overwrites when --force is given", rc == 0, rc)

    with tempfile.TemporaryDirectory() as tmp:
        state = Path(tmp)
        rc = run_main(state, ["--date", "2026-08-05"], {"hackernews": failing_fetch})
        check("fails when every attempted source errored", rc == 1, rc)

    with tempfile.TemporaryDirectory() as tmp:
        state = Path(tmp)
        rc = run_main(state, ["--date", "2026/08/05"], {})
        check("rejects a malformed --date", isinstance(rc, str), rc)

    with tempfile.TemporaryDirectory() as tmp:
        state = Path(tmp)
        today = datetime.now().astimezone().strftime("%Y-%m-%d")
        # --date pointing at today is a normal run: it must not fall back to
        # the reduced source set.
        rc = run_main(state, ["--date", today], {"hackernews": failing_fetch})
        raw = json.loads((state / "runs" / today / "raw.json").read_text(encoding="utf-8"))
        check("treats --date today as a live run", raw["backfill"] is False)
        check("writes seen.json on a live run", (state / "seen.json").exists())

    with tempfile.TemporaryDirectory() as tmp:
        state = Path(tmp)
        today = datetime.now().astimezone().strftime("%Y-%m-%d")
        # /a was first seen on an earlier day: a trend service badges it, a
        # product drops it; /b is new to both.
        (state / "seen.json").write_text(json.dumps({"https://example.com/a": "2026-01-01"}), encoding="utf-8")
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            rc = run_main(state, [], {})
        raw = json.loads((state / "runs" / today / "raw.json").read_text(encoding="utf-8"))
        by_id = {s["id"]: s for s in raw["services"]}
        check("registers the products under market updates",
              all(by_id[p["id"]]["market"] == "updates" for p in ft.UPDATE_PRODUCTS))
        check("a trend service keeps a seen item with the badge",
              [(i["url"], i["seen_before"]) for i in by_id["hackernews"]["items"]] ==
              [("https://example.com/a", True), ("https://example.com/b", False)],
              by_id["hackernews"]["items"])
        check("a product drops the seen item",
              [i["url"] for i in by_id["claude"]["items"]] == ["https://example.com/b"],
              [i["url"] for i in by_id["claude"]["items"]])
        check("product items carry no score", by_id["claude"]["items"][0]["base_score"] == 0)
        check("reports the dropped count", "claude" in out.getvalue() and "既出 1 件を除外" in out.getvalue(), out.getvalue())
        seen = json.loads((state / "seen.json").read_text(encoding="utf-8"))
        check("records the kept product item as seen today", seen.get("https://example.com/b") == today)
        # Rerunning on the same day keeps what was first seen today.
        with contextlib.redirect_stdout(io.StringIO()):
            run_main(state, [], {})
        raw = json.loads((state / "runs" / today / "raw.json").read_text(encoding="utf-8"))
        by_id = {s["id"]: s for s in raw["services"]}
        check("a same-day rerun keeps the product item",
              [i["url"] for i in by_id["claude"]["items"]] == ["https://example.com/b"])

    with tempfile.TemporaryDirectory() as tmp:
        state = Path(tmp)
        today = datetime.now().astimezone().strftime("%Y-%m-%d")
        (state / "config.json").write_text(
            json.dumps({"disabled_sources": ["zenn", "nosuch"]}), encoding="utf-8")
        out = io.StringIO()
        with contextlib.redirect_stdout(out):
            rc = run_main(state, [], {})
        raw = json.loads((state / "runs" / today / "raw.json").read_text(encoding="utf-8"))
        ids = [s["id"] for s in raw["services"]]
        check("succeeds with a source disabled", rc == 0, rc)
        check("drops a disabled source from the live run", "zenn" not in ids, ids)
        check("keeps every other source", set(ids) == service_ids - {"zenn"}, sorted(ids))
        check("never reports a disabled source as skipped",
              all(s["status"] == "ok" for s in raw["services"]),
              [(s["id"], s["status"]) for s in raw["services"]])
        check("names the disabled sources in the summary",
              "DISABLED: zenn (" in out.getvalue(), out.getvalue())
        check("warns about an unknown id", "nosuch" in out.getvalue(), out.getvalue())

    with tempfile.TemporaryDirectory() as tmp:
        state = Path(tmp)
        today = datetime.now().astimezone().strftime("%Y-%m-%d")
        original_deadline = ft.PHASE_DEADLINE
        hn = next(s for s in ft.SERVICES if s["id"] == "hackernews")
        hn_fetch = hn["fetch"]
        hn["fetch"] = lambda cfg: FOREVER.wait()
        ft.PHASE_DEADLINE = 0.5
        try:
            t0 = time.monotonic()
            with contextlib.redirect_stdout(io.StringIO()):
                rc = run_main(state, [], {})
            elapsed = time.monotonic() - t0
        finally:
            ft.PHASE_DEADLINE = original_deadline
            hn["fetch"] = hn_fetch
        raw = json.loads((state / "runs" / today / "raw.json").read_text(encoding="utf-8"))
        by_id = {s["id"]: s for s in raw["services"]}
        check("finishes a live run despite a hung source", rc == 0 and elapsed < 3,
              (rc, f"{elapsed:.2f}s"))
        check("reports the hung source as an error with a note",
              by_id["hackernews"]["status"] == "error" and "打ち切り" in by_id["hackernews"]["note"],
              by_id["hackernews"])
        check("keeps the sources that answered", by_id["lobsters"]["status"] == "ok",
              by_id["lobsters"]["status"])
finally:
    ft.BACKFILL_FETCHERS = original_fetchers
    ft.attach_comments = original_attach
    ft.attach_article_content = original_attach_content
    for svc, fetch in zip(ft.SERVICES, original_live):
        svc["fetch"] = fetch

print(f"\n{passed} passed, {failed} failed")
sys.exit(1 if failed else 0)
PY
