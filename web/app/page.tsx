import type { ReactNode } from "react";
import { Suspense } from "react";
import { ChevronRight, GraduationCap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { siYoutube } from "simple-icons";
import { BrandIcon } from "@/components/brand-icon";
import {
  GithubActivity,
  GithubActivityFallback,
} from "@/components/github-activity";
import { RoleFlip } from "@/components/role-flip";
import { StackSection } from "@/components/stack-section";
import {
  PortfolioAccordion,
  PortfolioAccordionItem,
} from "@/components/portfolio-accordion";
import { ResumeDownloadButton } from "@/components/resume-download-button";
import { Signature } from "@/components/signature";

const SITE_URL = "https://godsbattle.net";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Christian Obanaka",
  alternateName: "chrisgoingturbo",
  url: SITE_URL,
  image: `${SITE_URL}/avatar.webp`,
  jobTitle: "Software Engineer",
  description:
    "Software engineer and futures trader building products for trading and fintech companies.",
  sameAs: [
    "https://github.com/chrisgoingturbo",
    "https://x.com/chrisgoingturbo",
    "https://www.linkedin.com/in/christian-obanaka/",
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

const experience = [
  {
    company: "Tradara",
    href: "https://tradara.com",
    logo: "/tradara-logo.svg",
    role: "Software Engineer",
    period: "Aug 2026 – Aug 2026",
    employment: "Full-Time",
    description:
      "Built Tradara’s futures terminal and prop-trading infrastructure.",
  },
  {
    company: "thePropTrade",
    href: "https://theproptrade.com",
    logo: "/theproptrade-logo.svg",
    role: "Head of Community",
    period: "Nov 2025 – Jul 2026",
    employment: "Full-Time",
    description:
      "Scaled the community and improved day-to-day support for active traders.",
  },
  {
    company: "PipFarm",
    href: "https://pipfarm.com",
    logo: "/pipfarm-logo.svg",
    role: "Community + Affiliate Manager",
    period: "Feb 2025 – Nov 2025",
    employment: "Full-Time",
    description:
      "Grew Discord from 5k to 10k members in five months while improving activity and referrals.",
  },
  {
    company: "PokerDAO",
    href: "https://link3.to/pokerdao",
    logo: "/pokerdao-logo.svg",
    role: "Community Manager",
    period: "Apr 2022 – Dec 2024",
    employment: "Part-Time",
    description:
      "Grew Discord and Telegram from 3k to 7.5k members while halving support response time.",
  },
] as const;

const education = [
  {
    school: "University of Port Harcourt",
    location: "Port Harcourt, Nigeria",
    period: "2021 – Oct 2025",
    level: "University",
    qualification: "Bachelor’s degree",
    field: "Mathematics & Computer Science",
  },
  {
    school: "Federal Government College",
    location: "Port Harcourt, Nigeria",
    period: "2017 – 2020",
    level: "Senior",
    qualification: "Senior Secondary 1–3",
  },
  {
    school: "Wisdom Gate Intl. College",
    location: "Port Harcourt, Nigeria",
    period: "2015 – 2017",
    level: "Junior",
    qualification: "Junior Secondary 1–3",
  },
] as const;

const footerLinkClass =
  "inline-flex min-h-8 items-center underline decoration-border underline-offset-[3px] hover:text-foreground hover:decoration-foreground";

export default function Home() {
  return (
    <main id="main" className="mx-auto max-w-[680px] px-6 pb-24 pt-10 sm:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <header>
        <div className="flex min-w-0 items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="truncate text-[17px] font-medium leading-[1.25] tracking-[-0.012em] text-foreground">
              Christian Obanaka
            </h1>
            <div className="mt-1 text-[14px] font-medium tracking-[-0.01em] text-muted">
              <RoleFlip />
            </div>
          </div>
          <ResumeDownloadButton />
        </div>

        <div className="mt-16 max-w-[610px] space-y-5 text-pretty">
          <p className="text-[16px] leading-[1.65] text-foreground/70 sm:text-[17px]">
            I&rsquo;m a software engineer and futures trader focused on the tools
            traders use every day. Most recently, I worked at{" "}
            <a
              href="https://tradara.com"
              target="_blank"
              rel="noreferrer noopener"
              className="font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
            >
              Tradara
              <span className="sr-only"> (opens in a new tab)</span>
            </a>. I also design and build{" "}
            <a
              href="https://trackmyprop.app"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 align-[-0.08em] font-medium text-foreground"
            >
              <Image
                src="/trackmyprop-logo.svg"
                alt=""
                width={15}
                height={15}
                className="size-[15px] shrink-0 object-contain"
              />
              <span className="underline decoration-border underline-offset-[3px] hover:decoration-foreground">
                trackmyprop
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
            , a desktop workspace for prop-firm accounts, rules, journals, and
            payouts.
          </p>
          <p className="text-[14px] leading-[1.65] text-muted">
            Read the{" "}
            <Link
              href="/work/trackmyprop/"
              prefetch={false}
              className="font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
            >
              trackmyprop case study
            </Link>
            , find me on{" "}
            <ExternalLink href="https://x.com/chrisgoingturbo">X</ExternalLink>
            {" "}and{" "}
            <ExternalLink href="https://www.linkedin.com/in/christian-obanaka/">
              LinkedIn
            </ExternalLink>
            , or reach me by{" "}
            <a
              href="mailto:christian@godsbattle.net"
              className="text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
            >
              email
            </a>
            .
          </p>
        </div>
      </header>

      <Section title="Projects">
        <div className="grid auto-rows-fr gap-4 sm:grid-cols-2">
          <a
            href="https://trackmyprop.app"
            target="_blank"
            rel="noreferrer noopener"
            className="card-shadow project-card group rounded-2xl p-1"
          >
            <div className="project-card-surface relative flex h-full min-h-[228px] items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/[0.025]">
                <Image
                  src="/trackmyprop-logo.svg"
                  alt=""
                  width={64}
                  height={64}
                  className="project-card-logo size-16 object-contain"
                />
                <span className="absolute right-4 top-4 whitespace-nowrap text-[11px] text-muted tabular-nums">
                  2026 – Present
                </span>
              </div>
              <div className="project-card-panel absolute inset-x-0 bottom-0 isolate px-4 py-3.5">
                <span
                  aria-hidden
                  className="project-card-blur absolute -inset-x-4 -bottom-4 -top-10 backdrop-blur-xl backdrop-saturate-125"
                />
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-medium text-foreground">
                    trackmyprop
                  </h3>
                  <ChevronRight
                    aria-hidden
                    className="size-4 -translate-x-0.5 text-muted opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="project-card-description relative z-10">
                  <div className="overflow-hidden">
                    <p className="pt-1.5 text-pretty text-[13px] leading-[1.55] text-muted">
                      A desktop workspace for prop-firm accounts, rules,
                      journals, trades, and payouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </a>

          <a
            href="https://youtube.com/godsbattle"
            target="_blank"
            rel="noreferrer noopener"
            className="card-shadow project-card group rounded-2xl p-1"
          >
            <div className="project-card-surface relative flex h-full min-h-[228px] items-center justify-center overflow-hidden rounded-xl border border-border bg-card">
              <div className="absolute inset-0 flex items-center justify-center bg-foreground/[0.025]">
                <BrandIcon
                  icon={siYoutube}
                  size={60}
                  className="project-card-logo text-foreground"
                />
                <span className="absolute right-4 top-4 whitespace-nowrap text-[11px] text-muted tabular-nums">
                  2019 – 2023
                </span>
              </div>
              <div className="project-card-panel absolute inset-x-0 bottom-0 isolate px-4 py-3.5">
                <span
                  aria-hidden
                  className="project-card-blur absolute -inset-x-4 -bottom-4 -top-10 backdrop-blur-xl backdrop-saturate-125"
                />
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <h3 className="text-[15px] font-medium text-foreground">
                    godsbattle
                  </h3>
                  <ChevronRight
                    aria-hidden
                    className="size-4 -translate-x-0.5 text-muted opacity-0 transition-[opacity,transform] duration-200 ease-out group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 motion-reduce:transition-none"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="project-card-description relative z-10">
                  <div className="overflow-hidden">
                    <p className="pt-1.5 text-pretty text-[13px] leading-[1.55] text-muted">
                      PC-optimization tutorials that reached 9,000 subscribers
                      and 4.5 million views.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </a>
        </div>
      </Section>

      <section aria-label="GitHub activity" className="mt-20">
        <Suspense fallback={<GithubActivityFallback />}>
          <GithubActivity />
        </Suspense>
      </section>

      <PortfolioAccordion>
        <PortfolioAccordionItem title="Stack">
          <StackSection />
        </PortfolioAccordionItem>

        <PortfolioAccordionItem title="Experience">
          <ol className="space-y-8">
            {experience.map((role) => (
              <li key={`${role.company}-${role.period}`}>
                <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
                  <span className="flex size-10 items-center justify-center overflow-hidden rounded-lg border border-border bg-foreground/[0.035] p-2">
                    <Image
                      src={role.logo}
                      alt=""
                      width={28}
                      height={28}
                      className="h-7 w-auto max-w-7 object-contain"
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-[15px] font-medium text-foreground">
                        <a
                          href={role.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="hover:text-muted"
                        >
                          {role.company}
                          <span className="sr-only">
                            {" "}
                            (opens in a new tab)
                          </span>
                        </a>
                      </h3>
                      <span className="shrink-0 rounded-full bg-foreground/[0.045] px-2 py-0.5 text-[11px] leading-4 text-muted">
                        {role.employment}
                      </span>
                      <span
                        aria-hidden
                        className="experience-fade-rule hidden h-px min-w-4 flex-1 sm:block"
                      />
                      <p className="hidden shrink-0 text-[12px] text-muted tabular-nums sm:block">
                        {role.period}
                      </p>
                    </div>
                    <h4 className="mt-0.5 text-[13px] text-muted">
                      {role.role}
                    </h4>
                    <p className="mt-1 text-[12px] text-muted tabular-nums sm:hidden">
                      {role.period}
                    </p>
                  </div>
                </div>
                <p className="mt-3 pl-[52px] text-pretty text-[12px] leading-[1.6] text-muted/80">
                  {role.description}
                </p>
              </li>
            ))}
          </ol>
        </PortfolioAccordionItem>

        <PortfolioAccordionItem title="Education">
          <ol className="space-y-8">
            {education.map((item) => (
              <li key={`${item.school}-${item.period}`}>
                <div className="grid grid-cols-[40px_minmax(0,1fr)] gap-3">
                  <span className="flex size-10 items-center justify-center rounded-lg border border-border bg-foreground/[0.035] text-muted">
                    <GraduationCap
                      aria-hidden
                      className="size-[18px]"
                      strokeWidth={1.7}
                    />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-pretty text-[15px] font-medium text-foreground">
                        {item.school}
                      </h3>
                      <span className="shrink-0 rounded-full bg-foreground/[0.045] px-2 py-0.5 text-[11px] leading-4 text-muted">
                        {item.level}
                      </span>
                      <span
                        aria-hidden
                        className="experience-fade-rule hidden h-px min-w-4 flex-1 sm:block"
                      />
                      <p className="hidden shrink-0 text-[12px] text-muted tabular-nums sm:block">
                        {item.period}
                      </p>
                    </div>
                    <p className="mt-0.5 text-[13px] text-muted">
                      {item.qualification}
                      {"field" in item ? ` · ${item.field}` : null}
                    </p>
                    <p className="mt-1 text-[12px] text-muted tabular-nums sm:hidden">
                      {item.period}
                    </p>
                  </div>
                </div>
                <p className="mt-3 pl-[52px] text-pretty text-[12px] leading-[1.6] text-muted/80">
                  {item.location}
                </p>
              </li>
            ))}
          </ol>
        </PortfolioAccordionItem>
      </PortfolioAccordion>

      <footer className="mt-20 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[13px] text-muted">
        <Signature
          text="Christian"
          fontSize={11}
          duration={1.1}
          delay={0.15}
          inView
          className="shrink-0 opacity-60"
        />
        <nav aria-label="Footer links" className="flex items-center gap-4">
          <Link href="/posts/" prefetch={false} className={footerLinkClass}>
            Writing
          </Link>
          <a
            href="https://github.com/chrisgoingturbo"
            target="_blank"
            rel="noreferrer noopener"
            className={footerLinkClass}
          >
            GitHub
          </a>
          <a
            href="https://x.com/chrisgoingturbo"
            target="_blank"
            rel="noreferrer noopener"
            className={footerLinkClass}
          >
            X
          </a>
          <a
            href="https://www.linkedin.com/in/christian-obanaka/"
            target="_blank"
            rel="noreferrer noopener"
            className={footerLinkClass}
          >
            LinkedIn
          </a>
          <a
            href="mailto:christian@godsbattle.net"
            className={footerLinkClass}
          >
            Email
          </a>
        </nav>
      </footer>
    </main>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const id = `${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-heading`;

  return (
    <section aria-labelledby={id} className="mt-20">
      <div className="mb-6">
        <h2 id={id} className="text-[14px] font-medium text-foreground">
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
    >
      {children}
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
