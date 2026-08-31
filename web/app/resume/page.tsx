import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Download } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const RESUME_DESCRIPTION =
  "Software engineer, design engineer, and futures trader focused on trading and fintech products.";

export const metadata: Metadata = {
  title: "resume",
  description: RESUME_DESCRIPTION,
  alternates: { canonical: "/resume/" },
  openGraph: {
    type: "profile",
    url: "https://godsbattle.net/resume/",
    title: "Christian Obanaka — software engineer résumé",
    description: RESUME_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "Christian Obanaka — software engineer résumé",
    description: RESUME_DESCRIPTION,
  },
};

type Role = {
  company: string;
  logo: string;
  url?: string;
  title: string;
  employment: "Full-Time" | "Part-Time";
  start: string;
  end: string;
  blurb: string;
  preserveLogoColor?: boolean;
};

const experience: Role[] = [
  {
    company: "Tradara",
    logo: "/tradara-logo.svg",
    url: "https://tradara.com",
    title: "Software Engineer",
    employment: "Full-Time",
    start: "Aug 2026",
    end: "Aug 2026",
    blurb:
      "Built Tradara’s futures terminal and prop-trading infrastructure.",
    preserveLogoColor: true,
  },
  {
    company: "thePropTrade",
    logo: "/theproptrade-logo.svg",
    url: "https://theproptrade.com",
    title: "Head of Community",
    employment: "Full-Time",
    start: "Nov 2025",
    end: "Jul 2026",
    blurb:
      "Scaled the community and improved day-to-day support for active traders.",
  },
  {
    company: "PipFarm",
    logo: "/pipfarm-logo.svg",
    url: "https://pipfarm.com",
    title: "Community + Affiliate Manager",
    employment: "Full-Time",
    start: "Feb 2025",
    end: "Nov 2025",
    blurb:
      "Grew Discord from 5k to 10k members in five months while improving activity and referrals.",
  },
  {
    company: "PokerDAO",
    logo: "/pokerdao-logo.svg",
    url: "https://link3.to/pokerdao",
    title: "Community Manager",
    employment: "Part-Time",
    start: "Apr 2022",
    end: "Dec 2024",
    blurb:
      "Grew Discord and Telegram from 3k to 7.5k members while halving support response time.",
  },
];

const education = [
  {
    school: "University of Port Harcourt",
    location: "Port Harcourt, Nigeria",
    dates: "2021 - Oct 2025",
    qualification: "Bachelor’s degree in Mathematics & Computer Science",
  },
  {
    school: "Federal Government College",
    location: "Port Harcourt, Nigeria",
    dates: "2017 - 2020",
    qualification: "Senior Secondary 1-3",
  },
  {
    school: "Wisdom Gate Intl. College",
    location: "Port Harcourt, Nigeria",
    dates: "2015 - 2017",
    qualification: "Junior Secondary 1-3",
  },
] as const;

const capabilities = [
  "product and interface design for desktop and responsive web experiences",
  "frontend implementation with react, typescript, next.js, and tailwind css",
  "interaction design, product prototyping, and iterative interface refinement",
  "design systems, reusable components, and consistent data-dense UI patterns",
  "accessible names, keyboard navigation, focus behavior, and reduced-motion support",
  "trading, prop-firm, trader-support, community, and operations domain knowledge",
  "AI-assisted research, implementation, testing, and review with human ownership of decisions",
];

const tools = [
  ["design", ["figma", "design systems", "prototyping"]],
  ["frontend", ["react", "typescript", "next.js", "tailwind css"]],
  [
    "delivery",
    ["electron", "git", "cloudflare", "vercel", "railway", "accessibility testing"],
  ],
  ["operations", ["notion", "clickup", "intercom", "zendesk", "slack"]],
] as const;

const achievements = [
  {
    label: "9,000 youtube subscribers",
    href: "https://vidiq.com/certificates/Fgz03Zk3GS/",
  },
  {
    label: "4.5 million views on youtube",
    href: "https://vidiq.com/certificates/w1bqoYgFge/",
  },
];

export default function ResumePage() {
  return (
    <>
      <SiteHeader />
      <main id="main" className="mx-auto max-w-[680px] px-6 pt-16 pb-32 sm:pt-20">
        <header>
          <h1 className="text-[28px] font-medium tracking-tight text-foreground sm:text-[32px]">
            christian obanaka
          </h1>
          <p className="mt-3 max-w-[620px] text-pretty text-[15px] leading-[1.7] text-muted">
            Software engineer, design engineer, and futures trader. I combine
            product design, engineering, and firsthand trader knowledge to
            build focused financial-product experiences.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="/downloads/christian-obanaka-resume.pdf"
              download
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[14px] font-medium text-background"
            >
              <Download aria-hidden className="size-3.5" strokeWidth={2} />
              Download PDF
            </a>
            <a
              href="/downloads/christian-obanaka-resume.png"
              download
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 py-2 text-[14px] font-medium text-foreground hover:bg-foreground/[0.04]"
            >
              Download image
            </a>
          </div>
        </header>

        <Section title="experience">
          <p className="mb-6 text-pretty text-[14px] leading-[1.7] text-foreground/80">
            Most recently, I built futures-trading software at Tradara. Earlier
            community, support, affiliate, and growth roles at prop firms
            continue to inform the products I design and engineer.
          </p>
          <ol className="space-y-2">
            {experience.map((role) => (
              <li
                key={role.company}
                className="group -mx-3 rounded-xl px-3 py-3 transition-colors duration-200 hover:bg-foreground/[0.03]"
              >
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-[10px] bg-card ring-1 ring-border"
                  >
                    <Image
                      src={role.logo}
                      alt=""
                      width={40}
                      height={40}
                      className={`h-10 w-10 object-contain ${
                        role.preserveLogoColor ? "" : "dark:invert"
                      }`}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-0.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
                      <p className="text-[15px] font-medium text-foreground">
                        {role.url ? (
                          <ExtLink href={role.url}>{role.company}</ExtLink>
                        ) : (
                          role.company
                        )}
                      </p>
                      <p className="shrink-0 text-[13px] text-muted tabular-nums">
                        {role.start} &rarr; {role.end}
                      </p>
                    </div>
                    <p className="text-[14px] text-muted">
                      {role.title} · {role.employment}
                    </p>
                    <p className="mt-2 text-[14px] leading-[1.65] text-foreground/80">
                      {role.blurb}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="education">
          <ol className="space-y-4">
            {education.map((item) => (
              <li
                key={item.school}
                className="grid gap-1 sm:grid-cols-[1fr_auto] sm:gap-x-5"
              >
                <div>
                  <h3 className="text-[15px] font-medium text-foreground">
                    {item.school}
                  </h3>
                  <p className="mt-0.5 text-[14px] text-muted">
                    {item.qualification}
                  </p>
                  <p className="mt-0.5 text-[13px] text-muted/80">
                    {item.location}
                  </p>
                </div>
                <p className="text-[13px] text-muted tabular-nums">
                  {item.dates}
                </p>
              </li>
            ))}
          </ol>
        </Section>

        <Section title="design engineering capabilities">
          <ul className="space-y-2 text-[14px] leading-[1.65] text-foreground/85">
            {capabilities.map((capability) => (
              <li key={capability} className="flex gap-3">
                <span aria-hidden className="mt-[10px] block h-px w-3 shrink-0 bg-border" />
                <span>{capability}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section title="tools">
          <dl className="space-y-3">
            {tools.map(([area, list]) => (
              <div
                key={area}
                className="grid grid-cols-[110px_1fr] items-baseline gap-x-4"
              >
                <dt className="text-[13px] text-muted">{area}</dt>
                <dd className="text-[14px] leading-[1.65] text-foreground/85">
                  {list.join(", ")}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <Section title="projects">
          <ul className="space-y-2">
            <li>
              <Link
                href="/work/trackmyprop/"
                className="text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
              >
                trackmyprop — product design and engineering case study
              </Link>
            </li>
            <li>
              <ExtLink href="https://trackmyprop.app">trackmyprop product website</ExtLink>
            </li>
            <li>
              <ExtLink href="https://youtube.com/godsbattle">godsbattle</ExtLink>
            </li>
          </ul>
        </Section>

        <Section title="achievements">
          <ul className="space-y-2">
            {achievements.map((a) => (
              <li key={a.href}>
                <ExtLink href={a.href}>{a.label}</ExtLink>
              </li>
            ))}
          </ul>
        </Section>

        <footer className="mt-24 text-[14px] text-muted">
          <p>
            reach out:{" "}
            <ExtLink href="mailto:christian@godsbattle.net">
              christian@godsbattle.net
            </ExtLink>{" "}
            ·{" "}
            <ExtLink href="https://www.linkedin.com/in/christian-obanaka/">
              LinkedIn
            </ExtLink>
          </p>
        </footer>
      </main>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-16">
      <h2 className="mb-5 text-[15px] font-medium tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  const isMail = href.startsWith("mailto:");
  return (
    <a
      href={href}
      {...(isMail ? {} : { target: "_blank", rel: "noreferrer noopener" })}
      className="group inline-flex items-baseline gap-1 text-foreground underline underline-offset-[3px] decoration-border hover:decoration-foreground"
    >
      {children}
      {!isMail ? (
        <ArrowUpRight
          aria-hidden
          className="h-3 w-3 self-center text-muted transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-foreground"
          strokeWidth={2}
        />
      ) : null}
    </a>
  );
}
