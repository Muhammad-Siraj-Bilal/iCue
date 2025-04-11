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

import React, { useEffect, useState } from 'react';
import {
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
    View,
    Dimensions,
    ActivityIndicator
} from 'react-native';
import { Text } from '@/components/Themed';
import { FIREBASE_AUTH, FIREBASE_DB } from '@/FirebaseConfig';
import { getAuth, signOut, deleteUser } from 'firebase/auth';
import { getDocs, collection } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AwesomeButton from 'react-native-really-awesome-button';
import Svg, { Line, Text as SVGText } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';

interface ShotData {
    id: number;
    accelX?: number[];
    accelY?: number[];
    accelZ?: number[];
    gyroX?: number[];
    gyroY?: number[];
    gyroZ?: number[];
}

const questionMapping: Record<number, string> = {
  3: "legalShot",
  1: "ballPotted",
  2: "foul",
  4: "spin",
  5: "doubleHit", // Modify as needed
};

export default function ProfileScreen() {
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('');
    const [shots, setShots] = useState<ShotData[]>([]);
    const [selectedShot, setSelectedShot] = useState<ShotData | null>(null);
    const [showComparison, setShowComparison] = useState<boolean>(false);

    const [quizAnswers, setQuizResults] = useState<{ [key: string]: boolean } | null>(null);
    const [shotAnalysis, setShotAnalysis] = useState<string>('Loading analysis...');
    const [loading, setLoading] = useState<boolean>(false);

    const auth = getAuth();
    const user = auth.currentUser;
    const width = Dimensions.get('window').width;

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                setEmail(user.email || '');

                try {
                    const userId = user.uid;
                    const storedImage = await AsyncStorage.getItem(`userPhoto_${userId}`);

                    if (typeof storedImage === 'string') {
                        setUserPhoto(`data:image/jpeg;base64,${storedImage}`);
                    } else {
                        setUserPhoto(null);
                    }
                } catch (error) {
                    console.error('Error retrieving image from AsyncStorage:', error);
                }

                const shotsCollectionRef = collection(FIREBASE_DB, `users/${user.uid}/shots`);
                const shotsSnapshot = await getDocs(shotsCollectionRef);
                const shotsData = shotsSnapshot.docs
                    .filter(docSnap => docSnap.id !== 'metadata')
                    .map((docSnap, index) => ({
                        id: index + 1,
                        ...docSnap.data(),
                    })) as ShotData[];

                setShots(shotsData);
            }
        };
        fetchUserData();
    }, [user]);

    const pickImage = async (fromCamera: boolean) => {
        let result = fromCamera
            ? await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true })
            : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [4, 3], quality: 0.5, base64: true });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const selectedAsset = result.assets[0];
            const base64Image = selectedAsset.base64;

            if (typeof base64Image === 'string' && user) {
                try {
                    const userId = user.uid;
                    await AsyncStorage.setItem(`userPhoto_${userId}`, base64Image);
                    setUserPhoto(`data:image/jpeg;base64,${base64Image}`);
                } catch (error) {
                    console.error('Error storing image in AsyncStorage:', error);
                }
            } else {
                console.error('Invalid base64 image data or no user logged in.');
            }
        }
    };

    const handleSignOut = async () => {
        await signOut(FIREBASE_AUTH);
        router.replace('/login');
    };

    const handleDeleteAccount = async () => {
        if (user) {
            await deleteUser(user);
            router.replace('/login');
        }
    };

    const displayShotData = (shot: ShotData) => {
        setSelectedShot(shot);
        analyzeShot(shot);
    };

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
    
                Generate a concise, engaging evaluation of the shot, considering smoothness. If the smoothness is not less than 0.2 then it was not a good shot. 
                Format the response naturally as a coach giving feedback.
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

    const renderShotDetails = () => {
        if (!selectedShot) return null;

        const width = Dimensions.get('window').width - 40;

        const renderPlot = (title: string, data: number[] | undefined) => {
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
                            labels: data.map((_, index: number) => (index % 5 === 0 ? index.toString() : '')),
                            datasets: [{ data: data }],
                        }}
                        width={width - 40}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=""
                        yAxisInterval={10}
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
                        style={{ marginVertical: 10, borderRadius: 16 }}
                    />
                </View>
            );
        };

        return (
          <View style={[styles.analysisContainer, { alignItems: 'center' }]}>  
              <Text style={[styles.analysisTitle, { justifyContent: 'center' }]}>Shot Analysis</Text>
              {loading ? <ActivityIndicator size="small" color="#0000ff" /> : 
              <Text style={[styles.description, { textAlign: 'justify' }]}>{shotAnalysis}</Text>}

          <View style={styles.shotDetailsContainer}>
              <Text style={[styles.shotDetailsTitle, { color: 'black' }]}>Shot {selectedShot.id} Details</Text>
      
              {renderPlot('Accel X', selectedShot.accelX)}
              {renderPlot('Accel Y', selectedShot.accelY)}
              {renderPlot('Accel Z', selectedShot.accelZ)}
              {renderPlot('Gyro X', selectedShot.gyroX)}
              {renderPlot('Gyro Y', selectedShot.gyroY)}
              {renderPlot('Gyro Z', selectedShot.gyroZ)}
              {renderComparison()}
      
              <View style={styles.backButtonContainer}> 
                  <AwesomeButton
                      onPress={() => setSelectedShot(null)}
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
                      Back to Profile
                  </AwesomeButton>
                </View>
            </View>
        </View>
      );
    };

    const calculateNormalizedScore = (shotData: any): number => {
        const { accelX, accelY, accelZ, gyroX, gyroY, gyroZ } = shotData;
    
        const analyzeFluctuations = (data: number[] | undefined): number => {
            if (!data || data.length < 25) return 0;
    
            const preShot = data.slice(0, 16);
            const postShot = data.slice(24);
    
            const avgChange = (arr: number[]) =>
              arr.slice(1).reduce((sum, val, idx) => sum + Math.abs(val - arr[idx]), 0) / arr.length;

          return avgChange(preShot) + avgChange(postShot);
        };
    
        const fluctuationScores = [
            analyzeFluctuations(accelX),
            analyzeFluctuations(accelY),
            analyzeFluctuations(accelZ),
            analyzeFluctuations(gyroX),
            analyzeFluctuations(gyroY),
            analyzeFluctuations(gyroZ),
        ];
    
        const fluctuationScore = fluctuationScores.reduce((sum, score) => sum + score, 0);
    
        const minScore = 10;
        const maxScore = 150;
        const normalizedScore = Math.min(Math.max((fluctuationScore - minScore) / (maxScore - minScore), 0), 1);
        console.log(normalizedScore);
        return normalizedScore;
    };

  const renderComparison = () => {
    if (loading) {
        return <Text style={styles.loadingText}>Loading shot data...</Text>;
    }

    if (!shots || shots.length === 0) {
        return <Text style={styles.noDataText}>No shot data available for comparison.</Text>;
    }

    const width = Dimensions.get('window').width - 40;
    const data = {
        labels: shots.map((shot) => `Shot ${shot.id}`),
        datasets: [
            {
                data: shots.map(calculateNormalizedScore),
                color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
                strokeWidth: 2,
            },
        ],
    };

    console.log(data);

    const chartConfig = {
      backgroundColor: '#e2e2e2',
      backgroundGradientFrom: '#eff3ff',
      backgroundGradientTo: '#efefef',
      decimalPlaces: 2,
      color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
      style: {
        borderRadius: 16,
      },
      propsForDots: {
        r: '2',
        strokeWidth: '1',
        stroke: '#ffa726',
      },
      yAxisProps: {
        yAxisInterval: 0.2,
        yAxisMin: 0,
        yAxisMax: 1,
      },
      yAxisLabel: '',
    };
  
    return (
      <View style={[styles.plotContainer, { alignItems: 'center' }]}>  
              <Text style={[styles.plotTitle, { justifyContent: 'center' }]}>Comparision with other shots</Text>
        <LineChart
          data={data}
          width={width - 40} // Adjust width to fit within container
          height={220}
          chartConfig={chartConfig}
          bezier
          style={{ marginVertical: 10, borderRadius: 16 }}
        />
        <View style={comparisonStyles.shotDescription}>
          <Text style={comparisonStyles.shotDescriptionText}>
            Shots below 0.2 are considered good shots.
          </Text>
        </View>
      </View>
    );
  };

    return (
        <ScrollView style={styles.container} indicatorStyle={'black'}>
            {selectedShot ? (
                renderShotDetails()
            ) : (
                <View>
                    <View style={styles.profileHeader}>
                        <TouchableOpacity onPress={() => pickImage(false)} style={styles.profileImageContainer}>
                            {userPhoto ? (
                                <Image source={{ uri: userPhoto }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.placeholderIcon}>
                                    <Ionicons name="person-circle-outline" size={100} color="gray" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.emailContainer}>
                        <Ionicons name="mail" size={28} color="#FFCC4D" />
                        <Text style={styles.email}>{email}</Text>
                    </View>
                    <Text style={styles.shotsTitle}>Your Shots</Text>
                    {shots.map(shot => (
                        <TouchableOpacity key={shot.id} style={styles.shotButton} onPress={() => displayShotData(shot)}>
                            <Text style={styles.shotText}>Shot {shot.id}</Text>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.bottomButtonsContainer}>
                        <AwesomeButton
                            onPress={handleSignOut}
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
                            Sign Out
                        </AwesomeButton>
                        <AwesomeButton
                            onPress={handleDeleteAccount}
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
                            Delete Account
                        </AwesomeButton>
                    </View>
                </View>
            )}
        </ScrollView>
    );
}

const comparisonStyles = StyleSheet.create({
  plotContainer: {
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
  plotTitle: {
    fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 20, alignItems: 'center', color: 'black'
  },
  shotDescription: {
    marginTop: 10,
    alignItems: 'center',
  },
  shotDescriptionText: {
    fontSize: 12,
    color: 'black',
  },
});

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
  analysisTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, marginTop: 20, alignItems: 'center', color: 'black' },
  description: {
      fontSize: 16,
      color: '#333',
      marginBottom: 5,
      fontFamily: 'Poppins-Regular', 
      lineHeight: 24,
  },
  container: { flex: 1, padding: 20, backgroundColor: "#F9F9F9" },
  profileHeader: {
    alignItems: 'center',
    backgroundColor: '#FFCC4D',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: 140, // Adjust height
    marginBottom: 100, // Adjust margin
},

profileImageContainer: {
    position: 'absolute', // Use absolute positioning
    top: 50, // Adjust top position
    left: '56%', // Center horizontally
    marginLeft: -75, // Adjust based on image width/2
},

profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 5,
    borderColor: '#DAA520',
},

emailContainer: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
    alignItems: 'center', // Center content
},

// ... other styles ...

shotButton: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // For Android shadow
    alignItems: 'center',
},
  email: {
      fontSize: 18,
      fontWeight: 'bold',
      color: '#666',
      marginLeft: 10,
  },
  shotsTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: 'black' },
  shotDetailsContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
},
  shotDetailsTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'black' },
  plotContainer: { marginBottom: 20 },
  plotTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: 'black' },
  backButtonContainer: {
      alignItems: 'center',
      marginTop: 10,
      marginBottom: 10,
      justifyContent: 'flex-end',
  },
  bottomButtonsContainer: {
      alignItems: 'center',
      marginTop: 30,
      marginBottom: 30,
  },
  bottomButton: {
      minWidth: 120,
      backgroundColor: '#e0e0e0',
      padding: 15,
      borderRadius: 8,
      alignItems: 'center',
  },
  // shotButton: {
  //     backgroundColor: '#e0e0e0',
  //     padding: 20,
  //     borderRadius: 10,
  //     marginBottom: 10,
  //     alignItems: 'center',
  //     borderWidth: 3,
  // },
  shotText: {
      fontSize: 16,
      color: 'black',
      fontWeight: 'bold',
  },
  placeholderIcon: {
      justifyContent: 'center',
      backgroundColor: '#e0e0e0',
      alignItems: 'center',
      width: 150,
      height: 150,
      borderRadius: 75,
      borderWidth: 5,
      borderColor: '#DAA520',
  },
  buttonText: {
      fontSize: 16,
      color: 'black',
  },
  awesomeButton: {
      marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20, // Optional: Add some margin at the bottom
    marginTop: 20, // Optional: Add some margin at the top
},
comparisonContainer: {
  padding: 40,
  backgroundColor: 'white',
  borderRadius: 10,
  marginBottom: 20,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 3.84,
  elevation: 5,
  alignItems: 'center',
},
comparisonTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 20,
  color: 'black',
},
noDataText: {
  fontSize: 16,
  color: 'gray',
  fontStyle: 'italic',
  textAlign: 'center',
  marginTop: 20,
},
yAxisLabelContainer: {
  flexDirection: 'column',
  justifyContent: 'space-between',
  width: '100%',
  position: 'relative',
},
yAxisLabel: {
  position: 'absolute',
  fontSize: 12,
  color: 'black',
},
arrowLine: {
  position: 'absolute',
  width: '50%',
  height: 1,
  backgroundColor: 'black',
  top: '50%',
},
loadingText: {
  textAlign: 'center',
  marginTop: 20,
},
shotDescription: {
  marginTop: 10,
  alignItems: 'center',
},
shotDescriptionText: {
  fontSize: 12,
},
});