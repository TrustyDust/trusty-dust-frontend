// components/BackgroundVideo.tsx
import React from "react";

const BackgroundVideo: React.FC = () => {
  return (
    <>
      {/* Video element: fixed, fill, object-cover */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        // path file yang kamu upload; untuk produksi pindahkan file ke /public lalu ganti src ke "/Bg-TrustyDust.mp4"
        src={"/Bg-TrustyDust.mp4"}
        className="fixed inset-0 w-full h-full object-cover pointer-events-none -z-50"
        aria-hidden="true"
      />

      {/* Optional overlay supaya teks tetap terbaca */}
      <div className="fixed inset-0 bg-black/30 pointer-events-none -z-40" />
    </>
  );
};

export default BackgroundVideo;
