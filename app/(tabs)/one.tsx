// import { StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

// export default function TabOneScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab One</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
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

// -----------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { Ionicons } from '@expo/vector-icons';
// import {
//   StyleSheet,
//   SafeAreaView,
//   View,
//   Text,
//   Platform,
//   StatusBar,
//   Dimensions,
//   KeyboardAvoidingView,
// } from 'react-native';
// import { GiftedChat, InputToolbar, Send, IMessage } from 'react-native-gifted-chat';
// import axios from 'axios';
// import { collection, getDocs } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';

// interface ShotData {
//   id: string;
//   accelX: number[];
//   accelY: number[];
//   accelZ: number[];
//   gyroX: number[];
//   gyroY: number[];
//   gyroZ: number[];
//   quizAnswers: Record<string, string>;
//   timestamp: string;
// }

// const { width } = Dimensions.get('window');

// export default function ChatBot(): JSX.Element {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [shotData, setShotData] = useState<ShotData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) return;

//         const shotsCollection = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//         const docSnap = await getDocs(shotsCollection);
//         const data: ShotData[] = await Promise.all(
//           docSnap.docs.map(async (docRef) => {
//             const docData = docRef.data();
//             return {
//               id: docRef.id,
//               accelX: docData.accelX || [],
//               accelY: docData.accelY || [],
//               accelZ: docData.accelZ || [],
//               gyroX: docData.gyroX || [],
//               gyroY: docData.gyroY || [],
//               gyroZ: docData.gyroZ || [],
//               quizAnswers: docData.quizAnswers || {},
//               timestamp: docData.timestamp || '',
//             };
//           })
//         );

//         console.log(data);
//         setShotData(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };

//     fetchData();
//     const interval = setInterval(fetchData, 9000);
//     return () => clearInterval(interval);
//   }, []);

//   function renderInputToolbar(props: any) {
//     return <InputToolbar {...props} containerStyle={styles.toolbar} />;
//   }

//   function renderSend(props: any) {
//     return (
//       <Send {...props} containerStyle={styles.sendButton}>
//         <Ionicons name="send" size={24} color="#FFFFFF" />
//       </Send>
//     );
//   }

//   const handleSend = async (newMessages: IMessage[] = []) => {
//     setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
//     const messageText = newMessages[0].text.toLowerCase();
//     const serializedShotData = JSON.stringify(shotData);

//     try {
//       const response = await axios.post(
//         'https://api.openai.com/v1/engines/gpt-3.5-turbo-instruct/completions',
//         {
//           prompt: `The following is a JSON dataset containing details of shots in a billiards game: "${serializedShotData}". Each entry has acceleration (X, Y, Z), gyro (X, Y, Z), timestamp, and quiz answers. As the BilliardsBot, your task is to analyze this data and respond accurately to user queries about shot performance, analysis, and improvement. Follow these rules: 1. **Shot Accuracy**: - If a user asks about shot accuracy, analyze acceleration and gyro values to estimate accuracy. - If inconsistencies in acceleration exist, suggest stability improvements. 2. **Shot Legality**: - If the user asks about legality, review the motion data to detect irregularities. 3. **General Analysis**: - Provide a comprehensive summary of the shot based on stored data. 4. **Improvement Suggestions**: - Recommend drills or adjustments based on shot data. User's query: "${messageText}"`,
//           max_tokens: 1400,
//           temperature: 0.2,
//           n: 1,
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json',
//             'Authorization': 'Bearer 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',
//           },
//         }
//       );

//       const botResponse = response.data.choices[0].text.trim();
//       const botMessage: IMessage = {
//         _id: Date.now(),
//         text: botResponse,
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'BilliardsBot',
//         },
//       };
//       setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));
//     } catch (error) {
//       console.error('Error responding:', error);
//     }
//   };

//   return (
//     <SafeAreaView style={styles.safeArea}>
//       <View style={styles.container}>
//         <View style={styles.header}>
//           <Text style={styles.pageTitle}>BilliardsBot</Text>
//         </View>
//         <KeyboardAvoidingView
//           style={{ flex: 1 }}
//           behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//           keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
//         >
//           <GiftedChat
//             messages={messages}
//             onSend={(newMessages) => handleSend(newMessages)}
//             user={{ _id: 1 }}
//             renderInputToolbar={renderInputToolbar}
//             renderSend={renderSend}
//             placeholder="Ask me about your shot!"
//           />
//         </KeyboardAvoidingView>
//       </View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   safeArea: {
//     flex: 1,
//     paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
//     backgroundColor: '#f0f0f0',
//   },
//   container: {
//     flex: 1,
//     backgroundColor: '#f0f0f0',
//   },
//   header: {
//     width: '100%',
//     backgroundColor: '#4CAF50',
//     paddingVertical: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   pageTitle: {
//     fontSize: 24,
//     fontWeight: '600',
//     color: '#FFFFFF',
//   },
//   toolbar: {
//     minHeight: 50,
//     backgroundColor: '#FFFFFF',
//     borderWidth: 1,
//     borderColor: '#e0e0e0',
//     borderRadius: 25,
//     marginHorizontal: 10,
//     marginBottom: 10,
//     paddingHorizontal: 10,
//   },
//   sendButton: {
//     height: 38,
//     width: 38,
//     borderRadius: 19,
//     backgroundColor: '#4CAF50',
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
// });

// -----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import {
//   StyleSheet,
//   SafeAreaView,
//   View,
//   Text,
// } from 'react-native';
// import { GiftedChat, InputToolbar, Send, IMessage } from 'react-native-gifted-chat';
// import axios from 'axios';
// import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';

// interface ShotData {
//   id: string;
//   accelX: number[];
//   accelY: number[];
//   accelZ: number[];
//   gyroX: number[];
//   gyroY: number[];
//   gyroZ: number[];
//   quizAnswers: Record<string, string>;
//   timestamp: string;
// }

// export default function ChatBot(): JSX.Element {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [shotData, setShotData] = useState<ShotData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) return;
        
//         const shotsCollection = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//         const docSnap = await getDocs(shotsCollection);
//         const data: ShotData[] = await Promise.all(
//           docSnap.docs.map(async (docRef) => {
//             const docData = docRef.data();
//             return {
//               id: docRef.id,
//               accelX: docData.accelX || [],
//               accelY: docData.accelY || [],
//               accelZ: docData.accelZ || [],
//               gyroX: docData.gyroX || [],
//               gyroY: docData.gyroY || [],
//               gyroZ: docData.gyroZ || [],
//               quizAnswers: docData.quizAnswers || {},
//               timestamp: docData.timestamp || '',
//             };
//           })
//         );
        
//         console.log(data);
//         setShotData(data);
//       } catch (error) {
//         console.error(error);
//       }
//     };
    
//     fetchData();
//     const interval = setInterval(fetchData, 9000);
//     return () => clearInterval(interval);
//   }, []);

//   function renderInputToolbar(props: any) {
//     return <InputToolbar {...props} containerStyle={styles.toolbar} />;
//   }

//   function renderSend(props: any) {
//     return (
//       <Send {...props} containerStyle={styles.sendButton}>
//         <View style={styles.sendIcon} />
//       </Send>
//     );
//   }

// //   const handleSend = async (newMessages: IMessage[] = []) => {
// //     setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
// //     const messageText = newMessages[0].text.toLowerCase();
// //     const serializedShotData = JSON.stringify(shotData);

// //     try {
// //       const response = await axios.post(
// //         'https://api.openai.com/v1/chat/completions',
// //         {
// //           prompt: `The following is a JSON dataset containing details of shots in a billiards game:
// //           "${serializedShotData}". Each entry has acceleration (X, Y, Z), gyro (X, Y, Z), timestamp, and quiz answers.
          
// //           As the BilliardsBot, your task is to analyze this data and respond accurately to user queries about shot performance, analysis, and improvement. Follow these rules:
          
// //           1. **Shot Accuracy**:
// //              - If a user asks about shot accuracy, analyze acceleration and gyro values to estimate accuracy.
// //              - If inconsistencies in acceleration exist, suggest stability improvements.
          
// //           2. **Shot Legality**:
// //              - If the user asks about legality, review the motion data to detect irregularities.
          
// //           3. **General Analysis**:
// //              - Provide a comprehensive summary of the shot based on stored data.
          
// //           4. **Improvement Suggestions**:
// //              - Recommend drills or adjustments based on shot data.

// //           User's query: "${messageText}"`,
// //           max_tokens: 1400,
// //           temperature: 0.2,
// //           n: 1,
// //         },
// //         {
// //           headers: {
// //             'Content-Type': 'application/json',
// //             'Authorization': `Bearer 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`,
// //           },
// //         }
// //       );

// //       const botResponse = response.data.choices[0].text.trim();
// //       const botMessage: IMessage = {
// //         _id: Date.now(),
// //         text: botResponse,
// //         createdAt: new Date(),
// //         user: {
// //           _id: 2,
// //           name: 'BilliardsBot',
// //         },
// //       };
// //       setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));
// //     } catch (error) {
// //       console.error('Error responding:', error);
// //     }
// //   };

// const handleSend = async(newMessages: IMessage[] = []) => {
//     setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
//     const messageText = newMessages[0].text.toLowerCase();
//     const serializedShotData = JSON.stringify(shotData);
//     try{
//         const prompt = `The following is a JSON dataset containing details of shots in a billiards game:
//            "${serializedShotData}". Each entry has acceleration (X, Y, Z), gyro (X, Y, Z), timestamp, and quiz answers.
          
//            As the BilliardsBot, your task is to analyze this data and respond accurately to user queries about shot performance, analysis, and improvement. Follow these rules:
          
//            1. **Shot Accuracy**:
//               - If a user asks about shot accuracy, analyze acceleration and gyro values to estimate accuracy.
//               - If inconsistencies in acceleration exist, suggest stability improvements.
          
//            2. **Shot Legality**:
//               - If the user asks about legality, review the motion data to detect irregularities.
          
//            3. **General Analysis**:
//               - Provide a comprehensive summary of the shot based on stored data.
          
//            4. **Improvement Suggestions**:
//               - Recommend drills or adjustments based on shot data.

//          User's query: "${messageText}"`;
      
//       const apiKey = 'YOUR_CHATGPT_API_KEY'; // Replace with your actual API key
//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer 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`,
//         },
//         body: JSON.stringify({
//           model: 'gpt-3.5-turbo',
//           messages: [{ role: 'user', content: prompt }],
//           max_tokens: 300,
//         }),
//       });

//     const botResponse = await response.json()
//     const responseText = botResponse.choices[0].message.content;
//       const botMessage: IMessage = {
//         _id: Date.now(),
//         text: responseText,
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'BilliardsBot',
//         },
//       };
//       setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));

//     //   const data = await response.json();
//     //   //const responseText = data.choices[0].message.content;
//     //   const mindMapData = JSON.parse(responseText);
//     //   return mindMapData;
//     }
//     catch(error){
//         console.error('Error generating mind map data:', error);
//         return null;

//     }
// }

//   return (
//     <SafeAreaView style={styles.root}>
//       <View style={styles.header}>
//         <Text style={styles.pageTitle}>BilliardsBot</Text>
//       </View>
//       <GiftedChat
//         messages={messages}
//         onSend={newMessages => handleSend(newMessages)}
//         user={{ _id: 1 }}
//         renderInputToolbar={renderInputToolbar}
//         renderSend={renderSend}
//         placeholder="Ask me about your shot!"
//       />
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   root: {
//     flex: 1,
//     backgroundColor: '#EAEAEA',
//   },
//   header: {
//     padding: 16,
//     backgroundColor: '#4A90E2',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   pageTitle: {
//     fontSize: 22,
//     fontWeight: 'bold',
//     color: '#FFFFFF',
//   },
//   toolbar: {
//     minHeight: 50,
//     backgroundColor: '#FFFFFF',
//     borderTopWidth: 1,
//     borderTopColor: '#CCCCCC',
//     borderRadius: 20,
//     marginHorizontal: 10,
//     marginBottom: 10,
//   },
//   sendButton: {
//     height: 44,
//     width: 44,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginHorizontal: 10,
//   },
//   sendIcon: {
//     width: 30,
//     height: 30,
//     backgroundColor: '#4A90E2',
//     borderRadius: 15,
//   },
// });

// ----------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';
import { GiftedChat, InputToolbar, Send, IMessage, Message, Bubble } from 'react-native-gifted-chat';
import axios from 'axios';
import { collection, doc, getDocs, getDoc } from 'firebase/firestore';
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { useFonts, Bangers_400Regular } from '@expo-google-fonts/bangers';
import { Ionicons } from '@expo/vector-icons';

interface ShotData {
  id: string;
  accelX: number[];
  accelY: number[];
  accelZ: number[];
  gyroX: number[];
  gyroY: number[];
  gyroZ: number[];
  quizAnswers: Record<string, string>;
  timestamp: string;
}

export default function ChatBot(): JSX.Element {
  let [fontsLoaded] = useFonts({
    Bangers_400Regular,
  });

  const [messages, setMessages] = useState<IMessage[]>([]);
  //   const [shotData, setShotData] = useState<ShotData[]>([]);
  const [shotData, setShotData] = useState<ShotData | null>(null); // Change to single ShotData or null

  useEffect(() => {
        const fetchLatestShot = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) {
                    setShotData(null);
                    console.log("No user logged in.");
                    return;
                }

                const metadataDocRef = doc(FIREBASE_DB, `users/${user.uid}/shots/metadata`);
                const metadataDocSnap = await getDoc(metadataDocRef);

                if (metadataDocSnap.exists() && metadataDocSnap.data().lastShotId) {
                    const lastShotId = metadataDocSnap.data().lastShotId;
                    const latestShotDocRef = doc(FIREBASE_DB, `users/${user.uid}/shots/${lastShotId}`);
                    const latestShotDocSnap = await getDoc(latestShotDocRef);

                    if (latestShotDocSnap.exists()) {
                        const docData = latestShotDocSnap.data();
                        const latestShot: ShotData = {
                            id: latestShotDocSnap.id,
                            accelX: docData.accelX || [],
                            accelY: docData.accelY || [],
                            accelZ: docData.accelZ || [],
                            gyroX: docData.gyroX || [],
                            gyroY: docData.gyroY || [],
                            gyroZ: docData.gyroZ || [],
                            quizAnswers: docData.quizAnswers || {},
                            timestamp: docData.timestamp || '',
                        };
                        setShotData(latestShot);
                    } else {
                        setShotData(null);
                    }
                } else {
                    setShotData(null);
                }
            } catch (error) {
                console.error("Error fetching latest shot:", error);
                setShotData(null);
            }
        };

        fetchLatestShot();
        const interval = setInterval(fetchLatestShot, 9000);
        return () => clearInterval(interval);
    }, []);

  function renderInputToolbar(props: any) {
    return <InputToolbar {...props} containerStyle={styles.toolbar} />;
  }

  function renderSend(props: any) {
    return (
      <Send {...props} containerStyle={styles.sendButton}>
        <View style={styles.sendIcon}>
          <Ionicons name="send" size={24} color="white" />
        </View>
      </Send>
    );
  }

//  const handleSend = async(newMessages: IMessage[] = []) => {
//     setMessages(previousMessages => GiftedChat.append(previousMessages, newMessages));
//     const messageText = newMessages[0].text.toLowerCase();
//     const serializedShotData = JSON.stringify(shotData);
//     try{
//         const prompt = `The following is a JSON dataset containing details of shots in a billiards game:
//            "${serializedShotData}". Each entry has acceleration (X, Y, Z), gyro (X, Y, Z), timestamp, and quiz answers.
          
//            As the BilliardsBot, your task is to analyze this data and respond accurately to user queries about shot performance, analysis, and improvement. Follow these rules:
          
//            1. **Shot Accuracy**:
//               - If a user asks about shot accuracy, analyze acceleration and gyro values to estimate accuracy.
//               - If inconsistencies in acceleration exist, suggest stability improvements.
          
//            2. **Shot Legality**:
//               - If the user asks about legality, review the motion data to detect irregularities.
          
//            3. **General Analysis**:
//               - Provide a comprehensive summary of the shot based on stored data.
          
//            4. **Improvement Suggestions**:
//               - Recommend drills or adjustments based on shot data.

//          User's query: "${messageText}"`;
      
//       //const apiKey = 'YOUR_CHATGPT_API_KEY'; // Replace with your actual API key
//       const response = await fetch('https://api.openai.com/v1/chat/completions', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer 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`,
//         },
//         body: JSON.stringify({
//           model: 'gpt-3.5-turbo',
//           messages: [{ role: 'user', content: prompt }],
//           max_tokens: 300,
//         }),
//       });

//     const botResponse = await response.json()
//     const responseText = botResponse.choices[0].message.content;
//       const botMessage: IMessage = {
//         _id: Date.now(),
//         text: responseText,
//         createdAt: new Date(),
//         user: {
//           _id: 2,
//           name: 'BilliardsBot',
//         },
//       };
//       setMessages(previousMessages => GiftedChat.append(previousMessages, [botMessage]));

//       //onst data = await response.json();
//       //const responseText = data.choices[0].message.content;
//       //const mindMapData = JSON.parse(responseText);
//       //return mindMapData;
//     }
//     catch(error){
//         console.error('Error generating mind map data:', error);
//         return null;

//     }
// }

const handleSend = async (newMessages: IMessage[] = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    const messageText = newMessages[0].text.toLowerCase();
    const serializedShotData = JSON.stringify(shotData);
    console.log(serializedShotData);
    try {
        // const prompt = `The following is a JSON dataset containing details of shots in a billiards game:
        //    "${serializedShotData}". Each entry has acceleration (X, Y, Z), gyro (X, Y, Z), timestamp, and quiz answers.
          
        //    As the BilliardsBot, your task is to analyze this data and respond accurately to user queries about shot performance, analysis, and improvement. Follow these rules:
          
        //    1. Shot Accuracy:
        //       - If a user asks about shot accuracy, analyze acceleration and gyro values to estimate accuracy.
        //       - If inconsistencies in acceleration exist, suggest stability improvements.
          
        //    2. Shot Legality:
        //       - If the user asks about legality, review the motion data to detect irregularities.
          
        //    3. General Analysis:
        //       - Provide a comprehensive summary of the shot based on stored data.
          
        //    4. Improvement Suggestions:
        //       - Recommend drills or adjustments based on shot data.

        //  User's query: "${messageText}"`;

        const prompt = `You are BilliardsBot, a helpful assistant that provides information and analysis on billiards. 
        If the user asks a question about billiards rules, game information, or general knowledge, provide a helpful and informative response.
        If the user provides shot data in JSON format, analyze the data and provide feedback on the shot's quality, legality, and accuracy. Also, offer personalized improvement suggestions.

        Shot Data provided in json format:
        ${serializedShotData}

        Shot Data:
        - It includes acceleration (X, Y, Z), gyroscope (X, Y, Z), timestamp, and quiz answers.
        - There are 40 data points for acceleration and gyroscope, covering 1 second before and 1 second after the shot.
        - Ignore data points at indices 16-24, as they represent the cue stick's contact with the ball.

        Shot Analysis:
        - Analyze fluctuations in acceleration and gyroscope values to assess stability.
        - Review motion data for irregularities to determine legality.
        - Estimate shot accuracy based on consistency and smoothness of the data.
        - Provide improvement suggestions based on the analysis.

        User Query: ${messageText}
        `;

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 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`,
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1200,
            }),
        });

        const botResponse = await response.json();
        let responseText = '';

        if (botResponse && botResponse.choices && botResponse.choices[0] && botResponse.choices[0].message) {
            responseText = botResponse.choices[0].message.content;
        } else {
          responseText = "Sorry, I encountered an issue processing your request.";
          console.error("OpenAI API response was malformed:", botResponse);
        }

        const botMessage: IMessage = {
            _id: Date.now(),
            text: responseText,
            createdAt: new Date(),
            user: {
                _id: 2,
                name: 'BilliardsBot',
            },
        };
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [botMessage]));

    } catch (error) {
        console.error('Error generating analysis:', error);
        setMessages((previousMessages) => GiftedChat.append(previousMessages, [{
          _id: Date.now(),
          text: "An error occurred while processing your request.",
          createdAt: new Date(),
          user: { _id: 2, name: 'BilliardsBot'},
        }]));
    }
};

  const renderMessage = (props: any) => {
    const { currentMessage } = props;
  
    if (currentMessage?.user?._id === 1) {
      return (
        <View style={[styles.userMessage, props.containerStyle]}> 
          <Message {...props} />
        </View>
      );
    } else {
      return <Message {...props} />;
    }
  };

  const renderBubble = (props: any) => {
    if (props.currentMessage?.user?._id === 1) { // User's message
      return (
        <Bubble
          {...props}
          wrapperStyle={{
            right: {
              backgroundColor: '#4CAF50', // Green background
            },
          }}
        />
      );
    }
    return <Bubble {...props} />; // Default bubble for other messages
  };

  if (!fontsLoaded) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.pageTitle}>KNOW MORE</Text>
      </View>
      <GiftedChat
        messages={messages}
        onSend={(newMessages) => handleSend(newMessages)}
        user={{ _id: 1 }}
        renderInputToolbar={renderInputToolbar}
        renderSend={renderSend}
        placeholder="Ask me about your shot!"
        // containerStyle={{ backgroundColor: '#FFF9C4' }}
        renderMessage={renderMessage}
        renderBubble={renderBubble} // Use the custom renderBubble
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#EAEAEA',
  },
  header: {
    padding: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'Bangers',
  },
  toolbar: {
    minHeight: 50,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 0,
    borderTopColor: '#CCCCCC',
    borderRadius: 20,
    marginHorizontal: 10,
    marginBottom: 10,
  },
  sendButton: {
    height: 44,
    width: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  sendIcon: {
    width: 40,
    height: 40,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMessage: { // Modified userMessage style
    // backgroundColor: '#A5D6A7', // Green background for user messages
    borderRadius: 8,
    padding: 8,
    marginRight: 8,
  },
});