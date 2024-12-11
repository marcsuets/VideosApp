import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, Button, ActionSheetIOS } from "react-native";
import { getFirestore, collection, addDoc, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import app from "../firebaseConfig"; // Importa tu configuración de Firebase

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
      const querySnapshot = await getDocs(collection(db, 'videos'));
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data().list); // Assuming 'list' is the field you want to display
      });
      const uniqueItems = [...new Set(items)].filter(item => item !== "Favorites");

      setLists(['Cancel', 'Favorites', ...uniqueItems]);
    } catch (error) {
      console.error('Error fetching Firestore data:', error);
    }
  };

  // Obtener las listas del usuario
  useEffect(() => {
    if (user) {
      setLists(fetchLists); // Temporarily setting some example lists
    }
  }, [user]);

  // Función para manejar la adición de un video
  const handleAddVideo = async () => {
    if (!title || !url || !selectedList) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      // Si se ha introducido un nombre para la nueva lista, se usa como selectedList
      const listToUse = newList.trim() !== "" ? newList : selectedList;

      await addDoc(collection(db, "videos"), {
        title,
        url,
        platform,
        author: user.email,
        addDate: new Date().toISOString(),
        list: listToUse, // Usamos el valor de la nueva lista o la lista seleccionada
      });
      Alert.alert("Éxito", "El video se ha añadido correctamente.");
      navigation.goBack(); // Volver a la pantalla anterior
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  const openActionSheetList = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: lists,
        cancelButtonIndex: 0,
        userInterfaceStyle: 'dark',
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          // cancel action
        } else if (buttonIndex === 1) {
          setSelectedList("Favorites");
        } else {
          setSelectedList(lists[buttonIndex]);
        }
      },
    );

  const openActionSheetPlatform = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ['YouTube', 'Instagram', 'Cancel'],
        cancelButtonIndex: 2,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          setPlatform("YouTube");
        } else if (buttonIndex === 1) {
          setPlatform("Instagram");
        }
      },
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Video</Text>

      <TextInput
        style={styles.input}
        placeholder="Título del video"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="URL del video"
        value={url}
        onChangeText={setUrl}
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Plataforma</Text>
        <Text>{platform}</Text>
        <Button onPress={openActionSheetPlatform} title="Choose platform" />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Seleccionar Lista</Text>
        <Text>{selectedList}</Text>
        <Button onPress={openActionSheetList} title="Choose list" />
        <Text style={styles.label}>Crear nueva lista (si no quieres usar una existente):</Text>
        <TextInput
          style={styles.input}
          placeholder="Crear lista nueva"
          value={newList}
          onChangeText={setNewList}
        />
      </View>

      

      <TouchableOpacity style={styles.button} onPress={handleAddVideo}>
        <Text style={styles.buttonText}>Añadir Video</Text>
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
