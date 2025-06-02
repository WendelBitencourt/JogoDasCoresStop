import React, { useRef, useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Text,
  Animated,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import * as Speech from "expo-speech";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";

export default function App() {
  const [darkMode, setDarkMode] = useState(false);

  const colors = [
    { name: "Verde", hex: "#179141" },
    { name: "Roxo", hex: "#9400d3" },
    { name: "Preto", hex: "#000" },
    { name: "Rosa", hex: "#ff007f" },
    { name: "Cinza", hex: "#808080" },
    { name: "Amarelo", hex: "#FFFF00" },
    { name: "Laranja", hex: "#FFA500" },
  ];

  const speakColorName = (colorName) => {
    Speech.speak(colorName, { language: "pt-BR" });
  };

  const scales = useRef(colors.map(() => new Animated.Value(1))).current;

  const handlePressIn = (index) => {
    Animated.spring(scales[index], {
      toValue: 0.93,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (index, colorName) => {
    Animated.spring(scales[index], {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
    speakColorName(colorName);
  };

  useEffect(() => {
    // Impede que a splash screen suma automaticamente
    SplashScreen.preventAutoHideAsync();

    // Aguarda 2 segundos antes de esconder a splash
    const timer = setTimeout(() => {
      SplashScreen.hideAsync();
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Estilos dinâmicos para modo claro/escuro
  const dynamicStyles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: darkMode ? "#181818" : "#ecf0f1",
      padding: 8,
      paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    colorButton: {
      width: 200,
      height: 60,
      justifyContent: "center",
      alignItems: "center",
      marginVertical: 10,
      borderRadius: 10,
      elevation: 3,
    },
    buttonText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "white",
      textShadowColor: "rgba(0,0,0,0.5)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 2,
    },
    toggleButton: {
      position: "absolute",
      top: Platform.OS === "android" ? 16 + (StatusBar.currentHeight || 0) : 16,
      right: 20,
      backgroundColor: darkMode ? "#333" : "#bbb",
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 20,
      elevation: 2,
      zIndex: 10,
    },
    toggleButtonText: {
      color: darkMode ? "#fff" : "#222",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: darkMode ? "#181818" : "#ecf0f1" }}
    >
      <ExpoStatusBar
        style={darkMode ? "light" : "dark"}
        hidden={false}
        translucent
      />
      <View style={dynamicStyles.container}>
        <TouchableOpacity
          style={dynamicStyles.toggleButton}
          onPress={() => setDarkMode((prev) => !prev)}
        >
          <Text style={dynamicStyles.toggleButtonText}>
            {darkMode ? "Modo Claro" : "Modo Escuro"}
          </Text>
        </TouchableOpacity>
        {colors.map((color, index) => (
          <TouchableWithoutFeedback
            key={index}
            onPressIn={() => handlePressIn(index)}
            onPressOut={() => handlePressOut(index, color.name)}
          >
            <Animated.View
              style={[
                dynamicStyles.colorButton,
                {
                  backgroundColor: color.hex,
                  transform: [{ scale: scales[index] }],
                },
              ]}
            >
              <Text style={dynamicStyles.buttonText}>{color.name}</Text>
            </Animated.View>
          </TouchableWithoutFeedback>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ecf0f1",
    padding: 8,
  },
  colorButton: {
    width: 200,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    borderRadius: 10,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
