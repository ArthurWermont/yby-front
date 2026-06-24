import { storyColors, storyFonts } from "../tokens";

type StoryHeaderProps = {
  title: string;
  period: string;
  context: string;
  variant?: "dark" | "light";
};

export function StoryHeader({
  title,
  period,
  context,
  variant = "light",
}: StoryHeaderProps) {
  const isDark = variant === "dark";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        borderBottom: `4px solid ${
          isDark ? storyColors.darkBorder : storyColors.forest700
        }`,
        paddingBottom: 34,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <img
          src={isDark ? "/ybyiconcream.png" : "/ybyicon.png"}
          style={{
            width: 62,
            height: 62,
            objectFit: "contain",
          }}
        />

        <div>
          <div
            style={{
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: 1,
              color: isDark ? storyColors.beige50 : storyColors.forest900,
            }}
          >
            YBY
          </div>

          <div
            style={{
              marginTop: 8,
              fontSize: 16,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: isDark ? storyColors.beige200 : storyColors.brown500,
            }}
          >
            Soluções Sustentáveis
          </div>
        </div>
      </div>

      <div style={{ textAlign: "right", maxWidth: 500 }}>
        <div
          style={{
            fontFamily: storyFonts.sans,
            fontSize: 32,
            lineHeight: 1.12,
            fontWeight: 800,
            color: isDark ? storyColors.beige50 : storyColors.brown900,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 22,
            color: isDark ? storyColors.beige200 : storyColors.brown500,
          }}
        >
          {period}
        </div>

        <div
          style={{
            marginTop: 6,
            fontSize: 22,
            fontWeight: 800,
            color: isDark ? storyColors.beige100 : storyColors.forest700,
          }}
        >
          {context}
        </div>
      </div>
    </div>
  );
}