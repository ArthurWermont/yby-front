import type { ReactNode } from "react";
import { storyColors, storyFonts, storySize, storySpacing } from "../tokens";

type StoryFrameProps = {
  children: ReactNode;
  variant?: "dark" | "light";
};

export function StoryFrame({ children, variant = "dark" }: StoryFrameProps) {
  const isDark = variant === "dark";

  return (
    <div
      style={{
        width: storySize.width,
        height: storySize.height,
        position: "relative",
        overflow: "hidden",
        backgroundColor: isDark ? storyColors.forest900 : storyColors.beige50,
        color: isDark ? storyColors.beige50 : storyColors.brown900,
        fontFamily: storyFonts.sans,
        boxSizing: "border-box",
        padding: storySpacing.page,
      }}
    >
      {children}
    </div>
  );
}