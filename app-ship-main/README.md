
# AppShip

### Description

A React Native Expo Boiler Plate.


## Features

- Firebase Authentication
- Tabs



## Tech Stack

- TypeScript
- React Native (Expo)
- Firebase (Authentication)
  - Email



## Setup
#### Simulation/Device Setup
If you haven't used Expo before, follow this [expo documentation](https://docs.expo.dev/get-started/set-up-your-environment/?platform=ios&device=simulated&mode=development-build) to setup simulators and device setups.

#### Clone the Repo
```bash
  git clone https://github.com/andepants/app-ship.git my-app
  cd my-app
  npx expo install
  npx expo prebuild
  npx expo run ios
```

#### Generate Firebase credentials
1. Got to [firebase](https://firebase.google.com/)
2. Go to console
3. Add Project
4. Enter project name. Skip Analytics. Create Project
5. Click Project Settings (gear icon) in the top left
6. Scroll to "Your apps". Select the web app icon.
7. Input app nickname, hit "register".
8. Copy `.env.example` to `.env` and paste your Firebase values into the matching `EXPO_PUBLIC_FIREBASE_*` entries.

#### Local environment variables
Create a `.env` file in the project root and fill in the values from `.env.example`. This keeps Firebase, Google Sign-In, and Groq keys out of Git before you push to GitHub.

#### Turn on Firebase Authentication
1. Go to Firebase console
2. On left in product categories, click "Build" -> "Authentication"
3. Click "Get Started"
4. Enable Email/Password. Click Save.
