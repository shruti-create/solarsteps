import React, { useEffect } from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userData = await AsyncStorage.getItem("user_data");
        if (userData) {
          navigation.replace("Home"); 
        } else {
          navigation.replace("Login"); 
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        navigation.replace("Login"); 
      }
    };

    setTimeout(() => {
      checkLoginStatus();
    }, 2000); 
  }, []);

  return (
    <View style={styles.container}>
      <Image 
        source={require("../assets/splash.png")} 
        style={styles.image}
      />
      <Text style={styles.text}>SolarSteps</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F3FF",
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
  text: {
    fontFamily: "Manjari",
    color: "#378258",
    fontSize: 35,
    marginTop: 20, 
  },
});
