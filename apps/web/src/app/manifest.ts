import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Xenith",
    short_name: "Xenith",
    description: "Translate Text, Files & Korean Documents",
    start_url: "/",
    display: "standalone",
    background_color: "#0f172a",
    theme_color: "#4361EE",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
