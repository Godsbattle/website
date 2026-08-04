"use client";

import { useEffect, useId, useState } from "react";
import {
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "motion/react";
import opentype from "opentype.js";
import { cn } from "@/lib/utils";

interface SignatureProps {
  text?: string;
  color?: string;
  fontSize?: number;
  duration?: number;
  delay?: number;
  className?: string;
  inView?: boolean;
  once?: boolean;
  fontUrl?: string;
}

export function Signature({
  text = "Signature",
  color = "currentColor",
  fontSize = 32,
  duration = 1.5,
  delay = 0,
  className,
  inView = false,
  once = true,
  fontUrl = "/LastoriaBoldRegular.otf",
}: SignatureProps) {
  const [paths, setPaths] = useState<string[]>([]);
  const [width, setWidth] = useState(300);
  const prefersReducedMotion = useReducedMotion();
  const height = fontSize * 3;
  const horizontalPadding = fontSize * 0.1;
  const baseline = fontSize * 1.5;
  const maskId = `signature-reveal-${useId().replaceAll(":", "")}`;

  useEffect(() => {
    let cancelled = false;

    async function loadSignature() {
      try {
        const font = await opentype.load(fontUrl);
        let x = horizontalPadding;
        const nextPaths: string[] = [];

        for (const character of text) {
          const glyph = font.charToGlyph(character);
          nextPaths.push(glyph.getPath(x, baseline, fontSize).toPathData(3));

          const advanceWidth = glyph.advanceWidth ?? font.unitsPerEm;
          x += advanceWidth * (fontSize / font.unitsPerEm);
        }

        if (!cancelled) {
          setPaths(nextPaths);
          setWidth(x + horizontalPadding);
        }
      } catch (error) {
        console.error("Signature font could not be loaded:", error);
      }
    }

    void loadSignature();

    return () => {
      cancelled = true;
    };
  }, [baseline, fontSize, fontUrl, horizontalPadding, text]);

  const variants = {
    hidden: { opacity: 0, pathLength: 0 },
    visible: { opacity: 1, pathLength: 1 },
  };

  return (
    <LazyMotion features={domAnimation} strict>
      <m.svg
        key={paths.length}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        fill="none"
        role="img"
        aria-label={`${text} signature`}
        className={cn("overflow-visible text-foreground", className)}
        initial={prefersReducedMotion ? "visible" : "hidden"}
        whileInView={inView ? "visible" : undefined}
        animate={inView ? undefined : "visible"}
        viewport={{ once }}
      >
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse">
            {paths.map((path, index) => (
              <m.path
                key={path}
                d={path}
                stroke="white"
                strokeWidth={fontSize * 0.22}
                fill="none"
                variants={variants}
                transition={{
                  opacity: {
                    delay: delay + index * 0.2 + 0.01,
                    duration: 0.01,
                  },
                  pathLength: {
                    delay: delay + index * 0.2,
                    duration: prefersReducedMotion ? 0 : duration,
                    ease: "easeInOut",
                  },
                }}
                vectorEffect="non-scaling-stroke"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </mask>
        </defs>

        {paths.map((path, index) => (
          <m.path
            key={path}
            d={path}
            stroke={color}
            strokeWidth={0.5}
            fill="none"
            variants={variants}
            transition={{
              opacity: {
                delay: delay + index * 0.2 + 0.01,
                duration: 0.01,
              },
              pathLength: {
                delay: delay + index * 0.2,
                duration: prefersReducedMotion ? 0 : duration,
                ease: "easeInOut",
              },
            }}
            vectorEffect="non-scaling-stroke"
            strokeLinecap="butt"
            strokeLinejoin="round"
          />
        ))}

        <g mask={`url(#${maskId})`}>
          {paths.map((path) => (
            <path key={path} d={path} fill={color} />
          ))}
        </g>
      </m.svg>
    </LazyMotion>
  );
}
