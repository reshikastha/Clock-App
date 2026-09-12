import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, styles } from "../styles/clockStyles";

type Alarm = {
  id: number;
  time: string;
  name: string;
  days: string;
  enabled: boolean;
};

const initialAlarms: Alarm[] = [
  {
    id: 1,
    time: "06:30",
    name: "Morning run",
    days: "Mon, Tue, Wed, Fri",
    enabled: true,
  },
  {
    id: 2,
    time: "08:00",
    name: "Standup prep",
    days: "Mon, Tue, Wed, Thu, Fri",
    enabled: true,
  },
  {
    id: 3,
    time: "22:30",
    name: "Wind down",
    days: "Every day",
    enabled: false,
  },
];

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState(initialAlarms);

  function toggleAlarm(id: number) {
    setAlarms((currentAlarms) =>
      currentAlarms.map((alarm) =>
        alarm.id === id ? { ...alarm, enabled: !alarm.enabled } : alarm,
      ),
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <View style={styles.logoCircle}>
            <View style={styles.logoHand} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.appName}>Clock</Text>
            <Text style={styles.appSubtitle}>TIME INSTRUMENT</Text>
          </View>

          <Ionicons name="settings-outline" color={colors.grey} size={23} />
        </View>

        <Text style={styles.sectionTitle}>ALARMS</Text>
        <Text style={styles.sectionDescription}>Wake up to what matters.</Text>

        {alarms.map((alarm) => (
          <View
            key={alarm.id}
            style={[
              styles.card,
              styles.row,
              styles.spaceBetween,
              { paddingVertical: 20 },
            ]}
          >
            <View>
              <Text style={styles.alarmTime}>{alarm.time}</Text>
              <Text style={styles.alarmName}>{alarm.name}</Text>
              <Text style={styles.alarmDays}>{alarm.days}</Text>
            </View>

            <Switch
              value={alarm.enabled}
              onValueChange={() => toggleAlarm(alarm.id)}
              trackColor={{
                false: colors.darkGrey,
                true: colors.orange,
              }}
              thumbColor={colors.white}
            />
          </View>
        ))}

        <Pressable style={styles.button}>
          <Ionicons name="add" size={23} color={colors.white} />

          <Text style={[styles.buttonText, { marginLeft: 8 }]}>Add alarm</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
