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
import { tryGetFirebaseAuth } from '../FirebaseConfig';
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithCredential, GoogleAuthProvider 
} from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { CueTheme, cueShadow } from '@/constants/CueTheme';

WebBrowser.maybeCompleteAuthSession(); // Required for Expo Web

const googleWebClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const googleAndroidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID;
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = tryGetFirebaseAuth();

  // Set up Google Sign-In
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId: googleWebClientId,
    androidClientId: googleAndroidClientId,
    iosClientId: googleIosClientId,
    selectAccount: true,
  });

  // Handle Google Sign-In Response
  useEffect(() => {
    if (!auth) {
      return;
    }

    if (response?.type === "success") {
      const idToken = response.params?.id_token || response.authentication?.idToken;
      if (!idToken) {
        Alert.alert("Google Sign-In Failed", "Google did not return an ID token for Firebase sign-in.");
        return;
      }
      const credential = GoogleAuthProvider.credential(idToken);
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
    if (!auth) {
      Alert.alert('Auth unavailable', 'Firebase auth could not start in this session. Restart Expo after the latest fix.');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log("Login successful, navigating...");
      router.replace('/(tabs)'); // Navigate to main app
    } catch (error: any) {
      Alert.alert('Sign-in failed', error.message);
    }
  };

  const signUp = async () => {
    if (!auth) {
      Alert.alert('Auth unavailable', 'Firebase auth could not start in this session. Restart Expo after the latest fix.');
      return;
    }

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
      <View style={styles.heroBand} />
      <View style={styles.card}>
        <Image style={styles.logo} source={require('../assets/images/iCueC.png')} />
        <Text style={styles.eyebrow}>iCue Account</Text>
        <Text style={styles.title}>
          {type === 'login' ? 'Welcome Back' : 'Create an Account'}
        </Text>
        <Text style={styles.subtitle}>
          Sign in to save shots, compare patterns, and keep your training history attached to your profile.
        </Text>

        <TextInput
          autoCapitalize="none"
          placeholder="Email"
          placeholderTextColor="#7A867F"
          style={styles.inputField}
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          autoCapitalize="none"
          placeholder="Password"
          placeholderTextColor="#7A867F"
          style={styles.inputField}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {type === 'login' ? (
          <TouchableOpacity onPress={signIn} style={styles.btnPrimary}>
            <Text style={styles.btnPrimaryText}>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={signUp} style={styles.btnGreen}>
            <Text style={styles.btnPrimaryText}>Create Account</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.orText}>OR CONTINUE WITH</Text>

        <TouchableOpacity 
          onPress={() => {
            if (!googleWebClientId || !googleAndroidClientId || !googleIosClientId) {
              Alert.alert('Google Sign-In unavailable', 'Add your Google client IDs to the local .env file first.');
              return;
            }
            promptAsync();
          }} 
          style={styles.googleButton} 
          disabled={!request}
        >
          <Image 
            source={require('../assets/images/google_logo.png')} 
            style={styles.googleIcon} 
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CueTheme.colors.felt,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroBand: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '38%',
    backgroundColor: CueTheme.colors.feltDeep,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: CueTheme.colors.card,
    borderRadius: CueTheme.radius.lg,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    ...cueShadow,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 12,
    alignSelf: 'center',
  },
  eyebrow: {
    color: CueTheme.colors.brassDeep,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.3,
    textAlign: 'center',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 10,
    textAlign: 'center',
    color: CueTheme.colors.rail,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: CueTheme.colors.slateSoft,
    marginBottom: 18,
  },
  inputField: {
    marginVertical: 6,
    height: 54,
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFCF5',
    width: '100%',
    color: CueTheme.colors.slate,
  },
  btnPrimary: {
    backgroundColor: CueTheme.colors.feltDeep,
    marginTop: 10,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CueTheme.colors.brass,
  },
  btnGreen: {
    backgroundColor: CueTheme.colors.feltDeep,
    marginTop: 10,
    width: '100%',
    paddingVertical: 15,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: CueTheme.colors.brass,
  },
  btnPrimaryText: {
    color: CueTheme.colors.chalk,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  orText: {
    marginVertical: 18,
    fontSize: 12,
    fontWeight: 'bold',
    color: CueTheme.colors.brassDeep,
    letterSpacing: 1.3,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFCF5',
    borderWidth: 1,
    borderColor: CueTheme.colors.line,
    borderRadius: 18,
    paddingVertical: 12,
    width: '100%',
    justifyContent: 'center',
  },
  googleIcon: {
    width: 220,
    height: 32,
  },
});

export default Page;
