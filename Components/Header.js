import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Asegúrate de tener @expo/vector-icons instalado
import colors from '../colors';
import LinearGradient  from 'expo-linear-gradient';

const Header = ({ title, onMenuPress }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onMenuPress}>
        <Ionicons name="log-out" size={32} color={colors.blue}/>
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    backgroundColor: colors.black,
    height: 120, 
    paddingTop: 50
  },
  title: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Header;
