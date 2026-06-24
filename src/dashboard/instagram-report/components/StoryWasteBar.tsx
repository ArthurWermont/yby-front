import { storyColors } from "../tokens";
import { formatNumber } from "../utils";

type StoryWasteBarProps = {
  name: string;
  value: number;
  color: string;
};

export function StoryWasteBar({ name, value, color }: StoryWasteBarProps) {
  const width = Math.max(Math.min(value, 100), 2);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 14,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <span
            style={{
              width: 22,
              height: 22,
              borderRadius: 999,
              backgroundColor: color,
              display: "block",
            }}
          />

          <span
            style={{
              fontSize: 28,
              fontWeight: 800,
              color: storyColors.brown700,
            }}
          >
            {name}
          </span>
        </div>

        <span
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: storyColors.brown500,
          }}
        >
          {formatNumber(value)}%
        </span>
      </div>

      <div
        style={{
          height: 24,
          borderRadius: 999,
          backgroundColor: storyColors.beige200,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${width}%`,
            height: "100%",
            borderRadius: 999,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}