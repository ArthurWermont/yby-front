import { Font } from "@react-pdf/renderer";

let fontsRegistered = false;

export const registerReportFonts = () => {
  if (fontsRegistered) return;

  Font.registerHyphenationCallback((word) => [word]);

  Font.register({
    family: "Spectral",
    fonts: [
      {
        src: "/fonts/Spectral-Regular.ttf",
        fontWeight: 400,
      },
      {
        src: "/fonts/Spectral-SemiBold.ttf",
        fontWeight: 600,
      },
      {
        src: "/fonts/Spectral-Bold.ttf",
        fontWeight: 700,
      },
      {
        src: "/fonts/Spectral-BoldItalic.ttf",
        fontWeight: 700,
        fontStyle: "italic",
      },
    ],
  });

  Font.register({
    family: "Hanken Grotesk",
    fonts: [
      {
        src: "/fonts/HankenGrotesk-Regular.ttf",
        fontWeight: 400,
      },
      {
        src: "/fonts/HankenGrotesk-SemiBold.ttf",
        fontWeight: 600,
      },
      {
        src: "/fonts/HankenGrotesk-Bold.ttf",
        fontWeight: 700,
      },
      {
        src: "/fonts/HankenGrotesk-ExtraBold.ttf",
        fontWeight: 800,
      },
    ],
  });

  fontsRegistered = true;
};
