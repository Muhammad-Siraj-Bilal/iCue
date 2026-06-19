// import React from 'react';
// import FontAwesome from '@expo/vector-icons/FontAwesome';
// import { Link, Tabs } from 'expo-router';
// import { Pressable, Text } from 'react-native';

// import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/components/useColorScheme';
// import { useClientOnlyValue } from '@/components/useClientOnlyValue';
// import { getAuth } from 'firebase/auth';
// import { router } from 'expo-router';

// // You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
// function TabBarIcon(props: {
//   name: React.ComponentProps<typeof FontAwesome>['name'];
//   color: string;
// }) {
//   return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
// }

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const [isLoading, setIsLoading] = React.useState(true);

//   React.useEffect(() => { // Use useEffect for side effects
//     const unsubscribe = getAuth().onAuthStateChanged((user) => {
//       setIsLoading(false);
//       if (!user) {
//         router.replace("/");
//       }
//     });
//     return unsubscribe; // Cleanup the listener when the component unmounts
//   }, []); // Empty dependency array means this effect runs once on mount

//   if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;

//   return (
//     <Tabs
//       screenOptions={{
//         tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
//         // Disable the static render of the header on web
//         // to prevent a hydration error in React Navigation v6.
//         headerShown: useClientOnlyValue(false, true),
//       }}>
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Dashboard',
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />,
//           headerRight: () => (
//             <Link href="/modal" asChild>
//               <Pressable>
//                 {({ pressed }) => (
//                   <FontAwesome
//                     name="info-circle"
//                     size={25}
//                     color={Colors[colorScheme ?? 'light'].text}
//                     style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
//                   />
//                 )}
//               </Pressable>
//             </Link>
//           ),
//         }}
//       />
//        {/* Added the new "one" tab */}
//        <Tabs.Screen
//         name="one" // The name used for navigation (e.g., in `router.push('/one')`)
//         options={{
//           title: 'Chatbot', // The text displayed in the tab bar
//           tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />, // Example icon
//         }}
//       />
//       <Tabs.Screen
//         name="two"
//         options={{
//           title: 'Profile',
//           tabBarIcon: ({ color }) => <TabBarIcon name="code" color={color} />, // Corrected: Added missing closing tag
//         }}
//       />
//     </Tabs>
//   );
// }

// ----------------------------------------------------------------------------------------------------------

import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Link, Tabs } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { useClientOnlyValue } from '@/components/useClientOnlyValue';
import { tryGetFirebaseAuth } from '@/FirebaseConfig';
import { router } from 'expo-router';
import { CueTheme } from '@/constants/CueTheme';

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => { // Use useEffect for side effects
    const auth = tryGetFirebaseAuth();
    if (!auth) {
      setIsLoading(false);
      router.replace('/');
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoading(false);
      if (!user) {
        router.replace('/');
      }
    });

    return unsubscribe; // Cleanup the listener when the component unmounts
  }, []); // Empty dependency array means this effect runs once on mount

  if (isLoading) return <Text style={{ paddingTop: 30 }}>Loading...</Text>;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: CueTheme.colors.brass,
        tabBarInactiveTintColor: 'rgba(234, 244, 239, 0.65)',
        tabBarStyle: {
          backgroundColor: CueTheme.colors.feltDark,
          borderTopColor: 'rgba(215, 181, 109, 0.18)',
          height: 74,
          paddingTop: 8,
          paddingBottom: 12,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        sceneStyle: {
          backgroundColor: CueTheme.colors.felt,
        },
        headerShown: useClientOnlyValue(false, true),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <TabBarIcon name="dashboard" color={color} />, // Dashboard icon
          headerRight: () => (
            <Link href="/Information" asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? 'light'].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="one"
        options={{
          title: 'Chatbot',
          tabBarIcon: ({ color }) => <TabBarIcon name="comments" color={color} />, // Chatbot icon
        }}
      />
      <Tabs.Screen
        name="two"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color={color} />, // Profile icon
        }}
      />
    </Tabs>
  );
}
