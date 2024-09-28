import { PlaywrightCrawler } from "crawlee";

const crawler = new PlaywrightCrawler({
  requestHandler: async ({ page }) => {
    // better way
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
    console.log(videoDetails);
  },
});

async function runCrawler() {
  await crawler.run([
    "https://www.youtube.com/playlist?list=PLRD1Niz0lz1sfeX5UEGzkC3HJGpPOE96b",
  ]);
}

runCrawler();
