import { StyleSheet, Text, View } from "@react-pdf/renderer";
import { colors } from "../tokens";

type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 10,
  },
  eyebrow: {
    fontSize: 8,
    fontWeight: 700,
    color: colors.forest700,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    marginBottom: 5,
  },
  title: {
    fontSize: 19,
    fontWeight: 700,
    color: colors.brown900,
    marginBottom: 4,
  },
  description: {
    fontSize: 9,
    color: colors.brown500,
    lineHeight: 1.4,
  },
});

export function SectionTitle({
  eyebrow,
  title,
  description,
}: SectionTitleProps) {
  return (
    <View style={styles.wrapper}>
      {eyebrow ? <Text style={styles.eyebrow}>{eyebrow}</Text> : null}
      <Text style={styles.title}>{title}</Text>
      {description ? (
        <Text style={styles.description}>{description}</Text>
      ) : null}
    </View>
  );
}
