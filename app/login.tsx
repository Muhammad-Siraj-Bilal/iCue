// import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, Image, TextInput, TouchableOpacity, Alert } from 'react-native'
// import React, { useState } from 'react'
// import { useLocalSearchParams } from 'expo-router'
// import { defaultStyles } from '../constants/Styles'
// import { FIREBASE_AUTH } from '../FirebaseConfig'
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
// import { router } from 'expo-router';


// const Page = () => {
//   const { type } = useLocalSearchParams<{type: string}>();
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const auth = FIREBASE_AUTH;

//   const signIn = async () => {
//     setLoading(true)
//     try {
//       const user = await signInWithEmailAndPassword(auth, email, password)
//       if (user) router.replace('/(tabs)')
//     } catch (error: any) {
//       console.log(error)
//       alert('Sign in failed: ' + error.message);
//     }
//     setLoading(false)
//   }

//   const signUp = async () => {
//     setLoading(true)
//     try {
//       const user = await createUserWithEmailAndPassword(auth, email, password)
//       if (user) router.replace('/(tabs)')
//     } catch (error: any) {
//       console.log(error)
//       alert('Sign in failed: ' + error.message);
//     }
//     setLoading(false)
//   }

//   return (
//     <KeyboardAvoidingView
//       behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
//       style={styles.container}
//       keyboardVerticalOffset={1}
//     >
//       {loading && (
//         <View style={defaultStyles.loadingOverlay}>
//           <ActivityIndicator size='large' color='#fff'/>
//         </View>
//       )}
//       {/* <Image style={styles.logo} source={require('../assets/images/logo-white.png')} /> */}

//       <Text style={styles.title}>
//         {type === 'login' ? 'Welcome back' : 'Create your account'}
//       </Text>

//       <View style={{marginBottom: 20 }}>
//         <TextInput
//           autoCapitalize='none'
//           placeholder='Email'
//           style={styles.inputField}
//           value={email}
//           onChangeText={setEmail}
//         />
//         <TextInput
//           autoCapitalize='none'
//           placeholder='Password'
//           style={styles.inputField}
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>

//       {type === 'login' ? (
//         <TouchableOpacity onPress={signIn} style={[defaultStyles.btn, styles.btnPrimary]}>
//           <Text style={styles.btnPrimaryText}>Login</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity onPress={signUp} style={[defaultStyles.btn, styles.btnPrimary]}>
//           <Text style={styles.btnPrimaryText}>Create acount</Text>
//         </TouchableOpacity>
//       )}

//     </KeyboardAvoidingView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//   },
//   logo: {
//     width: 60,
//     height: 60,
//     alignSelf: 'center',
//     marginVertical: 80,
//   },
//   title: {
//     fontSize: 30,
//     alignSelf: 'center',
//     fontWeight: 'bold',
//   },
//   inputField: {
//     marginVertical: 4,
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 12,
//     padding: 10,
//     backgroundColor: '#fff',
//   },
//   btnPrimary: {
//     backgroundColor: "#007bff",
//     marginVertical: 4,
//   },
//   btnPrimaryText: {
//     color: '#fff',
//     fontSize: 16,
//   }
// })

// export default Page;

// ---------------------------------------------------------------------------------------------------

// import { 
//   View, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, 
//   Image, TextInput, TouchableOpacity, Alert 
// } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { useLocalSearchParams } from 'expo-router';
// import { defaultStyles } from '../constants/Styles';
// import { FIREBASE_AUTH } from '../FirebaseConfig';
// import { 
//   createUserWithEmailAndPassword, signInWithEmailAndPassword 
// } from 'firebase/auth';
// import { router } from 'expo-router';

// const Page = () => {
//   const { type } = useLocalSearchParams<{ type: string }>();
//   const [loading, setLoading] = useState(false);
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const auth = FIREBASE_AUTH;

//   const signIn = async () => {
//     setLoading(true);
//     try {
//       await signInWithEmailAndPassword(auth, email, password);
//       router.replace('/(tabs)');
//     } catch (error: any) {
//       Alert.alert('Sign-in failed', error.message);
//     }
//     setLoading(false);
//   };

//   const signUp = async () => {
//     setLoading(true);
//     try {
//       await createUserWithEmailAndPassword(auth, email, password);
//       router.replace('/(tabs)');
//     } catch (error: any) {
//       Alert.alert('Sign-up failed', error.message);
//     }
//     setLoading(false);
//   };

//   return (
//     <KeyboardAvoidingView 
//       behavior={Platform.OS == 'ios' ? 'padding' : 'height'} 
//       style={styles.container}
//     >
//       {loading && (
//         <View style={defaultStyles.loadingOverlay}>
//           <ActivityIndicator size="large" color="#fff" />
//         </View>
//       )}

//       {/* Logo */}
//       <Image style={styles.logo} source={require('../assets/images/iCueC.png')} />

//       {/* Title */}
//       <Text style={styles.title}>
//         {type === 'login' ? 'Welcome Back' : 'Create an Account'}
//       </Text>

//       {/* Input Fields */}
//       <View style={styles.inputContainer}>
//         <TextInput
//           autoCapitalize="none"
//           placeholder="Email"
//           placeholderTextColor="#ccc"
//           style={styles.inputField}
//           value={email}
//           onChangeText={setEmail}
//         />
//         <TextInput
//           autoCapitalize="none"
//           placeholder="Password"
//           placeholderTextColor="#ccc"
//           style={styles.inputField}
//           value={password}
//           onChangeText={setPassword}
//           secureTextEntry
//         />
//       </View>

//       {/* Buttons */}
//       {type === 'login' ? (
//         <TouchableOpacity onPress={signIn} style={[defaultStyles.btn, styles.btnPrimary]}>
//           <Text style={styles.btnPrimaryText}>Login</Text>
//         </TouchableOpacity>
//       ) : (
//         <TouchableOpacity onPress={signUp} style={[defaultStyles.btn, styles.btnGreen]}>
//           <Text style={styles.btnPrimaryText}>Create Account</Text>
//         </TouchableOpacity>
//       )}
//     </KeyboardAvoidingView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,  // Reduced padding to move everything up further
//     justifyContent: 'flex-start',  // Align everything to the top
//     alignItems: 'center',          // Align everything horizontally centered
//   },
//   logo: {
//     width: 120,
//     height: 120,
//     marginBottom: 10,  // Reduced margin to move logo closer to the top
//     borderRadius: 60,  // Circular logo
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: 'bold',
//     marginBottom: 10,  // Reduced margin to move the title up
//     textAlign: 'center',
//   },
//   inputContainer: {
//     width: '100%',
//     alignItems: 'center', // Center the input fields horizontally
//     marginBottom: 15,  // Reduced margin to move input fields up
//   },
//   inputField: {
//     marginVertical: 8,  // Reduced vertical margin for input fields
//     height: 50,
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 12,
//     padding: 10,
//     backgroundColor: '#fff',
//     width: 300,  // Set width to ensure proper centering
//     textAlign: 'center',  // Center text inside textboxes
//   },
//   btnPrimary: {
//     backgroundColor: '#28a745',
//     marginVertical: 8,  // Reduced margin to move button up
//     width: 300,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   btnGreen: {
//     backgroundColor: '#28a745', // Green color for Create Account button
//     marginVertical: 8,  // Reduced margin to move button up
//     width: 300,
//     paddingVertical: 12,
//     borderRadius: 8,
//     alignItems: 'center',
//   },
//   btnPrimaryText: {
//     color: '#fff',
//     fontSize: 16,
//   },
// });

// export default Page;

// -----------------------------------------------------------------------------------------------------

import { 
  View, Text, StyleSheet, Image, TextInput, TouchableOpacity, Alert 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router'; // Import router for navigation
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider 
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

WebBrowser.maybeCompleteAuthSession(); // Required for Expo Web

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;

  // Set up Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: "678755859046-g6dd9jious8uu2nrthvem8l8896gmdsc.apps.googleusercontent.com",
    iosClientId: "678755859046-g1061fadvgvhesib3bbilikdt7fgh4cc.apps.googleusercontent.com",
  });

  // Handle Google Sign-In Response
  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          console.log("Google sign-in successful!");
          router.replace('/(tabs)'); // Navigate to main app after successful sign-in
        })
        .catch((error) => {
          Alert.alert("Google Sign-In Failed", error.message);
        });
    }
  }, [response]);

  const signIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, navigating...");
      router.replace('/(tabs)'); // Navigate to main app
    } catch (error: any) {
      Alert.alert('Sign-in failed', error.message);
    }
  };

  const signUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign-up successful, navigating...");
      router.replace('/(tabs)'); // Navigate after sign-up
    } catch (error: any) {
      Alert.alert('Sign-up failed', error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image style={styles.logo} source={require('../assets/images/iCueC.png')} />
      
      {/* Title */}
      <Text style={styles.title}>
        {type === 'login' ? 'Welcome Back' : 'Create an Account'}
      </Text>

      {/* Input Fields */}
      <TextInput
        autoCapitalize="none"
        placeholder="Email"
        placeholderTextColor="#ccc"
        style={styles.inputField}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        autoCapitalize="none"
        placeholder="Password"
        placeholderTextColor="#ccc"
        style={styles.inputField}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Buttons */}
      {type === 'login' ? (
        <TouchableOpacity onPress={signIn} style={styles.btnPrimary}>
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={signUp} style={styles.btnGreen}>
          <Text style={styles.btnPrimaryText}>Create Account</Text>
        </TouchableOpacity>
      )}

      {/* OR Separator */}
      <Text style={styles.orText}>OR</Text>

      {/* Google Sign-In Button */}
      <TouchableOpacity 
        onPress={() => promptAsync()} 
        style={styles.googleButton} 
        disabled={!request}
      >
        <Image 
          source={require('../assets/images/google_logo.png')} 
          style={styles.googleIcon} 
          resizeMode="contain"  // Ensure the image scales properly to fit the button
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start', // Brings elements higher
    alignItems: 'center',
    paddingTop: 40, // Reduces top spacing
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10, // Reducing bottom space
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  inputField: {
    marginVertical: 6,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#fff',
    width: 280,
    textAlign: 'center',
  },
  btnPrimary: {
    backgroundColor: '#28a745',
    marginVertical: 6,
    width: 280,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnGreen: {
    backgroundColor: '#28a745',
    marginVertical: 6,
    width: 280,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
  orText: {
    marginVertical: 20, // Adjusted spacing
    fontSize: 15,
    fontWeight: 'bold',
    color: '#666',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    width: 280,
    justifyContent: 'center',
  },
  googleIcon: {
    width: 280,
    height: 50,
    marginRight: 8, // Adjusted spacing
  },
});

export default Page;
