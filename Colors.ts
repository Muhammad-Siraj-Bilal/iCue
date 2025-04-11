/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
    tabBg: '#f2f2f2', // Add this line for light mode
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
    tabBg: '#333', // Add this line for dark mode
  },
};

export const ColorPalette = {
  primary: '#20AB6E',
  lime: '#D7FFD4',
  pink: '#F655FF',
  brown: '#29271D',
  sky: '#E5EDFF',
  teal: '#0E4D45',
  yellow: '#FCBB80',
  orange: '#EF580B',
  blue: '#0000FA',
  green: '#172E15',
  light: '#FFFCFF',
  grey: '#242026',
  greyLight: '#B8B3BA',
  input: '#EEE9F0',
  selected: '#F7F2F9',
  dark: '#2F2D32',
}
