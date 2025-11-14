import React from "react";
import {
  Platform,
  StatusBar as RNStatusBar,
  StatusBarProps,
} from "react-native";
import { useStatusBarStyle } from "../contexts/ThemeContext";

interface ThemedStatusBarProps
  extends Omit<StatusBarProps, "barStyle" | "backgroundColor"> {
  // Allow override if needed
  forceBarStyle?: StatusBarProps["barStyle"];
  forceBackgroundColor?: string;
}

export const ThemedStatusBar: React.FC<ThemedStatusBarProps> = ({
  forceBarStyle,
  forceBackgroundColor,
  ...props
}) => {
  const { barStyle, backgroundColor } = useStatusBarStyle();

  return (
    <RNStatusBar
      barStyle={forceBarStyle || barStyle}
      backgroundColor={forceBackgroundColor || backgroundColor}
      translucent={Platform.OS === "android"} // Better handling for Android
      {...props}
    />
  );
};

// Default export for easy importing
export default ThemedStatusBar;
