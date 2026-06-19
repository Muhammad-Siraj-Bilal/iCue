import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  StyleProp,
  TextStyle,
} from 'react-native';
import type { ReactNode } from 'react';
import { CueTheme, cueShadow } from '@/constants/CueTheme';

type GoldButtonProps = {
  onPress: () => void;
  children: ReactNode;
  width?: number;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export default function GoldButton({
  onPress,
  children,
  width,
  style,
  textStyle,
}: GoldButtonProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[styles.button, width != null ? { width } : null, style]}
    >
      {typeof children === 'string' ? (
        <Text style={[styles.label, textStyle]}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: CueTheme.colors.brass,
    borderRadius: CueTheme.radius.pill,
    paddingVertical: 15,
    paddingHorizontal: 28,
    alignItems: 'center',
    alignSelf: 'center',
    marginVertical: 8,
    borderWidth: 1,
    borderColor: CueTheme.colors.brassDeep,
    borderBottomWidth: 5,
    borderBottomColor: CueTheme.colors.brassDeep,
    ...cueShadow,
  },
  label: {
    color: CueTheme.colors.rail,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
});
