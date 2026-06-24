import { StoryFooter } from "../components/StoryFooter";
import { StoryFrame } from "../components/StoryFrame";
import { storyColors, storyFonts } from "../tokens";
import type { InstagramReportProps } from "../types";
import {
  formatCompactNumber,
  formatInteger,
  formatPeriod,
  getContextLabel,
} from "../utils";

export function StoryImpact({
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
      {/* <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 60,
          backgroundColor: storyColors.brown500,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 800,
          letterSpacing: 4,
          textTransform: "uppercase",
          color: storyColors.beige100,
        }}
      >
        Card de impacto compartilhável
      </div> */}

      <img
        src="/ybyiconcream.png"
        style={{
          position: "absolute",
          left: 370,
          top: 780,
          width: 340,
          height: 340,
          objectFit: "contain",
          opacity: 0.055,
        }}
      />

      <div
        style={{
          marginTop: 135,
          textAlign: "center",
        }}
      >
        <img
          src="/ybyiconcream.png"
          style={{
            width: 82,
            height: 82,
            objectFit: "contain",
            opacity: 0.9,
          }}
        />

        <div
          style={{
            marginTop: 28,
            fontSize: 46,
            fontWeight: 800,
            letterSpacing: 1,
          }}
        >
          YBY
        </div>

        <div
          style={{
            marginTop: 12,
            fontSize: 18,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: storyColors.beige200,
          }}
        >
          Soluções Sustentáveis
        </div>
      </div>

      <div
        style={{
          margin: "180px auto 0",
          maxWidth: 850,
          textAlign: "center",
          fontFamily: storyFonts.serif,
          fontSize: 68,
          lineHeight: 1.1,
          fontWeight: 700,
          fontStyle: "italic",
          color: storyColors.beige50,
        }}
      >
        Juntos, transformamos coletas em impacto ambiental real.
      </div>

      <div
        style={{
          marginTop: 115,
          padding: "62px 0",
          borderTop: `2px solid ${storyColors.darkBorder}`,
          borderBottom: `2px solid ${storyColors.darkBorder}`,
          display: "grid",
          gridTemplateColumns: "1fr 1fr 1fr",
          gap: 24,
        }}
      >
        {[
          [formatInteger(weightSummary), "kg de resíduos", "Peso coletado"],
          [formatCompactNumber(waterSummary), "litros de água", "Economizada"],
          [formatInteger(treeSummary), "árvores equiv.", "Poupadas"],
        ].map(([value, unit, label]) => (
          <div key={label} style={{ textAlign: "center" }}>
            <div
              style={{
                fontFamily: storyFonts.serif,
                fontSize: 62,
                fontWeight: 700,
                lineHeight: 0.95,
                color: storyColors.beige50,
                whiteSpace: "nowrap",
              }}
            >
              {value}
            </div>

            <div
              style={{
                marginTop: 16,
                fontSize: 18,
                color: storyColors.beige200,
              }}
            >
              {unit}
            </div>

            <div
              style={{
                marginTop: 14,
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: storyColors.beige100,
              }}
            >
              {label}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          margin: "80px auto 0",
          maxWidth: 820,
          textAlign: "center",
          fontSize: 30,
          lineHeight: 1.4,
          fontWeight: 800,
          color: storyColors.beige100,
        }}
      >
        E {formatInteger(cO2Summary)} kg de CO₂e evitados no período — impacto
        climático positivo gerado por meio da reciclagem.
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
