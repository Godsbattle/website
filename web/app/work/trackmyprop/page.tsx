import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { SiteHeader } from "@/components/site-header";

const PAGE_URL = "https://godsbattle.net/work/trackmyprop/";
const PAGE_DESCRIPTION =
  "How Christian Obanaka designs and builds trackmyprop, a desktop workspace for prop-firm traders.";

export const metadata: Metadata = {
  title: "trackmyprop case study",
  description: PAGE_DESCRIPTION,
  alternates: { canonical: "/work/trackmyprop/" },
  openGraph: {
    type: "article",
    url: PAGE_URL,
    title: "trackmyprop — product design and engineering case study",
    description: PAGE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: "trackmyprop — product design and engineering case study",
    description: PAGE_DESCRIPTION,
  },
};

const caseStudyJsonLd = {
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  name: "trackmyprop — product design and engineering case study",
  url: PAGE_URL,
  description: PAGE_DESCRIPTION,
  image: "https://godsbattle.net/work/trackmyprop/overview.png",
  author: {
    "@type": "Person",
    name: "Christian Obanaka",
    url: "https://godsbattle.net",
  },
  about: {
    "@type": "SoftwareApplication",
    name: "trackmyprop",
    url: "https://trackmyprop.app",
    applicationCategory: "FinanceApplication",
    operatingSystem: "macOS, Windows",
    description:
      "A desktop workspace for managing prop-firm accounts, trades, challenges, journals, payouts, and supporting tools.",
  },
};

export default function TrackmypropCaseStudy() {
  return (
    <>
      <SiteHeader wide />
      <main id="main" className="mx-auto max-w-[1080px] px-6 pb-32 pt-14 sm:pt-20">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(caseStudyJsonLd).replace(/</g, "\\u003c"),
          }}
        />

        <header className="max-w-[780px]">
          <p className="text-[13px] text-muted">Case study · product design + engineering</p>
          <div className="mt-4 flex items-center gap-3 sm:gap-4">
            <Image
              src="/trackmyprop-logo.svg"
              alt=""
              width={52}
              height={52}
              className="size-10 shrink-0 object-contain sm:size-[52px]"
              priority
            />
            <h1 className="text-balance text-[38px] font-medium leading-[1.08] text-foreground sm:text-[52px]">
              trackmyprop
            </h1>
          </div>
          <p className="mt-5 max-w-[720px] text-pretty text-[18px] leading-[1.65] text-foreground/80 sm:text-[20px]">
            A desktop-first workspace for traders managing the operational
            complexity of prop-firm accounts.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="https://trackmyprop.app"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-foreground px-4 py-2 text-[14px] font-medium text-background"
            >
              Visit product website
              <ArrowUpRight aria-hidden className="size-3.5" strokeWidth={2} />
            </a>
            <a
              href="mailto:christian@godsbattle.net"
              className="inline-flex min-h-11 items-center rounded-full border border-border bg-card px-4 py-2 text-[14px] font-medium text-foreground hover:bg-foreground/[0.04]"
            >
              Contact me
            </a>
          </div>
        </header>

        <figure className="mt-12 sm:mt-16">
          <div className="overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border sm:p-3">
            <Image
              src="/work/trackmyprop/overview.png"
              alt="trackmyprop desktop overview with portfolio performance, account cards, challenges, payouts, and a date filter"
              width={3420}
              height={2148}
              sizes="(min-width: 1120px) 1032px, calc(100vw - 64px)"
              className="h-auto w-full rounded-xl"
              priority
            />
          </div>
          <figcaption className="mt-3 text-pretty text-[13px] leading-[1.55] text-muted">
            The portfolio overview brings returns, account health, challenges,
            payouts, and time context into one desktop workspace.
          </figcaption>
        </figure>

        <dl className="mt-12 grid gap-x-8 gap-y-6 border-y border-border py-6 sm:grid-cols-2 lg:grid-cols-4">
          <ProjectFact term="Role">Product direction, UX/UI design, implementation</ProjectFact>
          <ProjectFact term="Product">Electron desktop application</ProjectFact>
          <ProjectFact term="Audience">Prop-firm and futures traders</ProjectFact>
          <ProjectFact term="Current state">Private beta, in active development</ProjectFact>
        </dl>

        <div className="mx-auto mt-20 max-w-[760px]">
          <CaseSection title="The product">
            <p>
              trackmyprop is a desktop workspace for traders who operate across
              prop firms, accounts, platforms, rules, and payout cycles. It
              brings account tracking, trade journaling, challenge management,
              trading tools, and operational records into one place.
            </p>
            <p>
              I lead the product direction, user experience, interface design,
              and implementation of trackmyprop. I use AI agents throughout
              research, development, testing, and iteration while retaining
              responsibility for the decisions and final quality.
            </p>
          </CaseSection>

          <CaseSection title="The problem">
            <p>
              Prop-firm traders do more than place trades. They monitor different
              account states, follow firm-specific rules, review executions,
              track fees and payouts, and keep evidence of their progress. That
              work is often split across broker platforms, spreadsheets, notes,
              calculators, and community support conversations.
            </p>
            <p>
              The design challenge is to make that complexity visible without
              making the product feel complicated: enough density for serious
              desktop work, with clear hierarchy and language that remains
              understandable under pressure.
            </p>
          </CaseSection>

          <CaseSection title="Domain knowledge as a design input">
            <p>
              I came to the product as both a futures trader and someone who had
              worked directly with prop-firm traders through community, support,
              affiliate, and growth roles. Those conversations exposed recurring
              friction: unclear rule calculations, fragmented account history,
              repetitive support questions, and poor visibility into what needs
              attention next.
            </p>
            <p>
              That experience informs the product vocabulary, information
              architecture, safety language, and the decision to treat accounts,
              challenges, trades, payouts, and costs as connected parts of one
              workflow rather than isolated dashboards.
            </p>
          </CaseSection>

          <CaseSection title="Product structure">
            <dl className="divide-y divide-border border-y border-border">
              <WorkflowRow
                term="Track"
                description="Portfolio overview, live connections, accounts, prop-firm journeys, transactions, expenses, and account records."
              />
              <WorkflowRow
                term="Journal"
                description="Trade history and review tools that connect individual executions to daily and longer-term context."
              />
              <WorkflowRow
                term="Tools"
                description="Consistency, payout, challenge, and win-rate calculators alongside an economic calendar."
              />
              <WorkflowRow
                term="System"
                description="Desktop navigation, search, reusable data surfaces, shared actions, and connection status patterns."
              />
            </dl>
          </CaseSection>
        </div>

        <figure className="mt-16">
          <div className="overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border sm:p-3">
            <Image
              src="/work/trackmyprop/journal.png"
              alt="trackmyprop day-review editor with an embedded trade, daily summary, and monthly trading summary"
              width={2295}
              height={1650}
              sizes="(min-width: 1120px) 1032px, calc(100vw - 64px)"
              className="h-auto w-full rounded-xl"
            />
          </div>
          <figcaption className="mt-3 text-pretty text-[13px] leading-[1.55] text-muted">
            The journal links written reflection to real trade, day, and month
            data instead of separating notes from performance context.
          </figcaption>
        </figure>

        <div className="mx-auto mt-20 max-w-[760px]">
          <CaseSection title="Important interface decisions">
            <ul className="space-y-4">
              <DecisionItem title="Desktop density with a stable hierarchy">
                Persistent navigation, page tabs, filters, and compact data
                surfaces support repeated daily use without turning every metric
                into a promotional card.
              </DecisionItem>
              <DecisionItem title="Rules explained as decisions">
                Calculators pair the result with the inputs, thresholds, and next
                required amount so traders can understand why a status changed.
              </DecisionItem>
              <DecisionItem title="One language across workflows">
                Reusable account rows, status treatments, monetary formatting,
                dialogs, and page actions keep unfamiliar tools predictable.
              </DecisionItem>
              <DecisionItem title="Safety before optimistic automation">
                Connection and trading states use explicit status and failure
                language; unavailable information is not presented as a guarantee.
              </DecisionItem>
            </ul>
          </CaseSection>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <figure>
            <div className="overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border">
              <Image
                src="/work/trackmyprop/consistency.png"
                alt="trackmyprop consistency calculator showing a 30 percent limit, daily profit inputs, and the amount needed to qualify"
                width={3420}
                height={2148}
                sizes="(min-width: 1024px) 504px, calc(100vw - 64px)"
                className="h-auto w-full rounded-xl"
              />
            </div>
            <figcaption className="mt-3 text-pretty text-[13px] leading-[1.55] text-muted">
              The consistency calculator explains the threshold, current score,
              and what the trader needs next.
            </figcaption>
          </figure>
          <figure>
            <div className="overflow-hidden rounded-2xl bg-card p-2 ring-1 ring-border">
              <Image
                src="/work/trackmyprop/calendar.png"
                alt="trackmyprop weekly economic calendar with impact filters and structured event cards"
                width={3420}
                height={2148}
                sizes="(min-width: 1024px) 504px, calc(100vw - 64px)"
                className="h-auto w-full rounded-xl"
              />
            </div>
            <figcaption className="mt-3 text-pretty text-[13px] leading-[1.55] text-muted">
              A weekly economic calendar keeps event risk in the same environment
              as the trader&rsquo;s other operating tools.
            </figcaption>
          </figure>
        </div>

        <div className="mx-auto mt-20 max-w-[760px]">
          <CaseSection title="Desktop-first by design">
            <p>
              trackmyprop is built as an Electron desktop application for macOS
              and Windows. That choice supports wide, information-dense layouts,
              keyboard-led navigation, local workflows, and a persistent workspace
              that can sit beside trading software throughout the day.
            </p>
            <p>
              The trade-off is deliberate: the core product is not compressed
              into a mobile dashboard. The public website, account surfaces, and
              supporting brand materials handle the web-facing part of the product
              while the main operational experience remains desktop-first.
            </p>
          </CaseSection>

          <CaseSection title="Design system and implementation">
            <p>
              The interface is built with React, TypeScript, Tailwind CSS, and
              reusable primitives backed by accessible component foundations.
              Shared tokens separate the page, card, sidebar, overlay, and state
              layers; reusable patterns cover controls, dialogs, data rows,
              navigation, status feedback, and responsive marketing surfaces.
            </p>
            <p>
              The product website and brand system use the same restrained visual
              language: neutral surfaces, compact typography, practical motion,
              and screenshots that show the actual application rather than a
              separate marketing fiction.
            </p>
          </CaseSection>

          <CaseSection title="AI in the workflow">
            <p>
              I use AI agents to accelerate research, implementation, testing,
              and iteration while retaining ownership of the product direction,
              design decisions, and final quality. The repository includes the
              working rules, product context, review practices, and verification
              steps those agents use.
            </p>
            <p>
              AI is useful here because the product spans interface design,
              desktop engineering, broker integrations, documentation, and quality
              assurance. It increases execution capacity; it does not replace the
              judgment needed to decide what belongs in the product or whether the
              result is good enough.
            </p>
          </CaseSection>

          <CaseSection title="Constraints and trade-offs">
            <ul className="space-y-3">
              <li>Different prop firms and broker platforms expose different rules, data, and connection limits.</li>
              <li>Dense financial interfaces need precision without making every surface visually loud.</li>
              <li>Live or unavailable states must be communicated honestly, especially around trading and account safety.</li>
              <li>A private-beta product needs room to evolve without making the navigation and component system feel temporary.</li>
            </ul>
          </CaseSection>

          <CaseSection title="Current state and lessons">
            <p>
              trackmyprop is in private beta and active development. The current
              desktop product covers portfolio and account tracking, prop-firm
              journeys, trade journaling, calculations, records, an economic
              calendar, and trade-copier workflows, with connection coverage and
              supporting systems continuing to evolve.
            </p>
            <p>
              The central lesson has been that domain knowledge matters most when
              it becomes product structure: clearer terminology, safer defaults,
              connected records, and explanations that help a trader decide what
              to do next.
            </p>
          </CaseSection>

          <section aria-labelledby="next-step-heading" className="mt-20 rounded-2xl bg-card p-6 ring-1 ring-border sm:p-8">
            <h2 id="next-step-heading" className="text-balance text-[22px] font-medium text-foreground">
              See the product or discuss a project
            </h2>
            <p className="mt-3 text-pretty text-[15px] leading-[1.7] text-muted">
              Visit the trackmyprop product site, or get in touch about design
              engineering for a trading or fintech team.
            </p>
            <div className="mt-6 flex flex-wrap gap-4 text-[14px] font-medium">
              <a
                href="https://trackmyprop.app"
                target="_blank"
                rel="noreferrer noopener"
                className="group inline-flex items-center gap-1.5 text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
              >
                trackmyprop.app
                <ArrowUpRight aria-hidden className="size-3.5 text-muted group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </a>
              <a
                href="mailto:christian@godsbattle.net"
                className="text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
              >
                christian@godsbattle.net
              </a>
              <a
                href="https://www.linkedin.com/in/christian-obanaka/"
                target="_blank"
                rel="noreferrer noopener"
                className="text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
              >
                LinkedIn
              </a>
            </div>
          </section>

          <Link
            href="/"
            className="group mt-16 inline-flex items-center gap-1.5 text-[14px] text-muted hover:text-foreground"
          >
            <ArrowLeft aria-hidden className="size-3.5 group-hover:-translate-x-0.5" strokeWidth={2} />
            Back to portfolio
          </Link>
        </div>
      </main>
    </>
  );
}

function ProjectFact({ term, children }: { term: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-[12px] text-muted">{term}</dt>
      <dd className="mt-1.5 text-pretty text-[14px] leading-[1.5] text-foreground">
        {children}
      </dd>
    </div>
  );
}

function CaseSection({ title, children }: { title: string; children: ReactNode }) {
  const id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return (
    <section aria-labelledby={id} className="mt-16 first:mt-0">
      <h2 id={id} className="text-balance text-[24px] font-medium leading-[1.2] text-foreground sm:text-[28px]">
        {title}
      </h2>
      <div className="mt-5 space-y-4 text-pretty text-[15px] leading-[1.75] text-foreground/80 sm:text-[16px]">
        {children}
      </div>
    </section>
  );
}

function WorkflowRow({ term, description }: { term: string; description: string }) {
  return (
    <div className="grid gap-1.5 py-4 sm:grid-cols-[120px_1fr] sm:gap-6">
      <dt className="font-medium text-foreground">{term}</dt>
      <dd className="text-muted">{description}</dd>
    </div>
  );
}

function DecisionItem({ title, children }: { title: string; children: ReactNode }) {
  return (
    <li className="grid gap-1.5 border-t border-border pt-4 sm:grid-cols-[220px_1fr] sm:gap-6">
      <strong className="font-medium text-foreground">{title}</strong>
      <span className="text-muted">{children}</span>
    </li>
  );
}
