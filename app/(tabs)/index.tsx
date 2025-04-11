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
//                     'Authorization': `Bearer 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`, // Replace with your OpenAI key
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
import { FIREBASE_DB } from '../../FirebaseConfig';
import { getAuth } from 'firebase/auth';
import { LineChart } from 'react-native-chart-kit';
import AwesomeButton from 'react-native-really-awesome-button';
import { useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import * as Speech from 'expo-speech';
import { MaterialIcons } from '@expo/vector-icons';
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

    const [quizAnswers, setQuizResults] = useState<{ [key: string]: boolean } | null>(null);
    const [shotAnalysis, setShotAnalysis] = useState<string>('Loading analysis...');
    const [loading, setLoading] = useState<boolean>(false);
    const [showProShot, setShowProShot] = useState<boolean>(false);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchLatestShot = async () => {
            try {
                const auth = getAuth();
                const user = auth.currentUser;
                if (!user) return;

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
                    analyzeShot(latestDoc);
                }
            } catch (error) {
                console.error('Error fetching latest shot:', error);
            }
        };
        fetchLatestShot();
    }, []);

    const analyzeShot = async (shotData: any) => {
        setLoading(true);
    
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
            const parsedQuizAnswers: Record<string, boolean> = Object.fromEntries(
                Object.entries(quizAnswers || {}).map(([key, value]) => [
                    questionMapping[Number(key)], // Convert key to number
                    String(value).toLowerCase() === "yes" // Normalize comparison
                ])
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
    
                Generate a concise, engaging evaluation of the shot, considering smoothness, legality, and quiz results. If the smoothness is not less than 0.2 then it was not a good shot. Fromm the quiz, if the answers were that if the shot was legal, and the ball was potted, and no foul commited as well then it was a great shot. 
                Format the response naturally as a coach giving feedback. Give recommendations and tips on how to improve the shot as well.
            `;
    
            // Fetch AI-generated analysis (Use environment variable for API key)
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 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`, // Use env variable
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: [{ role: 'user', content: prompt }],
                    max_tokens: 200,
                }),
            });
    
            if (!response.ok) throw new Error(`OpenAI API Error: ${response.statusText}`);
    
            const botResponse = await response.json();
            const responseText = botResponse?.choices?.[0]?.message?.content || "Couldn't analyze the shot.";
    
            setShotAnalysis(responseText);
        } catch (error) {
            console.error('Error analyzing shot:', error);
            setShotAnalysis('Error analyzing shot.');
        } finally {
            setLoading(false);
        }
    };
    
    const speakAnalysis = () => {
      Speech.speak(shotAnalysis, { language: 'en' });
    };

    const Graph = ({ title, data }: { title: string; data: number[] }) => { // Corrected type here
        if (!data || data.length === 0) {
            return (
                <View style={styles.plotContainer}>
                    <Text style={styles.plotTitle}>{title}</Text>
                    <Text>No data available</Text>
                </View>
            );
        }

        return (
            <View style={styles.plotContainer}>
                <Text style={styles.plotTitle}>{title}</Text>
                <LineChart
                    data={{
                        labels: data.map((_, index) => (index % 5 === 0 ? index.toString() : '')),
                        datasets: [{ data }],
                    }}
                    width={width - 40}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#e2e2e2',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        decimalPlaces: 2,
                        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: { borderRadius: 16 },
                        propsForDots: { r: '2', strokeWidth: '1', stroke: '#ffa726' },
                    }}
                    bezier
                    style={{ marginVertical: 8, borderRadius: 16 }}
                />
            </View>
        );
    };

    const proShot = {
    accelX: [0.07983, 0.0835, 0.03174, 0.0791, 0.09106, 0.0813, 0.09204, 0.0625, 0.05835, 0.04565, 0.07446, 0.06787, 0.04565, 0.01978, 0.13672, 0.12524, 0.05615, -0.10278, -0.55811, -0.46924, -0.48364, 0.63989, -0.52515, -0.11548, 0.25562, 0.0437, 0.10571, 0.0481, -0.11597, 0.0647, 0.01855, -0.0105, -0.02539, 0.01392, -0.04346, -0.04297, 0.01953, 0.07153, -0.06201, -0.03271],
    accelY: [-0.30469, -0.25928, -0.17798, -0.1792, -0.22388, -0.25, -0.22803, -0.21216, -0.18115, -0.21851, -0.23462, -0.31348, -0.25122, -0.15869, -0.25293, -0.00439, 0.78491, 1.99994, 1.99994, -2.0, -2.0, -0.47534, 0.31348, 0.00952, -0.10425, -0.11401, -0.11792, 0.00024, -0.05151, -0.06006, -0.03564, -0.0166, -0.03931, -0.0564, -0.01416, -0.05762, -0.04126, -0.0293, -0.04419, -0.0293],
    accelZ: [1.0022, 0.94824, 0.94434, 0.95874, 0.948, 1.01831, 1.00513, 1.03931, 1.01904, 0.99194, 1.02441, 1.0, 1.05811, 1.1394, 1.13354, 0.99268, -0.17529, -0.60571, 0.68066, 1.64526, 0.37012, 1.09912, 1.8689, 0.97974, 0.85352, 0.96362, 1.08374, 0.89575, 0.95923, 1.09937, 0.9436, 1.0625, 0.97485, 0.94336, 1.03198, 0.93774, 0.98657, 1.0603, 0.98218, 0.99512],
    gyroX: [-1.41221, 0.9313, 0.40458, 1.16031, 1.0458, 1.38168, 1.22901, 0.60305, 0.71756, -0.90076, 0.77099, -2.29008, 0.01527, -2.06107, -6.49618, -6.9084, 10.81679, 25.20611, 250.12978, 28.32061, 21.98473, 48.40458, 2.72519, -6.81679, -5.20611, -5.1374, 1.92366, 2.87786, -0.92366, 1.22137, 1.24427, -1.1145, 0.10687, -0.40458, -0.46565, 0.9313, 1.66412, 0.58779, 0.58779, -0.03817],
    gyroY: [-2.51145, -7.08397, -5.45038, 4.77099, 8.0458, 4.20611, 6.98473, 1.89313, -0.33588, 5.38168, -11.16794, 13.19084, -14.41221, -9.32061, -7.67939, -22.84733, 75.12214, 104.9542, 12.54962, -114.82442, 48.35115, -13.94656, -22.07634, 18.0916, 5.48092, 14.19084, 5.26718, -1.21374, -0.78626, -3.69466, 1.67176, -3.76336, -3.94656, -5.33588, 4.94656, 9.57252, 0.64885, 2.93893, 4.9084, -0.38931],
    gyroZ: [0.77863, 0.81679, -0.12977, -1.27481, -1.00763, -0.61832, -0.64885, -0.61069, -0.80153, -0.92366, -0.74809, -1.70229, -1.15267, -2.06107, -2.90076, -1.25954, -88.28244, 17.0687, 250.12978, -9.51908, 8.73282, -4.78626, -9.38168, -3.77863, -10.67176, -6.92366, 0.53435, -1.94656, -0.70992, 0.9542, -0.64122, 0.28244, 0.56489, -0.25954, -0.83206, -3.34351, -1.48855, -0.10687, -0.20611, -0.61069],
    };

    return (
      <View style={styles.mainContainer}>
        <ScrollView
            style={styles.scrollContainer}
            indicatorStyle={'black'}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center' }} // Add this line
        >
          <View style={[styles.analysisContainer, { alignItems: 'center' }]}>  
          <View style={{ flexDirection: 'row',  alignItems: 'center', width: '100%' }}>
              <Text style={[styles.analysisTitle, { justifyContent: 'center' }]}>Shot Analysis</Text>
              {shotAnalysis && (
                <TouchableOpacity onPress={speakAnalysis} style={{ padding: 10 }}>
                  <MaterialIcons name="volume-up" size={24} color="black" />
                </TouchableOpacity>
              )}
              </View>
              {loading ? <ActivityIndicator size="small" color="#0000ff" /> : 
              <Text style={[styles.description, { textAlign: 'justify' }]}>{shotAnalysis}</Text>}
          </View>
            {showProShot ? (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>Professional's Shot</Text>
                    <Graph title="Accel X" data={proShot.accelX} />
                    <Graph title="Accel Y" data={proShot.accelY} />
                    <Graph title="Accel Z" data={proShot.accelZ} />
                    <Graph title="Gyro X" data={proShot.gyroX} />
                    <Graph title="Gyro Y" data={proShot.gyroY} />
                    <Graph title="Gyro Z" data={proShot.gyroZ} />
                </View>
            ) : latestShot ? (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>Latest Shot</Text>
                    <Graph title="Accel X" data={latestShot.accelX} />
                    <Graph title="Accel Y" data={latestShot.accelY} />
                    <Graph title="Accel Z" data={latestShot.accelZ} />
                    <Graph title="Gyro X" data={latestShot.gyroX} />
                    <Graph title="Gyro Y" data={latestShot.gyroY} />
                    <Graph title="Gyro Z" data={latestShot.gyroZ} />
                </View>
            ) : (
                <View style={{ alignItems: 'center' }}>
                    <Text style={styles.title}>Latest Shot</Text>
                    <Text>No shot data available.</Text>
                </View>
            )}
        </ScrollView>

          <View style={styles.buttonContainer}>
          <AwesomeButton
              onPress={() => setShowProShot(!showProShot)}
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
              {showProShot ? 'Back to Your Shot' : 'View Professional\'s Shot'}
          </AwesomeButton>
          <AwesomeButton
              onPress={() => router.replace('/Intro')}
              backgroundColor="#FFD700"
              backgroundDarker="#DAA520"
              width={width * 0.8}
              borderRadius={30}
              textSize={15}
              textColor="#000"
              textFontFamily="System"
              raiseLevel={5}
              paddingHorizontal={30}
              style={styles.quizButton}
          >
              New Shot
          </AwesomeButton>
          </View>
      </View>
  );
}

const styles = StyleSheet.create({
  analysisContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
    alignItems: 'center', // Center content
  },
  analysisTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 20, marginTop: 20, alignItems: 'center' },
  description: {
      fontSize: 16,
      color: '#333',
      marginBottom: 5,
      fontFamily: 'Poppins-Regular', 
      lineHeight: 24,
  },
  mainContainer: {
      flex: 1,
  },
  scrollContainer: {
      flex: 1,
      padding: 20,
  },
  title: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 20,
  },
  plotContainer: {
      marginBottom: 20,
  },
  plotTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
  },
  buttonContainer: {
      padding: 20,
      justifyContent: 'flex-end',
      alignItems: 'center', // Add this line
  },
  awesomeButton: {
      alignSelf: 'stretch',
  },
  quizButton: {
      alignSelf: 'stretch',
      marginTop: 10,
  },
});