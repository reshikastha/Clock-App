import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/header";
import { colors, styles } from "../styles/clockStyles";

type City = {
  id: number;
  name: string;
  country: string;
  abbreviation: string;
  timeZone: string;
};

const cities: City[] = [
  {
    id: 1,
    name: "Adelaide",
    country: "Australia",
    abbreviation: "ACST",
    timeZone: "Australia/Adelaide",
  },
  {
    id: 2,
    name: "Kathmandu",
    country: "Nepal",
    abbreviation: "NPT",
    timeZone: "Asia/Kathmandu",
  },
  {
    id: 3,
    name: "London",
    country: "United Kingdom",
    abbreviation: "GMT",
    timeZone: "Europe/London",
  },
  {
    id: 4,
    name: "Tokyo",
    country: "Japan",
    abbreviation: "JST",
    timeZone: "Asia/Tokyo",
  },
];

function getTime(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function getTimeWithSeconds(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

function getDate(date: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-AU", {
    timeZone,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(date);
}

export default function WorldClockScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header />
        <Text style={styles.label}>LOCAL TIME</Text>

        <Text style={styles.cityZone}>Australia/Adelaide</Text>

        <Text style={styles.mainTime}>
          {getTimeWithSeconds(currentDate, "Australia/Adelaide")}
        </Text>

        <Text style={styles.dateText}>
          {new Intl.DateTimeFormat("en-AU", {
            timeZone: "Australia/Adelaide",
            weekday: "long",
            day: "numeric",
            month: "long",
          }).format(currentDate)}
        </Text>

        {cities.map((city, index) => (
          <View
            key={city.id}
            style={[
              styles.card,
              index === 0 && styles.selectedCard,
              styles.row,
              styles.spaceBetween,
            ]}
          >
            <View style={styles.row}>
              <View
                style={[styles.cityDot, index === 0 && styles.selectedDot]}
              />

              <View>
                <Text style={styles.cityName}>{city.name}</Text>

                <Text style={styles.cityZone}>
                  {city.country} ({city.abbreviation})
                </Text>
              </View>
            </View>

            <View>
              <Text style={styles.cityTime}>
                {getTime(currentDate, city.timeZone)}
              </Text>

              <Text style={styles.cityDate}>
                {getDate(currentDate, city.timeZone)}
              </Text>
            </View>
          </View>
        ))}

        <Pressable style={styles.button}>
          <Ionicons name="add" size={23} color={colors.white} />

          <Text style={[styles.buttonText, { marginLeft: 8 }]}>Add city</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
