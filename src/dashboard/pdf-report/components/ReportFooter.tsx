import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { format } from "date-fns";
import { colors, spacing } from "../tokens";

type ReportFooterProps = {
  pageLabel: string;
};

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    left: spacing.page,
    right: spacing.page,
    bottom: 28,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  text: {
    fontSize: 7,
    color: colors.brown400,
  },
  page: {
    fontSize: 7,
    color: colors.forest700,
    fontWeight: 700,
  },
});

export function ReportFooter({ pageLabel }: ReportFooterProps) {
  return (
    <View fixed style={styles.footer}>
      <Text style={styles.text}>
        Relatório gerado em {format(new Date(), "dd/MM/yyyy HH:mm")} | YBY
        Soluções Sustentáveis
      </Text>

      <Text style={styles.page}>{pageLabel}</Text>
    </View>
  );
}