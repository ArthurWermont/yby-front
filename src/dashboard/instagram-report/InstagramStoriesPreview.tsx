import { forwardRef } from "react";
import "./fonts.css";

import { StoryCover } from "./pages/StoryCover";
import { StoryImpact } from "./pages/StoryImpact";
import { StoryIndicators } from "./pages/StoryIndicators";
import { StoryWaste } from "./pages/StoryWaste";
import type { InstagramReportProps } from "./types";

export const InstagramStoriesPreview = forwardRef<
  HTMLDivElement,
  InstagramReportProps
>((props, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: "fixed",
        left: -99999,
        top: 0,
        display: "flex",
        flexDirection: "column",
        gap: 40,
        zIndex: -1,
      }}
    >
      <div data-story="story-01-capa">
        <StoryCover {...props} />
      </div>

      <div data-story="story-02-indicadores">
        <StoryIndicators {...props} />
      </div>

      <div data-story="story-03-residuos">
        <StoryWaste {...props} />
      </div>

      <div data-story="story-04-impacto">
        <StoryImpact {...props} />
      </div>
    </div>
  );
});

InstagramStoriesPreview.displayName = "InstagramStoriesPreview";