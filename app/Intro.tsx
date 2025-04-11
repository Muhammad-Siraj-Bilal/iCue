// import React from 'react';
// import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
// import { useRouter } from 'expo-router';

// const IntroScreen: React.FC = () => {
//   const router = useRouter();

//   return (
//     <ImageBackground source={require('../assets/images/pool-club.webp')} style={styles.background}>
//       <Text style={styles.heading}>Get to Know More About Your Shot</Text>
//       <Text style={styles.subText}>This quiz includes both multiple-choice and true/false questions.</Text>
//       <TouchableOpacity
//         onPress={() => router.replace('/QuizScreen')}
//         style={styles.startButton}
//       >
//         <Text style={styles.buttonText}>Start After Taking the Shot</Text>
//       </TouchableOpacity>
//     </ImageBackground>
//   );
// };

// const styles = StyleSheet.create({
//   background: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%', // Ensure full width
//     height: '100%', // Ensure full height
//   },
//   heading: {
//     fontSize: 32, // Increased font size
//     fontWeight: '800', // Use a heavier font weight (800 is bolder than 'bold')
//     fontFamily: 'System', // Use a system font, replace with your custom font if needed
//     color: 'white',
//     marginBottom: 20,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.75)', // Text shadow for readability
//     textShadowOffset: { width: -1, height: 1 },
//     textShadowRadius: 10,
//   },
//   subText: {
//     fontSize: 18, // Increased font size for subtext
//     fontFamily: 'System', // Use system font
//     color: 'white',
//     marginBottom: 30,
//     textAlign: 'center',
//     textShadowColor: 'rgba(0, 0, 0, 0.5)', // Softer text shadow
//     textShadowOffset: { width: -0.5, height: 0.5 },
//     textShadowRadius: 5,
//   },
//   startButton: {
//     paddingVertical: 15, // Increased padding for a larger button
//     paddingHorizontal: 30,
//     backgroundColor: '#28a745', // More vibrant green
//     borderRadius: 25, // More rounded corners
//     shadowColor: "#000", // Shadow properties for a more "3D" look
//     shadowOffset: {
//       width: 0,
//       height: 4, // Increased shadow height
//     },
//     shadowOpacity: 0.30, // Increased opacity
//     shadowRadius: 4.65,
//     elevation: 8, // Elevation for Android shadows
//     borderWidth: 2, // Add a subtle border
//     borderColor: '#1f7a32', // Darker green border

//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 18, // Increased font size for button text
//     fontWeight: '700', // Bolder font weight for button text
//     fontFamily: 'System',
//     textAlign: 'center',
//   },
// });

// export default IntroScreen;


import React, { useRef, useEffect } from 'react';
import { View, Text, ImageBackground, StyleSheet, Animated, Dimensions, Image } from 'react-native';
import { useRouter } from 'expo-router';
import AwesomeButton from 'react-native-really-awesome-button';
import { useFonts, Bangers_400Regular } from '@expo-google-fonts/bangers'; // Import Bangers font


const getStyles = (screenWidth: number, screenHeight: number) => StyleSheet.create({
    background: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    topContainer: { // For heading
        position: 'absolute',
        top: screenHeight * 0.18, // Use screenHeight for consistent positioning
        left: screenWidth * 0.14, // Use screenWidth
        width: '60%',
        zIndex: 1,
      },
    heading: {
        fontSize: 30,
        fontFamily: 'Bangers_400Regular', // Use the loaded font name
        color: '#228B22',
        textShadowColor: '#F0E68C',
        textShadowOffset: { width: 4, height: 4 },
        textShadowRadius: 0,
        transform: [{ rotate: '-21deg' }],
        letterSpacing: 2,
        textAlign: 'left', // Left-align text
    },
    bottomContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: screenHeight * 0.14, // Moved button up
    },
    buttonText: {
        color: '#000',
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'System',
        textAlign: 'center',
    },
});

const IntroScreen: React.FC = () => {
    const router = useRouter();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const translateYAnim = useRef(new Animated.Value(50)).current;
    const buttonScaleAnim = useRef(new Animated.Value(0.5)).current;

    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
    const styles = getStyles(screenWidth, screenHeight);

    let [fontsLoaded] = useFonts({
        Bangers_400Regular,
    });

    useEffect(() => {
        Animated.sequence([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }),
            Animated.parallel([
                Animated.timing(translateYAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.spring(buttonScaleAnim, {
                    toValue: 1,
                    friction: 4,
                    tension: 40,
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [fadeAnim, translateYAnim, buttonScaleAnim]);

    if (!fontsLoaded) {
        return null; // Or a loading indicator
      }

    return (
        <ImageBackground source={require('../assets/images/pool-club.webp')} style={styles.background}>
            <Animated.View style={[styles.topContainer, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
                <Text style={styles.heading}>Get to Know{'\n'}More About{'\n'}Your Shot</Text>
            </Animated.View>

            <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim, transform: [{ scale: buttonScaleAnim }] }]}>
                <AwesomeButton
                    onPress={() => router.replace('/QuizScreen')}
                    backgroundColor="#FFD700"
                    backgroundDarker="#DAA520"
                    width={screenWidth * 0.8}
                    borderRadius={30}
                    textSize={20}
                    textColor="#000"
                    textFontFamily="System"
                    raiseLevel={5}
                    paddingHorizontal={30}
                >
                    <Text style={styles.buttonText}>Start After Taking the Shot</Text>
                </AwesomeButton>
            </Animated.View>
        </ImageBackground>
    );
};

export default IntroScreen;