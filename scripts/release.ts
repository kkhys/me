import { release } from "@kkhys/release";

// Monorepo-wide release: tags the kkhys/me repository (which now holds both
// apps) and creates a matching GitHub Release. Both apps deploy independently;
// this is the single release flow for the whole repo.
await release({ repoName: "me" });
