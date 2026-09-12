import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { colors, styles } from "../styles/clockStyles";

function formatStopwatch(milliseconds: number) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const hundredths = Math.floor((milliseconds % 1000) / 10);

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}.${String(hundredths).padStart(2, "0")}`;
}

export default function StopwatchScreen() {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const startedAt = Date.now() - elapsedTime;

    const interval = setInterval(() => {
      setElapsedTime(Date.now() - startedAt);
    }, 10);

    return () => clearInterval(interval);
  }, [isRunning]);

  function resetStopwatch() {
    setIsRunning(false);
    setElapsedTime(0);
    setLaps([]);
  }

  function addLap() {
    if (elapsedTime > 0) {
      setLaps((currentLaps) => [elapsedTime, ...currentLaps]);
    }
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

        <Text style={styles.sectionTitle}>STOPWATCH</Text>

        <Text style={styles.sectionDescription}>Measure what's running.</Text>

        <Text style={styles.stopwatchTime}>{formatStopwatch(elapsedTime)}</Text>

        <Pressable
          style={styles.primaryButton}
          onPress={() => setIsRunning((current) => !current)}
        >
          <Text style={styles.primaryButtonText}>
            {isRunning ? "Pause" : "Start"}
          </Text>
        </Pressable>

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.button, styles.halfButton]}
            onPress={addLap}
          >
            <Text style={styles.buttonText}>Lap</Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.halfButton]}
            onPress={resetStopwatch}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>

        <View style={[styles.card, { marginTop: 30 }]}>
          <Text style={styles.lapTitle}>REFERENCE DIAL</Text>

          <Text style={styles.informationTitle}>
            One true time, read three ways
          </Text>

          <Text style={styles.informationText}>
            The stopwatch displays minutes, seconds and hundredths of a second
            in real time.
          </Text>
        </View>

        {laps.map((lap, index) => (
          <View
            key={`${lap}-${index}`}
            style={[styles.card, styles.row, styles.spaceBetween]}
          >
            <Text style={styles.presetText}>Lap {laps.length - index}</Text>

            <Text style={styles.presetTime}>{formatStopwatch(lap)}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
