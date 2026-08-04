import type { ComponentType, SVGProps } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  ChartNoAxesCombined,
  Info,
  Mail,
} from "lucide-react";
import type { SimpleIcon } from "simple-icons";
import {
  siBaseui,
  siBetterauth,
  siBun,
  siClaude,
  siClerk,
  siClickup,
  siCloudflare,
  siD3,
  siDocker,
  siElectron,
  siExpo,
  siExcalidraw,
  siFastapi,
  siFigma,
  siGit,
  siGithub,
  siHono,
  siJavascript,
  siMarkdown,
  siNextdotjs,
  siNotion,
  siApple,
  siPosthog,
  siPostgresql,
  siPython,
  siRailway,
  siReact,
  siResend,
  siRust,
  siSanity,
  siSentry,
  siShadcnui,
  siSqlalchemy,
  siSqlite,
  siSwift,
  siTailwindcss,
  siTanstack,
  siTypescript,
  siVercel,
  siVisx,
  siVite,
  siVitest,
} from "simple-icons";
import { BrandIcon, CodexIcon, MotionIcon } from "@/components/brand-icon";

type StackTool = {
  name: string;
  href: string;
  icon?: SimpleIcon;
  glyph?: LucideIcon;
  brandGlyph?: ComponentType<SVGProps<SVGSVGElement>>;
  brandGlyphClassName?: string;
};

type StackGroup = {
  label: string;
  tools: StackTool[];
};

const stackGroups: StackGroup[] = [
  {
    label: "Languages",
    tools: [
      {
        name: "TypeScript",
        href: "https://www.typescriptlang.org/",
        icon: siTypescript,
      },
      {
        name: "JavaScript",
        href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        icon: siJavascript,
      },
      { name: "Python", href: "https://www.python.org/", icon: siPython },
      { name: "Rust", href: "https://www.rust-lang.org/", icon: siRust },
    ],
  },
  {
    label: "Frontend & apps",
    tools: [
      { name: "React", href: "https://react.dev/", icon: siReact },
      {
        name: "React Native",
        href: "https://reactnative.dev/",
        icon: siReact,
      },
      { name: "Expo", href: "https://expo.dev/", icon: siExpo },
      {
        name: "SwiftUI",
        href: "https://developer.apple.com/xcode/swiftui/",
        icon: siSwift,
      },
      { name: "Next.js", href: "https://nextjs.org/", icon: siNextdotjs },
      {
        name: "Tailwind CSS",
        href: "https://tailwindcss.com/",
        icon: siTailwindcss,
      },
      { name: "Electron", href: "https://www.electronjs.org/", icon: siElectron },
      { name: "Vite", href: "https://vite.dev/", icon: siVite },
      { name: "Base UI", href: "https://base-ui.com/", icon: siBaseui },
      { name: "shadcn/ui", href: "https://ui.shadcn.com/", icon: siShadcnui },
      {
        name: "Motion",
        href: "https://motion.dev/",
        brandGlyph: MotionIcon,
        brandGlyphClassName: "h-[13px] w-[18px] shrink-0 text-muted",
      },
      { name: "TanStack", href: "https://tanstack.com/", icon: siTanstack },
    ],
  },
  {
    label: "Backend & data",
    tools: [
      { name: "FastAPI", href: "https://fastapi.tiangolo.com/", icon: siFastapi },
      { name: "Hono", href: "https://hono.dev/", icon: siHono },
      {
        name: "Better Auth",
        href: "https://www.better-auth.com/",
        icon: siBetterauth,
      },
      { name: "Clerk", href: "https://clerk.com/", icon: siClerk },
      {
        name: "PostgreSQL",
        href: "https://www.postgresql.org/",
        icon: siPostgresql,
      },
      { name: "SQLite", href: "https://www.sqlite.org/", icon: siSqlite },
      {
        name: "SQLAlchemy",
        href: "https://www.sqlalchemy.org/",
        icon: siSqlalchemy,
      },
      { name: "Sanity", href: "https://www.sanity.io/", icon: siSanity },
      { name: "Resend", href: "https://resend.com/", icon: siResend },
    ],
  },
  {
    label: "Content & visualisation",
    tools: [
      {
        name: "Recharts",
        href: "https://recharts.org/",
        glyph: ChartNoAxesCombined,
      },
      { name: "D3", href: "https://d3js.org/", icon: siD3 },
      { name: "Visx", href: "https://airbnb.io/visx/", icon: siVisx },
      { name: "Fumadocs", href: "https://fumadocs.dev/", glyph: BookOpen },
      {
        name: "React Email",
        href: "https://react.email/",
        glyph: Mail,
      },
      {
        name: "Markdown",
        href: "https://www.markdownguide.org/",
        icon: siMarkdown,
      },
    ],
  },
  {
    label: "Testing & delivery",
    tools: [
      { name: "Bun", href: "https://bun.sh/", icon: siBun },
      { name: "Vitest", href: "https://vitest.dev/", icon: siVitest },
      { name: "Docker", href: "https://www.docker.com/", icon: siDocker },
      { name: "Vercel", href: "https://vercel.com/", icon: siVercel },
      { name: "Railway", href: "https://railway.com/", icon: siRailway },
      {
        name: "Cloudflare",
        href: "https://www.cloudflare.com/",
        icon: siCloudflare,
      },
      { name: "Sentry", href: "https://sentry.io/", icon: siSentry },
      { name: "PostHog", href: "https://posthog.com/", icon: siPosthog },
    ],
  },
  {
    label: "Design & workflow",
    tools: [
      { name: "Figma", href: "https://www.figma.com/", icon: siFigma },
      {
        name: "Pixelmator Pro",
        href: "https://www.apple.com/pixelmator-pro/",
        icon: siApple,
      },
      {
        name: "Excalidraw",
        href: "https://excalidraw.com/",
        icon: siExcalidraw,
      },
      { name: "Git", href: "https://git-scm.com/", icon: siGit },
      { name: "GitHub", href: "https://github.com/", icon: siGithub },
      {
        name: "Codex",
        href: "https://openai.com/codex/",
        brandGlyph: CodexIcon,
        brandGlyphClassName: "size-[13px] shrink-0 text-muted",
      },
      { name: "Claude", href: "https://claude.ai/", icon: siClaude },
      { name: "Notion", href: "https://www.notion.com/", icon: siNotion },
      { name: "ClickUp", href: "https://clickup.com/", icon: siClickup },
    ],
  },
];

export function StackSection() {
  return (
    <div>
      <div className="mb-3 flex justify-end">
        <button
          type="button"
          aria-describedby="stack-private-note"
          aria-label="About this stack list"
          className="stack-note-trigger relative inline-flex size-7 items-center justify-center rounded-full border border-border bg-card text-muted outline-none hover:border-foreground/20 hover:text-foreground focus-visible:text-foreground"
        >
          <Info aria-hidden className="size-3.5" strokeWidth={1.8} />
          <span
            id="stack-private-note"
            role="tooltip"
            className="stack-note-tooltip pointer-events-none absolute right-0 top-full z-20 mt-2 w-64 rounded-lg border border-border bg-background/95 px-3 py-2 text-pretty text-left text-[12px] font-normal leading-[1.55] text-muted shadow-lg backdrop-blur-md"
          >
            This list is not exhaustive. Some tools are custom-built; others
            are being respectfully gatekept.
          </span>
        </button>
      </div>
      {stackGroups.map((group, index) => {
        const labelId = `stack-${group.label
          .toLowerCase()
          .replaceAll(/[^a-z0-9]+/g, "-")}`;

        return (
          <div
            key={group.label}
            className="grid gap-y-3 border-b border-border py-4 first:pt-0 last:border-b-0 last:pb-0 sm:grid-cols-[152px_1fr] sm:gap-y-0"
          >
            <h3
              id={labelId}
              className="text-[13px] leading-7 text-muted sm:border-r sm:border-dashed sm:border-border sm:pr-4"
            >
              <span
                aria-hidden
                className="mr-2 font-mono text-[12px] text-muted/55 tabular-nums"
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              {group.label}
            </h3>
            <ul
              aria-labelledby={labelId}
              className="flex flex-wrap gap-1.5 sm:pl-4"
            >
              {group.tools.map((tool) => {
                const Glyph = tool.glyph;
                const BrandGlyph = tool.brandGlyph;

                return (
                  <li key={tool.name} className="flex">
                    <a
                      href={tool.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-border bg-card px-2.5 py-1 font-mono text-[12px] leading-none text-foreground"
                    >
                      {tool.icon ? (
                        <BrandIcon
                          icon={tool.icon}
                          size={13}
                          className="shrink-0 text-muted"
                        />
                      ) : BrandGlyph ? (
                        <BrandGlyph className={tool.brandGlyphClassName} />
                      ) : Glyph ? (
                        <Glyph
                          aria-hidden
                          className="size-[13px] shrink-0 text-muted"
                          strokeWidth={1.8}
                        />
                      ) : null}
                      {tool.name}
                      <span className="sr-only"> (opens in a new tab)</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
