import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { SocialCard, socialImageSize } from "../../_components/social-card";

export const dynamic = "force-static";

export async function GET() {
  const geist = await readFile(
    join(process.cwd(), "node_modules/next/dist/compiled/@vercel/og/Geist-Regular.ttf"),
  );

  return new ImageResponse(
    <SocialCard
      index="01 / PORTFOLIO"
      eyebrow="Portfolio"
      title="Software engineer."
      description="I build clear, polished products for traders."
      footer="SOFTWARE ENGINEERING · PRODUCT DESIGN"
    />,
    {
      ...socialImageSize,
      fonts: [{ name: "Geist", data: geist, weight: 400, style: "normal" }],
      headers: {
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    },
  );
}
