import React, { useState, useEffect } from "react";
import { View,Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen3 = ({ navigation }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const friendsList = ["Kylee", "Shruti", "Ryan", "Reece", "Oliver"];

  const toggleFriend = (friend) => {
    setSelectedFriends((prevSelected) =>
    prevSelected.includes(friend)
        ? prevSelected.filter((name) => name !== friend)
        : [...prevSelected, friend]
    );
  };

  const handleNext = async () => {
    try {
        const storedData = await AsyncStorage.getItem("user_data");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        parsedData.friends = selectedFriends;
        await AsyncStorage.setItem("user_data", JSON.stringify(parsedData));
        navigation.replace("Home");
      }
    } catch (error) {
        console.error("Error saving friends", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.container} >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require("../assets/friends.png")} style={styles.friends} />
                <Text style={styles.title}>Add Friends!</Text>
            </View>
            <Text style = {{top: -30, fontSize: 15, color: '#378258'}}> Here's some people you may know. </Text>
                {friendsList.map((friend, index) => (
                    <TouchableOpacity
                    key={index}
                    style={[styles.friendButton, selectedFriends.includes(friend) && styles.friendSelected]}
                    onPress={() => toggleFriend(friend)}
                    >
                    <Text style={[styles.friendText, selectedFriends.includes(friend) && styles.friendTextSelected]}>{friend}</Text>
                    </TouchableOpacity>
                ))}
            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Image source={require("../assets/login_next.png")} style={styles.buttonImage} />
            </TouchableOpacity>
        </View>
    </TouchableWithoutFeedback>
  );
};

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
    fontSize: 35,
    textAlign: "center",
    width: '80%'
  },
  friendButton: {
    width: "80%",
    height: "8%",
    padding: 10,
    paddingLeft: 30,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#378258",
    borderRadius: 20,
    alignItems: "left",
    justifyContent:"center"
  },
  friendSelected: {
    backgroundColor: "#378258",
  },
  friendText: {
    fontSize: 25,
    color: "#378258",
  },
  friendTextSelected: {
    color: "#fff",
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
  friends: {
    width: 90, 
    left: 60, 
    top: -5, 
    resizeMode: "contain"
  }
});

export default LoginScreen3;
