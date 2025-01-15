import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import Header from "../Components/Header";

import { useNavigation } from "@react-navigation/native";

const VideoDetailsScreen = () => {
    const route = useRoute();
    
    const navigation = useNavigation();
    
    const { video } = route.params; // Recibe los datos del video como parámetro

    const handleMenuPress = () => {
        navigation.goBack();
    };

    return (
        <View style={{flex: 1}}>
            <Header title="VideosApp" onMenuPress={handleMenuPress}  icon="arrow-back"/>
            <ScrollView style={styles.container}>
                <Image source={video.thumbnail} style={styles.thumbnail} />
                <Text style={styles.title}>{video.title}</Text>
                <Text style={styles.info}>Platform: {video.platform}</Text>
                <Text style={styles.info}>Added Date: {video.addDate}</Text>
                <Text style={styles.info}>URL: {video.url}</Text>
                <Text style={styles.description}>
                    {video.description || "No description available"}
                </Text>
            </ScrollView>
        </View>
        
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    thumbnail: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    info: {
        fontSize: 16,
        color: "#666",
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: "#333",
        marginTop: 15,
    },
});

export default VideoDetailsScreen;
