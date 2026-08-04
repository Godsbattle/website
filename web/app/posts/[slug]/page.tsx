import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ViewTransition } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { YouTubeLite } from "@/components/youtube-lite";
import { getAllPostSlugs, getPost, getPostNav } from "@/lib/posts";
import "lite-youtube-embed/src/lite-yt-embed.css";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/posts/[slug]">
): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.displayTitle,
    description: post.excerpt || undefined,
    openGraph: post.hasFeaturedImage
      ? { images: [`/posts/${post.slug}/featured.webp`] }
      : undefined,
  };
}

export default async function PostPage(props: PageProps<"/posts/[slug]">) {
  const { slug } = await props.params;
  const [post, nav] = await Promise.all([getPost(slug), getPostNav(slug)]);
  if (!post) notFound();

  return (
    <>
      <SiteHeader />
      <YouTubeLite />
      <main id="main" className="mx-auto max-w-[680px] px-6 pt-14 pb-32 sm:pt-20">
        <article>
          <header className="mb-10">
            {post.date ? (
              <time
                dateTime={post.date}
                className="text-[13px] text-muted tabular-nums"
              >
                {formatDate(post.date)}
              </time>
            ) : null}
            <h1 className="mt-3 text-[32px] font-medium leading-[1.15] tracking-tight text-foreground sm:text-[36px]">
              {post.displayTitle}
            </h1>
            {post.heroYouTubeId ? (
              <ViewTransition
                name={`post-hero-${post.slug}`}
                default="post-hero-transition"
              >
                <div className="mt-10 overflow-hidden rounded-xl ring-1 ring-foreground/[0.08]">
                  <lite-youtube
                    videoid={post.heroYouTubeId}
                    playlabel={post.heroYouTubeLabel ?? "Play"}
                  />
                </div>
              </ViewTransition>
            ) : post.hasFeaturedImage ? (
              <ViewTransition
                name={`post-hero-${post.slug}`}
                default="post-hero-transition"
              >
                <div className="mt-10 overflow-hidden rounded-xl bg-card ring-1 ring-foreground/[0.08]">
                  <Image
                    src={`/posts/${post.slug}/featured.webp`}
                    alt=""
                    width={1280}
                    height={720}
                    sizes="(min-width: 768px) 680px, 100vw"
                    priority
                    className="aspect-[16/9] w-full object-cover"
                  />
                </div>
              </ViewTransition>
            ) : null}
          </header>

          <div className="prose">{post.content}</div>
        </article>

        {(nav.older || nav.newer) ? (
          <nav
            aria-label="more posts"
            className="mt-28"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {nav.newer ? (
                <Link
                  href={`/posts/${nav.newer.slug}/`}
                  className="group block rounded-lg p-3 -mx-3 hover:bg-muted/10"
                >
                  <p className="flex items-center gap-1.5 text-[12px] text-muted">
                    <ArrowLeft
                      aria-hidden
                      className="h-3 w-3 transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
                      strokeWidth={2}
                    />
                    newer
                  </p>
                  <p className="mt-1.5 text-[14px] font-medium leading-snug text-foreground/85 group-hover:text-foreground">
                    {nav.newer.displayTitle}
                  </p>
                </Link>
              ) : (
                <span aria-hidden />
              )}
              {nav.older ? (
                <Link
                  href={`/posts/${nav.older.slug}/`}
                  className="group block rounded-lg p-3 -mx-3 text-right hover:bg-muted/10 sm:text-right"
                >
                  <p className="flex items-center justify-end gap-1.5 text-[12px] text-muted">
                    older
                    <ArrowRight
                      aria-hidden
                      className="h-3 w-3 transition-transform duration-200 ease-out group-hover:translate-x-0.5"
                      strokeWidth={2}
                    />
                  </p>
                  <p className="mt-1.5 text-[14px] font-medium leading-snug text-foreground/85 group-hover:text-foreground">
                    {nav.older.displayTitle}
                  </p>
                </Link>
              ) : null}
            </div>
            <div className="mt-12">
              <Link
                href="/posts/"
                className="group inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-foreground"
              >
                <ArrowLeft
                  aria-hidden
                  className="h-3.5 w-3.5 transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
                  strokeWidth={2}
                />
                all writing
              </Link>
            </div>
          </nav>
        ) : (
          <footer className="mt-28">
            <Link
              href="/posts/"
              className="group inline-flex items-center gap-1.5 text-[14px] text-foreground/80 hover:text-foreground"
            >
              <ArrowLeft
                aria-hidden
                className="h-3.5 w-3.5 text-muted/70 transition-transform duration-200 ease-out group-hover:-translate-x-0.5"
                strokeWidth={2}
              />
              all writing
            </Link>
          </footer>
        )}
      </main>
    </>
  );
}

function formatDate(iso: string): string {
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
