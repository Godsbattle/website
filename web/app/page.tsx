import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { siGithub, siX, siYoutube } from "simple-icons";
import { BrandIcon } from "@/components/brand-icon";
import { CopyEmailButton } from "@/components/copy-email-button";
import { SendMessageButton } from "@/components/send-message-button";
import { getAllPostMeta } from "@/lib/posts";

const SITE_URL = "https://godsbattle.net";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Christian Obanaka",
  alternateName: "chrisgoingturbo",
  url: SITE_URL,
  image: `${SITE_URL}/avatar.webp`,
  jobTitle: "Design engineer",
  description:
    "Design engineer and futures trader creating product experiences for trading and fintech companies.",
  sameAs: [
    "https://github.com/chrisgoingturbo",
    "https://x.com/chrisgoingturbo",
    "https://youtube.com/godsbattle",
  ],
  knowsAbout: [
    "Product design",
    "Interface design",
    "Frontend development",
    "Futures trading",
    "Prop firms",
    "Community operations",
  ],
};

export default async function Home() {
  const allPosts = await getAllPostMeta();

  return (
    <main id="main" className="mx-auto max-w-[760px] px-6 pb-32 pt-14 sm:pt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header>
        <div className="flex items-center gap-3.5">
          <Image
            src="/avatar.webp"
            alt=""
            width={52}
            height={52}
            loading="eager"
            fetchPriority="high"
            className="size-[52px] rounded-full ring-1 ring-border"
            style={{ viewTransitionName: "site-avatar" }}
          />
          <div className="leading-tight">
            <p className="text-[17px] font-medium text-foreground">
              Christian Obanaka
            </p>
            <a
              href="https://x.com/chrisgoingturbo"
              target="_blank"
              rel="noreferrer noopener"
              className="mt-1 inline-flex items-center gap-1.5 text-[14px] text-muted underline decoration-transparent underline-offset-[3px] hover:text-foreground hover:decoration-border"
            >
              <BrandIcon icon={siX} size={11} className="shrink-0" />
              chrisgoingturbo
            </a>
          </div>
        </div>

        <h1 className="mt-10 max-w-[680px] text-balance text-[34px] font-medium leading-[1.12] text-foreground sm:text-[44px]">
          Design engineer.
        </h1>
        <div className="mt-6 max-w-[690px] space-y-4 text-pretty text-[16px] leading-[1.75] text-foreground/80 sm:text-[17px]">
          <p>
            I design and build clear, polished products for traders. As a
            futures trader and former prop-firm community lead, I understand
            the people using these products, the problems they encounter, and
            the businesses supporting them.
          </p>
          <p>
            I&rsquo;m currently building{" "}
            <a
              href="https://trackmyprop.app"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1 align-[-0.075em] font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
            >
              <Image
                src="/trackmyprop-logo.svg"
                alt=""
                width={15}
                height={15}
                className="size-[15px] shrink-0 object-contain"
              />
              trackmyprop
            </a>{" "}
            &mdash; a desktop trading workspace for managing prop-firm accounts, rules,
            trades, journals, and payouts.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link
            href="/work/trackmyprop/"
            prefetch={false}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[14px] font-medium text-background"
          >
            View trackmyprop case study
            <ChevronRight aria-hidden className="size-3.5" strokeWidth={2} />
          </Link>
          <a
            href="mailto:christian@godsbattle.net"
            className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 py-2 text-[14px] font-medium text-foreground hover:bg-foreground/[0.04]"
          >
            Contact me
          </a>
          <Link
            href="/resume/"
            prefetch={false}
            className="inline-flex min-h-11 items-center px-2 py-2 text-[14px] font-medium text-muted hover:text-foreground"
          >
            View résumé
          </Link>
        </div>
      </header>

      <section aria-labelledby="featured-work-heading" className="mt-24">
        <div className="flex items-baseline justify-between gap-4">
          <h2 id="featured-work-heading" className="text-[15px] font-medium text-foreground">
            Featured work
          </h2>
          <p className="text-[13px] text-muted">product design + engineering</p>
        </div>

        <Link
          href="/work/trackmyprop/"
          prefetch={false}
          className="card-shadow group mt-5 block overflow-hidden rounded-2xl bg-card p-2"
        >
          <div className="overflow-hidden rounded-xl bg-muted/10 ring-1 ring-foreground/[0.06]">
            <Image
              src="/work/trackmyprop/overview.png"
              alt=""
              width={3420}
              height={2148}
              sizes="(min-width: 768px) 712px, calc(100vw - 64px)"
              className="h-auto w-full"
              loading="lazy"
            />
          </div>
          <div className="flex items-start gap-4 px-3 pb-3 pt-4 sm:items-center">
            <Image
              src="/trackmyprop-logo.svg"
              alt=""
              width={36}
              height={36}
              className="size-9 shrink-0 object-contain"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-[16px] font-medium text-foreground">trackmyprop</h3>
              <p className="mt-1 text-pretty text-[14px] leading-[1.55] text-muted">
                A desktop-first workspace for the operational side of prop-firm
                trading.
              </p>
            </div>
            <ChevronRight
              aria-hidden
              className="mt-1 size-4 shrink-0 text-muted group-hover:translate-x-0.5 group-hover:text-foreground sm:mt-0"
              strokeWidth={2}
            />
          </div>
        </Link>
      </section>

      <section aria-labelledby="experience-heading" className="mt-24">
        <h2 id="experience-heading" className="text-[15px] font-medium text-foreground">
          Trading-domain experience
        </h2>
        <p className="mt-5 max-w-[680px] text-pretty text-[15px] leading-[1.75] text-foreground/80">
          Before moving into design engineering, I worked directly with traders
          through community, support, affiliate, and growth roles at prop firms.
          That experience now informs the products I design.
        </p>
        <ol className="mt-7 divide-y divide-border">
          <li className="grid gap-2 py-5 sm:grid-cols-[150px_1fr] sm:gap-6">
            <div>
              <p className="text-[14px] font-medium text-foreground">thePropTrade</p>
              <p className="mt-1 text-[13px] text-muted tabular-nums">2025&ndash;2026</p>
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground">Head of Community</p>
              <p className="mt-1.5 text-pretty text-[14px] leading-[1.65] text-muted">
                Scaled the community, drove organic engagement, and worked
                closely with the traders using the firm&rsquo;s products and support.
              </p>
            </div>
          </li>
          <li className="grid gap-2 py-5 sm:grid-cols-[150px_1fr] sm:gap-6">
            <div>
              <p className="text-[14px] font-medium text-foreground">PipFarm</p>
              <p className="mt-1 text-[13px] text-muted tabular-nums">2025</p>
            </div>
            <div>
              <p className="text-[14px] font-medium text-foreground">
                Community + Affiliate Manager
              </p>
              <p className="mt-1.5 text-pretty text-[14px] leading-[1.65] text-muted">
                Grew the Discord community from 5k to 10k in five months and
                improved activity and referrals through focused engagement.
              </p>
            </div>
          </li>
        </ol>
        <Link
          href="/resume/"
          prefetch={false}
          className="group mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
        >
          Full experience and capabilities
          <ArrowUpRight
            aria-hidden
            className="size-3.5 text-muted group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
            strokeWidth={2}
          />
        </Link>
      </section>

      <section aria-labelledby="earlier-work-heading" className="mt-24">
        <h2 id="earlier-work-heading" className="text-[15px] font-medium text-foreground">
          Earlier technical work
        </h2>
        <p className="mt-5 max-w-[680px] text-pretty text-[15px] leading-[1.75] text-foreground/80">
          Before focusing on trading products, I made practical PC-optimization
          tutorials and supporting technical notes through godsbattle. The work
          reached 9,000 YouTube subscribers and 4.5 million views.
        </p>
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-[14px]">
          <a
            href="https://youtube.com/godsbattle"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
          >
            <BrandIcon icon={siYoutube} size={15} />
            YouTube channel
          </a>
          <Link
            href="/posts/"
            prefetch={false}
            className="font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
          >
            Writing archive ({allPosts.length})
          </Link>
          <a
            href="https://github.com/chrisgoingturbo"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
          >
            <BrandIcon icon={siGithub} size={14} />
            GitHub
          </a>
        </div>
      </section>

      <section aria-labelledby="contact-heading" className="mt-24 rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
        <h2 id="contact-heading" className="text-[20px] font-medium text-foreground">
          Building a trading or fintech product?
        </h2>
        <p className="mt-3 max-w-[560px] text-pretty text-[15px] leading-[1.7] text-muted">
          I&rsquo;m open to design engineering, product design engineering, and
          UI-focused frontend opportunities.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <SendMessageButton />
          <CopyEmailButton />
        </div>
      </section>

      <footer className="mt-24">
        <p className="text-[13px] text-muted tabular-nums">
          © {new Date().getUTCFullYear()} Christian Obanaka
        </p>
      </footer>
    </main>
  );
}
