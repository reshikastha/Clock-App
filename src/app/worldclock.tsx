// import { Ionicons } from "@expo/vector-icons";
// import { useEffect, useState } from "react";
// import { Pressable, ScrollView, Text, View } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";

// import Header from "@/components/header";
// import { colors, styles } from "../styles/clockStyles";

// type City = {
//   id: number;
//   name: string;
//   country: string;
//   abbreviation: string;
//   timeZone: string;
// };

// const cities: City[] = [
//   {
//     id: 1,
//     name: "Adelaide",
//     country: "Australia",
//     abbreviation: "ACST",
//     timeZone: "Australia/Adelaide",
//   },
//   {
//     id: 2,
//     name: "Kathmandu",
//     country: "Nepal",
//     abbreviation: "NPT",
//     timeZone: "Asia/Kathmandu",
//   },
//   {
//     id: 3,
//     name: "London",
//     country: "United Kingdom",
//     abbreviation: "GMT",
//     timeZone: "Europe/London",
//   },
//   {
//     id: 4,
//     name: "Tokyo",
//     country: "Japan",
//     abbreviation: "JST",
//     timeZone: "Asia/Tokyo",
//   },
// ];

// function getTime(date: Date, timeZone: string) {
//   return new Intl.DateTimeFormat("en-AU", {
//     timeZone,
//     hour: "2-digit",
//     minute: "2-digit",
//     hour12: false,
//   }).format(date);
// }

// function getTimeWithSeconds(date: Date, timeZone: string) {
//   return new Intl.DateTimeFormat("en-AU", {
//     timeZone,
//     hour: "2-digit",
//     minute: "2-digit",
//     second: "2-digit",
//     hour12: false,
//   }).format(date);
// }

// function getDate(date: Date, timeZone: string) {
//   return new Intl.DateTimeFormat("en-AU", {
//     timeZone,
//     weekday: "short",
//     day: "numeric",
//     month: "short",
//   }).format(date);
// }

// export default function WorldClockScreen() {
//   const [currentDate, setCurrentDate] = useState(new Date());

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentDate(new Date());
//     }, 1000);

//     return () => clearInterval(interval);
//   }, []);

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <ScrollView contentContainerStyle={styles.container}>
//         <Header />
//         <Text style={styles.label}>LOCAL TIME</Text>

//         <Text style={styles.cityZone}>Australia/Adelaide</Text>

//         <Text style={styles.mainTime}>
//           {getTimeWithSeconds(currentDate, "Australia/Adelaide")}
//         </Text>

//         <Text style={styles.dateText}>
//           {new Intl.DateTimeFormat("en-AU", {
//             timeZone: "Australia/Adelaide",
//             weekday: "long",
//             day: "numeric",
//             month: "long",
//           }).format(currentDate)}
//         </Text>

//         {cities.map((city, index) => (
//           <View
//             key={city.id}
//             style={[
//               styles.card,
//               index === 0 && styles.selectedCard,
//               styles.row,
//               styles.spaceBetween,
//             ]}
//           >
//             <View style={styles.row}>
//               <View
//                 style={[styles.cityDot, index === 0 && styles.selectedDot]}
//               />

//               <View>
//                 <Text style={styles.cityName}>{city.name}</Text>

//                 <Text style={styles.cityZone}>
//                   {city.country} ({city.abbreviation})
//                 </Text>
//               </View>
//             </View>

//             <View>
//               <Text style={styles.cityTime}>
//                 {getTime(currentDate, city.timeZone)}
//               </Text>

//               <Text style={styles.cityDate}>
//                 {getDate(currentDate, city.timeZone)}
//               </Text>
//             </View>
//           </View>
//         ))}

//         <Pressable style={styles.button}>
//           <Ionicons name="add" size={23} color={colors.white} />

//           <Text style={[styles.buttonText, { marginLeft: 8 }]}>Add city</Text>
//         </Pressable>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }

import { Ionicons } from "@expo/vector-icons";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import Header from "@/components/header";
import { db } from "@/config/firebase";
import { colors, styles } from "../styles/clockStyles";

type City = {
  id: string;
  name: string;
  country: string;
  abbreviation: string;
  timeZone: string;
};

type CityFormData = {
  name: string;
  country: string;
  abbreviation: string;
  timeZone: string;
};

function createEmptyForm(): CityFormData {
  return {
    name: "",
    country: "",
    abbreviation: "",
    timeZone: "",
  };
}

function getTime(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "--:--";
  }
}

function getTimeWithSeconds(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "--:--:--";
  }
}

function getDate(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone,
      weekday: "short",
      day: "numeric",
      month: "short",
    }).format(date);
  } catch {
    return "Invalid timezone";
  }
}

function getLongDate(date: Date, timeZone: string) {
  try {
    return new Intl.DateTimeFormat("en-AU", {
      timeZone,
      weekday: "long",
      day: "numeric",
      month: "long",
    }).format(date);
  } catch {
    return "";
  }
}

function isValidTimeZone(timeZone: string) {
  try {
    new Intl.DateTimeFormat("en-AU", {
      timeZone,
    }).format();

    return true;
  } catch {
    return false;
  }
}

export default function WorldClockScreen() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [cities, setCities] = useState<City[]>([]);

  const [formData, setFormData] = useState<CityFormData>(createEmptyForm());

  const [editingCity, setEditingCity] = useState<City | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * Update all displayed clocks every second.
   */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  /*
   * Load cities from Firebase in real time.
   */
  useEffect(() => {
    const citiesCollection = collection(db, "cities");

    const unsubscribe = onSnapshot(
      citiesCollection,
      (snapshot) => {
        const firebaseCities: City[] = snapshot.docs.map((cityDocument) => {
          const data = cityDocument.data();

          return {
            id: cityDocument.id,
            name: data.name ?? "",
            country: data.country ?? "",
            abbreviation: data.abbreviation ?? "",
            timeZone: data.timeZone ?? "",
          };
        });

        firebaseCities.sort((firstCity, secondCity) =>
          firstCity.name.localeCompare(secondCity.name),
        );

        setCities(firebaseCities);
        setError("");
        setIsLoading(false);
      },
      (firebaseError) => {
        console.error("Could not load cities:", firebaseError);

        setError("Could not load cities from Firebase.");
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  function openAddForm() {
    setEditingCity(null);
    setFormData(createEmptyForm());
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(city: City) {
    setEditingCity(city);

    setFormData({
      name: city.name,
      country: city.country,
      abbreviation: city.abbreviation,
      timeZone: city.timeZone,
    });

    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingCity(null);
    setFormData(createEmptyForm());
    setError("");
  }

  /*
   * Add a city or update an existing city.
   */
  async function saveCity() {
    const cityName = formData.name.trim();
    const country = formData.country.trim();
    const abbreviation = formData.abbreviation.trim().toUpperCase();
    const timeZone = formData.timeZone.trim();

    if (!cityName || !country || !abbreviation || !timeZone) {
      setError("Please complete all fields.");
      return;
    }

    if (!isValidTimeZone(timeZone)) {
      setError("Invalid timezone. Use a value such as Australia/Adelaide.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (editingCity) {
        const cityReference = doc(db, "cities", editingCity.id);

        await updateDoc(cityReference, {
          name: cityName,
          country,
          abbreviation,
          timeZone,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "cities"), {
          name: cityName,
          country,
          abbreviation,
          timeZone,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsFormOpen(false);
      setEditingCity(null);
      setFormData(createEmptyForm());
    } catch (firebaseError) {
      console.error("Could not save city:", firebaseError);

      setError("Could not save the city.");
    } finally {
      setIsSaving(false);
    }
  }

  /*
   * Show the native confirmation alert before deleting.
   */
  function confirmDeleteCity(city: City) {
    Alert.alert(
      "Delete city",
      `Are you sure you want to delete ${city.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteCity(city.id),
        },
      ],
    );
  }

  /*
   * Delete the selected city from Firebase.
   */
  async function deleteCity(cityId: string) {
    try {
      await deleteDoc(doc(db, "cities", cityId));
    } catch (firebaseError) {
      console.error("Could not delete city:", firebaseError);

      Alert.alert("Delete failed", "Could not delete the city.");
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Header />

        <Text style={styles.label}>LOCAL TIME</Text>

        <Text style={styles.cityZone}>Australia/Adelaide</Text>

        <Text style={styles.mainTime}>
          {getTimeWithSeconds(currentDate, "Australia/Adelaide")}
        </Text>

        <Text style={styles.dateText}>
          {getLongDate(currentDate, "Australia/Adelaide")}
        </Text>

        {error && !isFormOpen ? (
          <Text style={localStyles.errorMessage}>{error}</Text>
        ) : null}

        {isLoading ? (
          <View style={localStyles.statusContainer}>
            <ActivityIndicator size="large" color={colors.orange} />

            <Text style={localStyles.statusText}>Loading cities...</Text>
          </View>
        ) : cities.length === 0 ? (
          <View style={localStyles.emptyContainer}>
            <Ionicons name="globe-outline" size={46} color={colors.grey} />

            <Text style={localStyles.emptyTitle}>No cities added</Text>

            <Text style={localStyles.emptyDescription}>
              Select Add city to create your world clock.
            </Text>
          </View>
        ) : (
          cities.map((city, index) => (
            <View
              key={city.id}
              style={[
                styles.card,
                styles.row,
                styles.spaceBetween,
                index === 0 && styles.selectedCard,
              ]}
            >
              <View style={localStyles.cityLeftSection}>
                <View
                  style={[styles.cityDot, index === 0 && styles.selectedDot]}
                />

                <View style={localStyles.cityInformation}>
                  <Text style={styles.cityName}>{city.name}</Text>

                  <Text style={styles.cityZone}>
                    {city.country} ({city.abbreviation})
                  </Text>
                </View>
              </View>

              <View style={localStyles.cityRightSection}>
                <Text style={styles.cityTime}>
                  {getTime(currentDate, city.timeZone)}
                </Text>

                <Text style={styles.cityDate}>
                  {getDate(currentDate, city.timeZone)}
                </Text>

                <View style={localStyles.cityActions}>
                  <Pressable
                    style={localStyles.iconButton}
                    onPress={() => openEditForm(city)}
                  >
                    <Ionicons
                      name="pencil-outline"
                      size={17}
                      color={colors.grey}
                    />
                  </Pressable>

                  <Pressable
                    style={localStyles.iconButton}
                    onPress={() => confirmDeleteCity(city)}
                  >
                    <Ionicons name="trash-outline" size={17} color="#ff5a5f" />
                  </Pressable>
                </View>
              </View>
            </View>
          ))
        )}

        <Pressable style={styles.button} onPress={openAddForm}>
          <Ionicons name="add" size={23} color={colors.white} />

          <Text style={[styles.buttonText, { marginLeft: 8 }]}>Add city</Text>
        </Pressable>
      </ScrollView>

      <Modal
        visible={isFormOpen}
        transparent
        animationType="fade"
        onRequestClose={closeForm}
      >
        <View style={localStyles.modalBackdrop}>
          <View style={localStyles.modalContainer}>
            <View style={localStyles.modalHeader}>
              <View>
                <Text style={localStyles.modalEyebrow}>WORLD CLOCK</Text>

                <Text style={localStyles.modalTitle}>
                  {editingCity ? "Edit city" : "Add a city"}
                </Text>
              </View>

              <Pressable style={localStyles.closeButton} onPress={closeForm}>
                <Ionicons name="close" size={25} color={colors.white} />
              </Pressable>
            </View>

            <Text style={localStyles.inputLabel}>City name</Text>

            <TextInput
              style={localStyles.input}
              value={formData.name}
              onChangeText={(value) =>
                setFormData((current) => ({
                  ...current,
                  name: value,
                }))
              }
              placeholder="Adelaide"
              placeholderTextColor={colors.grey}
              maxLength={40}
            />

            <Text style={localStyles.inputLabel}>Country</Text>

            <TextInput
              style={localStyles.input}
              value={formData.country}
              onChangeText={(value) =>
                setFormData((current) => ({
                  ...current,
                  country: value,
                }))
              }
              placeholder="Australia"
              placeholderTextColor={colors.grey}
              maxLength={40}
            />

            {/* <Text style={localStyles.inputLabel}>Abbreviation</Text>

            <TextInput
              style={localStyles.input}
              value={formData.abbreviation}
              onChangeText={(value) =>
                setFormData((current) => ({
                  ...current,
                  abbreviation: value,
                }))
              }
              placeholder="ACST"
              placeholderTextColor={colors.grey}
              autoCapitalize="characters"
              maxLength={8}
            /> */}

            <Text style={localStyles.inputLabel}>Timezone</Text>

            <TextInput
              style={localStyles.input}
              value={formData.timeZone}
              onChangeText={(value) =>
                setFormData((current) => ({
                  ...current,
                  timeZone: value,
                }))
              }
              placeholder="Australia/Adelaide"
              placeholderTextColor={colors.grey}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={localStyles.helpText}>
              Examples: Asia/Kathmandu, Europe/London, Asia/Tokyo
            </Text>

            {error ? <Text style={localStyles.formError}>{error}</Text> : null}

            <View style={styles.actionRow}>
              <Pressable
                style={[styles.button, styles.halfButton]}
                onPress={closeForm}
                disabled={isSaving}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </Pressable>

              <Pressable
                style={[
                  styles.primaryButton,
                  styles.halfButton,
                  isSaving && localStyles.disabledButton,
                ]}
                onPress={saveCity}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {editingCity ? "Save changes" : "Add city"}
                  </Text>
                )}
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  cityLeftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 10,
  },

  cityInformation: {
    flex: 1,
  },

  cityRightSection: {
    alignItems: "flex-end",
  },

  cityActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 10,
  },

  iconButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },

  statusContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 50,
  },

  statusText: {
    color: colors.grey,
    marginTop: 12,
  },

  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 20,
    paddingVertical: 45,
    marginBottom: 18,
  },

  emptyTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 14,
  },

  emptyDescription: {
    color: colors.grey,
    textAlign: "center",
    marginTop: 7,
  },

  errorMessage: {
    color: "#ff767b",
    backgroundColor: "#321a1c",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "center",
    padding: 20,
  },

  modalContainer: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 18,
    padding: 20,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  modalEyebrow: {
    color: colors.orange,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },

  modalTitle: {
    color: colors.white,
    fontSize: 23,
    fontWeight: "700",
    marginTop: 5,
  },

  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceLight,
    alignItems: "center",
    justifyContent: "center",
  },

  inputLabel: {
    color: colors.grey,
    fontSize: 13,
    marginBottom: 7,
  },

  input: {
    height: 50,
    color: colors.white,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    marginBottom: 15,
  },

  helpText: {
    color: colors.grey,
    fontSize: 12,
    lineHeight: 18,
    marginTop: -6,
    marginBottom: 14,
  },

  formError: {
    color: "#ff767b",
    marginBottom: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
