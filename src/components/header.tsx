import { Text, View } from "react-native";
import { styles } from "../styles/clockStyles";

const Header = () => {
  return (
    <View style={styles.header}>
      <View style={styles.logoCircle}>
        <View style={styles.logoHand} />
      </View>

      <View style={styles.headerContent}>
        <Text style={styles.appName}>Clock</Text>
        <Text style={styles.appSubtitle}>TIME INSTRUMENT</Text>
      </View>

      {/* <Ionicons name="settings-outline" color={colors.grey} size={23} /> */}
    </View>
  );
};

export default Header;
