import { Button, CircularProgress } from "@mui/material";
import { saveAs } from "file-saver";
import { toBlob } from "html-to-image";
import JSZip from "jszip";
import { useRef, useState } from "react";

import { InstagramStoriesPreview } from "./InstagramStoriesPreview";
import { storySize } from "./tokens";
import type { InstagramReportProps } from "./types";

type ExportStoriesButtonProps = InstagramReportProps;

const waitForRender = async () => {
  await document.fonts?.ready;
  await new Promise((resolve) => setTimeout(resolve, 500));
};

export function ExportStoriesButton(props: ExportStoriesButtonProps) {
  const previewRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  const exportStories = async () => {
    if (!previewRef.current || loading) return;

    try {
      setLoading(true);

      await waitForRender();

      const zip = new JSZip();

      const storyNodes = Array.from(
        previewRef.current.querySelectorAll("[data-story]"),
      ) as HTMLElement[];

      for (let index = 0; index < storyNodes.length; index++) {
        const node = storyNodes[index];
        const storyName = node.dataset.story || `story-${index + 1}`;

        const blob = await toBlob(node, {
          cacheBust: true,
          backgroundColor: "transparent",
          width: storySize.width,
          height: storySize.height,
          canvasWidth: storySize.width,
          canvasHeight: storySize.height,
          pixelRatio: 1,
        });

        if (blob) {
          zip.file(`${storyName}.png`, blob);
        }
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });

      saveAs(zipBlob, "yby-impacto-stories.zip");
    } catch (error) {
      console.error("Erro ao exportar stories:", error);
      alert("Não foi possível gerar os stories. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={exportStories}
        disabled={loading}
        sx={{
          borderColor: "#2E7D32",
          color: "#2E7D32",
          textTransform: "none",
          fontWeight: 600,
          height: 44,
          px: 2.4,
          borderRadius: "8px",
          "&:hover": {
            borderColor: "#1B5E20",
            backgroundColor: "rgba(46, 125, 50, 0.06)",
          },
        }}
      >
        {loading ? (
          <>
            <CircularProgress size={18} sx={{ color: "#2E7D32" }} />
            <span style={{ marginLeft: 8 }}>Gerando artes...</span>
          </>
        ) : (
          "Baixar artes para Stories"
        )}
      </Button>

      <InstagramStoriesPreview ref={previewRef} {...props} />
    </>
  );
}
