"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { AlertCircle, PlayCircle } from "lucide-react";
import axios, { AxiosError } from "axios";
import { validateYoutubeUrl } from "@/lib/utils";

interface Video {
  channelName: string;
  title: string;
  totalViews: number;
  thumbnail: string;
  videoLink: string;
}

interface PlaylistData {
  videos: Video[];
}

export default function DarkModePlaylistAnalyzerLineChart() {
  const [playlistUrl, setPlaylistUrl] = useState("");
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const initialPlaylistData = async () => {
      const res = await axios.get("/api/crawler");
      const data = res.data;
      console.log(data);
      setPlaylistData({ videos: data });
    };
    initialPlaylistData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setPlaylistUrl("");

    try {
      const isYtPlaylistLink = validateYoutubeUrl(playlistUrl);
      if (!isYtPlaylistLink) {
        setError("Provided link is not a youtube playlist link!");
        return;
      }
      const res = await axios.post("/api/crawler/runCrawl", {
        url: playlistUrl,
      });
      const data = res.data;
      setPlaylistData({ videos: data });
    } catch (err) {
      console.log(err);
      if (err instanceof AxiosError) {
        setError(
          err.response?.data.message ||
            "Error occurred while fetching playlist data."
        );
      } else {
        setError("Error occurred! Please try again later.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-gray-100">
      <header className="shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold mb-4">YouTube Playlist Analyzer</h1>
          <p className="text-gray-400 mb-4">
            Enter a YouTube playlist URL to analyze its performance and see
            detailed statistics.
          </p>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              type="url"
              placeholder="Enter YouTube playlist URL"
              value={playlistUrl}
              onChange={(e) => setPlaylistUrl(e.target.value)}
              required
              className="flex-grow rounded-md text-white placeholder-gray-400 border-gray-600"
            />
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </Button>
          </form>
        </div>
      </header>

      {error && (
        <div className="container mx-auto px-4 py-4">
          <div
            className="bg-red-900 border-l-4 border-red-500 text-red-100 p-4"
            role="alert"
          >
            <div className="flex">
              <AlertCircle className="h-6 w-6 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {playlistData && (
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <section className="space-y-8">
              <Card className="border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Video List</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {playlistData.videos.map((video, index) => (
                      <li
                        key={index}
                        className="flex items-start space-x-4 hover:bg-gray-800 p-4 rounded-lg"
                        onClick={() => window.open(video.videoLink, "_blank")}
                      >
                        <img
                          src={video.thumbnail}
                          alt={`Thumbnail for ${video.title}`}
                          className="w-30 h-20 object-cover rounded"
                        />
                        <div className="flex-grow">
                          <h3 className="font-medium text-white">
                            {video.title}
                          </h3>
                          <p className="text-sm text-gray-400">
                            {video.totalViews.toLocaleString()} views
                          </p>
                        </div>
                        <PlayCircle className="h-6 w-6 text-blue-500" />
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </section>

            <section className="space-y-8">
              <Card className="border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">
                    Video Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={playlistData.videos}>
                      <XAxis
                        dataKey="title"
                        stroke="#9CA3AF"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "none",
                          color: "#fff",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="totalViews"
                        stroke="#60A5FA"
                        strokeWidth={2}
                        dot={{ fill: "#60A5FA", strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </section>
          </div>
        </main>
      )}
    </div>
  );
}
