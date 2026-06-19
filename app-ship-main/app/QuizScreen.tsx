// import React, { useState } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Animated, Image } from 'react-native';
// import { router, useNavigation } from 'expo-router';
// import { doc, setDoc } from 'firebase/firestore';
// import { FIREBASE_DB, FIREBASE_AUTH } from '../FirebaseConfig';

// interface Question {
//     id: number;
//     question: string;
//     options: string[];
//     correctAnswers: string[]; // Changed to an array
// }

// const questions: Question[] = [
//     { id: 1, question: 'Was the ball potted?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
//     { id: 2, question: 'Was a foul committed?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
//     { id: 3, question: 'Was it a legal shot?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
//     { id: 4, question: 'Was there any spin?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
//     { id: 5, question: 'Was there a double hit?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
// ];

// const QuizScreen: React.FC = () => {
//     const [answers, setAnswers] = useState<Partial<Record<number, string>>>({});
//     const [submitted, setSubmitted] = useState(false);
//     const user = FIREBASE_AUTH.currentUser;
//     const navigation = useNavigation();

//     const scaleAnim = React.useRef(new Animated.Value(0)).current;
//     const fadeInAnim = React.useRef(new Animated.Value(0)).current;

//     React.useEffect(() => {
//         if (submitted) {
//             Animated.parallel([
//                 Animated.spring(scaleAnim, {
//                     toValue: 1,
//                     friction: 5,
//                     tension: 40,
//                     useNativeDriver: true,
//                 }),
//                 Animated.timing(fadeInAnim, {
//                     toValue: 1,
//                     duration: 500,
//                     useNativeDriver: true,
//                 }),
//             ]).start();
//         }
//     }, [submitted, scaleAnim, fadeInAnim]);

//     const handleAnswer = (questionId: number, answer: string) => {
//         setAnswers(prev => ({ ...prev, [questionId]: answer }));
//     };

//     const handleSubmit = () => {
//         if (Object.keys(answers).length < questions.length) {
//             Alert.alert('Incomplete', 'Please answer all questions before proceeding.');
//             return;
//         }
//         setSubmitted(true);
//     };

//     const handleSaveAndSubmit = async () => {
//         if (!user) {
//             Alert.alert('Error', 'User not logged in.');
//             return;
//         }

//         try {
//             const shotId = `shot-${Date.now()}`;
//             await setDoc(doc(FIREBASE_DB, "users", user.uid, "shots", shotId), {
//                 timestamp: new Date(),
//                 quizAnswers: answers
//             });
//             Alert.alert('Saved', 'Your quiz answers have been recorded.');
//             router.replace('/(tabs)');
//         } catch (error) {
//             Alert.alert('Error', 'Failed to save answers. Please try again.');
//         }
//     };

//     const handleGoBack = () => {
//         if (submitted) {
//             setSubmitted(false);
//         } else {
//             navigation.goBack();
//         }
//     };

//     const handlePlayAgain = () => {
//         setAnswers({});
//         setSubmitted(false);
//     };

//     return (
//         <View style={styles.container}>
//             {/* Header */}
//             <View style={styles.header}>
//                 <TouchableOpacity onPress={handleGoBack}>
//                     <Text style={styles.backButton}>⟨ Back</Text>
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Quiz</Text>
//                 <View style={{ width: 50 }} />
//             </View>

//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 {!submitted ? (
//                     <>
//                         {/* Display all questions */}
//                         {questions.map(q => (
//                             <View key={q.id} style={styles.questionCard}>
//                                 <Text style={styles.questionNumber}>Question {q.id}</Text>
//                                 <Text style={styles.mainQuestionText}>{q.question}</Text>
//                                 {q.options.map(option => (
//                                     <TouchableOpacity
//                                         key={option}
//                                         style={[
//                                             styles.optionButton,
//                                             answers[q.id] === option && styles.selectedOption,
//                                         ]}
//                                         onPress={() => handleAnswer(q.id, option)}
//                                     >
//                                         <Text style={styles.optionText}>{option}</Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         ))}
//                         <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//                             <Text style={styles.buttonText}>Submit Quiz</Text>
//                         </TouchableOpacity>
//                     </>
//                 ) : (
//                     // Review Screen
//                     <Animated.View style={[styles.reviewContainer, { opacity: fadeInAnim, transform: [{ scale: scaleAnim }] }]}>
//                         <Text style={styles.reviewHeading}>Review Your Answers:</Text>
//                         {/* Trophy Image */}
//                         <Image source={require('../assets/images/iCueC.png')} style={styles.trophyImage} resizeMode="contain" />

//                         {questions.map(q => (
//                             <View key={q.id} style={styles.reviewItem}>
//                                 <Text style={styles.reviewQuestion}>{q.question}</Text>
//                                 <View style={styles.answerContainer}>
//                                     <Text style={styles.reviewAnswer}>{answers[q.id] || "Not Answered"}</Text>
//                                     {/* Correct/Incorrect Indicator - Now checks for array inclusion */}
//                                     {q.correctAnswers.includes(answers[q.id]!) ? (
//                                         <Text style={styles.correctIndicator}>✓</Text>
//                                     ) : (
//                                         <Text style={styles.incorrectIndicator}>✗</Text>
//                                     )}
//                                 </View>
//                             </View>
//                         ))}

//                         <View style={styles.buttonContainer}>
//                             <TouchableOpacity onPress={handlePlayAgain} style={[styles.reviewButton, styles.playAgainButton]}>
//                                 <Text style={styles.buttonText}>GO BACK</Text>
//                             </TouchableOpacity>
//                             <TouchableOpacity onPress={handleSaveAndSubmit} style={[styles.reviewButton, styles.saveSubmitButton]}>
//                                 <Text style={styles.buttonText}>SAVE & SUBMIT</Text>
//                             </TouchableOpacity>
//                         </View>
//                     </Animated.View>
//                 )}
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#90EE90',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingTop: 50,
//         paddingHorizontal: 10,
//         backgroundColor: '#c1e1c1',
//         height: 100,
//         borderBottomWidth: 1,
//         borderBottomColor: '#a0c4a0',
//     },
//     backButton: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//         paddingLeft: 0,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     scrollContainer: {
//         flexGrow: 1,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         paddingVertical: 20,
//     },
//     questionCard: {
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 20,
//         width: '90%',
//         maxWidth: 400,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//         marginBottom: 20,
//     },
//     questionNumber: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     mainQuestionText: {
//         fontSize: 18,
//         color: '#333',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     optionButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//         backgroundColor: '#2E8B57',
//         marginVertical: 8,
//         borderRadius: 30,
//         width: '100%',
//         alignSelf: 'center',
//     },
//     selectedOption: {
//         backgroundColor: '#228B22',
//         borderColor: '#006400',
//         borderWidth: 2,
//     },
//     optionText: {
//         color: 'white',
//         fontSize: 16,
//         textAlign: 'center',
//         fontWeight: '600',
//     },
//     submitButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         backgroundColor: '#FF6347',
//         borderRadius: 25,
//         marginTop: 20,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     reviewContainer: {
//         width: '100%',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//     },
//     reviewHeading: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     reviewItem: {
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 15,
//         marginBottom: 15,
//         width: '90%',
//         maxWidth: 400,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 3,
//         elevation: 4,
//     },
//     answerContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     reviewQuestion: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 5,
//     },
//     reviewAnswer: {
//         fontSize: 16,
//         color: '#555',
//     },
//     correctIndicator: {
//         color: 'green',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     incorrectIndicator: {
//         color: 'red',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '100%',
//         marginTop: 20,
//         marginBottom: 20
//     },
//     reviewButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         borderRadius: 25,
//         minWidth: 120,
//     },
//     playAgainButton: {
//         backgroundColor: '#4CAF50',
//     },
//     saveSubmitButton: {
//         backgroundColor: '#FF6347',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: '700',
//         textAlign: 'center',
//     },
//     trophyImage: {
//         width: 100,
//         height: 100,
//         marginBottom: 20
//     }
// });

// export default QuizScreen;

// ------------------------------------------------------------------------------------------------------

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Animated, Image } from 'react-native';
import { router, useNavigation } from 'expo-router';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore'; // Import updateDoc
import { FIREBASE_DB, tryGetFirebaseAuth } from '../FirebaseConfig';
import { ref, set, get, child } from "firebase/database"; // Import Firebase Realtime Database functions
import { getDatabase } from "firebase/database";


interface Question {
    id: number;
    question: string;
    options: string[];
    correctAnswers: string[]; // Changed to an array
}

const questions: Question[] = [
    { id: 1, question: 'Was the ball potted?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
    { id: 2, question: 'Was a foul committed?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
    { id: 3, question: 'Was it a legal shot?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
    { id: 4, question: 'Was there any spin?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
    { id: 5, question: 'Was there a double hit?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] }, // Both are correct
];

const QuizScreen: React.FC = () => {
    const [answers, setAnswers] = useState<Partial<Record<number, string>>>({});
    const [submitted, setSubmitted] = useState(false);
    const auth = tryGetFirebaseAuth();
    const user = auth?.currentUser;
    const navigation = useNavigation();

    const scaleAnim = React.useRef(new Animated.Value(0)).current;
    const fadeInAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (submitted) {
            Animated.parallel([
                Animated.spring(scaleAnim, {
                    toValue: 1,
                    friction: 5,
                    tension: 40,
                    useNativeDriver: true,
                }),
                Animated.timing(fadeInAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [submitted, scaleAnim, fadeInAnim]);

    const handleAnswer = (questionId: number, answer: string) => {
        setAnswers(prev => ({ ...prev, [questionId]: answer }));
    };

    const handleSubmit = () => {
        if (Object.keys(answers).length < questions.length) {
            Alert.alert('Incomplete', 'Please answer all questions before proceeding.');
            return;
        }
        setSubmitted(true);
    };


    const handleSaveAndSubmit = async () => {
        if (!user) {
            Alert.alert('Error', 'User not logged in.');
            return;
        }

        try {
            const username = user.displayName || user.uid;
            const userDocRef = doc(FIREBASE_DB, "users", username);

            await setDoc(userDocRef, { exists: true }, { merge: true });

            const shotsMetadataRef = doc(FIREBASE_DB, "users", username, "shots", "metadata");

            const metadataSnap = await getDoc(shotsMetadataRef);
            let nextShotId = 0;

            if (metadataSnap.exists()) {
                const metadata = metadataSnap.data();
                nextShotId = (metadata.lastShotId || 0) + 1;
            }

            const dbRef = ref(getDatabase());
            const shotDataRef = child(dbRef, 'shot_data');
            const snapshot = await get(shotDataRef);

            if (snapshot.exists()) {
                const shotData = snapshot.val();

                await setDoc(doc(FIREBASE_DB, "users", username, "shots", nextShotId.toString()), {
                    timestamp: new Date(),
                    quizAnswers: answers,
                    ...shotData,
                });

                await setDoc(shotsMetadataRef, { lastShotId: nextShotId }, { merge: true });

                Alert.alert('Saved', 'Your quiz answers and shot data have been recorded.');
                router.replace('/(tabs)');
            } else {
                Alert.alert('Error', 'No shot data found in Realtime Database.');
            }
        } catch (error) {
            console.error("Error in handleSaveAndSubmit:", error);
            Alert.alert('Error', 'Failed to save answers and shot data. Please try again.');
        }
    };
      

    const handleGoBack = () => {
        if (submitted) {
            setSubmitted(false);
        } else {
            router.replace('/(tabs)');
        }
    };

    const handlePlayAgain = () => {
        setAnswers({});
        setSubmitted(false);
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={handleGoBack}>
                    <Text style={styles.backButton}>⟨ Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Quiz</Text>
                <View style={{ width: 50 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                {!submitted ? (
                    <>
                        {/* Display all questions */}
                        {questions.map(q => (
                            <View key={q.id} style={styles.questionCard}>
                                <Text style={styles.questionNumber}>Question {q.id}</Text>
                                <Text style={styles.mainQuestionText}>{q.question}</Text>
                                {q.options.map(option => (
                                    <TouchableOpacity
                                        key={option}
                                        style={[
                                            styles.optionButton,
                                            answers[q.id] === option && styles.selectedOption,
                                        ]}
                                        onPress={() => handleAnswer(q.id, option)}
                                    >
                                        <Text style={styles.optionText}>{option}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        ))}
                        <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                            <Text style={styles.buttonText}>Submit Quiz</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    // Review Screen
                    <Animated.View style={[styles.reviewContainer, { opacity: fadeInAnim, transform: [{ scale: scaleAnim }] }]}>
                        <Text style={styles.reviewHeading}>Review Your Answers:</Text>
                        {/* Trophy Image */}
                        <Image source={require('../assets/images/iCueC.png')} style={styles.trophyImage} resizeMode="contain" />

                        {questions.map(q => (
                            <View key={q.id} style={styles.reviewItem}>
                                <Text style={styles.reviewQuestion}>{q.question}</Text>
                                <View style={styles.answerContainer}>
                                    <Text style={styles.reviewAnswer}>{answers[q.id] || "Not Answered"}</Text>
                                    {/* Correct/Incorrect Indicator - Now checks for array inclusion */}
                                    {q.correctAnswers.includes(answers[q.id]!) ? (
                                        <Text style={styles.correctIndicator}>✓</Text>
                                    ) : (
                                        <Text style={styles.incorrectIndicator}>✗</Text>
                                    )}
                                </View>
                            </View>
                        ))}

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity onPress={handlePlayAgain} style={[styles.reviewButton, styles.playAgainButton]}>
                                <Text style={styles.buttonText}>GO BACK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleSaveAndSubmit} style={[styles.reviewButton, styles.saveSubmitButton]}>
                                <Text style={styles.buttonText}>SAVE & SUBMIT</Text>
                            </TouchableOpacity>
                        </View>
                    </Animated.View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#90EE90',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 50,
        paddingHorizontal: 10,
        // backgroundColor: '#c1e1c1',
        backgroundColor: '#2E8B57',
        height: 100,
        borderBottomWidth: 1,
        borderBottomColor: '#a0c4a0',
    },
    backButton: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        paddingLeft: 0,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20,
    },
    questionCard: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 20,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 20,
    },
    questionNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
        textAlign: 'center',
    },
    mainQuestionText: {
        fontSize: 18,
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    optionButton: {
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#2E8B57',
        marginVertical: 8,
        borderRadius: 30,
        width: '100%',
        alignSelf: 'center',
    },
    selectedOption: {
        backgroundColor: "#FFD700",
        borderColor: '#006400',
        borderWidth: 2,
    },
    optionText: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '600',
    },
    submitButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        backgroundColor: "#FFD700",
        borderRadius: 25,
        marginTop: 20,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    reviewContainer: {
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    reviewHeading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
        textAlign: 'center',
    },
    reviewItem: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 15,
        marginBottom: 15,
        width: '90%',
        maxWidth: 400,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 4,
    },
    answerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reviewQuestion: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    reviewAnswer: {
        fontSize: 16,
        color: '#555',
    },
    correctIndicator: {
        color: 'green',
        fontSize: 24,
        fontWeight: 'bold',
    },
    incorrectIndicator: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 20,
        marginBottom: 20
    },
    reviewButton: {
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 25,
        minWidth: 120,
    },
    playAgainButton: {
        backgroundColor: '#4CAF50',
    },
    saveSubmitButton: {
        backgroundColor: "#FFD700",
    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
    },
    trophyImage: {
        width: 100,
        height: 100,
        marginBottom: 20
    }
});

export default QuizScreen;

// -----------------------------------------------------------------------------------------------------

// import React, { useState, useRef, useEffect } from 'react';
// import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView, Animated, Image } from 'react-native';
// import { router, useNavigation } from 'expo-router';
// import { doc, setDoc, getDoc } from 'firebase/firestore'; // Fixed Firestore logic
// import { FIREBASE_DB, FIREBASE_AUTH } from '../FirebaseConfig';
// import { ref, get, child } from "firebase/database"; 
// import { getDatabase } from "firebase/database";

// interface Question {
//     id: number;
//     question: string;
//     options: string[];
//     correctAnswers: string[];
// }

// const questions: Question[] = [
//     { id: 1, question: 'Was the ball potted?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] },
//     { id: 2, question: 'Was a foul committed?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] },
//     { id: 3, question: 'Was it a legal shot?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] },
//     { id: 4, question: 'Was there any spin?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] },
//     { id: 5, question: 'Was there a double hit?', options: ['Yes', 'No'], correctAnswers: ['Yes', 'No'] },
// ];

// const QuizScreen: React.FC = () => {
//     const [answers, setAnswers] = useState<Partial<Record<number, string>>>({});
//     const [submitted, setSubmitted] = useState(false);
//     const user = FIREBASE_AUTH.currentUser;
//     const navigation = useNavigation();

//     const scaleAnim = useRef(new Animated.Value(0)).current;
//     const fadeInAnim = useRef(new Animated.Value(0)).current;

//     useEffect(() => {
//         if (submitted) {
//             Animated.parallel([
//                 Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }),
//                 Animated.timing(fadeInAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
//             ]).start();
//         }
//     }, [submitted, scaleAnim, fadeInAnim]);

//     const handleAnswer = (questionId: number, answer: string) => {
//         setAnswers(prev => ({ ...prev, [questionId]: answer }));
//     };

//     const handleSubmit = () => {
//         if (Object.keys(answers).length < questions.length) {
//             Alert.alert('Incomplete', 'Please answer all questions before proceeding.');
//             return;
//         }
//         setSubmitted(true);
//     };

//     const handleSaveAndSubmit = async () => {
//         if (!user) {
//             Alert.alert('Error', 'User not logged in.');
//             return;
//         }

//         try {
//             const username = user.displayName || user.uid;
//             const userDocRef = doc(FIREBASE_DB, "users", username);

//             await setDoc(userDocRef, { exists: true }, { merge: true });

//             const shotsMetadataRef = doc(FIREBASE_DB, "users", username, "shots", "metadata");

//             const metadataSnap = await getDoc(shotsMetadataRef);
//             let nextShotId = 0;

//             if (metadataSnap.exists()) {
//                 const metadata = metadataSnap.data();
//                 nextShotId = (metadata.lastShotId || 0) + 1;
//             }

//             const dbRef = ref(getDatabase());
//             const shotDataRef = child(dbRef, 'shot_data');
//             const snapshot = await get(shotDataRef);

//             if (snapshot.exists()) {
//                 const shotData = snapshot.val();

//                 await setDoc(doc(FIREBASE_DB, "users", username, "shots", nextShotId.toString()), {
//                     timestamp: new Date(),
//                     quizAnswers: answers,
//                     ...shotData,
//                 });

//                 await setDoc(shotsMetadataRef, { lastShotId: nextShotId }, { merge: true });

//                 Alert.alert('Saved', 'Your quiz answers and shot data have been recorded.');
//                 router.replace('/(tabs)');
//             } else {
//                 Alert.alert('Error', 'No shot data found in Realtime Database.');
//             }
//         } catch (error) {
//             console.error("Error in handleSaveAndSubmit:", error);
//             Alert.alert('Error', 'Failed to save answers and shot data. Please try again.');
//         }
//     };

//     const handleGoBack = () => {
//         if (submitted) {
//             setSubmitted(false);
//         } else {
//             navigation.goBack();
//         }
//     };

//     const handlePlayAgain = () => {
//         setAnswers({});
//         setSubmitted(false);
//     };

//     return (
//         <View style={styles.container}>
//             <ScrollView contentContainerStyle={styles.scrollContainer}>
//                 {!submitted ? (
//                     <>
//                         {questions.map(q => (
//                             <View key={q.id} style={styles.questionCard}>
//                                 <Text style={styles.questionNumber}>Question {q.id}</Text>
//                                 <Text style={styles.mainQuestionText}>{q.question}</Text>
//                                 {q.options.map(option => (
//                                     <TouchableOpacity
//                                         key={option}
//                                         style={[styles.optionButton, answers[q.id] === option && styles.selectedOption]}
//                                         onPress={() => handleAnswer(q.id, option)}
//                                     >
//                                         <Text style={styles.optionText}>{option}</Text>
//                                     </TouchableOpacity>
//                                 ))}
//                             </View>
//                         ))}
//                         <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
//                             <Text style={styles.buttonText}>Submit Quiz</Text>
//                         </TouchableOpacity>
//                     </>
//                 ) : (
//                     <Animated.View style={[styles.reviewContainer, { opacity: fadeInAnim, transform: [{ scale: scaleAnim }] }]}>
//                         <Text style={styles.reviewHeading}>Review Your Answers:</Text>
//                         <Image source={require('../assets/images/iCueC.png')} style={styles.trophyImage} resizeMode="contain" />
//                         {questions.map(q => (
//                             <View key={q.id} style={styles.reviewItem}>
//                                 <Text style={styles.reviewQuestion}>{q.question}</Text>
//                                 <View style={styles.answerContainer}>
//                                     <Text style={styles.reviewAnswer}>{answers[q.id] || "Not Answered"}</Text>
//                                     {q.correctAnswers.includes(answers[q.id]!) ? (
//                                         <Text style={styles.correctIndicator}>✓</Text>
//                                     ) : (
//                                         <Text style={styles.incorrectIndicator}>✗</Text>
//                                     )}
//                                 </View>
//                             </View>
//                         ))}
//                         <TouchableOpacity onPress={handleSaveAndSubmit} style={styles.submitButton}>
//                             <Text style={styles.buttonText}>SAVE & SUBMIT</Text>
//                         </TouchableOpacity>
//                     </Animated.View>
//                 )}
//             </ScrollView>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#90EE90',
//     },
//     header: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//         paddingTop: 50,
//         paddingHorizontal: 10,
//         backgroundColor: '#c1e1c1',
//         height: 100,
//         borderBottomWidth: 1,
//         borderBottomColor: '#a0c4a0',
//     },
//     backButton: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#333',
//         paddingLeft: 0,
//     },
//     headerTitle: {
//         fontSize: 20,
//         fontWeight: 'bold',
//         color: '#333',
//     },
//     scrollContainer: {
//         flexGrow: 1,
//         justifyContent: 'flex-start',
//         alignItems: 'center',
//         paddingVertical: 20,
//     },
//     questionCard: {
//         backgroundColor: 'white',
//         borderRadius: 20,
//         padding: 20,
//         width: '90%',
//         maxWidth: 400,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//         marginBottom: 20,
//     },
//     questionNumber: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 15,
//         textAlign: 'center',
//     },
//     mainQuestionText: {
//         fontSize: 18,
//         color: '#333',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     optionButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 20,
//         backgroundColor: '#2E8B57',
//         marginVertical: 8,
//         borderRadius: 30,
//         width: '100%',
//         alignSelf: 'center',
//     },
//     selectedOption: {
//         backgroundColor: '#1a532f',
//         borderColor: '#006400',
//         borderWidth: 2,
//     },
//     optionText: {
//         color: 'white',
//         fontSize: 16,
//         textAlign: 'center',
//         fontWeight: '600',
//     },
//     submitButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         backgroundColor: '#FF6347',
//         borderRadius: 25,
//         marginTop: 20,
//         shadowColor: "#000",
//         shadowOffset: {
//             width: 0,
//             height: 2,
//         },
//         shadowOpacity: 0.25,
//         shadowRadius: 3.84,
//         elevation: 5,
//     },
//     reviewContainer: {
//         width: '100%',
//         alignItems: 'center',
//         paddingHorizontal: 20,
//     },
//     reviewHeading: {
//         fontSize: 24,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 20,
//         textAlign: 'center',
//     },
//     reviewItem: {
//         backgroundColor: 'white',
//         padding: 15,
//         borderRadius: 15,
//         marginBottom: 15,
//         width: '90%',
//         maxWidth: 400,
//         shadowColor: '#000',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.2,
//         shadowRadius: 3,
//         elevation: 4,
//     },
//     answerContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         alignItems: 'center',
//     },
//     reviewQuestion: {
//         fontSize: 16,
//         fontWeight: 'bold',
//         color: '#333',
//         marginBottom: 5,
//     },
//     reviewAnswer: {
//         fontSize: 16,
//         color: '#555',
//     },
//     correctIndicator: {
//         color: 'green',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     incorrectIndicator: {
//         color: 'red',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
//     buttonContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-around',
//         width: '100%',
//         marginTop: 20,
//         marginBottom: 20
//     },
//     reviewButton: {
//         paddingVertical: 15,
//         paddingHorizontal: 30,
//         borderRadius: 25,
//         minWidth: 120,
//     },
//     playAgainButton: {
//         backgroundColor: '#4CAF50',
//     },
//     saveSubmitButton: {
//         backgroundColor: '#FF6347',
//     },
//     buttonText: {
//         color: 'white',
//         fontSize: 18,
//         fontWeight: '700',
//         textAlign: 'center',
//     },
//     trophyImage: {
//         width: 100,
//         height: 100,
//         marginBottom: 20
//     }
// });

// export default QuizScreen;
