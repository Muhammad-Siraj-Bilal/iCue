// import { StyleSheet } from 'react-native';

// import EditScreenInfo from '@/components/EditScreenInfo';
// import { Text, View } from '@/components/Themed';

// export default function TabOneScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab One</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <EditScreenInfo path="app/(tabs)/index.tsx" />
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

// -----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, ScrollView, View, Text, Dimensions } from 'react-native';
// import { collection, getDocs } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import { LineChart } from 'react-native-chart-kit';

// interface ShotData {
//   id: string;
//   accelX: number[];
//   accelY: number[];
//   accelZ: number[];
//   gyroX: number[];
//   gyroY: number[];
//   gyroZ: number[];
//   timestamp: string;
// }

// const { width } = Dimensions.get('window');

// export default function TabOneScreen() {
//   const [shotData, setShotData] = useState<ShotData[]>([]);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) return;

//         const shotsCollection = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//         const docSnap = await getDocs(shotsCollection);
//         const data: ShotData[] = docSnap.docs.map((docRef) => {
//           const docData = docRef.data();
//           return {
//             id: docRef.id,
//             accelX: docData.accelX || [],
//             accelY: docData.accelY || [],
//             accelZ: docData.accelZ || [],
//             gyroX: docData.gyroX || [],
//             gyroY: docData.gyroY || [],
//             gyroZ: docData.gyroZ || [],
//             timestamp: docData.timestamp?.toString() || '',
//           };
//         });

//         setShotData(data);
//       } catch (error) {
//         console.error('Error fetching shot data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const renderPlot = (title: string, data: number[]) => {
//     if (!data || data.length === 0) {
//       return (
//         <View style={styles.plotContainer}>
//           <Text style={styles.plotTitle}>{title}</Text>
//           <Text>No data available</Text>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.plotContainer}>
//         <Text style={styles.plotTitle}>{title}</Text>
//         <LineChart
//           data={{
//             labels: data.map((_, index) => index.toString()),
//             datasets: [
//               {
//                 data: data,
//               },
//             ],
//           }}
//           width={width - 40}
//           height={220}
//           yAxisLabel=""
//           yAxisSuffix=""
//           yAxisInterval={1}
//           chartConfig={{
//             backgroundColor: '#e2e2e2',
//             backgroundGradientFrom: '#eff3ff',
//             backgroundGradientTo: '#efefef',
//             decimalPlaces: 2,
//             color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             style: {
//               borderRadius: 16,
//             },
//             propsForDots: {
//               r: '2',
//               strokeWidth: '1',
//               stroke: '#ffa726',
//             },
//           }}
//           bezier
//           style={{
//             marginVertical: 8,
//             borderRadius: 16,
//           }}
//         />
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {shotData.map((shot, index) => (
//         <View key={index}>
//           <Text style={styles.shotTitle}>Shot {index + 1}</Text>
//           {renderPlot('Accel X', shot.accelX)}
//           {renderPlot('Accel Y', shot.accelY)}
//           {renderPlot('Accel Z', shot.accelZ)}
//           {renderPlot('Gyro X', shot.gyroX)}
//           {renderPlot('Gyro Y', shot.gyroY)}
//           {renderPlot('Gyro Z', shot.gyroZ)}
//         </View>
//       ))}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   shotTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   plotContainer: {
//     marginBottom: 20,
//   },
//   plotTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
// });

// ----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, ScrollView, View, Text, Dimensions } from 'react-native';
// import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import { LineChart } from 'react-native-chart-kit';

// interface ShotData {
//   id: string;
//   accelX: number[];
//   accelY: number[];
//   accelZ: number[];
//   gyroX: number[];
//   gyroY: number[];
//   gyroZ: number[];
//   timestamp: string;
// }

// const { width } = Dimensions.get('window');

// export default function TabOneScreen() {
//   const [latestShot, setLatestShot] = useState<ShotData | null>(null);

//   useEffect(() => {
//     const fetchLatestShot = async () => {
//       try {
//         const auth = getAuth();
//         const user = auth.currentUser;
//         if (!user) return;

//         const shotsCollection = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//         const q = query(shotsCollection, orderBy('timestamp', 'desc'), limit(1));
//         const docSnap = await getDocs(q);

//         if (!docSnap.empty) {
//           const latestDoc = docSnap.docs[0];
//           const docData = latestDoc.data();
//           setLatestShot({
//             id: latestDoc.id,
//             accelX: docData.accelX || [],
//             accelY: docData.accelY || [],
//             accelZ: docData.accelZ || [],
//             gyroX: docData.gyroX || [],
//             gyroY: docData.gyroY || [],
//             gyroZ: docData.gyroZ || [],
//             timestamp: docData.timestamp?.toString() || '',
//           });
//         } else {
//           setLatestShot(null);
//         }
//       } catch (error) {
//         console.error('Error fetching latest shot:', error);
//       }
//     };

//     fetchLatestShot();
//   }, []);

//   const renderPlot = (title: string, data: number[]) => {
//     if (!data || data.length === 0) {
//       return (
//         <View style={styles.plotContainer}>
//           <Text style={styles.plotTitle}>{title}</Text>
//           <Text>No data available</Text>
//         </View>
//       );
//     }

//     return (
//       <View style={styles.plotContainer}>
//         <Text style={styles.plotTitle}>{title}</Text>
//         <LineChart
//           data={{
//             labels: data.map((_, index) => (index % 5 === 0 ? index.toString() : '')), // Show every 5th label
//             datasets: [
//               {
//                 data: data,
//               },
//             ],
//           }}
//           width={width - 40}
//           height={220}
//           yAxisLabel=""
//           yAxisSuffix=""
//           yAxisInterval={10} // Adjust as needed to reduce y-axis labels
//           chartConfig={{
//             backgroundColor: '#e2e2e2',
//             backgroundGradientFrom: '#eff3ff',
//             backgroundGradientTo: '#efefef',
//             decimalPlaces: 2,
//             color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             style: {
//               borderRadius: 16,
//             },
//             propsForDots: {
//               r: '2',
//               strokeWidth: '1',
//               stroke: '#ffa726',
//             },
//           }}
//           bezier
//           style={{
//             marginVertical: 8,
//             borderRadius: 16,
//           }}
//         />
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {latestShot ? (
//         <View>
//           <Text style={styles.shotTitle}>Latest Shot</Text>
//           {renderPlot('Accel X', latestShot.accelX)}
//           {renderPlot('Accel Y', latestShot.accelY)}
//           {renderPlot('Accel Z', latestShot.accelZ)}
//           {renderPlot('Gyro X', latestShot.gyroX)}
//           {renderPlot('Gyro Y', latestShot.gyroY)}
//           {renderPlot('Gyro Z', latestShot.gyroZ)}
//         </View>
//       ) : (
//         <Text>No shot data available.</Text>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   shotTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   plotContainer: {
//     marginBottom: 20,
//   },
//   plotTitle: {
//     fontSize: 16,
//     fontWeight: '600',
//     marginBottom: 8,
//   },
// });

// ----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
// import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
// import { FIREBASE_DB } from '../../FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import { LineChart } from 'react-native-chart-kit';
// import AwesomeButton from 'react-native-really-awesome-button';
// import { useNavigation } from '@react-navigation/native';
// import { router } from 'expo-router';

// const { width } = Dimensions.get('window');

// export default function TabOneScreen() {
//     const [latestShot, setLatestShot] = useState<{
//         accelX: number[];
//         accelY: number[];
//         accelZ: number[];
//         gyroX: number[];
//         gyroY: number[];
//         gyroZ: number[];
//     } | null>(null);

//     const questionMapping: Record<number, string> = {
//         3: "legalShot",
//         1: "ballPotted",
//         2: "foul",
//         4: "spin",
//         5: "doubleHit", // Modify as needed
//     };

//     const [quizAnswers, setQuizResults] = useState<{ [key: string]: boolean } | null>(null);
//     const [shotAnalysis, setShotAnalysis] = useState<string>('Loading analysis...');
//     const [loading, setLoading] = useState<boolean>(false);
//     const [showProShot, setShowProShot] = useState<boolean>(false);
//     const navigation = useNavigation();

//     useEffect(() => {
//         const fetchLatestShot = async () => {
//             try {
//                 const auth = getAuth();
//                 const user = auth.currentUser;
//                 if (!user) return;

//                 const shotsCollection = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//                 const q = query(shotsCollection, orderBy('timestamp', 'desc'), limit(1));
//                 const docSnap = await getDocs(q);

//                 if (!docSnap.empty) {
//                     const latestDoc = docSnap.docs[0].data();
//                     setLatestShot({
//                         accelX: latestDoc.accelX || [],
//                         accelY: latestDoc.accelY || [],
//                         accelZ: latestDoc.accelZ || [],
//                         gyroX: latestDoc.gyroX || [],
//                         gyroY: latestDoc.gyroY || [],
//                         gyroZ: latestDoc.gyroZ || [],
//                     });
//                     setQuizResults(latestDoc.quizAnswers || {});
//                     analyzeShot(latestDoc);
//                 }
//             } catch (error) {
//                 console.error('Error fetching latest shot:', error);
//             }
//         };
//         fetchLatestShot();
//     }, []);

//     const analyzeShot = async (shotData: any) => {
//         setLoading(true);

//         // Extract shot data
//         const { accelX, accelY, accelZ, gyroX, gyroY, gyroZ } = shotData;

//         // Ignore 17-23rd values, focus on before and after
//         const analyzeFluctuations = (data: number[]) => {
//             const preShot = data.slice(0, 16);
//             const postShot = data.slice(24);

//             const avgChange = (arr: number[]) =>
//                 arr.reduce((sum, val, idx, src) => idx > 0 ? sum + Math.abs(val - src[idx - 1]) : sum, 0) / arr.length;

//             return avgChange(preShot) + avgChange(postShot);
//         };

//         const fluctuationScore =
//             analyzeFluctuations(accelX) +
//             analyzeFluctuations(accelY) +
//             analyzeFluctuations(accelZ) +
//             analyzeFluctuations(gyroX) +
//             analyzeFluctuations(gyroY) +
//             analyzeFluctuations(gyroZ);

//         // Determine shot quality
//         const isSmooth = fluctuationScore < 25; // Adjust threshold if needed
//         // Convert Firebase values to boolean
//         const parsedQuizAnswers: Record<string, boolean> = Object.fromEntries(
//             Object.entries(quizAnswers || {}).map(([key, value]) => [
//                 questionMapping[Number(key)], // Convert key to number
//                 String(value).toLowerCase() === "yes" // Normalize comparison
//             ])
//         );

//         const isLegal = parsedQuizAnswers.legalShot ?? false;
//         const ballPotted = parsedQuizAnswers.ballPotted ?? false;
//         const isFoul = parsedQuizAnswers.foul ?? false;

//         // Construct OpenAI prompt
//         const prompt = `
//             Given the following billiard shot data:
//             - Fluctuation Score: ${fluctuationScore.toFixed(2)}
//             - Shot Smoothness: ${isSmooth ? "Smooth" : "Fluctuating"}
//             - Quiz Results:
//               - Legal Shot: ${isLegal ? "Yes" : "No"}
//               - Ball Potted: ${ballPotted ? "Yes" : "No"}
//               - Foul Committed: ${isFoul ? "Yes" : "No"}

//             Generate a concise, engaging evaluation of the shot, considering smoothness, legality, and quiz results. 
//             Format the response naturally as a coach giving feedback.
//         `;

//         // Fetch AI-generated analysis
//         try {
//             const response = await fetch('https://api.openai.com/v1/chat/completions', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': 'Bearer GROQ_API_KEY_HERE',
//                 },
//                 body: JSON.stringify({
//                     model: 'gpt-3.5-turbo',
//                     messages: [{ role: 'user', content: prompt }],
//                     max_tokens: 200,
//                 }),
//             });

//             const botResponse = await response.json();
//             const responseText =
//                 botResponse?.choices?.[0]?.message?.content || "Couldn't analyze the shot.";

//             setShotAnalysis(responseText);
//         } catch (error) {
//             console.error('Error fetching AI analysis:', error);
//             setShotAnalysis('Error analyzing shot.');
//         }

//         setLoading(false);
//     };

//     const Graph = ({ title, data }: { title: string; data: number[] }) => { // Corrected type here
//         if (!data || data.length === 0) {
//             return (
//                 <View style={styles.plotContainer}>
//                     <Text style={styles.plotTitle}>{title}</Text>
//                     <Text>No data available</Text>
//                 </View>
//             );
//         }

//         return (
//             <View style={styles.plotContainer}>
//                 <Text style={styles.plotTitle}>{title}</Text>
//                 <LineChart
//                     data={{
//                         labels: data.map((_, index) => (index % 5 === 0 ? index.toString() : '')),
//                         datasets: [{ data }],
//                     }}
//                     width={width - 40}
//                     height={220}
//                     chartConfig={{
//                         backgroundColor: '#e2e2e2',
//                         backgroundGradientFrom: '#eff3ff',
//                         backgroundGradientTo: '#efefef',
//                         decimalPlaces: 2,
//                         color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//                         labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                         style: { borderRadius: 16 },
//                         propsForDots: { r: '2', strokeWidth: '1', stroke: '#ffa726' },
//                     }}
//                     bezier
//                     style={{ marginVertical: 8, borderRadius: 16 }}
//                 />
//             </View>
//         );
//     };

//     const proShot = {
//     accelX: [0.07983, 0.0835, 0.03174, 0.0791, 0.09106, 0.0813, 0.09204, 0.0625, 0.05835, 0.04565, 0.07446, 0.06787, 0.04565, 0.01978, 0.13672, 0.12524, 0.05615, -0.10278, -0.55811, -0.46924, -0.48364, 0.63989, -0.52515, -0.11548, 0.25562, 0.0437, 0.10571, 0.0481, -0.11597, 0.0647, 0.01855, -0.0105, -0.02539, 0.01392, -0.04346, -0.04297, 0.01953, 0.07153, -0.06201, -0.03271],
//     accelY: [-0.30469, -0.25928, -0.17798, -0.1792, -0.22388, -0.25, -0.22803, -0.21216, -0.18115, -0.21851, -0.23462, -0.31348, -0.25122, -0.15869, -0.25293, -0.00439, 0.78491, 1.99994, 1.99994, -2.0, -2.0, -0.47534, 0.31348, 0.00952, -0.10425, -0.11401, -0.11792, 0.00024, -0.05151, -0.06006, -0.03564, -0.0166, -0.03931, -0.0564, -0.01416, -0.05762, -0.04126, -0.0293, -0.04419, -0.0293],
//     accelZ: [1.0022, 0.94824, 0.94434, 0.95874, 0.948, 1.01831, 1.00513, 1.03931, 1.01904, 0.99194, 1.02441, 1.0, 1.05811, 1.1394, 1.13354, 0.99268, -0.17529, -0.60571, 0.68066, 1.64526, 0.37012, 1.09912, 1.8689, 0.97974, 0.85352, 0.96362, 1.08374, 0.89575, 0.95923, 1.09937, 0.9436, 1.0625, 0.97485, 0.94336, 1.03198, 0.93774, 0.98657, 1.0603, 0.98218, 0.99512],
//     gyroX: [-1.41221, 0.9313, 0.40458, 1.16031, 1.0458, 1.38168, 1.22901, 0.60305, 0.71756, -0.90076, 0.77099, -2.29008, 0.01527, -2.06107, -6.49618, -6.9084, 10.81679, 25.20611, 250.12978, 28.32061, 21.98473, 48.40458, 2.72519, -6.81679, -5.20611, -5.1374, 1.92366, 2.87786, -0.92366, 1.22137, 1.24427, -1.1145, 0.10687, -0.40458, -0.46565, 0.9313, 1.66412, 0.58779, 0.58779, -0.03817],
//     gyroY: [-2.51145, -7.08397, -5.45038, 4.77099, 8.0458, 4.20611, 6.98473, 1.89313, -0.33588, 5.38168, -11.16794, 13.19084, -14.41221, -9.32061, -7.67939, -22.84733, 75.12214, 104.9542, 12.54962, -114.82442, 48.35115, -13.94656, -22.07634, 18.0916, 5.48092, 14.19084, 5.26718, -1.21374, -0.78626, -3.69466, 1.67176, -3.76336, -3.94656, -5.33588, 4.94656, 9.57252, 0.64885, 2.93893, 4.9084, -0.38931],
//     gyroZ: [0.77863, 0.81679, -0.12977, -1.27481, -1.00763, -0.61832, -0.64885, -0.61069, -0.80153, -0.92366, -0.74809, -1.70229, -1.15267, -2.06107, -2.90076, -1.25954, -88.28244, 17.0687, 250.12978, -9.51908, 8.73282, -4.78626, -9.38168, -3.77863, -10.67176, -6.92366, 0.53435, -1.94656, -0.70992, 0.9542, -0.64122, 0.28244, 0.56489, -0.25954, -0.83206, -3.34351, -1.48855, -0.10687, -0.20611, -0.61069],
//     };

//     return (
//       <View style={styles.mainContainer}>
//         <ScrollView
//             style={styles.scrollContainer}
//             indicatorStyle={'black'}
//             contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} // Add this line
//         >
//           <View style={[styles.analysisContainer, { alignItems: 'center' }]}>  
//               <Text style={[styles.analysisTitle, { justifyContent: 'center' }]}>Shot Analysis</Text>
//               {loading ? <ActivityIndicator size="small" color="#0000ff" /> : 
//               <Text style={[styles.description, { textAlign: 'justify' }]}>{shotAnalysis}</Text>}
//           </View>
//             {showProShot ? (
//                 <View style={{ alignItems: 'center' }}>
//                     <Text style={styles.title}>Professional's Shot</Text>
//                     <Graph title="Accel X" data={proShot.accelX} />
//                     <Graph title="Accel Y" data={proShot.accelY} />
//                     <Graph title="Accel Z" data={proShot.accelZ} />
//                     <Graph title="Gyro X" data={proShot.gyroX} />
//                     <Graph title="Gyro Y" data={proShot.gyroY} />
//                     <Graph title="Gyro Z" data={proShot.gyroZ} />
//                 </View>
//             ) : latestShot ? (
//                 <View style={{ alignItems: 'center' }}>
//                     <Text style={styles.title}>Latest Shot</Text>
//                     <Graph title="Accel X" data={latestShot.accelX} />
//                     <Graph title="Accel Y" data={latestShot.accelY} />
//                     <Graph title="Accel Z" data={latestShot.accelZ} />
//                     <Graph title="Gyro X" data={latestShot.gyroX} />
//                     <Graph title="Gyro Y" data={latestShot.gyroY} />
//                     <Graph title="Gyro Z" data={latestShot.gyroZ} />
//                 </View>
//             ) : (
//                 <View style={{ alignItems: 'center' }}>
//                     <Text style={styles.title}>Latest Shot</Text>
//                     <Text>No shot data available.</Text>
//                 </View>
//             )}
//         </ScrollView>

//           <View style={styles.buttonContainer}>
//           <AwesomeButton
//               onPress={() => setShowProShot(!showProShot)}
//               backgroundColor="#FFD700"
//               backgroundDarker="#DAA520"
//               width={width * 0.8}
//               borderRadius={30}
//               textSize={15}
//               textColor="#000"
//               textFontFamily="System"
//               raiseLevel={5}
//               paddingHorizontal={30}
//               style={styles.awesomeButton}
//           >
//               {showProShot ? 'Back to Your Shot' : 'View Professional\'s Shot'}
//           </AwesomeButton>
//           <AwesomeButton
//               onPress={() => router.replace('/Intro')}
//               backgroundColor="#FFD700"
//               backgroundDarker="#DAA520"
//               width={width * 0.8}
//               borderRadius={30}
//               textSize={15}
//               textColor="#000"
//               textFontFamily="System"
//               raiseLevel={5}
//               paddingHorizontal={30}
//               style={styles.quizButton}
//           >
//               New Shot
//           </AwesomeButton>
//           </View>
//       </View>
//   );
// }

// const styles = StyleSheet.create({
//   analysisContainer: {
//     backgroundColor: 'white',
//     padding: 25,
//     borderRadius: 10,
//     marginBottom: 30,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5, // For Android shadow
//     alignItems: 'center', // Center content
//   },
//   analysisTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, marginTop: 20, alignItems: 'center' },
//   description: {
//       fontSize: 16,
//       color: '#333',
//       marginBottom: 5,
//       fontFamily: 'Poppins-Regular', 
//       lineHeight: 24,
//   },
//   mainContainer: {
//       flex: 1,
//   },
//   scrollContainer: {
//       flex: 1,
//       padding: 20,
//   },
//   title: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginTop: 10,
//       marginBottom: 20,
//   },
//   plotContainer: {
//       marginBottom: 20,
//   },
//   plotTitle: {
//       fontSize: 16,
//       fontWeight: '600',
//       marginBottom: 8,
//   },
//   buttonContainer: {
//       padding: 20,
//       justifyContent: 'flex-end',
//       alignItems: 'center', // Add this line
//   },
//   awesomeButton: {
//       alignSelf: 'stretch',
//   },
//   quizButton: {
//       alignSelf: 'stretch',
//       marginTop: 10,
//   },
// });
  // const proShot = {
  //   accelX: [0.07983, 0.0835, 0.03174, 0.0791, 0.09106, 0.0813, 0.09204, 0.0625, 0.05835, 0.04565, 0.07446, 0.06787, 0.04565, 0.01978, 0.13672, 0.12524, 0.05615, -0.10278, -0.55811, -0.46924, -0.48364, 0.63989, -0.52515, -0.11548, 0.25562, 0.0437, 0.10571, 0.0481, -0.11597, 0.0647, 0.01855, -0.0105, -0.02539, 0.01392, -0.04346, -0.04297, 0.01953, 0.07153, -0.06201, -0.03271],
  //   accelY: [-0.30469, -0.25928, -0.17798, -0.1792, -0.22388, -0.25, -0.22803, -0.21216, -0.18115, -0.21851, -0.23462, -0.31348, -0.25122, -0.15869, -0.25293, -0.00439, 0.78491, 1.99994, 1.99994, -2.0, -2.0, -0.47534, 0.31348, 0.00952, -0.10425, -0.11401, -0.11792, 0.00024, -0.05151, -0.06006, -0.03564, -0.0166, -0.03931, -0.0564, -0.01416, -0.05762, -0.04126, -0.0293, -0.04419, -0.0293],
  //   accelZ: [1.0022, 0.94824, 0.94434, 0.95874, 0.948, 1.01831, 1.00513, 1.03931, 1.01904, 0.99194, 1.02441, 1.0, 1.05811, 1.1394, 1.13354, 0.99268, -0.17529, -0.60571, 0.68066, 1.64526, 0.37012, 1.09912, 1.8689, 0.97974, 0.85352, 0.96362, 1.08374, 0.89575, 0.95923, 1.09937, 0.9436, 1.0625, 0.97485, 0.94336, 1.03198, 0.93774, 0.98657, 1.0603, 0.98218, 0.99512],
  //   gyroX: [-1.41221, 0.9313, 0.40458, 1.16031, 1.0458, 1.38168, 1.22901, 0.60305, 0.71756, -0.90076, 0.77099, -2.29008, 0.01527, -2.06107, -6.49618, -6.9084, 10.81679, 25.20611, 250.12978, 28.32061, 21.98473, 48.40458, 2.72519, -6.81679, -5.20611, -5.1374, 1.92366, 2.87786, -0.92366, 1.22137, 1.24427, -1.1145, 0.10687, -0.40458, -0.46565, 0.9313, 1.66412, 0.58779, 0.58779, -0.03817],
  //   gyroY: [-2.51145, -7.08397, -5.45038, 4.77099, 8.0458, 4.20611, 6.98473, 1.89313, -0.33588, 5.38168, -11.16794, 13.19084, -14.41221, -9.32061, -7.67939, -22.84733, 75.12214, 104.9542, 12.54962, -114.82442, 48.35115, -13.94656, -22.07634, 18.0916, 5.48092, 14.19084, 5.26718, -1.21374, -0.78626, -3.69466, 1.67176, -3.76336, -3.94656, -5.33588, 4.94656, 9.57252, 0.64885, 2.93893, 4.9084, -0.38931],
  //   gyroZ: [0.77863, 0.81679, -0.12977, -1.27481, -1.00763, -0.61832, -0.64885, -0.61069, -0.80153, -0.92366, -0.74809, -1.70229, -1.15267, -2.06107, -2.90076, -1.25954, -88.28244, 17.0687, 250.12978, -9.51908, 8.73282, -4.78626, -9.38168, -3.77863, -10.67176, -6.92366, 0.53435, -1.94656, -0.70992, 0.9542, -0.64122, 0.28244, 0.56489, -0.25954, -0.83206, -3.34351, -1.48855, -0.10687, -0.20611, -0.61069],
  // };

// -------------------------------------------------------------------------------------------------------

import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, View, Text, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { tryGetFirebaseAuth, FIREBASE_DB } from '../../FirebaseConfig';
import { LineChart } from 'react-native-chart-kit';
import GoldButton from '@/components/GoldButton';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { CueTheme, cueShadow } from '@/constants/CueTheme';

const groqApiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
// import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const { width } = Dimensions.get('window');

export default function TabOneScreen() {
    const [latestShot, setLatestShot] = useState<{
        accelX: number[];
        accelY: number[];
        accelZ: number[];
        gyroX: number[];
        gyroY: number[];
        gyroZ: number[];
    } | null>(null);

    const questionMapping: Record<number, string> = {
        3: "legalShot",
        1: "ballPotted",
        2: "foul",
        4: "spin",
        5: "doubleHit", // Modify as needed
    };
    const getLessonRecommendation = (score: number, quiz: Record<string, boolean>) => {
      if (score < 60 || quiz.ballPotted === false) {
        return {
          focus: 'straight_stroke',
          videoId: '9bc0ujUhLtU',
          title: 'Long Straight Shot Reference',
          coach: 'Yukio Akagariyama',
          reason: 'Best when the pot is being missed or the cue delivery still looks unstable. It reinforces straighter cueing and cleaner pocketing.',
        };
      }

      if (quiz.foul) {
        return {
          focus: 'cue_ball_control',
          videoId: 'lmDKt2jxY3w',
          title: 'Cue Ball Control And Shot Selection',
          coach: 'Max Eberle',
          reason: 'Useful when the shot outcome creates foul pressure or poor leave. It focuses on cue-ball discipline and better route control.',
        };
      }

      if (score < 80) {
        return {
          focus: 'cue_ball_control',
          videoId: 'lmDKt2jxY3w',
          title: 'Cue Ball Control And Shot Selection',
          coach: 'Max Eberle',
          reason: 'A good fit for medium-level smoothness. It helps turn a decent stroke into more reliable position play.',
        };
      }

      return {
        focus: 'pro_reference',
        videoId: '7raN6I_KTus',
        title: 'Professional Shot Example',
        coach: 'Sharivari',
        reason: 'Best when the stroke is already stable and you want a sharper pro-level reference for timing and shot shape.',
      };
    };

    const [quizAnswers, setQuizResults] = useState<{ [key: string]: boolean } | null>(null);
    const [shotAnalysis, setShotAnalysis] = useState<string>('Loading analysis...');
    const [loading, setLoading] = useState<boolean>(false);
    const [showProShot, setShowProShot] = useState<boolean>(false);

    const proShot = {
    accelX: [0.07983, 0.0835, 0.03174, 0.0791, 0.09106, 0.0813, 0.09204, 0.0625, 0.05835, 0.04565, 0.07446, 0.06787, 0.04565, 0.01978, 0.13672, 0.12524, 0.05615, -0.10278, -0.55811, -0.46924, -0.48364, 0.63989, -0.52515, -0.11548, 0.25562, 0.0437, 0.10571, 0.0481, -0.11597, 0.0647, 0.01855, -0.0105, -0.02539, 0.01392, -0.04346, -0.04297, 0.01953, 0.07153, -0.06201, -0.03271],
    accelY: [-0.30469, -0.25928, -0.17798, -0.1792, -0.22388, -0.25, -0.22803, -0.21216, -0.18115, -0.21851, -0.23462, -0.31348, -0.25122, -0.15869, -0.25293, -0.00439, 0.78491, 1.99994, 1.99994, -2.0, -2.0, -0.47534, 0.31348, 0.00952, -0.10425, -0.11401, -0.11792, 0.00024, -0.05151, -0.06006, -0.03564, -0.0166, -0.03931, -0.0564, -0.01416, -0.05762, -0.04126, -0.0293, -0.04419, -0.0293],
    accelZ: [1.0022, 0.94824, 0.94434, 0.95874, 0.948, 1.01831, 1.00513, 1.03931, 1.01904, 0.99194, 1.02441, 1.0, 1.05811, 1.1394, 1.13354, 0.99268, -0.17529, -0.60571, 0.68066, 1.64526, 0.37012, 1.09912, 1.8689, 0.97974, 0.85352, 0.96362, 1.08374, 0.89575, 0.95923, 1.09937, 0.9436, 1.0625, 0.97485, 0.94336, 1.03198, 0.93774, 0.98657, 1.0603, 0.98218, 0.99512],
    gyroX: [-1.41221, 0.9313, 0.40458, 1.16031, 1.0458, 1.38168, 1.22901, 0.60305, 0.71756, -0.90076, 0.77099, -2.29008, 0.01527, -2.06107, -6.49618, -6.9084, 10.81679, 25.20611, 250.12978, 28.32061, 21.98473, 48.40458, 2.72519, -6.81679, -5.20611, -5.1374, 1.92366, 2.87786, -0.92366, 1.22137, 1.24427, -1.1145, 0.10687, -0.40458, -0.46565, 0.9313, 1.66412, 0.58779, 0.58779, -0.03817],
    gyroY: [-2.51145, -7.08397, -5.45038, 4.77099, 8.0458, 4.20611, 6.98473, 1.89313, -0.33588, 5.38168, -11.16794, 13.19084, -14.41221, -9.32061, -7.67939, -22.84733, 75.12214, 104.9542, 12.54962, -114.82442, 48.35115, -13.94656, -22.07634, 18.0916, 5.48092, 14.19084, 5.26718, -1.21374, -0.78626, -3.69466, 1.67176, -3.76336, -3.94656, -5.33588, 4.94656, 9.57252, 0.64885, 2.93893, 4.9084, -0.38931],
    gyroZ: [0.77863, 0.81679, -0.12977, -1.27481, -1.00763, -0.61832, -0.64885, -0.61069, -0.80153, -0.92366, -0.74809, -1.70229, -1.15267, -2.06107, -2.90076, -1.25954, -88.28244, 17.0687, 250.12978, -9.51908, 8.73282, -4.78626, -9.38168, -3.77863, -10.67176, -6.92366, 0.53435, -1.94656, -0.70992, 0.9542, -0.64122, 0.28244, 0.56489, -0.25954, -0.83206, -3.34351, -1.48855, -0.10687, -0.20611, -0.61069],
    };
    const referenceQuizAnswers = {
      legalShot: true,
      ballPotted: true,
      foul: false,
    };

    useEffect(() => {
        const fetchLatestShot = async () => {
            try {
                const auth = tryGetFirebaseAuth();
                const user = auth?.currentUser;
                if (!user) {
                    setLatestShot(null);
                    return;
                }

                const shotsCollection = collection(FIREBASE_DB, `users/${user.uid}/shots`);
                const q = query(shotsCollection, orderBy('timestamp', 'desc'), limit(1));
                const docSnap = await getDocs(q);

                if (!docSnap.empty) {
                    const latestDoc = docSnap.docs[0].data();
                    setLatestShot({
                        accelX: latestDoc.accelX || [],
                        accelY: latestDoc.accelY || [],
                        accelZ: latestDoc.accelZ || [],
                        gyroX: latestDoc.gyroX || [],
                        gyroY: latestDoc.gyroY || [],
                        gyroZ: latestDoc.gyroZ || [],
                    });
                    setQuizResults(latestDoc.quizAnswers || {});
                    analyzeShot(latestDoc, latestDoc.quizAnswers || {});
                }
            } catch (error) {
                console.error('Error fetching latest shot:', error);
            }
        };
        fetchLatestShot();
    }, []);

    const analyzeShot = async (shotData: any, quizAnswerSource?: { [key: string]: boolean } | null) => {
        setLoading(true);
        setShotAnalysis('Loading coach summary...');
    
        try {
            // Extract shot data
            const { accelX, accelY, accelZ, gyroX, gyroY, gyroZ } = shotData;
    
            // Analyze fluctuations, ignoring frames 17-23
            const analyzeFluctuations = (data: number[]) => {
                if (!data || data.length < 25) return 0; // Prevent errors
    
                const preShot = data.slice(0, 16);
                const postShot = data.slice(24);
    
                const avgChange = (arr: number[]) =>
                    arr.slice(1).reduce((sum, val, idx) => sum + Math.abs(val - arr[idx]), 0) / arr.length;
    
                return avgChange(preShot) + avgChange(postShot);
            };
    
            // Compute total fluctuation score
            const fluctuationScores = [
                analyzeFluctuations(accelX),
                analyzeFluctuations(accelY),
                analyzeFluctuations(accelZ),
                analyzeFluctuations(gyroX),
                analyzeFluctuations(gyroY),
                analyzeFluctuations(gyroZ),
            ];
    
            const fluctuationScore = fluctuationScores.reduce((sum, score) => sum + score, 0);
    
            // Normalize fluctuation score dynamically
            const minScore = 10; 
            const maxScore = 150; 
            const normalizedScore = Math.min(Math.max((fluctuationScore - minScore) / (maxScore - minScore), 0), 1);
            console.log(normalizedScore);
            // Adaptive threshold
            const isSmooth = normalizedScore < 0.2; 
    
            // Convert Firebase values to boolean
            const rawQuizAnswers = quizAnswerSource ?? quizAnswers ?? {};
            const parsedQuizAnswers: Record<string, boolean> = Object.fromEntries(
                Object.entries(rawQuizAnswers).map(([key, value]) => {
                    const mappedKey = Number.isNaN(Number(key)) ? key : questionMapping[Number(key)];
                    return [mappedKey, typeof value === 'boolean' ? value : String(value).toLowerCase() === "yes"];
                })
            );
    
            const isLegal = parsedQuizAnswers.legalShot ?? true;
            const ballPotted = parsedQuizAnswers.ballPotted ?? true;
            const isFoul = parsedQuizAnswers.foul ?? true;
    
            // Construct OpenAI prompt
            const prompt = `
                Given the following billiard shot data:
                - Fluctuation Score: ${fluctuationScore.toFixed(2)}
                - Shot Smoothness: ${isSmooth ? "Smooth" : "Fluctuating"}
                - Quiz Results:
                  - Legal Shot: ${isLegal ? "Yes" : "No"}
                  - Ball Potted: ${ballPotted ? "Yes" : "No"}
                  - Foul Committed: ${isFoul ? "Yes" : "No"}
    
                Generate a concise but complete coach-style evaluation of the shot, considering smoothness, legality, and quiz results. Treat unstable motion as a weaker shot, and treat a legal pot with no foul as a strong result.
                Format the response naturally as a coach giving feedback in 2 short paragraphs, then finish with 2 brief improvement tips in one final line.
            `;
    
            // Fetch AI-generated analysis (Use environment variable for API key)
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
                    max_tokens: 320,
                }),
            });

            if (!response.ok) {
                let errorMessage = `Groq API Error (${response.status})`;
                try {
                    const errorBody = await response.json();
                    errorMessage = errorBody?.error?.message || errorMessage;
                } catch {
                    // Ignore body parse failure and keep the status-based message.
                }
                throw new Error(errorMessage);
            }
    
            const botResponse = await response.json();
            const responseText = botResponse?.choices?.[0]?.message?.content || "Couldn't analyze the shot.";
    
            setShotAnalysis(responseText);
        } catch (error) {
            console.error('Error analyzing shot:', error);
            setShotAnalysis(
                error instanceof Error && error.message
                    ? `AI analysis is unavailable right now. ${error.message}`
                    : 'AI analysis is unavailable right now.'
            );
        } finally {
            setLoading(false);
        }
    };
    
    const speakAnalysis = () => {
      Speech.speak(shotAnalysis, { language: 'en' });
    };

    const calculateSmoothnessScore = (shot: typeof latestShot) => {
      if (!shot) return 0;
      return Math.max(
        0,
        Math.min(
          100,
          Math.round(
            100 -
              ([
                shot.accelX,
                shot.accelY,
                shot.accelZ,
                shot.gyroX,
                shot.gyroY,
                shot.gyroZ,
              ]
                .map((series) => {
                  if (!series || series.length < 25) return 0;
                  const preShot = series.slice(0, 16);
                  const postShot = series.slice(24);
                  const avgChange = (arr: number[]) =>
                    arr.slice(1).reduce((sum, val, idx) => sum + Math.abs(val - arr[idx]), 0) / arr.length;
                  return avgChange(preShot) + avgChange(postShot);
                })
                .reduce((sum, value) => sum + value, 0) /
                150) *
              100
          )
        )
      );
    };

    const shotReady = Boolean(latestShot);
    const userQuizSummary: Record<string, boolean> = Object.fromEntries(
      Object.entries(quizAnswers || {}).map(([key, value]) => {
        const mappedKey = Number.isNaN(Number(key)) ? key : questionMapping[Number(key)];
        return [mappedKey, typeof value === 'boolean' ? value : String(value).toLowerCase() === 'yes'];
      })
    );
    const activeShot = showProShot ? proShot : latestShot;
    const activeQuizAnswers = showProShot ? referenceQuizAnswers : quizAnswers || {};
    const parsedQuizSummary: Record<string, boolean> = Object.fromEntries(
      Object.entries(activeQuizAnswers || {}).map(([key, value]) => {
        const mappedKey = Number.isNaN(Number(key)) ? key : questionMapping[Number(key)];
        return [mappedKey, typeof value === 'boolean' ? value : String(value).toLowerCase() === 'yes'];
      })
    );
    const statusCards = [
      {
        label: 'Shot Status',
        value: shotReady ? 'Captured' : 'Waiting',
      },
      {
        label: 'Legality',
        value: parsedQuizSummary.legalShot === false ? 'Review' : 'Clean',
      },
      {
        label: 'Pot Result',
        value: parsedQuizSummary.ballPotted === false ? 'Missed' : 'Potted',
      },
    ];
    const smoothnessScore = calculateSmoothnessScore(activeShot);
    const userSmoothnessScore = calculateSmoothnessScore(latestShot);
    const lessonRecommendation = getLessonRecommendation(userSmoothnessScore, userQuizSummary);
    const readinessLabel =
      smoothnessScore >= 80 ? 'Competition Ready' : smoothnessScore >= 60 ? 'Training Well' : 'Needs Repetition';
    const scoreTone =
      smoothnessScore >= 80
        ? {
            accent: '#57C785',
            soft: 'rgba(87, 199, 133, 0.16)',
            text: '#DFF8E8',
            track: 'rgba(87, 199, 133, 0.26)',
          }
        : smoothnessScore >= 60
          ? {
              accent: '#E7C35A',
              soft: 'rgba(231, 195, 90, 0.18)',
              text: '#FFF1BF',
              track: 'rgba(231, 195, 90, 0.28)',
            }
          : {
              accent: '#E06A6A',
              soft: 'rgba(224, 106, 106, 0.18)',
              text: '#FFD7D7',
              track: 'rgba(224, 106, 106, 0.28)',
            };
    const focusPoints = [
      showProShot ? 'Reference profile active' : 'Your latest capture active',
      parsedQuizSummary.foul ? 'Foul risk detected' : 'Clean table outcome',
      parsedQuizSummary.ballPotted ? 'Pot result held' : 'Pot result still missing',
    ];

    const handleToggleShotView = () => {
      const nextShowProShot = !showProShot;
      setShowProShot(nextShowProShot);
      if (nextShowProShot) {
        analyzeShot(proShot, referenceQuizAnswers);
      } else if (latestShot) {
        analyzeShot(latestShot, quizAnswers || {});
      }
    };

    const Graph = ({ title, data }: { title: string; data: number[] }) => {
        const peak = data.length
          ? data.reduce((strongest, value) => (Math.abs(value) > Math.abs(strongest) ? value : strongest), data[0])
          : 0;
        const average =
          data.length > 0 ? data.reduce((sum, value) => sum + value, 0) / data.length : 0;
        const precisionMode = title.startsWith('Gyro') ? 'Rotation trace' : 'Acceleration trace';
        const graphTone = title.startsWith('Gyro')
          ? {
              line: '#5AA7FF',
              dot: '#8FC4FF',
              surface: '#F4F8FF',
              grid: 'rgba(37, 84, 124, 0.14)',
              label: '#23425A',
            }
          : {
              line: '#23A26D',
              dot: '#61C594',
              surface: '#F3FBF7',
              grid: 'rgba(16, 72, 46, 0.12)',
              label: '#214537',
            };

        if (!data || data.length === 0) {
            return (
                <View style={styles.plotContainer}>
                    <View style={styles.plotHeader}>
                      <View>
                        <Text style={styles.plotTitle}>{title}</Text>
                        <Text style={styles.plotSubtitle}>Signal unavailable for this capture.</Text>
                      </View>
                      <View style={styles.plotBadge}>
                        <Text style={styles.plotBadgeText}>Awaiting data</Text>
                      </View>
                    </View>
                    <Text style={styles.emptyPlotText}>Capture another shot to populate this motion channel.</Text>
                </View>
            );
        }

        return (
            <View style={styles.plotContainer}>
                <View style={styles.plotHeader}>
                  <View style={styles.plotHeadingBlock}>
                    <Text style={styles.plotTitle}>{title}</Text>
                    <Text style={styles.plotSubtitle}>{precisionMode}</Text>
                  </View>
                  <View style={styles.plotBadge}>
                    <Text style={styles.plotBadgeText}>{data.length} frames</Text>
                  </View>
                </View>
                <View style={styles.metricRow}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Peak</Text>
                    <Text style={styles.metricValue}>{peak.toFixed(2)}</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metricCard}>
                    <Text style={styles.metricLabel}>Average</Text>
                    <Text style={styles.metricValue}>{average.toFixed(2)}</Text>
                  </View>
                </View>
                <View style={[styles.chartShell, { backgroundColor: graphTone.surface }]}>
                  <LineChart
                      data={{
                          labels: data.map((_, index) => (index % 5 === 0 ? index.toString() : '')),
                          datasets: [
                            {
                              data,
                              color: () => graphTone.line,
                              strokeWidth: 3,
                            },
                          ],
                      }}
                      width={width - 108}
                      height={220}
                      withVerticalLines={false}
                      withOuterLines={false}
                      withInnerLines
                      withHorizontalLabels
                      withVerticalLabels
                      withDots
                      withShadow={false}
                      segments={4}
                      chartConfig={{
                          backgroundColor: graphTone.surface,
                          backgroundGradientFrom: graphTone.surface,
                          backgroundGradientTo: graphTone.surface,
                          decimalPlaces: 2,
                          color: () => graphTone.line,
                          labelColor: () => graphTone.label,
                          style: { borderRadius: 18 },
                          propsForDots: {
                            r: '3',
                            strokeWidth: '2',
                            stroke: graphTone.line,
                            fill: graphTone.dot,
                          },
                          propsForBackgroundLines: {
                            stroke: graphTone.grid,
                            strokeDasharray: '',
                          },
                          propsForLabels: {
                            fontSize: 10,
                          },
                        }}
                      bezier
                      style={styles.chartCanvas}
                  />
                </View>
            </View>
        );
    };

    return (
      <View style={styles.mainContainer}>
        <ScrollView
            style={styles.scrollContainer}
            indicatorStyle={'black'}
            contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.heroCard}>
            <View style={styles.heroTopRow}>
              <View style={styles.heroTitleWrap}>
                <Text style={styles.heroEyebrow}>Performance Dashboard</Text>
                <Text style={styles.heroTitle}>Shot Room</Text>
                <Text style={styles.heroSubtitle}>
                  Review the latest cue delivery, compare it to the reference stroke, and turn feedback into a better next rep.
                </Text>
              </View>
              <View style={[styles.scoreDial, { backgroundColor: scoreTone.soft, borderColor: scoreTone.track }]}>
                <Text style={[styles.scoreDialValue, { color: scoreTone.text }]}>{smoothnessScore}</Text>
                <Text style={[styles.scoreDialLabel, { color: scoreTone.accent }]}>Smoothness</Text>
              </View>
            </View>
            <View style={styles.readinessRow}>
              <View style={[styles.readinessBadge, { backgroundColor: scoreTone.accent }]}>
                <Ionicons name="flash" size={14} color={CueTheme.colors.rail} />
                <Text style={styles.readinessBadgeText}>{readinessLabel}</Text>
              </View>
              <Text style={styles.readinessHint}>
                {shotReady
                  ? 'Smoothness score is calculated from your motion data, then Groq turns that into the coach summary.'
                  : 'Waiting for a fresh captured shot.'}
              </Text>
            </View>
            <View style={styles.statusGrid}>
              {statusCards.map((card) => (
                <View key={card.label} style={styles.statusCard}>
                  <Text style={styles.statusLabel}>{card.label}</Text>
                  <Text style={styles.statusValue} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.85}>
                    {card.value}
                  </Text>
                </View>
              ))}
            </View>
            <View style={styles.focusStrip}>
              {focusPoints.map((point) => (
                <View key={point} style={styles.focusPill}>
                  <Ionicons name="ellipse" size={8} color={CueTheme.colors.brass} />
                  <Text style={styles.focusPillText}>{point}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={[styles.analysisContainer, { alignItems: 'center' }]}>  
          <View style={styles.analysisHeader}>
            <View style={styles.analysisHeaderText}>
              <Text style={[styles.analysisTitle, { justifyContent: 'center' }]}>Coach Summary</Text>
              <Text style={styles.analysisSubtext}>AI readout based on motion consistency and table outcome.</Text>
            </View>
              {shotAnalysis && (
                <TouchableOpacity onPress={speakAnalysis} style={styles.speakButton}>
                  <MaterialIcons name="volume-up" size={24} color={CueTheme.colors.rail} />
                </TouchableOpacity>
              )}
              </View>
              {loading ? <ActivityIndicator size="small" color="#0000ff" /> : 
              <Text style={styles.description}>{shotAnalysis}</Text>}
          </View>
            {showProShot ? (
                <View style={styles.chartSection}>
                    <Text style={styles.title}>Professional Reference</Text>
                    <Text style={styles.sectionHint}>Use this as the target shape for rhythm, tempo, and strike stability.</Text>
                    <Graph title="Accel X" data={proShot.accelX} />
                    <Graph title="Accel Y" data={proShot.accelY} />
                    <Graph title="Accel Z" data={proShot.accelZ} />
                    <Graph title="Gyro X" data={proShot.gyroX} />
                    <Graph title="Gyro Y" data={proShot.gyroY} />
                    <Graph title="Gyro Z" data={proShot.gyroZ} />
                </View>
            ) : latestShot ? (
                <View style={styles.chartSection}>
                    <Text style={styles.title}>Latest Shot</Text>
                    <Text style={styles.sectionHint}>Your captured motion curves, ready to compare against the reference stroke.</Text>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      style={styles.lessonCard}
                      onPress={() =>
                        router.push({
                          pathname: '/Information',
                          params: {
                            focus: lessonRecommendation.focus,
                            videoId: lessonRecommendation.videoId,
                            title: lessonRecommendation.title,
                            coach: lessonRecommendation.coach,
                            reason: lessonRecommendation.reason,
                          },
                        })
                      }
                    >
                      <View style={styles.lessonIconWrap}>
                        <Ionicons name="logo-youtube" size={18} color={CueTheme.colors.rail} />
                      </View>
                      <View style={styles.lessonTextWrap}>
                        <Text style={styles.lessonEyebrow}>Recommended Lesson</Text>
                        <Text style={styles.lessonTitle}>{lessonRecommendation.title}</Text>
                        <Text style={styles.lessonHint}>{lessonRecommendation.reason}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={CueTheme.colors.rail} />
                    </TouchableOpacity>
                    <Graph title="Accel X" data={latestShot.accelX} />
                    <Graph title="Accel Y" data={latestShot.accelY} />
                    <Graph title="Accel Z" data={latestShot.accelZ} />
                    <Graph title="Gyro X" data={latestShot.gyroX} />
                    <Graph title="Gyro Y" data={latestShot.gyroY} />
                    <Graph title="Gyro Z" data={latestShot.gyroZ} />
                </View>
            ) : (
                <View style={styles.chartSection}>
                    <Text style={styles.title}>Latest Shot</Text>
                    <Text style={styles.emptyStateText}>No shot data available yet. Capture a new attempt to populate the dashboard.</Text>
                </View>
            )}
        </ScrollView>

        <View style={styles.buttonContainer}>
          <View style={styles.buttonPanel}>
            <GoldButton
                onPress={handleToggleShotView}
                width={width * 0.84}
                style={styles.awesomeButton}
            >
                {showProShot ? 'Back to Your Shot' : 'View Professional\'s Shot'}
            </GoldButton>
            <GoldButton
                onPress={() => router.replace('/Intro')}
                width={width * 0.84}
                style={styles.quizButton}
            >
                New Shot
            </GoldButton>
          </View>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    width: '100%',
    backgroundColor: CueTheme.colors.feltDeep,
    borderRadius: 28,
    padding: 22,
    marginBottom: 22,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.22)',
    ...cueShadow,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  heroTitleWrap: {
    flex: 1,
  },
  heroEyebrow: {
    color: CueTheme.colors.brass,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  heroTitle: {
    color: CueTheme.colors.chalk,
    fontSize: 30,
    fontWeight: '800',
    marginBottom: 8,
  },
  heroSubtitle: {
    color: CueTheme.colors.mist,
    fontSize: 14,
    lineHeight: 21,
  },
  scoreDial: {
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(247, 244, 236, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.28)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  scoreDialValue: {
    color: CueTheme.colors.chalk,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 30,
  },
  scoreDialLabel: {
    color: CueTheme.colors.mist,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    lineHeight: 10,
    textAlign: 'center',
    width: 78,
  },
  readinessRow: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  readinessBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: CueTheme.colors.brass,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  readinessBadgeText: {
    color: CueTheme.colors.rail,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  readinessHint: {
    flex: 1,
    color: CueTheme.colors.mist,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'right',
  },
  statusGrid: {
    flexDirection: 'row',
    marginTop: 18,
    justifyContent: 'space-between',
    gap: 10,
  },
  statusCard: {
    flex: 1,
    backgroundColor: 'rgba(247, 244, 236, 0.1)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.18)',
  },
  statusLabel: {
    color: CueTheme.colors.mist,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  statusValue: {
    color: CueTheme.colors.chalk,
    fontSize: 17,
    fontWeight: '800',
    textAlign: 'center',
  },
  focusStrip: {
    marginTop: 14,
    gap: 10,
  },
  focusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(247, 244, 236, 0.08)',
    borderRadius: 14,
    paddingVertical: 9,
    paddingHorizontal: 12,
  },
  focusPillText: {
    color: CueTheme.colors.chalk,
    fontSize: 13,
    lineHeight: 18,
  },
  analysisContainer: {
    backgroundColor: CueTheme.colors.card,
    padding: 25,
    borderRadius: 24,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    alignItems: 'center',
    width: '100%',
    ...cueShadow,
  },
  analysisHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 6,
  },
  analysisHeaderText: {
    flex: 1,
  },
  analysisTitle: {
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
    marginTop: 4,
    color: CueTheme.colors.rail,
    alignItems: 'center',
  },
  analysisSubtext: {
    color: CueTheme.colors.slateSoft,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 6,
  },
  speakButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CueTheme.colors.cardAlt,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
  },
  description: {
      fontSize: 16,
      color: CueTheme.colors.slateSoft,
      marginBottom: 5,
      lineHeight: 24,
      width: '100%',
      alignSelf: 'stretch',
      textAlign: 'left',
      flexShrink: 1,
      paddingBottom: 4,
  },
  mainContainer: {
      flex: 1,
      backgroundColor: CueTheme.colors.felt,
  },
  scrollContainer: {
      flex: 1,
      padding: 20,
  },
  scrollContent: {
      alignItems: 'center',
      paddingBottom: 18,
  },
  title: {
      fontSize: 22,
      fontWeight: '800',
      marginTop: 4,
      marginBottom: 8,
      color: CueTheme.colors.chalk,
      letterSpacing: 0.4,
  },
  chartSection: {
      width: '100%',
      alignItems: 'center',
  },
  sectionHint: {
      color: CueTheme.colors.mist,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 18,
      textAlign: 'center',
      maxWidth: 320,
  },
  plotContainer: {
      marginBottom: 18,
      backgroundColor: '#FBF7EE',
      borderRadius: 24,
      padding: 18,
      borderWidth: 1,
      borderColor: 'rgba(16, 56, 44, 0.08)',
      ...cueShadow,
  },
  plotHeader: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      gap: 12,
      marginBottom: 14,
  },
  plotHeadingBlock: {
      flex: 1,
  },
  plotTitle: {
      fontSize: 15,
      fontWeight: '800',
      color: CueTheme.colors.feltDark,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
  },
  plotSubtitle: {
      color: '#5B6C65',
      fontSize: 12,
      lineHeight: 17,
      marginTop: 4,
  },
  plotBadge: {
      backgroundColor: 'rgba(7, 42, 35, 0.06)',
      borderRadius: 999,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: 'rgba(7, 42, 35, 0.08)',
  },
  plotBadgeText: {
      color: CueTheme.colors.feltDark,
      fontSize: 11,
      fontWeight: '800',
      letterSpacing: 0.6,
      textTransform: 'uppercase',
  },
  metricRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#F3E8C8',
      borderRadius: 18,
      paddingVertical: 12,
      paddingHorizontal: 14,
      marginBottom: 14,
      borderWidth: 1,
      borderColor: 'rgba(127, 100, 41, 0.1)',
  },
  metricCard: {
      flex: 1,
  },
  metricDivider: {
      width: 1,
      alignSelf: 'stretch',
      backgroundColor: 'rgba(7, 42, 35, 0.1)',
      marginHorizontal: 14,
  },
  metricLabel: {
      color: '#6C5A2A',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.7,
      textTransform: 'uppercase',
      marginBottom: 4,
  },
  metricValue: {
      color: CueTheme.colors.feltDark,
      fontSize: 20,
      fontWeight: '800',
  },
  chartShell: {
      borderRadius: 20,
      paddingVertical: 10,
      paddingHorizontal: 8,
      borderWidth: 1,
      borderColor: 'rgba(17, 53, 44, 0.08)',
  },
  chartCanvas: {
      marginTop: 2,
      borderRadius: 18,
      alignSelf: 'center',
  },
  buttonContainer: {
      padding: 20,
      justifyContent: 'flex-end',
      alignItems: 'center',
      backgroundColor: CueTheme.colors.feltDark,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTopWidth: 1,
      borderColor: 'rgba(215, 181, 109, 0.18)',
  },
  buttonPanel: {
      width: '100%',
      alignItems: 'center',
      maxWidth: 380,
  },
  awesomeButton: {
      alignSelf: 'center',
  },
  quizButton: {
      alignSelf: 'center',
      marginTop: 10,
  },
  emptyPlotText: {
      color: '#5B6C65',
      fontSize: 14,
      lineHeight: 20,
  },
  lessonCard: {
      width: '100%',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: CueTheme.colors.card,
      borderRadius: 22,
      padding: 16,
      marginBottom: 18,
      borderWidth: 1,
      borderColor: CueTheme.colors.line,
      ...cueShadow,
  },
  lessonIconWrap: {
      width: 42,
      height: 42,
      borderRadius: 21,
      backgroundColor: CueTheme.colors.brass,
      alignItems: 'center',
      justifyContent: 'center',
  },
  lessonTextWrap: {
      flex: 1,
  },
  lessonEyebrow: {
      color: CueTheme.colors.slateSoft,
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 4,
  },
  lessonTitle: {
      color: CueTheme.colors.rail,
      fontSize: 16,
      fontWeight: '800',
      marginBottom: 4,
  },
  lessonHint: {
      color: CueTheme.colors.slateSoft,
      fontSize: 13,
      lineHeight: 18,
  },
  emptyStateText: {
      color: CueTheme.colors.mist,
      fontSize: 15,
      lineHeight: 21,
      textAlign: 'center',
      maxWidth: 300,
  },
});
