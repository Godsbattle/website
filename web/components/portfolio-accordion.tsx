"use client";

import {
  createContext,
  useContext,
  useId,
  useState,
  type ReactNode,
} from "react";
import { ChevronDown } from "lucide-react";

type AccordionContextValue = {
  openSection: string | null;
  toggleSection: (section: string) => void;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);

export function PortfolioAccordion({ children }: { children: ReactNode }) {
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <AccordionContext.Provider
      value={{
        openSection,
        toggleSection: (section) =>
          setOpenSection((current) => (current === section ? null : section)),
      }}
    >
      <div className="-mx-3 mt-14 flex flex-col">{children}</div>
    </AccordionContext.Provider>
  );
}

export function PortfolioAccordionItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  const accordion = useContext(AccordionContext);
  const reactId = useId();

  if (!accordion) {
    throw new Error(
      "PortfolioAccordionItem must be rendered inside PortfolioAccordion",
    );
  }

  const isOpen = accordion.openSection === title;
  const sectionId = `${title.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-")}-${reactId.replaceAll(":", "")}`;
  const headingId = `${sectionId}-heading`;
  const contentId = `${sectionId}-content`;

  return (
    <section
      aria-labelledby={headingId}
      data-open={isOpen}
      data-section={title.toLowerCase()}
      className="portfolio-accordion-section rounded-xl"
    >
      <h2 id={headingId}>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls={contentId}
          onClick={() => accordion.toggleSection(title)}
          className="portfolio-accordion-trigger flex min-h-12 w-full cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-3 text-left"
        >
          <span className="text-[14px] font-medium text-foreground">
            {title}
          </span>
          <ChevronDown
            aria-hidden
            className="portfolio-accordion-chevron size-4 shrink-0 text-muted"
            strokeWidth={1.7}
          />
        </button>
      </h2>
      <div
        id={contentId}
        role="region"
        aria-labelledby={headingId}
        aria-hidden={!isOpen}
        inert={!isOpen}
        className="portfolio-accordion-content"
      >
        <div className="portfolio-accordion-inner">
          <div className="px-3 pb-4 pt-3">{children}</div>
        </div>
      </div>
    </section>
  );
}
