"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function VideoPlayer() {
  const params = useSearchParams();
  const src = params.get("src");

  if (!src) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white text-lg">
        No video source provided.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black p-4">
      <video
        src={decodeURIComponent(src)}
        controls
        autoPlay
        className="max-w-full max-h-screen rounded shadow-lg"
        style={{ maxHeight: "90vh" }}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

export default function VideoPlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen bg-black text-white">
          Loading...
        </div>
      }
    >
      <VideoPlayer />
    </Suspense>
  );
}
