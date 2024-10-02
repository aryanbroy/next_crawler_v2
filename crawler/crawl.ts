import { Dataset, PlaywrightCrawler } from "crawlee";
import path from "path";
import * as fs from "fs/promises";
import { validateYoutubeUrl } from "@/lib/utils";

type VideoDetail = {
  title: string;
  thumbnail: string;
  channelName: string;
  totalViews: number;
};

export async function runCrawler(url: string) {
  const results: VideoDetail[] = [];
  const crawler = new PlaywrightCrawler({
    requestHandler: async ({ page }) => {
      await page.waitForSelector("ytd-playlist-video-renderer");

      const videoDetails = await page.$$eval(
        "ytd-playlist-video-renderer",
        (videoDiv) => {
          const videoDetail = videoDiv.map((video) => {
            const insideVideoDiv = video.querySelector(
              "div#content > div#container"
            );
            const videoElement = insideVideoDiv?.querySelector(
              "div#meta > h3 > a#video-title"
            );

            const videoTitle = videoElement
              ? (videoElement as HTMLElement).title
              : "";

            const videoThumbnailElement = insideVideoDiv?.querySelector(
              "ytd-thumbnail#thumbnail > a#thumbnail > yt-image > img"
            );

            const videoThumbnail = videoThumbnailElement
              ? (videoThumbnailElement as HTMLImageElement).src
              : "";

            const channelNameElement = insideVideoDiv?.querySelector(
              "div#meta > ytd-video-meta-block > div#metadata > div#byline-container > ytd-channel-name > div#container > div#text-container > yt-formatted-string > a"
            );

            const channelName = channelNameElement
              ? (channelNameElement as HTMLElement).textContent
              : "";

            const viewsElement = insideVideoDiv?.querySelector(
              "div#content > div#container > div#meta > ytd-video-meta-block > div#metadata > div#byline-container > yt-formatted-string > span"
            );

            const viewsString = viewsElement
              ? (viewsElement as HTMLElement).textContent
              : "";

            const views = viewsString?.split(" ")[0];
            let totalViews;
            if (views?.includes("K")) {
              totalViews = Number(views.slice(0, views.length - 1)) * 1000;
            } else if (views?.includes("M")) {
              totalViews = Number(views.slice(0, views.length - 1)) * 1000000;
            } else {
              totalViews = Number(views);
            }

            const videoLink = (videoElement as HTMLLinkElement).href;

            const result = {
              title: videoTitle,
              thumbnail: videoThumbnail,
              channelName: channelName || "",
              totalViews: totalViews || 0,
              videoLink: videoLink || "",
            };

            return result;
          });
          return videoDetail;
        }
      );
      // console.log(videoDetails);
      results.push(...videoDetails);
      await Dataset.pushData(videoDetails);

      const datadir = path.join(process.cwd(), "data");
      await fs.mkdir(datadir, { recursive: true });
      await fs.writeFile(
        path.join(datadir, "crawled-data.json"),
        JSON.stringify(videoDetails)
      );

      console.log("Crawling finished");
    },
  });
  await crawler.run([url]);
  // console.log(results);
  return results;
}

// runCrawler(
//   "https://www.youtube.com/playlist?list=PLA1PbPOIrviLBEQpomRD3J9L6UgCS1eWl"
// );

if (require.main === module) {
  const startUrl = process.argv[2];
  if (!startUrl) {
    console.log("Please provide a start url");
    process.exit(1);
  }

  const isYtUrl = validateYoutubeUrl(startUrl);
  if (!isYtUrl) {
    console.log("Provided link is not a playlist link!");
    process.exit(1);
  }
  runCrawler(startUrl)
    .then((results) => {
      console.log("---RESULT_START---");
      console.log(JSON.stringify(results));
      console.log("---RESULT_END---");
    })
    .catch((error) => {
      console.log(error);
      console.log("Not a youtube link");
      process.exit(1);
    });
} else {
  console.log("Hello this is something else");
}