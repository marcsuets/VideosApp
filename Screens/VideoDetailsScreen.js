import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Linking,
    Button,
    Alert,
    ImageBackground,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import { WebView } from "react-native-webview";
import Header from "../Components/Header";
import Background from "../Resources/background.jpg";

import { useNavigation } from "@react-navigation/native";
import { doc, deleteDoc } from "firebase/firestore"; // Import Firebase Firestore methods
import { db } from "../firebaseConfig"; // Ensure this points to your Firebase config file
import colors from "../colors";

const VideoDetailsScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { video } = route.params; // Recibe los datos del video como parámetro

    const handleMenuPress = () => {
        navigation.goBack();
    };

    const extractYouTubeId = (url) => {
        const youtubeRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
        const match = url.match(youtubeRegex);
        return match ? match[1] : null;
    };

    const handleDeleteVideo = async () => {
        try {
            // Confirm deletion
            Alert.alert(
                "Delete Video",
                "Are you sure you want to delete this video?",
                [
                    { text: "Cancel", style: "cancel" },
                    {
                        text: "Delete",
                        style: "destructive",
                        onPress: async () => {
                            // Reference the document in Firestore
                            const videoDoc = doc(db, "videos", video.id); // Ensure `video.id` is the Firestore document ID
                            await deleteDoc(videoDoc);
                            Alert.alert("Success", "Video has been deleted.");
                            navigation.goBack(); // Navigate back to the previous screen
                        },
                    },
                ]
            );
        } catch (error) {
            console.error("Error deleting video: ", error);
            Alert.alert("Error", "An error occurred while deleting the video.");
        }
    };

    const videoId = extractYouTubeId(video.url);

    const getVideoPlayerHeight = () => {
        if (video.platform === "YouTube") {
            return 200; // Altura para YouTube
        } else if (video.platform === "Instagram") {
            return 500; // Altura para Instagram
        }
        return 200; // Altura predeterminada
    };

    return (
        <View style={{ flex: 1 }}>
            <Header title="VideosApp" onMenuPress={handleMenuPress} icon="arrow-back" />
            <ImageBackground source={Background} style={styles.backgroundImage}>
                <ScrollView style={styles.container}>
                    {video.platform === "YouTube" && videoId ? (
                        <WebView
                            source={{ uri: `https://www.youtube.com/embed/${videoId}` }}
                            style={[styles.videoPlayer, { height: getVideoPlayerHeight() }]}
                            allowsFullscreenVideo={true}
                        />
                    ) : video.platform === "Instagram" ? (
                        <WebView
                            source={{ uri: video.url }}
                            style={[styles.videoPlayer, { height: getVideoPlayerHeight() }]}
                            allowsFullscreenVideo={true}
                        />
                    ) : (
                        <Text style={styles.errorText}>Invalid or missing video URL</Text>
                    )}
                    <Text style={styles.title}>{video.title}</Text>
                    <Text style={styles.info}>Platform: {video.platform}</Text>
                    <Text style={styles.info}>Added Date: {video.addDate}</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(video.url)}>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Open on {video.platform}</Text>
                        </View>
                    </TouchableOpacity>
                    <Button title="Delete Video" onPress={handleDeleteVideo} color="red" />
                </ScrollView>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center",
    },
    videoPlayer: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
        color: colors.blue
    },
    info: {
        fontSize: 16,
        color: colors.black,
        marginBottom: 5,
    },
    description: {
        fontSize: 16,
        color: "#333",
        marginTop: 15,
    },
    errorText: {
        fontSize: 16,
        color: "red",
        textAlign: "center",
        marginVertical: 20,
    },
    button: {
        backgroundColor: colors.black,
        width: "60%",
        height: 60,
        margin: "20%",
        marginBottom: '5%',
        borderRadius: 15,
    },
    buttonText: {
        fontWeight: "bold",
        color: colors.blue,
        fontSize: 20,
        textAlign: "center",
        textAlignVertical: "center",
        justifyContent: "center",
        height: "100%",
        marginTop: "8%",
    },
});

export default VideoDetailsScreen;
