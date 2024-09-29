import { Dataset, PlaywrightCrawler } from "crawlee";
import path from "path";
import * as fs from "fs/promises";

type VideoDetail = {
  title: string;
  thumbnail: string;
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

            const result = {
              title: videoTitle,
              thumbnail: videoThumbnail,
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
  runCrawler(startUrl)
    .then((results) => {
      console.log("---RESULT_START---");
      console.log(JSON.stringify(results));
      console.log("---RESULT_END---");
    })
    .catch((error) => {
      console.log(error);
      process.exit(1);
    });
} else {
  console.log("Hello this is something else");
}