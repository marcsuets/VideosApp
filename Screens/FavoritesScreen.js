import React, { useContext, useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground, Alert, ScrollView, ActionSheetIOS } from "react-native";
import { AuthContext } from "../AuthContext";
import { useNavigation } from "@react-navigation/native";
import Header from "../Components/Header";
import Background from '../Resources/background.jpg';
import colors from "../colors";
import app from '../firebaseConfig';
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";
import { getAuth, signOut } from "firebase/auth";

const db = getFirestore(app);
const auth = getAuth(app);

const FavoritesScreen = () => {
    const { user } = useContext(AuthContext);
    const navigation = useNavigation();
    const [videos, setVideos] = useState([]);
    const [lists, setLists] = useState([]);
    const [selectedList, setSelectedList] = useState("Favorites");

    const getThumbnailUrl = (videoUrl, platform) => {
        if (platform === "YouTube") {
            // Obtener miniatura de YouTube desde el enlace
            const youtubeRegex = /(?:youtube\.com\/.*v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
            const match = videoUrl.match(youtubeRegex);
            if (match && match[1]) {
                return { uri: `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` };
            }
            return require('../Resources/Youtube.png');
        } else if (platform === "Instagram") {
            // Imagen local para Instagram
            return require('../Resources/Instagram.png');
        }
    
        // Imagen genérica si la plataforma no es válida
        return require('../Resources/Default.jpg');
    };
       

    // Fetch video lists
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

    const fetchVideos = async () => {
        try {
            const q = query(collection(db, 'videos'), where('list', '==', selectedList));
            const querySnapshot = await getDocs(q);
            const fetchedVideos = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                fetchedVideos.push({
                    id: doc.id,
                    ...data,
                    thumbnail: getThumbnailUrl(data.url, data.platform) // Generar miniatura con plataforma
                });
            });
            setVideos(fetchedVideos);
        } catch (error) {
            console.error('Error fetching videos:', error);
        }
    };
    
    

    useEffect(() => {
        if (user) {
            fetchLists();
            fetchVideos();
        }
    }, [user, selectedList]);

    const handleMenuPress = async () => {
        try {
            await signOut(auth);
            
            navigation.navigate("AuthScreen");
        } catch (error) {
            console.error("Error signing out: ", error);
            Alert.alert("Error", "No se pudo cerrar sesión. Intenta nuevamente.");
        }
    };

    const openActionSheet = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: lists,
                cancelButtonIndex: 0,
                userInterfaceStyle: 'dark',
            },
            buttonIndex => {
                if (buttonIndex === 0) {
                    // cancel action
                } else {
                    setSelectedList(lists[buttonIndex]);
                }
            },
        );

    return (
        <View style={{ flex: 1 }}>
            <Header title="VideosApp" onMenuPress={handleMenuPress} />
            <ImageBackground source={Background} style={styles.backgroundImage}>
                <View style={styles.container}>
                    <TouchableOpacity onPress={openActionSheet} style={styles.listSelector}>
                        <Text style={styles.listSelectorText}>
                            {selectedList}
                        </Text>
                        <Text style={{ textAlign: 'center' }}>Tap to change list</Text>
                    </TouchableOpacity>

                    <ScrollView style={{ flex: 1, width: '100%' }}>
                        {videos.map(video => (
                            <View key={video.id} style={styles.videoCard}>
                                <Image source={video.thumbnail} style={styles.thumbnail} />
                                <View style={styles.videoInfo}>
                                    <Text style={styles.videoTitle}>{video.title}</Text>
                                    <Text style={styles.videoDate}>Added: {video.addDate}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("AddVideoScreen")}>
                    <Text style={styles.buttonText}>Add Video</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    button: {
        height: 90,
        backgroundColor: colors.black,
        width: '100%',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.blue,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 24,
    },
    listSelector: {
        backgroundColor: colors.lightGray,
        paddingBottom: 15,
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 5,
        marginBottom: 10,
        marginTop: 10,
        borderRadius: 50,
        borderColor: colors.black,
        borderWidth: 4,
        width: 'auto'
    },
    listSelectorText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.darkGray,
        textAlign: 'center'
    },
    videoCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        alignItems: 'center',
    },
    videoInfo: {
        marginLeft: 10,
        flex: 1,
    },
    videoTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    videoDate: {
        fontSize: 14,
        color: '#666',
    },
    thumbnail: {
        width: 80,
        height: 80,
        borderRadius: 8,
    },
});

export default FavoritesScreen;
