"use client";

import { useEffect, useRef, useState } from "react";

export type Contribution = {
  date: string;
  count: number;
  level: number;
};

const levelClasses = [
  "bg-foreground/[0.06]",
  "bg-foreground/[0.18]",
  "bg-foreground/[0.34]",
  "bg-foreground/[0.56]",
  "bg-foreground/[0.82]",
] as const;

function getMonthLabels(contributions: Contribution[]) {
  const labels: { label: string; week: number }[] = [];
  let previousMonth = -1;

  contributions.forEach((contribution, index) => {
    const date = new Date(`${contribution.date}T00:00:00Z`);
    const month = date.getUTCMonth();

    if (month !== previousMonth && date.getUTCDate() <= 7) {
      labels.push({
        label: date.toLocaleDateString("en", {
          month: "short",
          timeZone: "UTC",
        }),
        week: Math.floor(index / 7),
      });
      previousMonth = month;
    }
  });

  return labels;
}

function formatContribution(contribution: Contribution) {
  const date = new Date(`${contribution.date}T00:00:00Z`).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    },
  );
  const count =
    contribution.count === 0
      ? "No contributions"
      : `${contribution.count} contribution${contribution.count === 1 ? "" : "s"}`;

  return `${count} on ${date}`;
}

export function GithubActivityGrid({
  contributions,
  total,
  interactive = true,
}: {
  contributions: Contribution[];
  total?: number;
  interactive?: boolean;
}) {
  const [activeContribution, setActiveContribution] =
    useState<Contribution | null>(null);
  const [scrollFades, setScrollFades] = useState({
    left: false,
    right: false,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const monthLabels = getMonthLabels(contributions);
  const weekCount = Math.ceil(contributions.length / 7);
  const summary = activeContribution
    ? formatContribution(activeContribution)
      : typeof total === "number"
      ? `${total.toLocaleString("en-US")} contributions in the past year`
      : null;

  useEffect(() => {
    const scroller = scrollRef.current;

    if (!scroller) return;

    const updateScrollFades = () => {
      const next = {
        left: scroller.scrollLeft > 1,
        right:
          scroller.scrollLeft + scroller.clientWidth <
          scroller.scrollWidth - 1,
      };

      setScrollFades((current) =>
        current.left === next.left && current.right === next.right
          ? current
          : next,
      );
    };

    updateScrollFades();

    const resizeObserver = new ResizeObserver(updateScrollFades);
    resizeObserver.observe(scroller);

    if (scroller.firstElementChild) {
      resizeObserver.observe(scroller.firstElementChild);
    }

    return () => resizeObserver.disconnect();
  }, [contributions]);

  return (
    <div>
      <div className="relative">
        <div
          ref={scrollRef}
          className="overflow-x-auto pb-2 [scrollbar-width:thin]"
          onScroll={(event) => {
            const scroller = event.currentTarget;
            const next = {
              left: scroller.scrollLeft > 1,
              right:
                scroller.scrollLeft + scroller.clientWidth <
                scroller.scrollWidth - 1,
            };

            setScrollFades((current) =>
              current.left === next.left && current.right === next.right
                ? current
                : next,
            );
          }}
        >
          <div
            className="w-max min-w-full"
            aria-hidden="true"
            onMouseLeave={
              interactive ? () => setActiveContribution(null) : undefined
            }
          >
            <div className="relative mb-2 h-4 min-w-[686px] text-[11px] text-muted">
              {monthLabels.map(({ label, week }) => (
                <span
                  key={`${label}-${week}`}
                  className="absolute top-0"
                  style={{
                    left: `${(week / Math.max(weekCount - 1, 1)) * 100}%`,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
            <div className="grid min-w-[686px] grid-flow-col grid-rows-7 gap-[3px]">
              {contributions.map((contribution) => (
                <span
                  key={contribution.date}
                  className={`size-2.5 rounded-[2px] ${levelClasses[contribution.level]}`}
                  onMouseEnter={
                    interactive
                      ? () => setActiveContribution(contribution)
                      : undefined
                  }
                />
              ))}
            </div>
          </div>
        </div>

        <span
          aria-hidden
          data-visible={scrollFades.left}
          className="github-scroll-fade github-scroll-fade-left"
        />
        <span
          aria-hidden
          data-visible={scrollFades.right}
          className="github-scroll-fade github-scroll-fade-right"
        />
      </div>

      {summary ? (
        <div className="mt-2 text-[12px] text-muted">
          <p aria-live="polite" className="min-h-[18px] tabular-nums">
            <span key={summary} className="github-summary-change inline-block">
              {summary}
            </span>
          </p>
        </div>
      ) : null}
    </div>
  );
}
