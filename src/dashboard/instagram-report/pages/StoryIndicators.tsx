import { StoryFrame } from "../components/StoryFrame";
import { StoryHeader } from "../components/StoryHeader";
import { StoryMiniCard } from "../components/StoryMiniCard";
import { storyColors, storyFonts } from "../tokens";
import type { InstagramReportProps } from "../types";
import {
  formatNumber,
  formatPeriod,
  getContextLabel,
  formatMonthsCount,
  formatCompactNumber,
  formatInteger,
} from "../utils";

export function StoryIndicators({
  mode,
  startDate,
  endDate,
  selectedPevNames = [],
  weightByMonth = [],
  weightSummary,
  waterSummary,
  cO2Summary,
  treeSummary,
}: InstagramReportProps) {
  const period = formatPeriod(startDate, endDate);
  const context = getContextLabel({ mode, selectedPevNames });

  return (
    <StoryFrame variant="light">
      <StoryHeader
        title="Indicadores ambientais"
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
          Resultados em destaque
        </div>

        <h1
          style={{
            margin: 0,
            fontFamily: storyFonts.serif,
            fontSize: 78,
            lineHeight: 1.02,
            color: storyColors.brown900,
          }}
        >
          Os quatro indicadores de impacto
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
          Indicadores ambientais consolidados com base nas coletas registradas
          no período selecionado.
        </p>
      </div>

      <div
        style={{
          marginTop: 76,
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 28,
        }}
      >
        <StoryMiniCard
          label="Peso coletado"
          value={formatNumber(weightSummary)}
          caption="kg"
          accent={storyColors.forest700}
        />

        <StoryMiniCard
          label="Água economizada"
          value={formatCompactNumber(waterSummary)}
          caption="litros"
          accent={storyColors.water}
        />

        <StoryMiniCard
          label="CO₂e evitado"
          value={formatInteger(cO2Summary)}
          caption="kg CO₂e"
          accent={storyColors.forest600}
        />

        <StoryMiniCard
          label="Árvores poupadas"
          value={formatInteger(treeSummary)}
          caption="unidades equivalentes"
          accent={storyColors.gold}
        />
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
          Leitura do período
        </div>

        <div style={{ fontSize: 26, lineHeight: 1.35 }}>
          Resultados consolidados ao longo de{" "}
          {formatMonthsCount(weightByMonth.length)} de coletas registradas na
          plataforma YBY.
        </div>
      </div>
    </StoryFrame>
  );
}
