// import { StatusBar } from 'expo-status-bar';
// import { Platform, StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

// export default function ModalScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Modal</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="app/modal.tsx" />

//       {/* Use a light status bar on iOS to account for the black space above the modal */}
//       <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   title: {
//     fontSize: 20,
//     fontWeight: 'bold',
//   },
//   separator: {
//     marginVertical: 30,
//     height: 1,
//     width: '80%',
//   },
// });

// ----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useRef } from 'react';
// import {
//   StatusBar,
//   Platform,
//   StyleSheet,
//   Animated,
//   Image,
//   View,
//   Dimensions,
//   ScrollView,
//   Text,
// } from 'react-native';
// import { useFonts, Bangers_400Regular } from '@expo-google-fonts/bangers';
// import { StatusBarStyle } from 'expo-status-bar'; // Import StatusBarStyle

// const { width } = Dimensions.get('window');

// const ModalScreen = () => {
//   const [fontsLoaded] = useFonts({
//     Bangers_400Regular,
//   });

//   const accelXAnim = useRef(new Animated.Value(0)).current;
//   const accelYAnim = useRef(new Animated.Value(0)).current;
//   const accelZAnim = useRef(new Animated.Value(0)).current;
//   const gyroXAnim = useRef(new Animated.Value(0)).current;
//   const gyroYAnim = useRef(new Animated.Value(0)).current;
//   const gyroZAnim = useRef(new Animated.Value(0)).current;

//   useEffect(() => {
//     // Accelerometer Animations
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(accelXAnim, { toValue: 20, duration: 1000, useNativeDriver: true }),
//         Animated.timing(accelXAnim, { toValue: -20, duration: 2000, useNativeDriver: true }),
//         Animated.timing(accelXAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(accelYAnim, { toValue: 20, duration: 1000, useNativeDriver: true }),
//         Animated.timing(accelYAnim, { toValue: -20, duration: 2000, useNativeDriver: true }),
//         Animated.timing(accelYAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(accelZAnim, { toValue: 20, duration: 1000, useNativeDriver: true }),
//         Animated.timing(accelZAnim, { toValue: -20, duration: 2000, useNativeDriver: true }),
//         Animated.timing(accelZAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
//       ])
//     ).start();

//     // Gyroscope Animations (Rotation)
//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(gyroXAnim, { toValue: 45, duration: 1000, useNativeDriver: true }),
//         Animated.timing(gyroXAnim, { toValue: -45, duration: 2000, useNativeDriver: true }),
//         Animated.timing(gyroXAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(gyroYAnim, { toValue: 45, duration: 1000, useNativeDriver: true }),
//         Animated.timing(gyroYAnim, { toValue: -45, duration: 2000, useNativeDriver: true }),
//         Animated.timing(gyroYAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
//       ])
//     ).start();

//     Animated.loop(
//       Animated.sequence([
//         Animated.timing(gyroZAnim, { toValue: 45, duration: 1000, useNativeDriver: true }),
//         Animated.timing(gyroZAnim, { toValue: -45, duration: 2000, useNativeDriver: true }),
//         Animated.timing(gyroZAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
//       ])
//     ).start();

//   }, []);

//   if (!fontsLoaded) {
//     return (
//       <View style={styles.loadingContainer}>
//         <Text>Loading...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Accelerometer & Gyroscope Explanation</Text>

//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Accel X (Sideways Motion)</Text>
//         <Animated.Image
//           source={require('@/assets/images/cuestick.jpg')} // Replace with your image path
//           style={[styles.cueStick, { transform: [{ translateX: accelXAnim }] }]}
//         />
//         <Text style={styles.description}>
//           Accel X measures the acceleration of the device from side to side.
//         </Text>
//       </View>

//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Accel Y (Forward/Backward Motion)</Text>
//         <Animated.Image
//           source={require('@/assets/images/cuestick.jpg')} // Replace with your image path
//           style={[styles.cueStick, { transform: [{ translateY: accelYAnim }] }]}
//         />
//         <Text style={styles.description}>
//           Accel Y measures the acceleration of the device forward and backward.
//         </Text>
//       </View>

//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Accel Z (Up/Down Motion)</Text>
//         <Animated.Image
//           source={require('@/assets/images/cuestick.jpg')} // Replace with your image path
//           style={[styles.cueStick, { transform: [{ translateY: accelZAnim }, { rotate: '90deg' }] }]} // Rotate for Up/Down
//         />
//         <Text style={styles.description}>
//           Accel Z measures the acceleration of the device up and down.
//         </Text>
//       </View>

//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Gyro X (Pitch Rotation)</Text>
//         <Animated.Image
//           source={require('@/assets/images/cuestick.jpg')} // Replace with your image path
//           style={[styles.cueStick, { transform: [{ rotateX: gyroXAnim.interpolate({inputRange: [-45, 45], outputRange: ['-45deg', '45deg']}) }] }]}
//         />
//         <Text style={styles.description}>
//           Gyro X measures the rotation of the device around the X-axis (pitch).
//         </Text>
//       </View>

//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Gyro Y (Yaw Rotation)</Text>
//         <Animated.Image
//           source={require('@/assets/images/cuestick.jpg')} // Replace with your image path
//           style={[styles.cueStick, { transform: [{ rotateY: gyroYAnim.interpolate({inputRange: [-45, 45], outputRange: ['-45deg', '45deg']}) }] }]}
//         />
//         <Text style={styles.description}>
//           Gyro Y measures the rotation of the device around the Y-axis (yaw).
//         </Text>
//       </View>

//       <View style={styles.sectionContainer}>
//         <Text style={styles.sectionTitle}>Gyro Z (Roll Rotation)</Text>
//         <Animated.Image
//           source={require('@/assets/images/cuestick.jpg')} // Replace with your image path
//           style={[styles.cueStick, { transform: [{ rotateZ: gyroZAnim.interpolate({inputRange: [-45, 45], outputRange: ['-45deg', '45deg']}) }] }]}
//         />
//         <Text style={styles.description}>
//           Gyro Z measures the rotation of the device around the Z-axis (roll).
//         </Text>
//       </View>

//       <StatusBar 
//         barStyle={Platform.OS === 'ios' ? 'dark' : 'light'} as StatusBarStyle // Use as StatusBarStyle
//         backgroundColor="blue" // Example: Set background color (optional)
//         translucent={false} // Example: Make status bar opaque (optional)
//       />
//     </ScrollView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     marginBottom: 20,
//     textAlign: 'center',
//     fontFamily: 'Bangers_400Regular',
//   },
//   sectionContainer: {
//     marginBottom: 30,
//   },
//   sectionTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//     fontFamily: 'Bangers_400Regular',
//     padding: 20,
//   },
//   cueStick: {
//     width: 400,
//     height: 200,
//     resizeMode: 'contain',
//   },
//   description: {
//     fontSize: 16,
//     color: '#333',
//     padding: 20,
//   },
// });

// export default ModalScreen;

// ----------------------------------------------------------------------------------------------------------

import React, { useEffect, useRef, useState } from 'react';
import {
    StatusBar,
    Platform,
    StyleSheet,
    Animated,
    Image,
    View,
    Dimensions,
    ScrollView,
    Text,
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useFonts, Bangers_400Regular } from '@expo-google-fonts/bangers';
import { StatusBarStyle } from 'expo-status-bar';
import AwesomeButton from 'react-native-really-awesome-button';
import { Video, ResizeMode } from 'expo-av';
import YoutubePlayer from "react-native-youtube-iframe";
import { WebView } from "react-native-webview";

const { width, height } = Dimensions.get('window');

const ModalScreen = () => {
    const [fontsLoaded] = useFonts({
        Bangers_400Regular,
    });

    const accelXAnim = useRef(new Animated.Value(0.5)).current;
    const accelYAnim = useRef(new Animated.Value(0)).current;
    const accelZAnim = useRef(new Animated.Value(0)).current;
    const gyroXAnim = useRef(new Animated.Value(0)).current;
    const gyroYAnim = useRef(new Animated.Value(0)).current;
    const gyroZAnim = useRef(new Animated.Value(0)).current;

    const [videoUrl, setVideoUrl] = useState<string | null>(null);
    const [videoSource, setVideoSource] = useState<number | null>(null);
    const [showVideoPage, setShowVideoPage] = useState(false);
    const [videoId, setVideoId] = useState("");

    useEffect(() => {
        // Accel X: Scale Animation (Expanding)
        Animated.loop(
            Animated.sequence([
                Animated.timing(accelXAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
                Animated.timing(accelXAnim, { toValue: 0.5, duration: 2000, useNativeDriver: true }),
            ])
        ).start();

        // Accel Y: Original Accel X Animation (Sideways)
        Animated.loop(
            Animated.sequence([
                Animated.timing(accelYAnim, { toValue: 20, duration: 1000, useNativeDriver: true }),
                Animated.timing(accelYAnim, { toValue: -20, duration: 2000, useNativeDriver: true }),
                Animated.timing(accelYAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Accel Z: Original Accel Y Animation (Forward/Backward)
        Animated.loop(
            Animated.sequence([
                Animated.timing(accelZAnim, { toValue: 20, duration: 1000, useNativeDriver: true }),
                Animated.timing(accelZAnim, { toValue: -20, duration: 2000, useNativeDriver: true }),
                Animated.timing(accelZAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Gyro X: Original Gyro Y (Yaw) - Correctly Swapped
        Animated.loop(
            Animated.sequence([
                Animated.timing(gyroXAnim, { toValue: 45, duration: 1000, useNativeDriver: true }),
                Animated.timing(gyroXAnim, { toValue: -45, duration: 2000, useNativeDriver: true }),
                Animated.timing(gyroXAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Gyro Y: Original Gyro X (Pitch) - Correctly Swapped
        Animated.loop(
            Animated.sequence([
                Animated.timing(gyroYAnim, { toValue: 45, duration: 1000, useNativeDriver: true }),
                Animated.timing(gyroYAnim, { toValue: -45, duration: 2000, useNativeDriver: true }),
                Animated.timing(gyroYAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

        // Gyro Z: Original Gyro Z (Roll) - No Change
        Animated.loop(
            Animated.sequence([
                Animated.timing(gyroZAnim, { toValue: 45, duration: 1000, useNativeDriver: true }),
                Animated.timing(gyroZAnim, { toValue: -45, duration: 2000, useNativeDriver: true }),
                Animated.timing(gyroZAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
            ])
        ).start();

    }, []);

    const handleWatchVideo = () => {
        // setVideoId('https://www.youtube.com/watch?v=7raN6I_KTus&ab_channel=Sharivari');
        // setVideoSource(require('https://www.youtube.com/watch?v=7raN6I_KTus&ab_channel=Sharivari'));
        setShowVideoPage(true);
    };

    const handleBack = () => {
        setShowVideoPage(false);
    };

    // const renderVideo = () => {
    //     if (!videoSource) return null;

    //     return (
    //         <Video
    //             source={videoSource}
    //             style={styles.video}
    //             resizeMode={ResizeMode.CONTAIN} // Use ResizeMode.CONTAIN
    //             shouldPlay
    //             isLooping
    //             useNativeControls
    //         />
    //     );
    // };

    if (!fontsLoaded) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    if (showVideoPage) {
        return (
          <ScrollView contentContainerStyle={styles.scrollContainer} indicatorStyle={'black'}>
            <View style={styles.videoPage}>
                <Text style={styles.videoTitle}>Professionals Shot Example</Text>
                <View style={styles.videoWrapper}>
                <WebView 
                    source={{ uri: "https://www.youtube.com/watch?v=7raN6I_KTus&ab_channel=Sharivari" }}
                    style={styles.video}
                    allowsFullscreenVideo
                    // resizeMode={ResizeMode.CONTAIN}
                    // shouldPlay
                    // isLooping
                    // useNativeControls
                />
                </View>
                <AwesomeButton
                  onPress={handleBack}
                  backgroundColor="#FFD700"
                  backgroundDarker="#DAA520"
                  width={width * 0.8}
                  borderRadius={30}
                  textSize={15}
                  textColor="#000"
                  textFontFamily="System"
                  raiseLevel={5}
                  paddingHorizontal={30}
                  style={styles.awesomeButton}
              >
                  ← Back
              </AwesomeButton>
            </View>
            </ScrollView>
        );
    }

    return (
        <ScrollView style={styles.container} indicatorStyle={'black'}>
            <Text style={styles.title}>Accelerometer & Gyroscope Explanation</Text>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Accel X (Sideways Motion)</Text>
                <Animated.Image
                    source={require('@/assets/images/cuestick.jpg')}
                    style={[styles.cueStick, { transform: [{ scale: accelXAnim }] }]}
                />
                <Text style={styles.description}>
                  Accel X measures the acceleration of the device from side to side.
                </Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Accel Y (Forward/Backward Motion)</Text>
                <Animated.Image
                    source={require('@/assets/images/cuestick.jpg')}
                    style={[styles.cueStick, { transform: [{ translateX: accelYAnim }] }]}
                />
                <Text style={styles.description}>
                  Accel Y measures the acceleration of the device forward and backward.
                </Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Accel Z (Up/Down Motion)</Text>
                <Animated.Image
                    source={require('@/assets/images/cuestick.jpg')}
                    style={[styles.cueStick, { transform: [{ translateY: accelZAnim }] }]}
                />
                <Text style={styles.description}>
                  Accel Z measures the acceleration of the device up and down.
                </Text>
            </View>

            {/* Correctly Swapped Gyro X and Gyro Y Animations */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Gyro X (Pitch Rotation)</Text>
                <Animated.Image
                    source={require('@/assets/images/cuestick.jpg')}
                    style={[styles.cueStick, { transform: [{ rotateY: gyroXAnim.interpolate({ inputRange: [-45, 45], outputRange: ['-45deg', '45deg'] }) }] }]}
                />
                <Text style={styles.description}>
                  Gyro X measures the rotation of the device around the X-axis (pitch).
                </Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Gyro Y (Yaw Rotation)</Text>
                <Animated.Image
                    source={require('@/assets/images/cuestick.jpg')}
                    style={[styles.cueStick, { transform: [{ rotateX: gyroYAnim.interpolate({ inputRange: [-45, 45], outputRange: ['-45deg', '45deg'] }) }] }]}
                />
                <Text style={styles.description}>
                  Gyro Y measures the rotation of the device around the Y-axis (yaw).
                </Text>
            </View>

            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Gyro Z (Roll Rotation)</Text>
                <Animated.Image
                    source={require('@/assets/images/cuestick.jpg')}
                    style={[styles.cueStick, { transform: [{ rotateZ: gyroZAnim.interpolate({ inputRange: [-45, 45], outputRange: ['-45deg', '45deg'] }) }] }]}
                />
                <Text style={styles.description}>
                    Gyro Z measures the rotation of the device around the Z-axis (roll).
                </Text>
            </View>

            <AwesomeButton
                onPress={handleWatchVideo}
                backgroundColor="#FFD700"
                backgroundDarker="#DAA520"
                width={width * 0.8}
                borderRadius={30}
                textSize={15}
                textColor="#000"
                textFontFamily="System"
                raiseLevel={5}
                paddingHorizontal={30}
                style={styles.awesomeButton}
            >
                Watch a Professional's Shot
            </AwesomeButton>

            {/* {renderVideo()} */}

            <StatusBar style={Platform.OS === 'ios' ? 'dark' : 'auto'} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1, 
        padding: 3, 
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F9F9F9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 40,
        marginTop: 20,
        textAlign: 'center',
        // fontFamily: 'Bangers_400Regular',
    },
    sectionContainer: {
        marginBottom: 30,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        fontFamily: 'Bangers_400Regular',
        padding: 20,
    },
    cueStick: {
        marginTop: 30,
        width: 300,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 30,
    },
    description: {
        fontSize: 16,
        color: '#333',
        padding: 20,
    },
    watchVideoButton: {
        backgroundColor: '#FFD700',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        fontFamily: 'System',
    },
    awesomeButton: {
        padding: 20,
        alignSelf: 'center',
        marginTop: 30,
        marginBottom: 30,
    },
    video: {
      width: "100%",
      height: "100%",
    },
    videoWrapper: {
        width: "95%",
        aspectRatio: 7 / 10, // Keeps proper YouTube ratio
        borderRadius: 15,
        overflow: "hidden",
        backgroundColor: "#000",
        elevation: 5, // Shadow effect (Android)
        shadowColor: "#000", // Shadow effect (iOS)
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
    },
    videoPage: {
        position: 'static',
        top: 0,
        left: 0,
        width: width,
        height: height,
        backgroundColor: '#F9F9F9',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: height * 0.04,
        paddingHorizontal: 10,
    },
    videoTitle: {
        marginTop: 10,
        fontFamily: 'Bangers_400Regular',
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 25,
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: '#FFD700',
        borderRadius: 10,
    },
    backButtonText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
});

export default ModalScreen;