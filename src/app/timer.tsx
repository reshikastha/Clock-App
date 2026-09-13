import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/header";
import { colors, styles } from "../styles/clockStyles";

type TimerPreset = {
  name: string;
  seconds: number;
};

const presets: TimerPreset[] = [
  { name: "Focus block", seconds: 5 * 60 },
  { name: "Short break", seconds: 10 * 60 },
  { name: "Deep work", seconds: 15 * 60 },
  { name: "Full sprint", seconds: 25 * 60 },
];

function formatTimer(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0",
  )}`;
}

export default function TimerScreen() {
  const [selectedDuration, setSelectedDuration] = useState(5 * 60);
  const [remainingSeconds, setRemainingSeconds] = useState(5 * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning || remainingSeconds <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setRemainingSeconds((currentSeconds) => {
        if (currentSeconds <= 1) {
          setIsRunning(false);
          return 0;
        }

        return currentSeconds - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isRunning, remainingSeconds]);

  function selectPreset(seconds: number) {
    setSelectedDuration(seconds);
    setRemainingSeconds(seconds);
    setIsRunning(false);
  }

  function resetTimer() {
    setIsRunning(false);
    setRemainingSeconds(selectedDuration);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />

        <Text style={styles.sectionTitle}>TIMER</Text>
        <Text style={styles.sectionDescription}>Count down on purpose.</Text>

        <View style={styles.timerCircle}>
          <Text style={styles.timerTime}>{formatTimer(remainingSeconds)}</Text>

          <Text style={styles.timerStatus}>
            {remainingSeconds === 0
              ? "FINISHED"
              : isRunning
                ? "RUNNING"
                : "READY"}
          </Text>
        </View>

        {presets.map((preset) => {
          const selected = selectedDuration === preset.seconds;

          return (
            <Pressable
              key={preset.name}
              style={[
                styles.card,
                styles.row,
                styles.spaceBetween,
                selected && styles.selectedCard,
              ]}
              onPress={() => selectPreset(preset.seconds)}
            >
              <Text style={styles.presetText}>{preset.name}</Text>

              <Text
                style={[
                  styles.presetTime,
                  selected && { color: colors.orange },
                ]}
              >
                {formatTimer(preset.seconds)}
              </Text>
            </Pressable>
          );
        })}

        <View style={styles.actionRow}>
          <Pressable
            style={[styles.primaryButton, styles.halfButton]}
            onPress={() => {
              if (remainingSeconds === 0) {
                setRemainingSeconds(selectedDuration);
              }

              setIsRunning((current) => !current);
            }}
          >
            <Text style={styles.primaryButtonText}>
              {isRunning ? "Pause" : "Start"}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.button, styles.halfButton]}
            onPress={resetTimer}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
