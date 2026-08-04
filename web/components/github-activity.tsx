import {
  GithubActivityGrid,
  type Contribution,
} from "@/components/github-activity-grid";

const GITHUB_USERNAME = "chrisgoingturbo";
const CONTRIBUTIONS_ENDPOINT = `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`;

type GithubActivityData = {
  total: number;
  contributions: Contribution[];
};

async function getGithubActivity(): Promise<GithubActivityData | null> {
  try {
    const response = await fetch(CONTRIBUTIONS_ENDPOINT, {
      next: { revalidate: 21600 },
    });

    if (!response.ok) return null;

    const data = (await response.json()) as {
      total?: { lastYear?: unknown };
      contributions?: unknown;
    };

    if (!Array.isArray(data.contributions)) return null;

    const contributions = data.contributions.flatMap((entry) => {
      if (
        typeof entry !== "object" ||
        entry === null ||
        !("date" in entry) ||
        !("count" in entry) ||
        !("level" in entry) ||
        typeof entry.date !== "string" ||
        typeof entry.count !== "number" ||
        typeof entry.level !== "number"
      ) {
        return [];
      }

      return [
        {
          date: entry.date,
          count: entry.count,
          level: Math.max(0, Math.min(4, entry.level)),
        },
      ];
    });

    if (contributions.length < 350) return null;

    const reportedTotal = data.total?.lastYear;
    const total =
      typeof reportedTotal === "number"
        ? reportedTotal
        : contributions.reduce((sum, day) => sum + day.count, 0);

    return { total, contributions };
  } catch {
    return null;
  }
}

export async function GithubActivity() {
  const activity = await getGithubActivity();

  if (!activity) {
    return (
      <p className="text-[14px] text-muted">
        Activity is temporarily unavailable. View the profile directly on{" "}
        <a
          href={`https://github.com/${GITHUB_USERNAME}`}
          target="_blank"
          rel="noreferrer noopener"
          className="font-medium text-foreground underline decoration-border underline-offset-[3px] hover:decoration-foreground"
        >
          GitHub
        </a>
        .
      </p>
    );
  }

  return (
    <GithubActivityGrid
      contributions={activity.contributions}
      total={activity.total}
    />
  );
}

export function GithubActivityFallback() {
  const contributions = Array.from({ length: 371 }, (_, index) => ({
    date: `loading-${index}`,
    count: 0,
    level: 0,
  }));

  return (
    <div className="animate-pulse motion-reduce:animate-none">
      <GithubActivityGrid contributions={contributions} interactive={false} />
      <div className="mt-2 h-4 w-48 rounded bg-foreground/[0.06]" />
    </div>
  );
}
