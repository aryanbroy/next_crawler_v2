# YouTube Playlist Crawler & Analytics

This project is a web application that crawls a provided YouTube playlist, extracts data about the playlist (including video titles, thumbnails, views, and channel names), and displays the data in a user-friendly format. It also uses Recharts to visualize the number of views each video in the playlist has received, allowing users to analyze video performance and provide feedback on which videos are gaining more reach.

## Features
- **YouTube Playlist Crawler:** Fetches playlist data including:
    - Video Title
    - Video Thumbnail
    - Views Count
    - Channel Name
- **Graphical Visualization:** Uses Recharts to show a line chart of the views for each video in the playlist.
- **Feedback & Insights:** Allows users to analyze video performance and easily spot trends in reach and popularity.


## Technologies Used
- Nextjs along with typescript for frontend as well as backend
- Recharts for data visualization
- Crawlee along with Playwright crawler to crawl provided youtube playlist url
- Shadcn for frontend components

## Installation
To set up and run the project locally, follow these steps:

### Prerequisites
- **Node.js** and **npm** installed on your machine. 

## Steps
1. Clone the repository:

```
git clone git@github.com:aryanbroy/next_crawler_v2.git
cd next_crawler_v2
```

2. Install the dependencies:

```
npm install
```
3. Run it on your local machine:

```
npm run dev
```

The application will run on http://localhost:3000

## Usage

1. **Provide Playlist URL**: Enter the url of the YouTube playlist you want to analyze in the input field.
2. **View Playlist Data**: The app will display the key information such as video titles, thumbnail, views and the channel name for each video in the playlist.
3. **Analyze Views:** Use the graph powered by Recharts to analyze video performance and view which videos are getting the most views.