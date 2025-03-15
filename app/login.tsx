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

import { 
  View, Text, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, 
  Image, TextInput, TouchableOpacity, Alert 
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { defaultStyles } from '../constants/Styles';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import { 
  createUserWithEmailAndPassword, signInWithEmailAndPassword 
} from 'firebase/auth';
import { router } from 'expo-router';

const Page = () => {
  const { type } = useLocalSearchParams<{ type: string }>();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = FIREBASE_AUTH;

  const signIn = async () => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Sign-in failed', error.message);
    }
    setLoading(false);
  };

  const signUp = async () => {
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Sign-up failed', error.message);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'} 
      style={styles.container}
    >
      {loading && (
        <View style={defaultStyles.loadingOverlay}>
          <ActivityIndicator size="large" color="#fff" />
        </View>
      )}

      {/* Logo */}
      <Image style={styles.logo} source={require('../assets/images/iCueC.png')} />

      {/* Title */}
      <Text style={styles.title}>
        {type === 'login' ? 'Welcome Back' : 'Create an Account'}
      </Text>

      {/* Input Fields */}
      <View style={styles.inputContainer}>
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
      </View>

      {/* Buttons */}
      {type === 'login' ? (
        <TouchableOpacity onPress={signIn} style={[defaultStyles.btn, styles.btnPrimary]}>
          <Text style={styles.btnPrimaryText}>Login</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={signUp} style={[defaultStyles.btn, styles.btnGreen]}>
          <Text style={styles.btnPrimaryText}>Create Account</Text>
        </TouchableOpacity>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,  // Reduced padding to move everything up further
    justifyContent: 'flex-start',  // Align everything to the top
    alignItems: 'center',          // Align everything horizontally centered
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 10,  // Reduced margin to move logo closer to the top
    borderRadius: 60,  // Circular logo
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 10,  // Reduced margin to move the title up
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center', // Center the input fields horizontally
    marginBottom: 15,  // Reduced margin to move input fields up
  },
  inputField: {
    marginVertical: 8,  // Reduced vertical margin for input fields
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    width: 300,  // Set width to ensure proper centering
    textAlign: 'center',  // Center text inside textboxes
  },
  btnPrimary: {
    backgroundColor: '#28a745',
    marginVertical: 8,  // Reduced margin to move button up
    width: 300,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnGreen: {
    backgroundColor: '#28a745', // Green color for Create Account button
    marginVertical: 8,  // Reduced margin to move button up
    width: 300,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default Page;
