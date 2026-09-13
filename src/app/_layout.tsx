import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

const ORANGE = "#ff6433";
const GREY = "#8d97a8";

export default function RootLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: ORANGE,
        tabBarInactiveTintColor: GREY,
        tabBarStyle: {
          height: 82,
          paddingTop: 8,
          paddingBottom: 12,
          backgroundColor: "#10151b",
          borderTopColor: "#252c35",
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="worldclock"
        options={{
          title: "WorldClock",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="globe-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="alarms"
        options={{
          title: "Alarms",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="alarm-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="stopwatch"
        options={{
          title: "Stopwatch",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="stopwatch-outline" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="timer"
        options={{
          title: "Timer",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="timer-outline" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
