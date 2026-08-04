type SocialCardProps = {
  index: string;
  eyebrow: string;
  title: string;
  description: string;
  footer: string;
};

export const socialImageSize = {
  width: 1200,
  height: 630,
};

export function SocialCard({
  index,
  eyebrow,
  title,
  description,
  footer,
}: SocialCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        overflow: "hidden",
        background: "#f7f6f2",
        color: "#171715",
        fontFamily: "Geist",
        padding: 52,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 28,
          right: 28,
          bottom: 28,
          left: 28,
          display: "flex",
          border: "1px solid #d8d5cc",
          borderRadius: 28,
        }}
      />

      <aside
        style={{
          width: 170,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "28px 34px 28px 24px",
          borderRight: "1px solid #d8d5cc",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontSize: 17,
            fontWeight: 600,
          }}
        >
          <span
            style={{
              width: 9,
              height: 9,
              borderRadius: 999,
              background: "#287360",
            }}
          />
          CO
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            color: "#6e6b63",
            fontSize: 15,
            letterSpacing: "0.08em",
          }}
        >
          <span>{index}</span>
          <span>2026</span>
        </div>
      </aside>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "30px 36px 28px 50px",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 17,
          }}
        >
          <span style={{ fontWeight: 600 }}>Christian Obanaka</span>
          <span style={{ color: "#6e6b63" }}>@chrisgoingturbo</span>
        </header>

        <section
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: 810,
          }}
        >
          <span
            style={{
              color: "#287360",
              fontSize: 17,
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            {eyebrow}
          </span>
          <h1
            style={{
              margin: "16px 0 0",
              fontSize: title.length > 18 ? 72 : 88,
              fontWeight: 600,
              letterSpacing: "-0.055em",
              lineHeight: 0.98,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              maxWidth: 750,
              margin: "22px 0 0",
              color: "#56534d",
              fontSize: 24,
              lineHeight: 1.4,
            }}
          >
            {description}
          </p>
        </section>

        <footer
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            color: "#6e6b63",
            fontSize: 15,
            letterSpacing: "0.04em",
          }}
        >
          <span>{footer}</span>
          <span>godsbattle.net</span>
        </footer>
      </main>
    </div>
  );
}
