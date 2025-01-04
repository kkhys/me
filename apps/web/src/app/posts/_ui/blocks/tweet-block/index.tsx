import { Tweet as ReactTweet } from "react-tweet";

export const TweetBlock = ({ tweetId }: { tweetId: string }) => (
  <div className="flex justify-center [&>div]:m-0">
    <ReactTweet id={tweetId} />
  </div>
);
