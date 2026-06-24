import { storyColors, storyFonts } from "../tokens";

type StoryMiniCardProps = {
  label: string;
  value: string;
  unit?: string;
  caption?: string;
  dark?: boolean;
  accent?: string;
  valueSize?: number;
};

export function StoryMiniCard({
  label,
  value,
  unit,
  caption,
  dark = false,
  accent = storyColors.forest700,
  valueSize,
}: StoryMiniCardProps) {
  return (
    <div
      style={{
        border: `2px solid ${
          dark ? storyColors.darkBorder : storyColors.lightBorder
        }`,
        borderTop: `10px solid ${accent}`,
        borderRadius: 32,
        backgroundColor: dark ? storyColors.darkCard : storyColors.white,
        padding: 34,
        minHeight: 210,
        boxSizing: "border-box",
        minWidth: 0,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          fontSize: dark ? 22 : 24,
          fontWeight: 800,
          color: dark ? storyColors.beige200 : storyColors.brown500,
          marginBottom: 24,
          lineHeight: 1.15,
        }}
      >
        {label}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: 10,
          minWidth: 0,
        }}
      >
        <span
          style={{
            fontFamily: storyFonts.serif,
            fontSize: valueSize ?? (dark ? 48 : 54),
            fontWeight: 700,
            lineHeight: 0.95,
            color: dark ? storyColors.beige50 : storyColors.brown900,
            whiteSpace: "nowrap",
            letterSpacing: -0.5,
          }}
        >
          {value}
        </span>

        {unit ? (
          <span
            style={{
              fontSize: dark ? 16 : 18,
              fontWeight: 800,
              lineHeight: 1.1,
              color: dark ? storyColors.beige200 : storyColors.brown500,
              whiteSpace: "nowrap",
            }}
          >
            {unit}
          </span>
        ) : null}
      </div>

      {caption ? (
        <div
          style={{
            marginTop: 14,
            fontSize: dark ? 17 : 18,
            fontWeight: 800,
            lineHeight: 1.15,
            color: dark ? storyColors.beige200 : storyColors.brown500,
          }}
        >
          {caption}
        </div>
      ) : null}
    </div>
  );
}
