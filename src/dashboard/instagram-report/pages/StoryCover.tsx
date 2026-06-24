import { StoryFooter } from "../components/StoryFooter";
import { StoryFrame } from "../components/StoryFrame";
import { StoryMetric } from "../components/StoryMetric";
import { StoryMiniCard } from "../components/StoryMiniCard";
import { storyColors, storyFonts } from "../tokens";
import type { InstagramReportProps } from "../types";
import {
  formatCompactNumber,
  formatInteger,
  formatNumber,
  formatPeriod,
  getContextLabel,
} from "../utils";

export function StoryCover({
  mode,
  startDate,
  endDate,
  selectedPevNames = [],
  wasteName,
  weightSummary,
  waterSummary,
  cO2Summary,
  treeSummary,
}: InstagramReportProps) {
  const period = formatPeriod(startDate, endDate);
  const context = getContextLabel({ mode, selectedPevNames });

  return (
    <StoryFrame variant="dark">
      <img
        src="/ybyiconcream.png"
        style={{
          position: "absolute",
          right: 72,
          bottom: 135,
          width: 250,
          height: 250,
          opacity: 0.05,
          objectFit: "contain",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
          <img
            src="/ybyiconcream.png"
            style={{ width: 70, height: 70, objectFit: "contain" }}
          />

          <div>
            <div
              style={{
                fontSize: 42,
                fontWeight: 800,
                letterSpacing: 1,
              }}
            >
              YBY
            </div>

            <div
              style={{
                marginTop: 8,
                fontSize: 17,
                letterSpacing: 4,
                textTransform: "uppercase",
                color: storyColors.beige200,
              }}
            >
              Soluções Sustentáveis
            </div>
          </div>
        </div>

        <div
          style={{
            textAlign: "right",
            fontSize: 22,
            color: storyColors.beige200,
            lineHeight: 1.45,
          }}
        >
          <div
            style={{
              fontWeight: 800,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: storyColors.beige50,
            }}
          >
            Relatório de impacto ambiental
          </div>

          <div style={{ marginTop: 16 }}>{period}</div>
          <div>{context}</div>
        </div>
      </div>

      <div
        style={{
          marginTop: 330,
          maxWidth: 820,
          fontFamily: storyFonts.serif,
          fontSize: 66,
          lineHeight: 1.08,
          fontWeight: 700,
          fontStyle: "italic",
          color: storyColors.beige100,
        }}
      >
        Cada coleta, um impacto que se multiplica.
      </div>

      <div style={{ marginTop: 90 }}>
        <StoryMetric
          dark
          variant="hero"
          label="Resíduos coletados no período"
          value={formatNumber(weightSummary)}
          unit="kg"
          caption="Material recuperado e desviado do aterro sanitário por meio das coletas realizadas com a YBY Soluções Sustentáveis."
        />
      </div>

      <div
        style={{
          position: "absolute",
          left: 86,
          right: 86,
          bottom: 390,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)",
          gap: 24,
        }}
      >
        <StoryMiniCard
          dark
          label="Água economizada"
          value={formatCompactNumber(waterSummary)}
          caption="litros"
          accent={storyColors.darkBorder}
        />

        <StoryMiniCard
          dark
          label="CO₂e evitado"
          value={formatInteger(cO2Summary)}
          caption="kg CO₂e"
          accent={storyColors.darkBorder}
        />

        <StoryMiniCard
          dark
          label="Árvores poupadas"
          value={formatInteger(treeSummary)}
          caption="unidades equivalentes"
          accent={storyColors.darkBorder}
        />
      </div>

      <StoryFooter
        period={period}
        context={context}
        wasteName={wasteName}
        variant="dark"
      />
    </StoryFrame>
  );
}
