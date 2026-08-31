import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "christian obanaka",
    short_name: "godsbattle",
    description:
      "Software engineer and futures trader building products for trading and fintech.",
    start_url: "/",
    display: "minimal-ui",
    background_color: "#fcfcfc",
    theme_color: "#fcfcfc",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
