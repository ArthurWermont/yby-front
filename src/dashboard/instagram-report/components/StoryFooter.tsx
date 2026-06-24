import { storyColors } from "../tokens";

type StoryFooterProps = {
  period: string;
  context: string;
  wasteName?: string;
  variant?: "dark" | "light";
};

export function StoryFooter({
  period,
  context,
  wasteName,
  variant = "dark",
}: StoryFooterProps) {
  const isDark = variant === "dark";

  return (
    <div
      style={{
        position: "absolute",
        left: 86,
        right: 86,
        bottom: 76,
        borderTop: `2px solid ${
          isDark ? storyColors.darkBorder : storyColors.lightBorder
        }`,
        paddingTop: 28,
        display: "flex",
        justifyContent: "space-between",
        gap: 30,
        fontSize: 22,
        color: isDark ? storyColors.beige200 : storyColors.brown500,
      }}
    >
      <span>{period}</span>

      <span style={{ textAlign: "right" }}>
        {context} · {wasteName || "Todos os resíduos"}
      </span>
    </div>
  );
}