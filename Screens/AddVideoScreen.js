import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, Alert, } from "react-native";
import { Picker } from '@react-native-picker/picker';
import { getFirestore, collection, addDoc } from "firebase/firestore";
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
  
  const user = auth.currentUser;

  // Obtener las listas del usuario
  useEffect(() => {
    if (user) {
      // Aquí iría una consulta para obtener las listas del usuario desde Firebase
      // Suponemos que tienes una colección de listas en Firebase y solo obtienes las listas del usuario actual.
      // Por ejemplo:
      // const userLists = collection(db, "users", user.uid, "lists");
      // setLists(userLists);
      setLists(["Favorites", "List 1", "List 2"]); // Temporarily setting some example lists
    }
  }, [user]);

  // Función para manejar la adición de un video
  const handleAddVideo = async () => {
    if (!title || !url || !selectedList) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    try {
      await addDoc(collection(db, "videos"), {
        title,
        url,
        platform,
        author: user.email,
        addDate: new Date().toISOString(),
        list: selectedList,
      });
      Alert.alert("Éxito", "El video se ha añadido correctamente.");
      navigation.goBack(); // Volver a la pantalla anterior
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

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
        <Picker
          selectedValue={platform}
          style={styles.picker}
          onValueChange={(itemValue) => setPlatform(itemValue)}
        >
          <Picker.Item label="YouTube" value="YouTube" />
          <Picker.Item label="Instagram" value="Instagram" />
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Seleccionar Lista</Text>
        <Picker
          selectedValue={selectedList}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedList(itemValue)}
        >
          {lists.map((list, index) => (
            <Picker.Item key={index} label={list} value={list} />
          ))}
        </Picker>
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
  picker: {
    height: 50,
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
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
