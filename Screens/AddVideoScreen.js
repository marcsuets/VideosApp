import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button, ActionSheetIOS } from "react-native";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig";

const db = getFirestore(app);
const auth = getAuth(app);

const AddVideoScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("YouTube"); // YouTube o Instagram
  const [selectedList, setSelectedList] = useState("Favorites");
  const [lists, setLists] = useState([]); // Aquí vamos a obtener las listas del usuario
  const [newList, setNewList] = useState(""); // Nuevo estado para la nueva lista
  const user = auth.currentUser;

  // Fetch items from Firestore
  const fetchLists = async () => {
    try {
      if (!user) return;

      // Filtrar por listas creadas por el usuario actual
      const q = query(
        collection(db, "videos"),
        where("author", "==", user.uid) // Filtra las listas del usuario autenticado
      );

      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data().list); // Extraer las listas
      });
      const uniqueItems = [...new Set(items)].filter((item) => item !== "Favorites");

      setLists(["Cancel", "Favorites", ...uniqueItems]);
    } catch (error) {
      console.error("Error fetching Firestore data:", error);
    }
  };

  // Obtener las listas del usuario
  useEffect(() => {
    if (user) {
      fetchLists(); // Llama a la función para cargar las listas
    }
  }, [user]);

  // Función para manejar la adición de un video
  const handleAddVideo = async () => {
    if (!title || !url || !selectedList) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      const listToUse = newList.trim() !== "" ? newList : selectedList;

      await addDoc(collection(db, "videos"), {
        title,
        url,
        platform,
        author: user.uid, // Usamos uid en lugar del email
        addDate: new Date().toISOString(),
        list: listToUse,
      });
      Alert.alert("Éxito", "El video se ha añadido correctamente.");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const openActionSheetList = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: lists,
        cancelButtonIndex: 0,
        userInterfaceStyle: "dark",
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setSelectedList("Favorites");
        } else {
          setSelectedList(lists[buttonIndex]);
        }
      }
    );

  const openActionSheetPlatform = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["YouTube", "Instagram", "Cancel"],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        if (buttonIndex === 0) {
          setPlatform("YouTube");
        } else if (buttonIndex === 1) {
          setPlatform("Instagram");
        }
      }
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add video</Text>

      <TextInput
        style={styles.input}
        placeholder="Video title"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Video URL"
        value={url}
        onChangeText={setUrl}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Platform</Text>
        <Text>{platform}</Text>
        <Button onPress={openActionSheetPlatform} title="Choose platform" />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Choose list</Text>
        <Text>{selectedList}</Text>
        <Button onPress={openActionSheetList} title="Choose list" />
        <Text style={styles.label}>Create new list (optional):</Text>
        <TextInput
          style={styles.input}
          placeholder="New list"
          value={newList}
          onChangeText={setNewList}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleAddVideo}>
        <Text style={styles.buttonText}>Add video</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  input: {
    width: "100%",
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  pickerContainer: {
    width: "100%",
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    alignItems: "center",
    marginVertical: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddVideoScreen;
