import { storyColors, storyFonts } from "../tokens";

type StoryMetricProps = {
  label: string;
  value: string;
  unit?: string;
  caption?: string;
  variant?: "hero" | "large" | "card";
  dark?: boolean;
};

export function StoryMetric({
  label,
  value,
  unit,
  caption,
  variant = "card",
  dark = false,
}: StoryMetricProps) {
  const isHero = variant === "hero";
  const isLarge = variant === "large";

  return (
    <div>
      <div
        style={{
          fontSize: isHero ? 24 : 20,
          fontWeight: 800,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: dark ? storyColors.beige200 : storyColors.forest700,
          marginBottom: isHero ? 34 : 18,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: storyFonts.serif,
            fontSize: isHero ? 160 : isLarge ? 92 : 68,
            fontWeight: 700,
            lineHeight: 0.9,
            color: dark ? storyColors.beige50 : storyColors.brown900,
          }}
        >
          {value}
        </span>

        {unit ? (
          <span
            style={{
              fontSize: isHero ? 34 : 24,
              fontWeight: 800,
              color: dark ? storyColors.beige200 : storyColors.brown500,
            }}
          >
            {unit}
          </span>
        ) : null}
      </div>

      {caption ? (
        <div
          style={{
            marginTop: 22,
            fontSize: isHero ? 28 : 22,
            lineHeight: 1.35,
            maxWidth: isHero ? 780 : "100%",
            color: dark ? storyColors.beige100 : storyColors.brown500,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}