import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import Header from "@/components/header";
import { db } from "@/config/firebase";
import { colors, styles } from "../styles/clockStyles";

type Alarm = {
  id: string;
  time: string;
  date: string;
  label: string;
  enabled: boolean;
};

type AlarmFormData = {
  time: string;
  date: string;
  label: string;
};

function getTodayDate(): string {
  const currentDate = new Date();

  const localDate = new Date(
    currentDate.getTime() - currentDate.getTimezoneOffset() * 60_000,
  );

  return localDate.toISOString().split("T")[0];
}

function createEmptyForm(): AlarmFormData {
  return {
    time: "08:00",
    date: getTodayDate(),
    label: "",
  };
}

function formatAlarmDate(date: string): string {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-AU", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00`));
}

export default function AlarmsScreen() {
  const [alarms, setAlarms] = useState<Alarm[]>([]);

  const [formData, setFormData] = useState<AlarmFormData>(createEmptyForm());

  const [editingAlarm, setEditingAlarm] = useState<Alarm | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  /*
   * LOAD ALARMS FROM FIREBASE
   *
   * onSnapshot provides real-time updates. When an alarm is
   * created, edited or deleted, the screen updates automatically.
   */
  useEffect(() => {
    const alarmsCollection = collection(db, "alarms");

    const unsubscribe = onSnapshot(
      alarmsCollection,
      (snapshot) => {
        const firebaseAlarms: Alarm[] = snapshot.docs.map((alarmDocument) => {
          const data = alarmDocument.data();

          return {
            id: alarmDocument.id,
            time: data.time ?? "",
            date: data.date ?? "",
            label: data.label ?? "Alarm",
            enabled: data.enabled ?? true,
          };
        });

        firebaseAlarms.sort((firstAlarm, secondAlarm) => {
          const firstDateTime = `${firstAlarm.date} ${firstAlarm.time}`;

          const secondDateTime = `${secondAlarm.date} ${secondAlarm.time}`;

          return firstDateTime.localeCompare(secondDateTime);
        });

        setAlarms(firebaseAlarms);
        setError("");
        setIsLoading(false);
      },
      (firebaseError) => {
        console.error("Load alarms error:", firebaseError);

        setError("Could not load alarms from Firebase.");
        setIsLoading(false);
      },
    );

    return unsubscribe;
  }, []);

  function openAddForm() {
    setEditingAlarm(null);
    setFormData(createEmptyForm());
    setError("");
    setIsFormOpen(true);
  }

  function openEditForm(alarm: Alarm) {
    setEditingAlarm(alarm);

    setFormData({
      time: alarm.time,
      date: alarm.date,
      label: alarm.label,
    });

    setError("");
    setIsFormOpen(true);
  }

  function closeForm() {
    if (isSaving) {
      return;
    }

    setIsFormOpen(false);
    setEditingAlarm(null);
    setFormData(createEmptyForm());
    setError("");
  }

  /*
   * ADD OR UPDATE AN ALARM
   */
  async function saveAlarm() {
    const cleanLabel = formData.label.trim();
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    const datePattern = /^\d{4}-\d{2}-\d{2}$/;

    if (!cleanLabel) {
      setError("Please enter an alarm label.");
      return;
    }

    if (!timePattern.test(formData.time)) {
      setError("Enter the time as HH:MM, for example 08:30.");
      return;
    }

    if (!datePattern.test(formData.date)) {
      setError("Enter the date as YYYY-MM-DD.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      if (editingAlarm) {
        const alarmReference = doc(db, "alarms", editingAlarm.id);

        await updateDoc(alarmReference, {
          label: cleanLabel,
          time: formData.time,
          date: formData.date,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "alarms"), {
          label: cleanLabel,
          time: formData.time,
          date: formData.date,
          enabled: true,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }

      setIsFormOpen(false);
      setEditingAlarm(null);
      setFormData(createEmptyForm());
    } catch (firebaseError) {
      console.error("Save alarm error:", firebaseError);
      setError("Could not save the alarm.");
    } finally {
      setIsSaving(false);
    }
  }

  /*
   * ENABLE OR DISABLE AN ALARM
   */
  async function toggleAlarm(alarm: Alarm) {
    try {
      const alarmReference = doc(db, "alarms", alarm.id);

      await updateDoc(alarmReference, {
        enabled: !alarm.enabled,
        updatedAt: serverTimestamp(),
      });
    } catch (firebaseError) {
      console.error("Toggle alarm error:", firebaseError);

      Alert.alert("Update failed", "Could not update the alarm.");
    }
  }

  /*
   * DELETE AN ALARM
   *
   * Alert.alert replaces window.confirm from the web version.
   */
  function confirmDeleteAlarm(alarm: Alarm) {
    Alert.alert(
      "Delete alarm",
      `Are you sure you want to delete "${alarm.label}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAlarm(alarm.id),
        },
      ],
    );
  }

  async function deleteAlarm(alarmId: string) {
    try {
      await deleteDoc(doc(db, "alarms", alarmId));
    } catch (firebaseError) {
      console.error("Delete alarm error:", firebaseError);

      Alert.alert("Delete failed", "Could not delete the alarm.");
    }
  }
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Header />

        <Text style={styles.sectionTitle}>ALARMS</Text>

        <Text style={styles.sectionDescription}>Wake up to what matters.</Text>

        {error && !isFormOpen ? (
          <Text style={localStyles.errorText}>{error}</Text>
        ) : null}

        {isLoading ? (
          <View style={localStyles.statusContainer}>
            <ActivityIndicator size="large" color={colors.orange} />

            <Text style={localStyles.statusText}>Loading alarms...</Text>
          </View>
        ) : alarms.length === 0 ? (
          <View style={localStyles.emptyContainer}>
            <Ionicons name="calendar-outline" size={45} color={colors.grey} />

            <Text style={localStyles.emptyTitle}>No alarms yet</Text>

            <Text style={localStyles.emptyDescription}>
              Select Add alarm to create one.
            </Text>
          </View>
        ) : (
          alarms.map((alarm) => (
            <View
              key={alarm.id}
              style={[
                styles.card,
                styles.row,
                styles.spaceBetween,
                localStyles.alarmCard,
                !alarm.enabled && localStyles.disabledAlarm,
              ]}
            >
              <View style={localStyles.alarmInformation}>
                <Text style={styles.alarmTime}>{alarm.time}</Text>

                <Text style={styles.alarmName}>{alarm.label}</Text>

                <Text style={styles.alarmDays}>
                  {formatAlarmDate(alarm.date)}
                </Text>
              </View>

              <View style={localStyles.actions}>
                <Pressable
                  style={localStyles.iconButton}
                  onPress={() => openEditForm(alarm)}
                >
                  <Ionicons
                    name="pencil-outline"
                    size={20}
                    color={colors.grey}
                  />
                </Pressable>

                <Pressable
                  style={localStyles.iconButton}
                  onPress={() => confirmDeleteAlarm(alarm)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ff5a5f" />
                </Pressable>

                <Switch
                  value={alarm.enabled}
                  onValueChange={() => toggleAlarm(alarm)}
                  trackColor={{
                    false: colors.darkGrey,
                    true: colors.orange,
                  }}
                  thumbColor={colors.white}
                />
              </View>
            </View>
          ))
        )}

        <Pressable style={styles.button} onPress={openAddForm}>
          <Ionicons name="add" size={23} color={colors.white} />

          <Text style={[styles.buttonText, { marginLeft: 8 }]}>Add alarm</Text>
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
                <Text style={localStyles.modalEyebrow}>ALARM</Text>

                <Text style={localStyles.modalTitle}>
                  {editingAlarm ? "Edit alarm" : "Set a new alarm"}
                </Text>
              </View>

              <Pressable style={localStyles.closeButton} onPress={closeForm}>
                <Ionicons name="close" size={25} color={colors.white} />
              </Pressable>
            </View>

            <Text style={localStyles.inputLabel}>Alarm label</Text>

            <TextInput
              style={localStyles.input}
              value={formData.label}
              onChangeText={(value) =>
                setFormData((current) => ({
                  ...current,
                  label: value,
                }))
              }
              placeholder="Morning run"
              placeholderTextColor={colors.grey}
              maxLength={40}
            />

            <Text style={localStyles.inputLabel}>Time</Text>

            <TextInput
              style={localStyles.input}
              value={formData.time}
              onChangeText={(value) =>
                setFormData((current) => ({
                  ...current,
                  time: value,
                }))
              }
              placeholder="08:30"
              placeholderTextColor={colors.grey}
              keyboardType="numbers-and-punctuation"
              maxLength={5}
            />

            <Text style={localStyles.inputLabel}>Date</Text>

            <TextInput
              style={localStyles.input}
              value={formData.date}
              onChangeText={(value) =>
                setFormData((current) => ({
                  ...current,
                  date: value,
                }))
              }
              placeholder="2026-09-13"
              placeholderTextColor={colors.grey}
              keyboardType="numbers-and-punctuation"
              maxLength={10}
            />

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
                onPress={saveAlarm}
                disabled={isSaving}
              >
                {isSaving ? (
                  <ActivityIndicator color={colors.white} />
                ) : (
                  <Text style={styles.primaryButtonText}>
                    {editingAlarm ? "Save changes" : "Set alarm"}
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
  alarmCard: {
    paddingVertical: 20,
  },

  disabledAlarm: {
    opacity: 0.45,
  },

  alarmInformation: {
    flex: 1,
    paddingRight: 10,
  },

  actions: {
    alignItems: "center",
    gap: 10,
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    marginTop: 6,
  },

  errorText: {
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
    marginBottom: 25,
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
    marginBottom: 17,
  },

  formError: {
    color: "#ff767b",
    marginBottom: 5,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
