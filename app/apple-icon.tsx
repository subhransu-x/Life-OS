import { ImageResponse } from "next/og";

export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#05070B",
          position: "relative",
        }}
      >
        <svg
          width="120"
          height="120"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="12" cy="12" r="8" stroke="#00E5FF" strokeWidth="1.5" strokeOpacity="0.3" />
          <line x1="12" y1="2" x2="12" y2="4" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="12" y1="20" x2="12" y2="22" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="12" x2="4" y2="12" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="20" y1="12" x2="22" y2="12" stroke="#00E5FF" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M12 16V8M12 8L9 11M12 8L15 11" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
