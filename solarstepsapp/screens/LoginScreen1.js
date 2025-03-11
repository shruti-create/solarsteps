import React, { useState } from "react";
import { View,Keyboard, TouchableWithoutFeedback, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const formatPhoneNumber = (text) => {
  let cleaned = text.replace(/\D/g, "").slice(0, 10);
  let formatted = cleaned
    .split("")
    .map((char, index) => (index === 3 || index === 6 ? `  ${char}` : char))
    .join("");

  return formatted;
};

const LoginScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleNext = async () => {
    if (phoneNumber.replace(/\D/g, "").length === 10) {
      try {
        await AsyncStorage.setItem("user_data", JSON.stringify({ phoneNumber, points: "" , friends: ""}));
        navigation.replace("LoginScreen2");
      } catch (error) {
        console.error("Error saving phone number", error);
      }
    } else {
      Alert.alert("Error", "Phone number must be exactly 10 digits.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container} onPress={Keyboard.dismiss}>
        <Text style={styles.title}>Please enter your phone number!</Text>
        <TextInput
          style={styles.input}
          placeholder="_ _ _  _ _ _  _ _ _ _"
          value={formatPhoneNumber(phoneNumber)}
          onChangeText={(text) => setPhoneNumber(text.replace(/\D/g, ""))}
          keyboardType="numeric"
          maxLength={14} 
        />
        
        <Image 
          source={require("../assets/phone_icon.png")} 
          style={styles.phoneIcon}
        />

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Image 
            source={require("../assets/login_next.png")}  
            style={styles.buttonImage}
          />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F3FF",
  },
  title: {
    fontFamily: "Manjari",
    color: "#378258",
    fontSize: 25,
    bottom: 50, 
    textAlign: "center", 
    width: '60%'
  },
  input: {
    width: "80%",
    padding: 10,
    fontSize: 24, 
    textAlign: "center",
    backgroundColor: "transparent",
    letterSpacing: 3, 
  },
  phoneIcon: {
    width: 50, 
    height: 50,
    marginTop: 20, 
    resizeMode: "contain",
  },
  button: {
    position: "absolute",
    bottom: 40, 
    right: 60, 
    width: 60, 
    height: 60,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    width: 130,
    resizeMode: "contain", 
  },
});
