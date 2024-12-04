import React, { useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { AuthContext } from "../AuthContext";

const FavoritesScreen = () => {
    const { user } = useContext(AuthContext);
  
    return (
      <View style={styles.container}>
        <Text style={styles.text}>
          {user ? `Bienvenido, ${user.email} a tus favoritos` : "No hay usuario autenticado"}
        </Text>
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
