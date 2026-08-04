import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ViewTransition } from "react";
import { SiteHeader } from "@/components/site-header";
import { getAllPostMeta, type PostMeta } from "@/lib/posts";

export const metadata: Metadata = {
  title: "writing archive",
  description:
    "Earlier PC-optimization tutorials and technical notes from the godsbattle archive.",
};

function formatShortDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d
    .toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toLowerCase();
}

export default async function PostsIndex() {
  const posts = await getAllPostMeta();

  return (
    <>
      <SiteHeader wide />
      <main id="main" className="mx-auto max-w-[1080px] px-6 pt-16 pb-32 sm:pt-20">
        <header className="mb-16 max-w-[680px]">
          <h1 className="text-[28px] font-medium tracking-tight text-foreground sm:text-[32px]">
            writing archive
          </h1>
          <p className="mt-2 text-[14px] leading-[1.65] text-muted">
            {posts.length} earlier technical notes and companions to the
            godsbattle channel.
          </p>
        </header>

        <ul className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <PostThumb post={post} eager={i < 6} />
            </li>
          ))}
        </ul>
      </main>
    </>
  );
}

function PostThumb({ post, eager }: { post: PostMeta; eager: boolean }) {
  const isVideo = !!post.heroYouTubeId;
  return (
    <Link
      href={`/posts/${post.slug}/`}
      className="group block"
    >
      <ViewTransition
        name={`post-hero-${post.slug}`}
        default="post-hero-transition"
      >
        <div className="relative overflow-hidden rounded-xl ring-1 ring-foreground/[0.06]">
          <div className="relative aspect-video w-full bg-muted/10">
            {post.hasFeaturedImage ? (
              <Image
                src={`/posts/${post.slug}/featured.webp`}
                alt=""
                fill
                sizes="(min-width: 1024px) 330px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                loading={eager ? "eager" : "lazy"}
                priority={eager}
              />
            ) : null}
          {isVideo ? (
            <span
              aria-label="video"
              className="pointer-events-none absolute bottom-2.5 right-2.5 grid h-7 w-7 place-items-center rounded-full bg-black/55 text-white backdrop-blur-md transition-transform duration-300 group-hover:scale-110"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-3.5 w-3.5 translate-x-[0.5px] fill-white"
                aria-hidden
              >
                {/* triangle bbox-centered in the viewBox; the 0.5px translate is
                    the optical nudge toward the pointing direction */}
                <polygon points="7.25,5.5 7.25,18.5 16.75,12" />
              </svg>
            </span>
          ) : null}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.18), rgba(0,0,0,0) 38%)",
              }}
            />
          </div>
        </div>
      </ViewTransition>
      <div className="mt-4 px-0.5">
        <p className="text-[14.5px] font-medium leading-snug tracking-tight text-foreground transition-colors duration-200 group-hover:text-foreground/65">
          {post.displayTitle}
        </p>
        {post.date ? (
          <time
            dateTime={post.date}
            className="mt-1.5 block text-[13px] text-muted tabular-nums"
          >
            {formatShortDate(post.date)}
          </time>
        ) : null}
      </div>
    </Link>
  );
}
