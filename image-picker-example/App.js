import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, View, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  const [image, setImage] = useState(null);

  // Request permission & pick from gallery
  const pickImage = async () => {
    // Ask for media library permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your gallery!");
      return;
    }

    // Launch image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All, // images & videos
      allowsEditing: true, // crop square
      aspect: [4, 3],
      quality: 1, // highest
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  // Request permission & capture with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "We need access to your camera!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📷 Expo Image Picker Example</Text>

      <View style={styles.buttons}>
        <Button title="Pick from Gallery" onPress={pickImage} />
        <Button title="Take a Photo" onPress={takePhoto} />
      </View>

      {image && (
        <Image source={{ uri: image }} style={styles.preview} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  buttons: { flexDirection: "row", gap: 10, marginBottom: 20 },
  preview: { width: 300, height: 300, resizeMode: "cover", borderRadius: 10 },
});