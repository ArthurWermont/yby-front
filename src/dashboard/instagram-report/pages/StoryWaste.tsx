import { StoryFrame } from "../components/StoryFrame";
import { StoryHeader } from "../components/StoryHeader";
import { StoryWasteBar } from "../components/StoryWasteBar";
import { storyColors, storyFonts } from "../tokens";
import type { InstagramReportProps } from "../types";
import {
  formatNumber,
  formatPeriod,
  getContextLabel,
  getSafeWasteName,
} from "../utils";

const wasteColors = [
  storyColors.forest700,
  storyColors.forest600,
  storyColors.amber,
  storyColors.clay,
  storyColors.gold,
  storyColors.stone,
  storyColors.bark,
];

export function StoryWaste({
  mode,
  startDate,
  endDate,
  selectedPevNames = [],
  wasteName,
  dataResiduos = [],
  weightSummary,
}: InstagramReportProps) {
  const period = formatPeriod(startDate, endDate);
  const context = getContextLabel({ mode, selectedPevNames });

  const orderedData = [...dataResiduos]
    .sort((a, b) => Number(b.value ?? 0) - Number(a.value ?? 0))
    .slice(0, 7);

  return (
    <StoryFrame variant="light">
      <StoryHeader
        title="Distribuição por resíduo"
        period={period}
        context={context}
        variant="light"
      />

      <div style={{ marginTop: 88 }}>
        <div
          style={{
            fontSize: 24,
            fontWeight: 800,
            letterSpacing: 4,
            color: storyColors.forest700,
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          Composição do período
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: storyFonts.serif,
            fontSize: 76,
            lineHeight: 1.02,
            color: storyColors.brown900,
          }}
        >
          Distribuição por resíduo
        </h1>

        <p
          style={{
            marginTop: 26,
            fontSize: 28,
            lineHeight: 1.35,
            color: storyColors.brown500,
            maxWidth: 850,
          }}
        >
          Participação percentual dos tipos de resíduos registrados no período
          selecionado.
        </p>
      </div>

      <div
        style={{
          marginTop: 82,
          display: "flex",
          flexDirection: "column",
          gap: 34,
        }}
      >
        {orderedData.map((item, index) => (
          <StoryWasteBar
            key={`${item.name}-${index}`}
            name={item.name}
            value={Number(item.value ?? 0)}
            color={wasteColors[index % wasteColors.length]}
          />
        ))}
      </div>

      <div
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          bottom: 96,
          backgroundColor: storyColors.beige100,
          border: `2px solid ${storyColors.lightBorder}`,
          borderRadius: 30,
          padding: 38,
          color: storyColors.brown700,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: storyColors.forest700,
            marginBottom: 18,
          }}
        >
          Resumo técnico
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          <span>Peso total coletado</span>
          <span>{formatNumber(weightSummary)} kg</span>
        </div>

        <div
          style={{
            marginTop: 22,
            fontSize: 24,
            lineHeight: 1.35,
            color: storyColors.brown500,
          }}
        >
          Filtro aplicado: {context} · Tipo de resíduo:{" "}
          {getSafeWasteName(wasteName)}.
        </div>
      </div>
    </StoryFrame>
  );
}