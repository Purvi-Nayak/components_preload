import React, { createContext, useContext, useState } from "react";
import { useColorScheme } from "react-native";
import { Colors } from "../constants/theme";

// Theme definitions
export interface Theme {
  dark: boolean;
  colors: {
    primary: string;
    background: string;
    card: string;
    text: string;
    border: string;
    notification: string;
    // Status bar colors
    statusBarBackground: string;
    statusBarStyle: "default" | "light-content" | "dark-content";
    // Additional theme colors for your app
    surface: string;
    onSurface: string;
    accent: string;
    error: string;
    success: string;
    warning: string;
  };
}

// Light theme
export const lightTheme: Theme = {
  dark: false,
  colors: {
    primary: "#2196F3",
    background: "#FFFFFF",
    card: "#FFFFFF",
    text: "#000000",
    border: "#E0E0E0",
    notification: "#FF3B30",
    statusBarBackground: "#FFFFFF",
    statusBarStyle: "dark-content",
    surface: "#F5F5F5",
    onSurface: "#333333",
    accent: "#03DAC4",
    error: "#F44336",
    success: "#4CAF50",
    warning: "#FF9800",
  },
};

// Dark theme
export const darkTheme: Theme = {
  dark: true,
  colors: {
    primary: "#BB86FC",
    background: "#121212",
    card: "#1E1E1E",
    text: "#FFFFFF",
    border: "#333333",
    notification: "#FF6B6B",
    statusBarBackground: "#000000",
    statusBarStyle: "light-content",
    surface: "#2A2A2A",
    onSurface: "#E0E0E0",
    accent: "#03DAC4",
    error: "#CF6679",
    success: "#81C784",
    warning: "#FFB74D",
  },
};

// Theme context
interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  toggleTheme?: () => void; // Optional manual toggle
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider
interface ThemeProviderProps {
  children: React.ReactNode;
  forcedTheme?: "light" | "dark"; // Optional forced theme for testing
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  forcedTheme,
}) => {
  const systemColorScheme = useColorScheme();
  const [manualTheme, setManualTheme] = useState<"light" | "dark" | null>(null);

  // Determine current theme
  const getCurrentTheme = (): Theme => {
    if (forcedTheme) {
      return forcedTheme === "dark" ? darkTheme : lightTheme;
    }

    if (manualTheme) {
      return manualTheme === "dark" ? darkTheme : lightTheme;
    }

    // Default to system theme
    return systemColorScheme === "dark" ? darkTheme : lightTheme;
  };

  const currentTheme = getCurrentTheme();
  const isDark = currentTheme.dark;

  // Manual theme toggle (for future settings screen)
  const toggleTheme = () => {
    setManualTheme((prev) => {
      if (prev === null) {
        // First manual toggle - switch from system theme
        return systemColorScheme === "dark" ? "light" : "dark";
      }
      return prev === "dark" ? "light" : "dark";
    });
  };

  const contextValue: ThemeContextType = {
    theme: currentTheme,
    isDark,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

// Helper hooks for common use cases
export const useThemeColors = () => {
  const { theme } = useTheme();
  return theme.colors;
};

export const useIsDark = () => {
  const { isDark } = useTheme();
  return isDark;
};

// Theme color hook for conditional light/dark colors
export const useThemeColor = (
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light
) => {
  const { isDark } = useTheme();
  const colorFromProps = props[isDark ? "dark" : "light"];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    // Fallback to basic Colors mapping for common color names
    const colorMap: Record<string, string> = isDark
      ? Colors.dark
      : Colors.light;
    return (
      colorMap[colorName] || (isDark ? Colors.dark.text : Colors.light.text)
    );
  }
};

// Status bar hook - this will be used in your StatusBar component
export const useStatusBarStyle = () => {
  const { theme } = useTheme();
  return {
    barStyle: theme.colors.statusBarStyle,
    backgroundColor: theme.colors.statusBarBackground,
  };
};
