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
//             'Authorization': 'Bearer GROQ_API_KEY_HERE',
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
// //             'Authorization': 'Bearer GROQ_API_KEY_HERE',
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
//           'Authorization': 'Bearer GROQ_API_KEY_HERE',
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

import React, { useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { doc, getDoc } from 'firebase/firestore';
import { tryGetFirebaseAuth, FIREBASE_DB } from '../../FirebaseConfig';
import { useFonts, Bangers_400Regular } from '@expo-google-fonts/bangers';
import { Ionicons } from '@expo/vector-icons';
import { CueTheme, cueShadow } from '@/constants/CueTheme';

const groqApiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;

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

type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

export default function ChatBot() {
  let [fontsLoaded] = useFonts({
    Bangers_400Regular,
  });

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [shotData, setShotData] = useState<ShotData | null>(null);
  const cleanAssistantText = (text: string) =>
    text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .trim();

  useEffect(() => {
    setMessages([
      {
        id: 'welcome-message',
        role: 'assistant',
        text: 'I am your cue coach. Ask about your latest shot, what went wrong, or how to improve your next visit to the table.',
      },
    ]);
  }, []);

  useEffect(() => {
        const fetchLatestShot = async () => {
            try {
                const auth = tryGetFirebaseAuth();
                const user = auth?.currentUser;
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

  const headerHint = useMemo(() => {
    if (!shotData) {
      return 'No saved shot is loaded yet. You can still ask general cue-sports questions.';
    }
    return 'Latest shot loaded. Ask for feedback, legality review, or improvement tips.';
  }, [shotData]);

const handleSend = async () => {
    const messageText = draft.trim().toLowerCase();
    if (!messageText || sending) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `${Date.now()}-user`,
      role: 'user',
      text: draft.trim(),
    };

    setMessages((previousMessages) => [userMessage, ...previousMessages]);
    setDraft('');
    setSending(true);
    const serializedShotData = JSON.stringify(shotData);
    try {
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

        if (!groqApiKey) {
          throw new Error('Missing EXPO_PUBLIC_GROQ_API_KEY');
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${groqApiKey}`,
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile',
                messages: [{ role: 'user', content: prompt }],
                max_tokens: 1200,
            }),
        });

        if (!response.ok) {
          const errorBody = await response.json().catch(() => null);
          throw new Error(errorBody?.error?.message || `Groq API Error (${response.status})`);
        }

        const botResponse = await response.json();
        let responseText = '';

        if (botResponse && botResponse.choices && botResponse.choices[0] && botResponse.choices[0].message) {
            responseText = cleanAssistantText(botResponse.choices[0].message.content);
        } else {
          responseText = "Sorry, I encountered an issue processing your request.";
          console.error("Groq API response was malformed:", botResponse);
        }

        const botMessage: ChatMessage = {
            id: `${Date.now()}-assistant`,
            role: 'assistant',
            text: responseText,
        };
        setMessages((previousMessages) => [botMessage, ...previousMessages]);

    } catch (error) {
        console.error('Error generating analysis:', error);
        setMessages((previousMessages) => [{
          id: `${Date.now()}-error`,
          role: 'assistant',
          text: error instanceof Error ? `An error occurred while processing your request: ${error.message}` : "An error occurred while processing your request.",
        }, ...previousMessages]);
    } finally {
        setSending(false);
    }
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
    <SafeAreaView style={styles.root} edges={['left', 'right']}>
      <KeyboardAvoidingView
        style={styles.root}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Training Room</Text>
          <Text style={styles.pageTitle}>Cue Coach</Text>
          <Text style={styles.pageSubtitle}>
            Ask about your latest shot, cue-ball control, or how to tidy up the stroke.
          </Text>
          <View style={styles.headerBadge}>
            <Ionicons name="stats-chart" size={16} color={CueTheme.colors.brass} />
            <Text style={styles.headerBadgeText}>{headerHint}</Text>
          </View>
        </View>

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messageList}
          inverted
          renderItem={({ item }) => (
            <View style={[styles.messageRow, item.role === 'user' ? styles.messageRowUser : styles.messageRowBot]}>
              <View style={[styles.messageBubble, item.role === 'user' ? styles.userBubble : styles.botBubble]}>
                <Text style={item.role === 'user' ? styles.userBubbleText : styles.botBubbleText}>
                  {item.text}
                </Text>
              </View>
            </View>
          )}
        />

        <View style={styles.composerShell}>
          <View style={styles.toolbar}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Ask me about your shot..."
              placeholderTextColor={CueTheme.colors.slateSoft}
              style={styles.composerInput}
              multiline
            />
            <TouchableOpacity
              onPress={handleSend}
              activeOpacity={0.85}
              style={[styles.sendIcon, (!draft.trim() || sending) && styles.sendIconDisabled]}
              disabled={!draft.trim() || sending}
            >
              {sending ? (
                <ActivityIndicator size="small" color={CueTheme.colors.chalk} />
              ) : (
                <Ionicons name="arrow-up" size={22} color={CueTheme.colors.chalk} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: CueTheme.colors.felt,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 16,
    backgroundColor: CueTheme.colors.feltDeep,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    borderBottomWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.2)',
    ...cueShadow,
  },
  headerBadge: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(247, 244, 236, 0.08)',
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.18)',
  },
  headerBadgeText: {
    flex: 1,
    color: CueTheme.colors.mist,
    fontSize: 13,
    lineHeight: 18,
  },
  eyebrow: {
    color: CueTheme.colors.brass,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  pageTitle: {
    fontSize: 30,
    color: CueTheme.colors.chalk,
    fontFamily: 'Bangers_400Regular',
    letterSpacing: 1.6,
  },
  pageSubtitle: {
    marginTop: 8,
    color: CueTheme.colors.mist,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
  },
  composerShell: {
    paddingHorizontal: 12,
    paddingTop: 10,
    paddingBottom: 0,
    backgroundColor: CueTheme.colors.feltDark,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderTopWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.16)',
  },
  toolbar: {
    minHeight: 58,
    backgroundColor: CueTheme.colors.card,
    borderTopWidth: 1,
    borderColor: CueTheme.colors.line,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
    ...cueShadow,
  },
  composerInput: {
    color: CueTheme.colors.slate,
    fontSize: 15,
    lineHeight: 20,
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    paddingTop: 4,
    paddingRight: 12,
  },
  sendIcon: {
    width: 44,
    height: 44,
    backgroundColor: CueTheme.colors.feltDeep,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CueTheme.colors.brass,
  },
  sendIconDisabled: {
    opacity: 0.45,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: CueTheme.colors.felt,
  },
  messageList: {
    backgroundColor: CueTheme.colors.felt,
    paddingHorizontal: 14,
    paddingTop: 18,
    paddingBottom: 18,
  },
  messageRow: {
    width: '100%',
    marginBottom: 12,
  },
  messageRowUser: {
    alignItems: 'flex-end',
  },
  messageRowBot: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '88%',
    flexShrink: 1,
  },
  userBubble: {
    backgroundColor: CueTheme.colors.brass,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  botBubble: {
    backgroundColor: CueTheme.colors.card,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 22,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  userBubbleText: {
    color: CueTheme.colors.rail,
    fontSize: 15,
    lineHeight: 21,
    flexShrink: 1,
  },
  botBubbleText: {
    color: CueTheme.colors.slate,
    fontSize: 15,
    lineHeight: 21,
    flexShrink: 1,
  },
});
