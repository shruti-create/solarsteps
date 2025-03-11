import React, { useState, useEffect } from "react";
import { View, Keyboard, TouchableWithoutFeedback,Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen2 = ({ navigation }) => {
  const [points, setPoints] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const getPhoneNumber = async () => {
      try {
        const storedData = await AsyncStorage.getItem("user_data");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setPhoneNumber(parsedData.phoneNumber);
          console.log("Phone number set:", parsedData.phoneNumber);
        }
      } catch (error) {
        console.error("Error retrieving phone number:", error);
      }
    };
    getPhoneNumber();
  }, []);

  const handleNext = async () => {
    if (points.length === 4) {
      try {
        await AsyncStorage.setItem("user_data", JSON.stringify({ phoneNumber, points, friends: ""}));
        navigation.replace("LoginScreen3"); 
      } catch (error) {
        console.error("Error saving points", error);
      }
    } else {
      Alert.alert("Error", "Points must be exactly 4 digits.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <View style={styles.container} onPress={Keyboard.dismiss}>
      <Text style={styles.title}>How many points do you want to earn PER WEEK?</Text>
      
      {/* Editable TextInput */}
      <TextInput
        style={styles.input}
        placeholder="_ _ _ _"
        value={points}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, "").slice(0, 4); 
          setPoints(numericText);
        }}
        keyboardType="numeric"
        maxLength={4}
      />

      <Text style={styles.text}> Tip: complete daily tasks to earn more points!! </Text>

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

export default LoginScreen2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E3F3FF",
  },
  text: {
    fontFamily: "Manjari",
    color: "#378258",
    top: 20,
    fontSize: 14,
    textAlign: "center", 
    width: '60%', 
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
    width: "50%",
    padding: 10,
    fontSize: 24, 
    textAlign: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#378258",
    letterSpacing: 8, 
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
