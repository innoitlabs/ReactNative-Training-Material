import React, { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View, Alert } from "react-native";
import * as Location from "expo-location";

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [watching, setWatching] = useState(null);

  // Request location permission on mount
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let current = await Location.getCurrentPositionAsync({});
      setLocation(current.coords);
    })();

    return () => {
      if (watching) {
        Location.removeWatchAsync(watching);
      }
    };
  }, []);

  // Start watching location in real-time
  const startWatching = async () => {
    try {
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 2000, // every 2 sec
          distanceInterval: 5, // every 5 meters
        },
        (loc) => setLocation(loc.coords)
      );
      setWatching(subscription);
    } catch (e) {
      Alert.alert("Error", e.message);
    }
  };

  // Stop watching
  const stopWatching = () => {
    if (watching) {
      watching.remove();
      setWatching(null);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📍 Expo Location Example</Text>

      {errorMsg ? (
        <Text style={{ color: "red" }}>{errorMsg}</Text>
      ) : (
        <Text>
          {location
            ? `Latitude: ${location.latitude}\nLongitude: ${location.longitude}`
            : "Fetching location..."}
        </Text>
      )}

      <View style={styles.buttons}>
        <Button title="Start Watching" onPress={startWatching} />
        <Button title="Stop Watching" onPress={stopWatching} disabled={!watching} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  buttons: { flexDirection: "row", gap: 10, marginTop: 20 },
});