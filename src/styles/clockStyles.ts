import { StyleSheet } from "react-native";

export const colors = {
  background: "#0b1015",
  surface: "#12181f",
  surfaceLight: "#171e26",
  border: "#29313b",
  orange: "#ff6433",
  orangeDark: "#7c2f1d",
  white: "#f4f6f8",
  grey: "#8d97a8",
  darkGrey: "#56606f",
};

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 35,
  },

  logoCircle: {
    width: 31,
    height: 31,
    borderWidth: 2,
    borderColor: colors.orange,
    borderRadius: 16,
    marginRight: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  logoHand: {
    width: 11,
    height: 2,
    backgroundColor: colors.orange,
    transform: [{ rotate: "40deg" }],
  },

  headerContent: {
    flex: 1,
  },

  appName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
  },

  appSubtitle: {
    color: colors.grey,
    fontSize: 9,
    letterSpacing: 3,
    marginTop: 2,
  },

  sectionTitle: {
    color: colors.orange,
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 6,
  },

  sectionDescription: {
    color: colors.grey,
    fontSize: 14,
    marginBottom: 20,
  },

  label: {
    color: colors.grey,
    fontSize: 11,
    letterSpacing: 1,
    marginBottom: 6,
  },

  mainTime: {
    color: colors.white,
    fontSize: 38,
    fontWeight: "800",
    letterSpacing: 1,
  },

  dateText: {
    color: colors.grey,
    fontSize: 14,
    marginTop: 4,
    marginBottom: 25,
  },

  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 13,
    padding: 16,
    marginBottom: 12,
  },

  selectedCard: {
    borderColor: colors.orange,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  spaceBetween: {
    justifyContent: "space-between",
  },

  cityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.darkGrey,
    marginRight: 15,
  },

  selectedDot: {
    backgroundColor: colors.orange,
  },

  cityName: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "600",
  },

  cityZone: {
    color: colors.grey,
    fontSize: 13,
    marginTop: 5,
  },

  cityTime: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
  },

  cityDate: {
    color: colors.grey,
    fontSize: 12,
    marginTop: 5,
    textAlign: "right",
  },

  button: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    backgroundColor: colors.surfaceLight,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  primaryButton: {
    minHeight: 52,
    borderWidth: 1,
    borderColor: colors.orange,
    borderRadius: 12,
    backgroundColor: colors.orangeDark,
    justifyContent: "center",
    alignItems: "center",
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
  },

  alarmTime: {
    color: colors.white,
    fontSize: 34,
    fontWeight: "800",
  },

  alarmName: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
    marginTop: 4,
  },

  alarmDays: {
    color: colors.grey,
    fontSize: 14,
    marginTop: 6,
  },

  stopwatchTime: {
    color: colors.white,
    fontSize: 58,
    fontWeight: "800",
    letterSpacing: 2,
    textAlign: "center",
    marginVertical: 35,
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  halfButton: {
    flex: 1,
  },

  timerCircle: {
    width: 235,
    height: 235,
    borderRadius: 118,
    borderWidth: 11,
    borderColor: colors.orange,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 25,
  },

  timerTime: {
    color: colors.white,
    fontSize: 43,
    fontWeight: "800",
    letterSpacing: 2,
  },

  timerStatus: {
    color: colors.grey,
    fontSize: 13,
    letterSpacing: 2,
    marginTop: 10,
  },

  presetText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "600",
  },

  presetTime: {
    color: colors.grey,
    fontSize: 14,
  },

  lapTitle: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 10,
  },

  informationTitle: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 7,
  },

  informationText: {
    color: colors.grey,
    fontSize: 14,
    lineHeight: 21,
  },
});
