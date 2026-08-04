const roles = [
  "Software engineer",
  "Design engineer",
  "Futures trader",
] as const;

export function RoleFlip() {
  return (
    <>
      <style>{`
        @keyframes christian-role-layer {
          0%, 30% {
            transform: translateY(0);
            filter: blur(0);
            opacity: 1;
          }
          33.333%, 96.667% {
            transform: translateY(-2px);
            filter: blur(5px);
            opacity: 0;
          }
          100% {
            transform: translateY(0);
            filter: blur(0);
            opacity: 1;
          }
        }

        @keyframes christian-role-shimmer {
          0%, 18% { background-position: 120% 50%; }
          72%, 100% { background-position: -30% 50%; }
        }

        .christian-role-layer {
          position: absolute;
          inset: 0;
          opacity: 0;
          animation: christian-role-layer 13.2s cubic-bezier(0.42, 0, 0.58, 1) infinite;
          will-change: transform, filter, opacity;
        }

        .christian-role-layer:nth-child(2) {
          animation-delay: -8.8s;
        }

        .christian-role-layer:nth-child(3) {
          animation-delay: -4.4s;
        }

        .christian-role-shimmer {
          color: var(--muted);
          background-image: linear-gradient(
            110deg,
            var(--muted) 32%,
            color-mix(in oklab, var(--foreground) 78%, var(--muted)) 48%,
            var(--muted) 64%
          );
          background-position: 120% 50%;
          background-size: 250% 100%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: christian-role-shimmer 5.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .christian-role-layer {
            animation: none;
            transform: translateY(0);
            filter: none;
            opacity: 0;
          }

          .christian-role-layer:first-child {
            opacity: 1;
          }

          .christian-role-shimmer {
            animation: none;
            background: none;
            -webkit-text-fill-color: currentColor;
          }
        }
      `}</style>
      <span className="sr-only">
        Software engineer, design engineer, futures trader
      </span>
      <span
        aria-hidden
        className="relative block h-5 min-w-[148px] text-left leading-5"
      >
        {roles.map((role) => (
          <span key={role} className="christian-role-layer">
            <span className="christian-role-shimmer block h-5">
              {role}
            </span>
          </span>
        ))}
      </span>
    </>
  );
}
