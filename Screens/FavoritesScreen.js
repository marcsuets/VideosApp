import React, { useContext } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AuthContext } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";

const FavoritesScreen = () => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {user ? `Bienvenido, ${user.email} a tus favoritos` : "No hay usuario autenticado"}
        </Text>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("AddVideoScreen")}>
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
    backgroundColor: "#fff",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
});

export default FavoritesScreen;
