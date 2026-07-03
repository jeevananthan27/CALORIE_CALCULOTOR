import React from "react";

export default function WaveDivider({ flip = false }) {
  return (
    <div className={`w-full overflow-hidden leading-[0] ${flip ? "rotate-180" : ""}`} style={{ height: 64 }} aria-hidden="true">
      <div className="flex w-[200%] h-full">
        <svg className="wave-layer" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
          <path d="M0,40 C150,90 350,0 600,40 C850,80 1050,10 1200,50 L1200,120 L0,120 Z" fill="var(--ink)" opacity="0.06" />
        </svg>
        <svg className="wave-layer" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
          <path d="M0,40 C150,90 350,0 600,40 C850,80 1050,10 1200,50 L1200,120 L0,120 Z" fill="var(--ink)" opacity="0.06" />
        </svg>
      </div>
      <div className="flex w-[200%] h-full -mt-16">
        <svg className="wave-layer slow" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
          <path d="M0,60 C200,10 400,100 600,55 C800,10 1000,90 1200,45 L1200,120 L0,120 Z" fill="var(--citrus)" opacity="0.16" />
        </svg>
        <svg className="wave-layer slow" viewBox="0 0 1200 120" preserveAspectRatio="none" style={{ width: "50%", height: "100%" }}>
          <path d="M0,60 C200,10 400,100 600,55 C800,10 1000,90 1200,45 L1200,120 L0,120 Z" fill="var(--citrus)" opacity="0.16" />
        </svg>
      </div>
    </div>
  );
}
