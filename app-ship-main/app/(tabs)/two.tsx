// import { Button, StyleSheet } from 'react-native';
// import { Text, View } from '@/components/Themed';
// import { FIREBASE_AUTH } from '@/FirebaseConfig';


// export default function TabTwoScreen() {
//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Tab Two</Text>
//       <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
//       <Button title="Sign Out" onPress={() => FIREBASE_AUTH.signOut()} />
//       {/* Account deletion required in IOS store */}
//       <Button title="Delete Account" onPress={() => FIREBASE_AUTH.currentUser?.delete()} />
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

// import React, { useEffect, useState } from 'react';
// import {
//   Button,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   View,
//   Dimensions,
// } from 'react-native';
// import { Text } from '@/components/Themed';
// import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import { doc, getDocs, collection, getDoc } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LineChart } from 'react-native-chart-kit';

// export default function TabTwoScreen() {
//   const [userPhoto, setUserPhoto] = useState<string | null>(null);
//   const [username, setUsername] = useState<string>('');
//   const [shots, setShots] = useState<any[]>([]);
//   const [selectedShot, setSelectedShot] = useState<any | null>(null);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
//         const userDocSnapshot = await getDoc(userDocRef);
//         if (userDocSnapshot.exists()) {
//           const userData = userDocSnapshot.data();
//           setUsername(userData.username || '');
//         }

//         try {
//           const storedImage = await AsyncStorage.getItem('userPhoto');
//           if (typeof storedImage === 'string') {
//             setUserPhoto(`data:image/jpeg;base64,${storedImage}`);
//           } else {
//             setUserPhoto('https://via.placeholder.com/150');
//           }
//         } catch (error) {
//           console.error('Error retrieving image from AsyncStorage:', error);
//         }

//         const shotsCollectionRef = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//         const shotsSnapshot = await getDocs(shotsCollectionRef);
//         const shotsData = shotsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
//         setShots(shotsData);
//       }
//     };
//     fetchUserData();
//   }, [user]);

//   const pickImage = async (fromCamera: boolean) => {
//     let result = fromCamera
//       ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true })
//       : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true });

//     if (!result.canceled && result.assets && result.assets.length > 0) {
//       const selectedAsset = result.assets[0];
//       const base64Image = selectedAsset.base64;

//       if (typeof base64Image === 'string') {
//         try {
//           await AsyncStorage.setItem('userPhoto', base64Image);
//           setUserPhoto(`data:image/jpeg;base64,${base64Image}`);
//         } catch (error) {
//           console.error('Error storing image in AsyncStorage:', error);
//         }
//       } else {
//         console.error('Invalid base64 image data.');
//       }
//     }
//   };

//   const displayShotData = (shot: any) => {
//     setSelectedShot(shot);
//   };

//   const renderShotDetails = () => {
//     if (!selectedShot) return null;

//     const chartConfig = {
//       backgroundGradientFrom: '#fff',
//       backgroundGradientTo: '#fff',
//       color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//       strokeWidth: 2,
//       useShadowColorFromDataset: false,
//     };

//     const width = Dimensions.get('window').width;

//     const renderPlot = (title: string, data: number[]) => {
//       if (!data || data.length === 0) {
//         return (
//           <View style={styles.plotContainer}>
//             <Text style={styles.plotTitle}>{title}</Text>
//             <Text>No data available</Text>
//           </View>
//         );
//       }

//       return (
//         <View style={styles.plotContainer}>
//           <Text style={styles.plotTitle}>{title}</Text>
//           <LineChart
//             data={{
//               labels: data.map((_, index: number) => (index % 5 === 0 ? index.toString() : '')),
//               datasets: [
//                 {
//                   data: data,
//                 },
//               ],
//             }}
//             width={width - 40}
//             height={220}
//             yAxisLabel=""
//             yAxisSuffix=""
//             yAxisInterval={10}
//             chartConfig={{
//               backgroundColor: '#e2e2e2',
//               backgroundGradientFrom: '#eff3ff',
//               backgroundGradientTo: '#efefef',
//               decimalPlaces: 2,
//               color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//               },
//               propsForDots: {
//                 r: '2',
//                 strokeWidth: '1',
//                 stroke: '#ffa726',
//               },
//             }}
//             bezier
//             style={{
//               marginVertical: 8,
//               borderRadius: 16,
//             }}
//           />
//         </View>
//       );
//     };

//     return (
//       <View style={styles.shotDetailsContainer}>
//         <Button title="Back to Profile" onPress={() => setSelectedShot(null)} />
//         <Text style={styles.shotDetailsTitle}>Shot {selectedShot.id} Details</Text>

//         {renderPlot('Accel X', selectedShot.accelX || [])}
//         {renderPlot('Accel Y', selectedShot.accelY || [])}
//         {renderPlot('Accel Z', selectedShot.accelZ || [])}
//         {renderPlot('Gyro X', selectedShot.gyroX || [])}
//         {renderPlot('Gyro Y', selectedShot.gyroY || [])}
//         {renderPlot('Gyro Z', selectedShot.gyroZ || [])}
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.container}>
//       {selectedShot ? (
//         renderShotDetails()
//       ) : (
//         <View>
//           <View style={styles.profileHeader}>
//             <TouchableOpacity onPress={() => pickImage(false)}>
//               <Image source={{ uri: userPhoto || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
//             </TouchableOpacity>
//             <Text style={styles.username}>{username}</Text>
//             <Button title="Take Photo" onPress={() => pickImage(true)} />
//           </View>

//           <Text style={styles.shotsTitle}>Your Shots</Text>
//           {shots.map(shot => (
//             <TouchableOpacity key={shot.id} style={styles.shotButton} onPress={() => displayShotData(shot)}>
//               <Text>Shot {shot.id}</Text>
//             </TouchableOpacity>
//           ))}

//           <Button title="Sign Out" onPress={() => FIREBASE_AUTH.signOut()} />
//           <Button title="Delete Account" onPress={() => user?.delete()} />
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     marginBottom: 10,
//   },
//   username: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   shotsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//   },
//   shotButton: {
//     backgroundColor: '#eee',
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   shotDetailsContainer: {
//     padding: 20,
//   },
//   shotDetailsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   quizTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 10,
//   },
//   quizAnswer: {
//     flexDirection: 'row',
//     marginTop: 5,
//   },
//   quizQuestion: {
//     fontWeight: 'bold',
//     marginRight: 5,
//   },
//   plotContainer: {
//     marginBottom: 20,
//   },
//   plotTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
// });

// -----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import {
//   Button,
//   StyleSheet,
//   Image,
//   ScrollView,
//   TouchableOpacity,
//   View,
//   Dimensions,
// } from 'react-native';
// import { Text } from '@/components/Themed';
// import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import { doc, getDocs, collection, getDoc } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LineChart } from 'react-native-chart-kit';
// import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for camera icon

// export default function TabTwoScreen() {
//   const [userPhoto, setUserPhoto] = useState<string | null>(null);
//   const [username, setUsername] = useState<string>('');
//   const [shots, setShots] = useState<any[]>([]);
//   const [selectedShot, setSelectedShot] = useState<any | null>(null);

//   const auth = getAuth();
//   const user = auth.currentUser;

//   useEffect(() => {
//     const fetchUserData = async () => {
//       if (user) {
//         const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
//         const userDocSnapshot = await getDoc(userDocRef);
//         if (userDocSnapshot.exists()) {
//           const userData = userDocSnapshot.data();
//           setUsername(userData.username || '');
//         }

//         try {
//           const userId = user.uid; // Get the user's ID
//           const storedImage = await AsyncStorage.getItem(`userPhoto_${userId}`); // Include userId in the key

//           if (typeof storedImage === 'string') {
//               setUserPhoto(`data:image/jpeg;base64,${storedImage}`);
//           } else {
//               setUserPhoto('https://via.placeholder.com/150');
//           }
//         } catch (error) {
//             console.error('Error retrieving image from AsyncStorage:', error);
//         }

//         const shotsCollectionRef = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//         const shotsSnapshot = await getDocs(shotsCollectionRef);
//         const shotsData = shotsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
//         setShots(shotsData);
//       }
//     };
//     fetchUserData();
//   }, [user]);

//   const pickImage = async (fromCamera: boolean) => {
//     let result = fromCamera
//       ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true })
//       : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true });

//       if (!result.canceled && result.assets && result.assets.length > 0) {
//         const selectedAsset = result.assets[0];
//         const base64Image = selectedAsset.base64;

//         if (typeof base64Image === 'string' && user) { // Add check for user
//             try {
//                 const userId = user.uid; // Get the user's ID
//                 await AsyncStorage.setItem(`userPhoto_${userId}`, base64Image); // Include userId in the key
//                 setUserPhoto(`data:image/jpeg;base64,${base64Image}`);
//             } catch (error) {
//                 console.error('Error storing image in AsyncStorage:', error);
//             }
//         } else {
//             console.error('Invalid base64 image data or no user logged in.');
//         }
//     }
//   };

//   const displayShotData = (shot: any) => {
//     setSelectedShot(shot);
//   };

//   const renderShotDetails = () => {
//     if (!selectedShot) return null;

//     const chartConfig = {
//       backgroundGradientFrom: '#fff',
//       backgroundGradientTo: '#fff',
//       color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//       strokeWidth: 2,
//       useShadowColorFromDataset: false,
//     };

//     // const width = Dimensions.get('window').width;
//     const width = Dimensions.get('window').width - 40; // Adjust width for centering

//     const renderPlot = (title: string, data: number[]) => {
//       if (!data || data.length === 0) {
//         return (
//           <View style={styles.plotContainer}>
//             <Text style={styles.plotTitle}>{title}</Text>
//             <Text>No data available</Text>
//           </View>
//         );
//       }

//       return (
//         <View style={styles.plotContainer}>
//           <Text style={styles.plotTitle}>{title}</Text>
//           <LineChart
//             data={{
//               labels: data.map((_, index: number) => (index % 5 === 0 ? index.toString() : '')),
//               datasets: [
//                 {
//                   data: data,
//                 },
//               ],
//             }}
//             width={width - 40}
//             height={220}
//             yAxisLabel=""
//             yAxisSuffix=""
//             yAxisInterval={10}
//             chartConfig={{
//               backgroundColor: '#e2e2e2',
//               backgroundGradientFrom: '#eff3ff',
//               backgroundGradientTo: '#efefef',
//               decimalPlaces: 2,
//               color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//               labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//               style: {
//                 borderRadius: 16,
//               },
//               propsForDots: {
//                 r: '2',
//                 strokeWidth: '1',
//                 stroke: '#ffa726',
//               },
//             }}
//             bezier
//             style={{
//               marginVertical: 8,
//               borderRadius: 16,
//             }}
//           />
//         </View>
//       );
//     };

//     return (
//       <View style={styles.shotDetailsContainer}>
//         <Button title="Back to Profile" onPress={() => setSelectedShot(null)} />
//         <Text style={styles.shotDetailsTitle}>Shot {selectedShot.id} Details</Text>

//         {renderPlot('Accel X', selectedShot.accelX || [])}
//         {renderPlot('Accel Y', selectedShot.accelY || [])}
//         {renderPlot('Accel Z', selectedShot.accelZ || [])}
//         {renderPlot('Gyro X', selectedShot.gyroX || [])}
//         {renderPlot('Gyro Y', selectedShot.gyroY || [])}
//         {renderPlot('Gyro Z', selectedShot.gyroZ || [])}
//       </View>
//     );
//   };

//   return (
//     <ScrollView style={styles.container} indicatorStyle={'black'}>
//       {selectedShot ? (
//         renderShotDetails()
//       ) : (
//         <View>
//           <View style={styles.profileHeader}>
//             <TouchableOpacity onPress={() => pickImage(false)} style={styles.profileImageContainer}>
//               <Image source={{ uri: userPhoto || 'https://via.placeholder.com/150' }} style={styles.profileImage} />
//               <TouchableOpacity onPress={() => pickImage(true)} style={styles.cameraIcon}>
//                 <Ionicons name="camera" size={24} color="black" />
//               </TouchableOpacity>
//             </TouchableOpacity>
//             <Text style={styles.username}>{username}</Text>
//           </View>

//           <Text style={styles.shotsTitle}>Your Shots</Text>
//           {shots.map(shot => (
//             <TouchableOpacity key={shot.id} style={styles.shotButton} onPress={() => displayShotData(shot)}>
//               <Text style={styles.shotText}>Shot {shot.id}</Text>
//             </TouchableOpacity>
//           ))}

//           <Button title="Sign Out" onPress={() => FIREBASE_AUTH.signOut()} />
//           <Button title="Delete Account" onPress={() => user?.delete()} />
//         </View>
//       )}
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   profileHeader: {
//     alignItems: 'center',
//     marginBottom: 20,
//   },
//   profileImageContainer: {
//     position: 'relative',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     marginBottom: 10,
//   },
//   cameraIcon: {
//     position: 'absolute',
//     bottom: 10,
//     right: 10,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 8,
//   },
//   username: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   shotsTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginTop: 20,
//     marginBottom: 10,
//     color: 'black', // Make text visible
//   },
//   shotButton: {
//     backgroundColor: '#f0f0f0', // Using the intended background color
//     padding: 15,
//     borderRadius: 5,
//     marginBottom: 10,
//     alignItems: 'center',
//   },
//   shotText: {
//     color: 'black', // Make text visible
//   },
//   shotDetailsContainer: {
//     padding: 20,
//   },
//   shotDetailsTitle: {
//     fontSize: 20,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
//   plotContainer: {
//     marginBottom: 20,
//   },
//   plotTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginBottom: 10,
//   },
// });

// ----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import {
//     Button,
//     StyleSheet,
//     Image,
//     ScrollView,
//     TouchableOpacity,
//     View,
//     Dimensions,
// } from 'react-native';
// import { Text } from '@/components/Themed';
// import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
// import { getAuth } from 'firebase/auth';
// import { doc, getDocs, collection, getDoc } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LineChart } from 'react-native-chart-kit';
// import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for camera icon

// export default function TabTwoScreen() {
//     const [userPhoto, setUserPhoto] = useState<string | null>(null);
//     const [username, setUsername] = useState<string>('');
//     const [email, setEmail] = useState<string>(''); // Add email state
//     const [shots, setShots] = useState<any[]>([]);
//     const [selectedShot, setSelectedShot] = useState<any | null>(null);

//     const auth = getAuth();
//     const user = auth.currentUser;

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (user) {
//                 const userDocRef = doc(FIREBASE_DB, 'users', user.uid);
//                 const userDocSnapshot = await getDoc(userDocRef);
//                 if (userDocSnapshot.exists()) {
//                     const userData = userDocSnapshot.data();
//                     setUsername(userData.username || '');
//                     setEmail(userData.email || ''); // Fetch and set email
//                 }

//                 try {
//                     const userId = user.uid;
//                     const storedImage = await AsyncStorage.getItem(`userPhoto_${userId}`);

//                     if (typeof storedImage === 'string') {
//                         setUserPhoto(`data:image/jpeg;base64,${storedImage}`);
//                     } else {
//                         setUserPhoto(null);
//                     }
//                 } catch (error) {
//                     console.error('Error retrieving image from AsyncStorage:', error);
//                 }

//                 const shotsCollectionRef = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//                 const shotsSnapshot = await getDocs(shotsCollectionRef);
//                 const shotsData = shotsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }));
//                 setShots(shotsData);
//             }
//         };
//         fetchUserData();
//     }, [user]);

//     const pickImage = async (fromCamera: boolean) => {
//         let result = fromCamera
//             ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true })
//             : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true });

//         if (!result.canceled && result.assets && result.assets.length > 0) {
//             const selectedAsset = result.assets[0];
//             const base64Image = selectedAsset.base64;

//             if (typeof base64Image === 'string' && user) {
//                 try {
//                     const userId = user.uid;
//                     await AsyncStorage.setItem(`userPhoto_${userId}`, base64Image);
//                     setUserPhoto(`data:image/jpeg;base64,${base64Image}`);
//                 } catch (error) {
//                     console.error('Error storing image in AsyncStorage:', error);
//                 }
//             } else {
//                 console.error('Invalid base64 image data or no user logged in.');
//             }
//         }
//     };

//     const displayShotData = (shot: any) => {
//         setSelectedShot(shot);
//     };

//     const renderShotDetails = () => {
//         if (!selectedShot) return null;

//         const chartConfig = {
//             backgroundGradientFrom: '#fff',
//             backgroundGradientTo: '#fff',
//             color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//             strokeWidth: 2,
//             useShadowColorFromDataset: false,
//         };

//         const width = Dimensions.get('window').width - 40;

//         const renderPlot = (title: string, data: number[]) => {
//             if (!data || data.length === 0) {
//                 return (
//                     <View style={styles.plotContainer}>
//                         <Text style={styles.plotTitle}>{title}</Text>
//                         <Text>No data available</Text>
//                     </View>
//                 );
//             }

//             return (
//                 <View style={styles.plotContainer}>
//                     <Text style={styles.plotTitle}>{title}</Text>
//                     <LineChart
//                         data={{
//                             labels: data.map((_, index: number) => (index % 5 === 0 ? index.toString() : '')),
//                             datasets: [
//                                 {
//                                     data: data,
//                                 },
//                             ],
//                         }}
//                         width={width - 40}
//                         height={220}
//                         yAxisLabel=""
//                         yAxisSuffix=""
//                         yAxisInterval={10}
//                         chartConfig={{
//                             backgroundColor: '#e2e2e2',
//                             backgroundGradientFrom: '#eff3ff',
//                             backgroundGradientTo: '#efefef',
//                             decimalPlaces: 2,
//                             color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//                             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                             style: {
//                                 borderRadius: 16,
//                             },
//                             propsForDots: {
//                                 r: '2',
//                                 strokeWidth: '1',
//                                 stroke: '#ffa726',
//                             },
//                         }}
//                         bezier
//                         style={{
//                             marginVertical: 10,
//                             borderRadius: 16,
//                         }}
//                     />
//                 </View>
//             );
//         };

//         return (
//             <View style={styles.shotDetailsContainer}>
//                 <Button title="Back to Profile" onPress={() => setSelectedShot(null)} />
//                 <Text style={[styles.shotDetailsTitle, { color: 'black' }]}>Shot {selectedShot.id} Details</Text>

//                 {renderPlot('Accel X', selectedShot.accelX || [])}
//                 {renderPlot('Accel Y', selectedShot.accelY || [])}
//                 {renderPlot('Accel Z', selectedShot.accelZ || [])}
//                 {renderPlot('Gyro X', selectedShot.gyroX || [])}
//                 {renderPlot('Gyro Y', selectedShot.gyroY || [])}
//                 {renderPlot('Gyro Z', selectedShot.gyroZ || [])}
//             </View>
//         );
//     };

//     return (
//       <ScrollView style={styles.container} indicatorStyle={'black'}>
//           {selectedShot ? (
//               renderShotDetails()
//           ) : (
//               <View>
//                   <View style={styles.profileHeader}>
//                   <TouchableOpacity onPress={() => pickImage(false)} style={styles.profileImageContainer}>
//                       {userPhoto ? (
//                           <Image source={{ uri: userPhoto }} style={styles.profileImage} />
//                       ) : (
//                           <View style={styles.placeholderIcon}>
//                               <Ionicons name="person-circle-outline" size={100} color="gray" />
//                           </View>
//                       )}
//                       <TouchableOpacity onPress={() => pickImage(true)} style={styles.cameraIcon}>
//                           <Ionicons name="camera" size={24} color="black" />
//                       </TouchableOpacity>
//                       <Text style={styles.email}>{email}</Text> {/* Wrap email in a Text component */}
//                   </TouchableOpacity>
//                       <Text style={styles.username}>{username}</Text>
//                   </View>

//                   <Text style={styles.shotsTitle}>Your Shots</Text>
//                   {shots.map(shot => (
//                       <TouchableOpacity key={shot.id} style={styles.shotButton} onPress={() => displayShotData(shot)}>
//                           <Text style={styles.shotText}>Shot {parseInt(shot.id) + 1}</Text> {/* Add 1 to shot ID */}
//                       </TouchableOpacity>
//                   ))}

//                   <Button title="Sign Out" onPress={() => FIREBASE_AUTH.signOut()} />
//                   <Button title="Delete Account" onPress={() => user?.delete()} />
//               </View>
//           )}
//       </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//       flex: 1,
//       padding: 20,
//   },
//   profileHeader: {
//       alignItems: 'center',
//       marginBottom: 20,
//       backgroundColor: '#FFD700', // Add yellow background
//       padding: 20,
//       borderRadius: 10,
//   },
//   profileImageContainer: {
//       position: 'relative',
//       alignItems: 'center',
//       justifyContent: 'center',
//   },
//   profileImage: {
//       width: 150,
//       height: 150,
//       borderRadius: 75,
//       marginBottom: 10,
//       borderWidth: 2,
//       borderColor: 'gray',
//   },
//   placeholderIcon: {
//       width: 150,
//       height: 150,
//       borderRadius: 75,
//       justifyContent: 'center',
//       alignItems: 'center',
//       marginBottom: 10,
//       borderWidth: 2,
//       borderColor: 'gray',
//   },
//   cameraIcon: {
//       position: 'absolute',
//       bottom: 10,
//       right: 10,
//       backgroundColor: 'white',
//       borderRadius: 20,
//       padding: 8,
//   },
//   username: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 5, // Reduce spacing
//   },
//   email: {
//       fontSize: 16,
//       color: '#666',
//       marginBottom: 10,
//   },
//   shotsTitle: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginTop: 20,
//       marginBottom: 10,
//       color: 'black',
//   },
//   shotButton: {
//       backgroundColor: '#f0f0f0',
//       padding: 15,
//       borderRadius: 5,
//       marginBottom: 10,
//       alignItems: 'center',
//   },
//   shotText: {
//       color: 'black',
//   },
//   shotDetailsContainer: {
//       padding: 20,
//   },
//   shotDetailsTitle: {
//       fontSize: 20,
//       fontWeight: 'bold',
//       marginBottom: 10,
//       color: 'black',
//   },
//   plotContainer: {
//       marginBottom: 20,
//   },
//   plotTitle: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       marginBottom: 10,
//       color: 'black',
//   },
// });

// ---------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import {
//     StyleSheet,
//     Image,
//     ScrollView,
//     TouchableOpacity,
//     View,
//     Dimensions,
// } from 'react-native';
// import { Text } from '@/components/Themed';
// import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
// import { getAuth, signOut, deleteUser } from 'firebase/auth';
// import { doc, getDocs, collection, getDoc } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LineChart } from 'react-native-chart-kit';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import AwesomeButton from 'react-native-really-awesome-button';

// interface ShotData {
//     id: number;
//     accelX?: number[];
//     accelY?: number[];
//     accelZ?: number[];
//     gyroX?: number[];
//     gyroY?: number[];
//     gyroZ?: number[];
//     // Add other properties as needed
// }

// export default function ProfileScreen() {
//     const [userPhoto, setUserPhoto] = useState<string | null>(null);
//     const [username, setUsername] = useState<string>('');
//     const [email, setEmail] = useState<string>('');
//     const [shots, setShots] = useState<ShotData[]>([]);
//     const [selectedShot, setSelectedShot] = useState<ShotData | null>(null);

//     const auth = getAuth();
//     const user = auth.currentUser;
//     const width = Dimensions.get('window').width;

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (user) {
//                 setUsername(user.displayName || '');
//                 setEmail(user.email || '');
    
//                 try {
//                     const userId = user.uid;
//                     const storedImage = await AsyncStorage.getItem(`userPhoto_${userId}`);
    
//                     if (typeof storedImage === 'string') {
//                         setUserPhoto(`data:image/jpeg;base64,${storedImage}`);
//                     } else {
//                         setUserPhoto(null);
//                     }
//                 } catch (error) {
//                     console.error('Error retrieving image from AsyncStorage:', error);
//                 }
    
//                 const shotsCollectionRef = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//                 const shotsSnapshot = await getDocs(shotsCollectionRef);
//                 const shotsData = shotsSnapshot.docs
//                     .filter(docSnap => docSnap.id !== 'metadata')
//                     .map((docSnap, index) => ({
//                         id: index + 1,
//                         ...docSnap.data(),
//                     })) as ShotData[];
    
//                 setShots(shotsData);
//             }
//         };
//         fetchUserData();
//     }, [user]);

//     const pickImage = async (fromCamera: boolean) => {
//         let result = fromCamera
//             ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true })
//             : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true });

//         if (!result.canceled && result.assets && result.assets.length > 0) {
//             const selectedAsset = result.assets[0];
//             const base64Image = selectedAsset.base64;

//             if (typeof base64Image === 'string' && user) {
//                 try {
//                     const userId = user.uid;
//                     await AsyncStorage.setItem(`userPhoto_${userId}`, base64Image);
//                     setUserPhoto(`data:image/jpeg;base64,${base64Image}`);
//                 } catch (error) {
//                     console.error('Error storing image in AsyncStorage:', error);
//                 }
//             } else {
//                 console.error('Invalid base64 image data or no user logged in.');
//             }
//         }
//     };

//     const handleSignOut = async () => {
//         await signOut(FIREBASE_AUTH);
//         router.replace('/login');
//     };

//     const handleDeleteAccount = async () => {
//         if (user) {
//             await deleteUser(user);
//             router.replace('/login');
//         }
//     };

//     const displayShotData = (shot: ShotData) => {
//         setSelectedShot(shot);
//     };

//     const renderShotDetails = () => {
//         if (!selectedShot) return null;

//         const width = Dimensions.get('window').width - 40;

//         const renderPlot = (title: string, data: number[] | undefined) => {
//           if (!data || data.length === 0) {
//               return (
//                   <View style={styles.plotContainer}>
//                       <Text style={styles.plotTitle}>{title}</Text>
//                       <Text>No data available</Text>
//                   </View>
//               );
//           }
      
//           return (
//               <View style={styles.plotContainer}>
//                   <Text style={styles.plotTitle}>{title}</Text>
//                   <LineChart
//                       data={{
//                           labels: data.map((_, index: number) => (index % 5 === 0 ? index.toString() : '')),
//                           datasets: [
//                               {
//                                   data: data,
//                               },
//                           ],
//                       }}
//                       width={width - 40}
//                       height={220}
//                       yAxisLabel=""
//                       yAxisSuffix=""
//                       yAxisInterval={10}
//                       chartConfig={{
//                           backgroundColor: '#e2e2e2',
//                           backgroundGradientFrom: '#eff3ff',
//                           backgroundGradientTo: '#efefef',
//                           decimalPlaces: 2,
//                           color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//                           labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                           style: {
//                               borderRadius: 16,
//                           },
//                           propsForDots: {
//                               r: '2',
//                               strokeWidth: '1',
//                               stroke: '#ffa726',
//                           },
//                       }}
//                       bezier
//                       style={{
//                           marginVertical: 10,
//                           borderRadius: 16,
//                       }}
//                   />
//               </View>
//           );
//       };

//         return (
//             <View style={styles.shotDetailsContainer}>
//                 <Text style={[styles.shotDetailsTitle, { color: 'black' }]}>Shot {selectedShot.id} Details</Text>

//                 {renderPlot('Accel X', selectedShot.accelX)}
//                 {renderPlot('Accel Y', selectedShot.accelY)}
//                 {renderPlot('Accel Z', selectedShot.accelZ)}
//                 {renderPlot('Gyro X', selectedShot.gyroX)}
//                 {renderPlot('Gyro Y', selectedShot.gyroY)}
//                 {renderPlot('Gyro Z', selectedShot.gyroZ)}

//                 <AwesomeButton
//                     onPress={() => setSelectedShot(null)}
//                     backgroundColor="#FFD700"
//                     backgroundDarker="#DAA520"
//                     width={width * 0.8}
//                     borderRadius={30}
//                     textSize={15}
//                     textColor="#000"
//                     textFontFamily="System"
//                     raiseLevel={5}
//                     paddingHorizontal={30}
//                     style={styles.awesomeButton}
//                 >
//                     Back to Profile
//                 </AwesomeButton>
//             </View>
//         );
//     };

//     return (
//         <ScrollView style={styles.container} indicatorStyle={'black'}>
//             {selectedShot ? (
//                 renderShotDetails()
//             ) : (
//                 <View>
//                     <View style={styles.profileHeader}>
//                         <TouchableOpacity onPress={() => pickImage(false)} style={styles.profileImageContainer}>
//                             {userPhoto ? (
//                                 <Image source={{ uri: userPhoto }} style={styles.profileImage} />
//                             ) : (
//                                 <View style={styles.placeholderIcon}>
//                                     <Ionicons name="person-circle-outline" size={100} color="gray" />
//                                 </View>
//                             )}
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.emailContainer}>
//                         <Ionicons name="mail" size={24} color="#FFCC4D" />
//                         <Text style={styles.email}>{email}</Text>
//                     </View>          
//                     <Text style={styles.shotsTitle}>Your Shots</Text>
//                     {shots.map(shot => (
//                         <TouchableOpacity key={shot.id} style={styles.shotButton} onPress={() => displayShotData(shot)}>
//                             <Text style={styles.shotText}>Shot {shot.id}</Text>
//                         </TouchableOpacity>
//                     ))}

//                     <View style={styles.bottomButtonsContainer}>
//                         <AwesomeButton
//                             onPress={handleSignOut}
//                             backgroundColor="#FFD700"
//                             backgroundDarker="#DAA520"
//                             width={width * 0.8}
//                             borderRadius={30}
//                             textSize={15}
//                             textColor="#000"
//                             textFontFamily="System"
//                             raiseLevel={5}
//                             paddingHorizontal={30}
//                             style={styles.awesomeButton}
//                         >
//                             Sign Out
//                         </AwesomeButton>
//                         <AwesomeButton
//                             onPress={handleDeleteAccount}
//                             backgroundColor="#FFD700"
//                             backgroundDarker="#DAA520"
//                             width={width * 0.8}
//                             borderRadius={30}
//                             textSize={15}
//                             textColor="#000"
//                             textFontFamily="System"
//                             raiseLevel={5}
//                             paddingHorizontal={30}
//                             style={styles.awesomeButton}
//                         >
//                             Delete Account
//                         </AwesomeButton>
//                     </View>
//                     {/* {selectedShot && (
//                         <View style={styles.backButtonContainer}>
//                             <AwesomeButton
//                                 onPress={() => setSelectedShot(null)}
//                                 backgroundColor="#FFD700"
//                                 backgroundDarker="#DAA520"
//                                 width={width * 0.8}
//                                 borderRadius={30}
//                                 textSize={15}
//                                 textColor="#000"
//                                 textFontFamily="System"
//                                 raiseLevel={5}
//                                 paddingHorizontal={30}
//                                 style={styles.awesomeButton}
//                             >
//                                 Back to Profile
//                             </AwesomeButton>
//                         </View>
//                     )} */}
//                 </View>
//             )}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//     container: { flex: 1, padding: 20, backgroundColor: "#F9F9F9" },
//     profileHeader: {
//         alignItems: 'center',
//         marginBottom: 10,
//         backgroundColor: '#FFCC4D',
//         padding: 30,
//         borderTopLeftRadius: 80,
//         borderTopRightRadius: 80,
//         borderBottomLeftRadius: 10,
//         borderBottomRightRadius: 10,
//         borderWidth: 5,
//     },
//     profileImageContainer: {
//         position: 'relative',
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginBottom: 10,
//     },
//     profileImage: {
//         width: 200,
//         height: 200,
//         borderRadius: 100,
//         borderWidth: 5,
//         borderColor: '#DAA520',
//     },
//     emailContainer: {
//         // flexDirection: 'row',
//         alignItems: 'center',
//         backgroundColor: '#F0F0F0', // Light background color (adjust as needed)
//         padding: 20, // Adjust padding as needed
//         borderRadius: 10, // Adjust border radius for rounded corners
//         marginBottom: 10, // Add some spacing below the container
//         borderWidth: 5,
//     },
//     email: {
//         fontSize: 18,
//         fontWeight: 'bold',
//         color: '#666',
//         marginLeft: 10, // Add some spacing between the icon and email
//     },
//     shotsTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: 'black' },
//     shotDetailsContainer: { 
//       padding: 20,
//       alignItems: 'center',
//      },
//     shotDetailsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'black' },
//     plotContainer: { marginBottom: 20 },
//     plotTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' },
//     backButtonContainer: {
//         alignItems: 'center',
//         marginTop: 20,
//         marginBottom: 20,
//     },
//     bottomButtonsContainer: {
//         alignItems: 'center',
//         marginTop: 20,
//         marginBottom: 20,
//     },
//     bottomButton: {
//         minWidth: 120,
//         backgroundColor: '#e0e0e0', // Add background color if needed
//         padding: 15,
//         borderRadius: 8,
//         alignItems: 'center',
//     },
//     shotButton: {
//         backgroundColor: '#e0e0e0',
//         padding: 20,
//         borderRadius: 8,
//         marginBottom: 10,
//         alignItems: 'center',
//         borderWidth: 5,
//     },
//     shotText: {
//         fontSize: 16,
//         color: 'black',
//         fontWeight: 'bold',
//     },
//     placeholderIcon: {
//         width: 100,
//         height: 100,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//     },
//     buttonText: {
//         fontSize: 16,
//         color: 'black',
//     },
//     awesomeButton: {
//         marginBottom: 10,
//     },
// });

// ----------------------------------------------------------------------------------------------------------

// import React, { useEffect, useState } from 'react';
// import {
//     StyleSheet,
//     Image,
//     ScrollView,
//     TouchableOpacity,
//     View,
//     Dimensions,
// } from 'react-native';
// import { Text } from '@/components/Themed';
// import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
// import { getAuth, signOut, deleteUser } from 'firebase/auth';
// import { getDocs, collection } from 'firebase/firestore';
// import * as ImagePicker from 'expo-image-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { LineChart } from 'react-native-chart-kit';
// import { Ionicons } from '@expo/vector-icons';
// import { router } from 'expo-router';
// import AwesomeButton from 'react-native-really-awesome-button';
// import { LinearGradient } from 'expo-linear-gradient';

// interface ShotData {
//     id: number;
//     accelX?: number[];
//     accelY?: number[];
//     accelZ?: number[];
//     gyroX?: number[];
//     gyroY?: number[];
//     gyroZ?: number[];
// }

// export default function ProfileScreen() {
//     const [userPhoto, setUserPhoto] = useState<string | null>(null);
//     const [email, setEmail] = useState<string>('');
//     const [shots, setShots] = useState<ShotData[]>([]);
//     const [selectedShot, setSelectedShot] = useState<ShotData | null>(null);

//     const auth = getAuth();
//     const user = auth.currentUser;
//     const width = Dimensions.get('window').width;

//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (user) {
//                 setEmail(user.email || '');

//                 try {
//                     const userId = user.uid;
//                     const storedImage = await AsyncStorage.getItem(`userPhoto_${userId}`);

//                     if (typeof storedImage === 'string') {
//                         setUserPhoto(`data:image/jpeg;base64,${storedImage}`);
//                     } else {
//                         setUserPhoto(null);
//                     }
//                 } catch (error) {
//                     console.error('Error retrieving image from AsyncStorage:', error);
//                 }

//                 const shotsCollectionRef = collection(FIREBASE_DB, `users/${user.uid}/shots`);
//                 const shotsSnapshot = await getDocs(shotsCollectionRef);
//                 const shotsData = shotsSnapshot.docs
//                     .filter(docSnap => docSnap.id !== 'metadata')
//                     .map((docSnap, index) => ({
//                         id: index + 1,
//                         ...docSnap.data(),
//                     })) as ShotData[];

//                 setShots(shotsData);
//             }
//         };
//         fetchUserData();
//     }, [user]);

//     const pickImage = async (fromCamera: boolean) => {
//         let result = fromCamera
//             ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true })
//             : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true });

//         if (!result.canceled && result.assets && result.assets.length > 0) {
//             const selectedAsset = result.assets[0];
//             const base64Image = selectedAsset.base64;

//             if (typeof base64Image === 'string' && user) {
//                 try {
//                     const userId = user.uid;
//                     await AsyncStorage.setItem(`userPhoto_${userId}`, base64Image);
//                     setUserPhoto(`data:image/jpeg;base64,${base64Image}`);
//                 } catch (error) {
//                     console.error('Error storing image in AsyncStorage:', error);
//                 }
//             } else {
//                 console.error('Invalid base64 image data or no user logged in.');
//             }
//         }
//     };

//     const handleSignOut = async () => {
//         await signOut(FIREBASE_AUTH);
//         router.replace('/login');
//     };

//     const handleDeleteAccount = async () => {
//         if (user) {
//             await deleteUser(user);
//             router.replace('/login');
//         }
//     };

//     const displayShotData = (shot: ShotData) => {
//         setSelectedShot(shot);
//     };

//     const renderShotDetails = () => {
//         if (!selectedShot) return null;

//         const width = Dimensions.get('window').width - 40;

//         const renderPlot = (title: string, data: number[] | undefined) => {
//             if (!data || data.length === 0) {
//                 return (
//                     <View style={styles.plotContainer}>
//                         <Text style={styles.plotTitle}>{title}</Text>
//                         <Text>No data available</Text>
//                     </View>
//                 );
//             }

//             return (
//                 <View style={styles.plotContainer}>
//                     <Text style={styles.plotTitle}>{title}</Text>
//                     <LineChart
//                         data={{
//                             labels: data.map((_, index: number) => (index % 5 === 0 ? index.toString() : '')),
//                             datasets: [{ data: data }],
//                         }}
//                         width={width - 40}
//                         height={220}
//                         yAxisLabel=""
//                         yAxisSuffix=""
//                         yAxisInterval={10}
//                         chartConfig={{
//                             backgroundColor: '#e2e2e2',
//                             backgroundGradientFrom: '#eff3ff',
//                             backgroundGradientTo: '#efefef',
//                             decimalPlaces: 2,
//                             color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
//                             labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
//                             style: { borderRadius: 16 },
//                             propsForDots: { r: '2', strokeWidth: '1', stroke: '#ffa726' },
//                         }}
//                         bezier
//                         style={{ marginVertical: 10, borderRadius: 16 }}
//                     />
//                 </View>
//             );
//         };

//         return (
//           <View style={styles.shotDetailsContainer}>
//               <Text style={[styles.shotDetailsTitle, { color: 'black' }]}>Shot {selectedShot.id} Details</Text>
      
//               {renderPlot('Accel X', selectedShot.accelX)}
//               {renderPlot('Accel Y', selectedShot.accelY)}
//               {renderPlot('Accel Z', selectedShot.accelZ)}
//               {renderPlot('Gyro X', selectedShot.gyroX)}
//               {renderPlot('Gyro Y', selectedShot.gyroY)}
//               {renderPlot('Gyro Z', selectedShot.gyroZ)}
      
//               <View style={styles.backButtonContainer}> 
//                   <AwesomeButton
//                       onPress={() => setSelectedShot(null)}
//                       backgroundColor="#FFD700"
//                       backgroundDarker="#DAA520"
//                       width={width * 0.8}
//                       borderRadius={30}
//                       textSize={15}
//                       textColor="#000"
//                       textFontFamily="System"
//                       raiseLevel={5}
//                       paddingHorizontal={30}
//                       style={styles.awesomeButton}
//                   >
//                       Back to Profile
//                   </AwesomeButton>
//               </View>
//           </View>
//       );
//     };

//     return (
//         <ScrollView style={styles.container} indicatorStyle={'black'}>
//             {selectedShot ? (
//                 renderShotDetails()
//             ) : (
//                 <View>
//                     <View style={styles.profileHeader}>
//                         <TouchableOpacity onPress={() => pickImage(false)} style={styles.profileImageContainer}>
//                             {userPhoto ? (
//                                 <Image source={{ uri: userPhoto }} style={styles.profileImage} />
//                             ) : (
//                                 <View style={styles.placeholderIcon}>
//                                     <Ionicons name="person-circle-outline" size={100} color="gray" />
//                                 </View>
//                             )}
//                         </TouchableOpacity>
//                     </View>
//                     <View style={styles.emailContainer}>
//                         <Ionicons name="mail" size={28} color="#FFCC4D" />
//                         <Text style={styles.email}>{email}</Text>
//                     </View>
//                     <Text style={styles.shotsTitle}>Your Shots</Text>
//                     {shots.map(shot => (
//                         <TouchableOpacity key={shot.id} style={styles.shotButton} onPress={() => displayShotData(shot)}>
//                             <Text style={styles.shotText}>Shot {shot.id}</Text>
//                         </TouchableOpacity>
//                     ))}

//                     <View style={styles.bottomButtonsContainer}>
//                         <AwesomeButton
//                             onPress={handleSignOut}
//                             backgroundColor="#FFD700"
//                             backgroundDarker="#DAA520"
//                             width={width * 0.8}
//                             borderRadius={30}
//                             textSize={15}
//                             textColor="#000"
//                             textFontFamily="System"
//                             raiseLevel={5}
//                             paddingHorizontal={30}
//                             style={styles.awesomeButton}
//                         >
//                             Sign Out
//                         </AwesomeButton>
//                         <AwesomeButton
//                             onPress={handleDeleteAccount}
//                             backgroundColor="#FFD700"
//                             backgroundDarker="#DAA520"
//                             width={width * 0.8}
//                             borderRadius={30}
//                             textSize={15}
//                             textColor="#000"
//                             textFontFamily="System"
//                             raiseLevel={5}
//                             paddingHorizontal={30}
//                             style={styles.awesomeButton}
//                         >
//                             Delete Account
//                         </AwesomeButton>
//                     </View>
//                 </View>
//             )}
//         </ScrollView>
//     );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: "#F9F9F9" },
//   profileHeader: {
//     alignItems: 'center',
//     backgroundColor: '#FFCC4D',
//     padding: 20,
//     borderTopLeftRadius: 20,
//     borderTopRightRadius: 20,
//     height: 140, // Adjust height
//     marginBottom: 100, // Adjust margin
// },

// profileImageContainer: {
//     position: 'absolute', // Use absolute positioning
//     top: 50, // Adjust top position
//     left: '56%', // Center horizontally
//     marginLeft: -75, // Adjust based on image width/2
// },

// profileImage: {
//     width: 150,
//     height: 150,
//     borderRadius: 75,
//     borderWidth: 5,
//     borderColor: '#DAA520',
// },

// emailContainer: {
//     backgroundColor: 'white',
//     padding: 25,
//     borderRadius: 10,
//     marginBottom: 20,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5, // For Android shadow
//     alignItems: 'center', // Center content
// },

// // ... other styles ...

// shotButton: {
//     backgroundColor: 'white',
//     padding: 20,
//     borderRadius: 10,
//     marginBottom: 10,
//     shadowColor: '#000',
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5, // For Android shadow
//     alignItems: 'center',
// },
//   email: {
//       fontSize: 18,
//       fontWeight: 'bold',
//       color: '#666',
//       marginLeft: 10,
//   },
//   shotsTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: 'black' },
//   shotDetailsContainer: {
//     flex: 1,
//     padding: 20,
//     alignItems: 'center',
// },
//   shotDetailsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'black' },
//   plotContainer: { marginBottom: 20 },
//   plotTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' },
//   backButtonContainer: {
//       alignItems: 'center',
//       marginTop: 10,
//       marginBottom: 10,
//       justifyContent: 'flex-end',
//   },
//   bottomButtonsContainer: {
//       alignItems: 'center',
//       marginTop: 30,
//       marginBottom: 30,
//   },
//   bottomButton: {
//       minWidth: 120,
//       backgroundColor: '#e0e0e0',
//       padding: 15,
//       borderRadius: 8,
//       alignItems: 'center',
//   },
//   // shotButton: {
//   //     backgroundColor: '#e0e0e0',
//   //     padding: 20,
//   //     borderRadius: 10,
//   //     marginBottom: 10,
//   //     alignItems: 'center',
//   //     borderWidth: 3,
//   // },
//   shotText: {
//       fontSize: 16,
//       color: 'black',
//       fontWeight: 'bold',
//   },
//   placeholderIcon: {
//       justifyContent: 'center',
//       backgroundColor: '#e0e0e0',
//       alignItems: 'center',
//       width: 150,
//       height: 150,
//       borderRadius: 75,
//       borderWidth: 5,
//       borderColor: '#DAA520',
//   },
//   buttonText: {
//       fontSize: 16,
//       color: 'black',
//   },
//   awesomeButton: {
//       marginBottom: 10,
//   },
//   buttonContainer: {
//     width: '100%',
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     marginBottom: 20, // Optional: Add some margin at the bottom
//     marginTop: 20, // Optional: Add some margin at the top
// },
// });

// ---------------------------------------------------------------------------------------------------------

import React, { useEffect, useMemo, useState } from 'react';
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Text } from '@/components/Themed';
import { tryGetFirebaseAuth, FIREBASE_DB } from '@/FirebaseConfig';
import { signOut, deleteUser } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import GoldButton from '@/components/GoldButton';
import { LinearGradient } from 'expo-linear-gradient';
import { CueTheme, cueShadow } from '@/constants/CueTheme';

const groqApiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
import * as Speech from 'expo-speech';

interface ShotData {
  id: number;
  accelX?: number[];
  accelY?: number[];
  accelZ?: number[];
  gyroX?: number[];
  gyroY?: number[];
  gyroZ?: number[];
  quizAnswers?: Record<string, string | boolean>;
  timestamp?: string;
}

const questionMapping: Record<number, string> = {
  3: 'legalShot',
  1: 'ballPotted',
  2: 'foul',
  4: 'spin',
  5: 'doubleHit',
};

const { width } = Dimensions.get('window');

const analyzeFluctuations = (data: number[] | undefined): number => {
  if (!data || data.length < 25) return 0;
  const preShot = data.slice(0, 16);
  const postShot = data.slice(24);
  const avgChange = (arr: number[]) =>
    arr.slice(1).reduce((sum, val, idx) => sum + Math.abs(val - arr[idx]), 0) / arr.length;
  return avgChange(preShot) + avgChange(postShot);
};

const calculateNormalizedScore = (shotData: ShotData): number => {
  const fluctuationScore = [
    analyzeFluctuations(shotData.accelX),
    analyzeFluctuations(shotData.accelY),
    analyzeFluctuations(shotData.accelZ),
    analyzeFluctuations(shotData.gyroX),
    analyzeFluctuations(shotData.gyroY),
    analyzeFluctuations(shotData.gyroZ),
  ].reduce((sum, score) => sum + score, 0);

  const minScore = 10;
  const maxScore = 150;
  return Math.min(Math.max((fluctuationScore - minScore) / (maxScore - minScore), 0), 1);
};

const calculateSmoothnessScore = (shotData: ShotData | null): number => {
  if (!shotData) return 0;
  return Math.max(0, Math.min(100, Math.round(100 - calculateNormalizedScore(shotData) * 100)));
};

const getScoreTone = (score: number) =>
  score >= 80
    ? {
        accent: '#57C785',
        soft: 'rgba(87, 199, 133, 0.16)',
        text: '#DFF8E8',
        track: 'rgba(87, 199, 133, 0.26)',
        label: 'Competition Ready',
      }
    : score >= 60
      ? {
          accent: '#E7C35A',
          soft: 'rgba(231, 195, 90, 0.18)',
          text: '#FFF1BF',
          track: 'rgba(231, 195, 90, 0.28)',
          label: 'Training Well',
        }
      : {
          accent: '#E06A6A',
          soft: 'rgba(224, 106, 106, 0.18)',
          text: '#FFD7D7',
          track: 'rgba(224, 106, 106, 0.28)',
          label: 'Needs Repetition',
        };

const parseQuizAnswers = (rawAnswers?: Record<string, string | boolean>) =>
  Object.fromEntries(
    Object.entries(rawAnswers || {}).map(([key, value]) => {
      const mappedKey = Number.isNaN(Number(key)) ? key : questionMapping[Number(key)];
      return [mappedKey, typeof value === 'boolean' ? value : String(value).toLowerCase() === 'yes'];
    })
  ) as Record<string, boolean>;

export default function ProfileScreen() {
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [shots, setShots] = useState<ShotData[]>([]);
  const [selectedShot, setSelectedShot] = useState<ShotData | null>(null);
  const [shotAnalysis, setShotAnalysis] = useState('Select a shot to review the coach summary.');
  const [loading, setLoading] = useState(false);

  const auth = tryGetFirebaseAuth();
  const user = auth?.currentUser;

  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;

      setEmail(user.email || '');

      try {
        const storedImage = await AsyncStorage.getItem(`userPhoto_${user.uid}`);
        setUserPhoto(typeof storedImage === 'string' ? `data:image/jpeg;base64,${storedImage}` : null);
      } catch (error) {
        console.error('Error retrieving image from AsyncStorage:', error);
      }

      const shotsCollectionRef = collection(FIREBASE_DB, `users/${user.uid}/shots`);
      const shotsSnapshot = await getDocs(shotsCollectionRef);
      const shotsData = shotsSnapshot.docs
        .filter((docSnap) => docSnap.id !== 'metadata')
        .map((docSnap, index) => {
          const docData = docSnap.data();
          const numericId = Number(docSnap.id);
          return {
            id: Number.isFinite(numericId) ? numericId : index + 1,
            ...docData,
          } as ShotData;
        })
        .sort((a, b) => b.id - a.id);

      setShots(shotsData);
    };

    fetchUserData();
  }, [user]);

  const bestScore = useMemo(
    () => (shots.length ? Math.max(...shots.map((shot) => calculateSmoothnessScore(shot))) : 0),
    [shots]
  );
  const averageScore = useMemo(
    () => (shots.length ? Math.round(shots.reduce((sum, shot) => sum + calculateSmoothnessScore(shot), 0) / shots.length) : 0),
    [shots]
  );
  const displayName = email.includes('@') ? email.split('@')[0] : email || 'Cue player';
  const selectedScore = calculateSmoothnessScore(selectedShot);
  const selectedTone = getScoreTone(selectedScore);
  const selectedQuiz = parseQuizAnswers(selectedShot?.quizAnswers);

  const pickImage = async (fromCamera: boolean) => {
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        })
      : await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });

    if (!result.canceled && result.assets?.length && typeof result.assets[0].base64 === 'string' && user) {
      try {
        await AsyncStorage.setItem(`userPhoto_${user.uid}`, result.assets[0].base64);
        setUserPhoto(`data:image/jpeg;base64,${result.assets[0].base64}`);
      } catch (error) {
        console.error('Error storing image in AsyncStorage:', error);
      }
    }
  };

  const handleSignOut = async () => {
    if (!auth) {
      router.replace('/login');
      return;
    }
    await signOut(auth);
    router.replace('/login');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    await deleteUser(user);
    router.replace('/login');
  };

  const speakAnalysis = () => {
    if (!shotAnalysis || loading) return;
    Speech.speak(shotAnalysis, { language: 'en' });
  };

  const analyzeShot = async (shotData: ShotData) => {
    setLoading(true);
    setShotAnalysis('Loading coach summary...');

    try {
      const fluctuationScore = [
        analyzeFluctuations(shotData.accelX),
        analyzeFluctuations(shotData.accelY),
        analyzeFluctuations(shotData.accelZ),
        analyzeFluctuations(shotData.gyroX),
        analyzeFluctuations(shotData.gyroY),
        analyzeFluctuations(shotData.gyroZ),
      ].reduce((sum, score) => sum + score, 0);

      const normalizedScore = calculateNormalizedScore(shotData);
      const quiz = parseQuizAnswers(shotData.quizAnswers);

      const prompt = `
        Given the following billiard shot data:
        - Fluctuation Score: ${fluctuationScore.toFixed(2)}
        - Shot Smoothness: ${normalizedScore < 0.2 ? 'Smooth' : 'Fluctuating'}
        - Legal Shot: ${quiz.legalShot === false ? 'No' : 'Yes'}
        - Ball Potted: ${quiz.ballPotted === false ? 'No' : 'Yes'}
        - Foul Committed: ${quiz.foul ? 'Yes' : 'No'}

        Generate a concise but complete coach-style evaluation of this previous shot. Treat unstable motion as weaker execution, and treat a legal pot with no foul as a strong outcome.
        Format the response in 2 short paragraphs, then end with 2 brief improvement tips in one final line.
      `;

        if (!groqApiKey) {
          throw new Error('Missing EXPO_PUBLIC_GROQ_API_KEY');
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 320,
        }),
        });

        if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.error?.message || `Groq API Error (${response.status})`);
      }

      const botResponse = await response.json();
      setShotAnalysis(botResponse?.choices?.[0]?.message?.content || "Couldn't analyze the shot.");
    } catch (error) {
      console.error('Error analyzing shot:', error);
      setShotAnalysis(error instanceof Error ? `Coach summary unavailable. ${error.message}` : 'Coach summary unavailable.');
    } finally {
      setLoading(false);
    }
  };

  const displayShotData = (shot: ShotData) => {
    setSelectedShot(shot);
    analyzeShot(shot);
  };

  const renderSignalCard = (title: string, data: number[] | undefined) => {
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

    if (!data?.length) {
      return (
        <View style={styles.plotCard}>
          <View style={styles.plotHeader}>
            <View>
              <Text style={styles.plotTitle}>{title}</Text>
              <Text style={styles.plotSubtitle}>Signal unavailable for this shot.</Text>
            </View>
            <View style={styles.plotBadge}>
              <Text style={styles.plotBadgeText}>Awaiting data</Text>
            </View>
          </View>
          <Text style={styles.emptyPlotText}>No motion values were saved for this channel.</Text>
        </View>
      );
    }

    const strongest = data.reduce((best, value) => (Math.abs(value) > Math.abs(best) ? value : best), data[0]);
    const average = data.reduce((sum, value) => sum + value, 0) / data.length;

    return (
      <View style={styles.plotCard}>
        <View style={styles.plotHeader}>
          <View style={styles.plotHeadingBlock}>
            <Text style={styles.plotTitle}>{title}</Text>
            <Text style={styles.plotSubtitle}>{title.startsWith('Gyro') ? 'Rotation trace' : 'Acceleration trace'}</Text>
          </View>
          <View style={styles.plotBadge}>
            <Text style={styles.plotBadgeText}>{data.length} frames</Text>
          </View>
        </View>
        <View style={styles.metricRow}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Peak</Text>
            <Text style={styles.metricValue}>{strongest.toFixed(2)}</Text>
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

  const renderComparison = () => {
    if (!shots.length) {
      return <Text style={styles.emptyStateText}>No stored shots available for comparison yet.</Text>;
    }

    const scoreSeries = [...shots].reverse().map((shot) => calculateSmoothnessScore(shot));

    return (
      <View style={styles.comparisonCard}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionHeaderText}>
            <Text style={styles.sectionTitle}>Training History</Text>
            <Text style={styles.sectionHint}>
              Compare this shot against your stored sessions with the same smoothness logic used on the dashboard.
            </Text>
          </View>
          <View style={styles.sectionBadge}>
            <Text style={styles.sectionBadgeText}>{shots.length} shots</Text>
          </View>
        </View>
        <View style={[styles.chartShell, styles.comparisonChartShell]}>
          <LineChart
            data={{
              labels: [...shots].reverse().map((shot) => `S${shot.id}`),
              datasets: [
                {
                  data: scoreSeries,
                  color: () => CueTheme.colors.brassDeep,
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
              backgroundColor: '#F9F4E7',
              backgroundGradientFrom: '#F9F4E7',
              backgroundGradientTo: '#F9F4E7',
              decimalPlaces: 0,
              color: () => CueTheme.colors.brassDeep,
              labelColor: () => CueTheme.colors.rail,
              style: { borderRadius: 18 },
              propsForDots: {
                r: '3.5',
                strokeWidth: '2',
                stroke: CueTheme.colors.brassDeep,
                fill: CueTheme.colors.brass,
              },
              propsForBackgroundLines: {
                stroke: 'rgba(44, 27, 18, 0.12)',
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
        <Text style={styles.comparisonFootnote}>
          Higher smoothness scores indicate cleaner cue delivery and steadier motion before and after contact.
        </Text>
      </View>
    );
  };

  const renderShotDetails = () => {
    if (!selectedShot) return null;

    return (
      <View>
        <LinearGradient
          colors={[CueTheme.colors.feltDeep, CueTheme.colors.feltDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <View style={styles.heroTopRow}>
            <View style={styles.heroTitleWrap}>
              <TouchableOpacity style={styles.backPill} onPress={() => setSelectedShot(null)}>
                <Ionicons name="chevron-back" size={16} color={CueTheme.colors.rail} />
                <Text style={styles.backPillText}>Profile</Text>
              </TouchableOpacity>
              <Text style={styles.heroEyebrow}>Stored Shot Review</Text>
              <Text style={styles.heroTitle}>Shot {selectedShot.id}</Text>
              <Text style={styles.heroSubtitle}>
                Revisit the motion signature, coach summary, and trend context for this saved attempt.
              </Text>
            </View>
            <View style={[styles.scoreDial, { backgroundColor: selectedTone.soft, borderColor: selectedTone.track }]}>
              <Text style={[styles.scoreDialValue, { color: selectedTone.text }]}>{selectedScore}</Text>
              <Text style={[styles.scoreDialLabel, { color: selectedTone.accent }]}>Smoothness</Text>
            </View>
          </View>
          <View style={styles.readinessRow}>
            <View style={[styles.readinessBadge, { backgroundColor: selectedTone.accent }]}>
              <Ionicons name="flash" size={14} color={CueTheme.colors.rail} />
              <Text style={styles.readinessBadgeText}>{selectedTone.label}</Text>
            </View>
            <Text style={styles.readinessHint}>
              Previous-shot analysis uses the same smoothness scoring model and coach summary flow as the dashboard.
            </Text>
          </View>
          <View style={styles.statusGrid}>
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Shot Status</Text>
              <Text style={styles.statusValue}>Stored</Text>
            </View>
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Legality</Text>
              <Text style={styles.statusValue}>{selectedQuiz.legalShot === false ? 'Review' : 'Clean'}</Text>
            </View>
            <View style={styles.statusCard}>
              <Text style={styles.statusLabel}>Pot Result</Text>
              <Text style={styles.statusValue}>{selectedQuiz.ballPotted === false ? 'Missed' : 'Potted'}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.analysisContainer}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderText}>
              <Text style={styles.sectionTitle}>Coach Summary</Text>
              <Text style={styles.sectionHint}>AI readout for this saved shot based on motion stability and table result.</Text>
            </View>
            {shotAnalysis ? (
              <TouchableOpacity onPress={speakAnalysis} style={styles.speakButton}>
                <Ionicons name="volume-high" size={22} color={CueTheme.colors.rail} />
              </TouchableOpacity>
            ) : null}
          </View>
          {loading ? <ActivityIndicator size="small" color={CueTheme.colors.brassDeep} /> : <Text style={styles.description}>{shotAnalysis}</Text>}
        </View>

        <View style={styles.chartSection}>
          <Text style={styles.chartSectionTitle}>Motion Signals</Text>
          <Text style={styles.chartSectionHint}>Same premium motion cards as the dashboard, now applied to your stored shot history.</Text>
          {renderSignalCard('Accel X', selectedShot.accelX)}
          {renderSignalCard('Accel Y', selectedShot.accelY)}
          {renderSignalCard('Accel Z', selectedShot.accelZ)}
          {renderSignalCard('Gyro X', selectedShot.gyroX)}
          {renderSignalCard('Gyro Y', selectedShot.gyroY)}
          {renderSignalCard('Gyro Z', selectedShot.gyroZ)}
        </View>

        {renderComparison()}

        <View style={styles.bottomButtonsContainer}>
          <GoldButton onPress={() => setSelectedShot(null)} width={width * 0.84} style={styles.actionButton}>
            Back to Profile
          </GoldButton>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} indicatorStyle="black" contentContainerStyle={styles.scrollContent}>
      {selectedShot ? (
        renderShotDetails()
      ) : (
        <View>
          <LinearGradient
            colors={[CueTheme.colors.feltDeep, CueTheme.colors.feltDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.profileHero}
          >
            <View style={styles.profileHeroTop}>
              <TouchableOpacity onPress={() => pickImage(false)} style={styles.profileImageContainer}>
                {userPhoto ? (
                  <Image source={{ uri: userPhoto }} style={styles.profileImage} />
                ) : (
                  <View style={styles.placeholderIcon}>
                    <Ionicons name="person" size={56} color={CueTheme.colors.brassDeep} />
                  </View>
                )}
              </TouchableOpacity>
              <TouchableOpacity style={styles.cameraBadge} onPress={() => pickImage(true)}>
                <Ionicons name="camera" size={18} color={CueTheme.colors.rail} />
              </TouchableOpacity>
            </View>
            <Text style={styles.heroEyebrow}>Player Profile</Text>
            <Text style={styles.profileEmail}>{displayName}</Text>
            <Text style={styles.profileSubtitle}>
              Review your saved attempts, monitor session quality, and keep your training history in one place.
            </Text>
            <View style={styles.profileStatsRow}>
              <View style={styles.profileStatCard}>
                <Text style={styles.profileStatValue}>{shots.length}</Text>
                <Text style={styles.profileStatLabel}>Shots Saved</Text>
              </View>
              <View style={styles.profileStatCard}>
                <Text style={styles.profileStatValue}>{bestScore}</Text>
                <Text style={styles.profileStatLabel}>Best Score</Text>
              </View>
              <View style={styles.profileStatCard}>
                <Text style={styles.profileStatValue}>{averageScore}</Text>
                <Text style={styles.profileStatLabel}>Average</Text>
              </View>
            </View>
          </LinearGradient>

          <View style={styles.emailCard}>
            <View style={styles.emailIconWrap}>
              <Ionicons name="mail" size={18} color={CueTheme.colors.rail} />
            </View>
            <View style={styles.emailTextWrap}>
              <Text style={styles.emailCardLabel}>Signed In</Text>
              <Text style={styles.emailCardValue}>{email || 'No email available'}</Text>
            </View>
          </View>

          <View style={styles.shotsSection}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionHeaderText}>
                <Text style={styles.shotsSectionTitle}>Stored Shots</Text>
                <Text style={styles.shotsSectionHint}>Open any saved attempt to review the same polished analysis layout used on the dashboard.</Text>
              </View>
              <View style={styles.shotsSectionBadge}>
                <Text style={styles.shotsSectionBadgeText}>{shots.length} total</Text>
              </View>
            </View>

            {shots.length ? (
              shots.map((shot) => {
                const score = calculateSmoothnessScore(shot);
                const tone = getScoreTone(score);
                return (
                  <TouchableOpacity key={shot.id} style={styles.shotRowCard} activeOpacity={0.9} onPress={() => displayShotData(shot)}>
                    <View style={styles.shotRowLeft}>
                      <View style={styles.shotIconWrap}>
                        <Ionicons name="stats-chart" size={18} color={CueTheme.colors.brassDeep} />
                      </View>
                      <View style={styles.shotRowTextWrap}>
                        <Text style={styles.shotRowTitle}>Shot {shot.id}</Text>
                        <Text style={styles.shotRowSubtitle}>{score >= 80 ? 'Strong delivery pattern' : score >= 60 ? 'Solid training attempt' : 'Worth another review'}</Text>
                      </View>
                    </View>
                    <View style={styles.shotRowRight}>
                      <View style={[styles.shotScoreBadge, { backgroundColor: tone.soft, borderColor: tone.track }]}>
                        <Text style={[styles.shotScoreValue, { color: tone.accent }]}>{score}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={CueTheme.colors.rail} />
                    </View>
                  </TouchableOpacity>
                );
              })
            ) : (
              <View style={styles.emptyShotsCard}>
                <Text style={styles.emptyStateText}>No saved shots yet. Capture a new attempt and it will appear here for profile review.</Text>
              </View>
            )}
          </View>

          <View style={styles.bottomButtonsContainer}>
            <GoldButton onPress={handleSignOut} width={width * 0.84} style={styles.actionButton}>
              Sign Out
            </GoldButton>
            <GoldButton onPress={handleDeleteAccount} width={width * 0.84} style={styles.actionButton}>
              Delete Account
            </GoldButton>
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CueTheme.colors.felt,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 30,
  },
  heroCard: {
    width: '100%',
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
  backPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: CueTheme.colors.brass,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 14,
  },
  backPillText: {
    color: CueTheme.colors.rail,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
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
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingHorizontal: 8,
  },
  scoreDialValue: {
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 30,
  },
  scoreDialLabel: {
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
    gap: 10,
    marginTop: 18,
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
  analysisContainer: {
    backgroundColor: CueTheme.colors.card,
    padding: 24,
    borderRadius: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    width: '100%',
    ...cueShadow,
  },
  description: {
    fontSize: 16,
    color: CueTheme.colors.slateSoft,
    lineHeight: 24,
    width: '100%',
  },
  sectionHeader: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 14,
    flexWrap: 'wrap',
  },
  sectionHeaderText: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: CueTheme.colors.rail,
    marginBottom: 4,
  },
  sectionHint: {
    color: CueTheme.colors.slateSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  sectionBadge: {
    backgroundColor: 'rgba(215, 181, 109, 0.12)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.22)',
    alignSelf: 'flex-start',
  },
  sectionBadgeText: {
    color: CueTheme.colors.rail,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
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
  chartSection: {
    width: '100%',
    marginBottom: 8,
  },
  chartSectionTitle: {
    color: CueTheme.colors.chalk,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 8,
  },
  chartSectionHint: {
    color: CueTheme.colors.mist,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 18,
    maxWidth: 330,
  },
  shotsSectionTitle: {
    color: CueTheme.colors.chalk,
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 4,
  },
  shotsSectionHint: {
    color: CueTheme.colors.mist,
    fontSize: 13,
    lineHeight: 18,
  },
  shotsSectionBadge: {
    backgroundColor: 'rgba(247, 244, 236, 0.12)',
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.28)',
    alignSelf: 'flex-start',
  },
  shotsSectionBadgeText: {
    color: CueTheme.colors.chalk,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  plotCard: {
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
  comparisonCard: {
    backgroundColor: CueTheme.colors.card,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    marginBottom: 24,
    ...cueShadow,
  },
  comparisonChartShell: {
    backgroundColor: '#F9F4E7',
    marginBottom: 14,
  },
  comparisonFootnote: {
    color: CueTheme.colors.slateSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  emptyPlotText: {
    color: '#5B6C65',
    fontSize: 14,
    lineHeight: 20,
  },
  emptyStateText: {
    color: CueTheme.colors.mist,
    fontSize: 15,
    lineHeight: 21,
    textAlign: 'center',
  },
  profileHero: {
    borderRadius: 30,
    padding: 24,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.22)',
    ...cueShadow,
  },
  profileHeroTop: {
    alignItems: 'center',
    marginBottom: 18,
  },
  profileImageContainer: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 4,
    borderColor: CueTheme.colors.brass,
    overflow: 'hidden',
    backgroundColor: CueTheme.colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  placeholderIcon: {
    width: '100%',
    height: '100%',
    borderRadius: 62,
    backgroundColor: CueTheme.colors.cardAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    right: width > 390 ? 96 : 70,
    bottom: -4,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: CueTheme.colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: CueTheme.colors.brassDeep,
  },
  profileEmail: {
    color: CueTheme.colors.chalk,
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  profileSubtitle: {
    color: CueTheme.colors.mist,
    fontSize: 14,
    lineHeight: 20,
    maxWidth: 320,
    marginBottom: 18,
  },
  profileStatsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  profileStatCard: {
    flex: 1,
    backgroundColor: 'rgba(247, 244, 236, 0.1)',
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.18)',
  },
  profileStatValue: {
    color: CueTheme.colors.chalk,
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 4,
  },
  profileStatLabel: {
    color: CueTheme.colors.mist,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.7,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  emailCard: {
    backgroundColor: CueTheme.colors.card,
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    ...cueShadow,
  },
  emailIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: CueTheme.colors.brass,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emailTextWrap: {
    flex: 1,
    minWidth: 0,
  },
  emailCardLabel: {
    color: CueTheme.colors.slateSoft,
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 3,
  },
  emailCardValue: {
    color: CueTheme.colors.slate,
    fontSize: 17,
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  shotsSection: {
    marginBottom: 18,
  },
  shotRowCard: {
    backgroundColor: CueTheme.colors.cardAlt,
    borderRadius: 22,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    ...cueShadow,
  },
  shotRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shotIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(215, 181, 109, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotRowTextWrap: {
    flex: 1,
  },
  shotRowTitle: {
    color: CueTheme.colors.rail,
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 4,
  },
  shotRowSubtitle: {
    color: CueTheme.colors.slateSoft,
    fontSize: 13,
    lineHeight: 18,
  },
  shotRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  shotScoreBadge: {
    minWidth: 52,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    alignItems: 'center',
  },
  shotScoreValue: {
    fontSize: 14,
    fontWeight: '800',
  },
  emptyShotsCard: {
    backgroundColor: 'rgba(247, 244, 236, 0.08)',
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(215, 181, 109, 0.18)',
  },
  bottomButtonsContainer: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 6,
  },
  actionButton: {
    marginBottom: 10,
    alignSelf: 'center',
  },
});
