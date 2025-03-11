import React, { useState, useEffect } from "react";
import { View, Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity, StyleSheet, Image, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AddFriends = ({ navigation }) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]); 
  const friendsList = ["Kylee", "Shruti", "Ryan", "Reece", "Oliver", "Mandy", "Sandy", "Randy", "Grandy", "Slandy", "tandy", "handy", "gandy"];

  useEffect(() => {
    const loadExistingFriends = async () => {
      try {
        const storedData = await AsyncStorage.getItem("user_data");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const existingFriends = parsedData.friends || [];
          
          const newFriends = friendsList.filter(friend => !existingFriends.includes(friend));
          setFilteredFriends(newFriends);
        } else {
          setFilteredFriends(friendsList); 
        }
      } catch (error) {
        console.error("Error loading friends:", error);
      }
    };

    loadExistingFriends();
  }, []);

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
        const existingFriends = parsedData.friends || [];

        parsedData.friends = [...new Set([...existingFriends, ...selectedFriends])];
        await AsyncStorage.setItem("user_data", JSON.stringify(parsedData));

        setFilteredFriends(filteredFriends.filter(friend => !selectedFriends.includes(friend)));

        setSelectedFriends([]);
      }
    } catch (error) {
      console.error("Error saving friends", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <View style={styles.container}>
      <Text style={styles.title}>Add Friends!</Text>
      <View style={styles.divider} />
      <Text style={styles.friendsStatement}>Here's some people you may know.</Text>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.friendButton, selectedFriends.includes(friend) && styles.friendSelected]}
              onPress={() => toggleFriend(friend)}
            >
              <Text style={[styles.friendText, selectedFriends.includes(friend) && styles.friendTextSelected]}>
                {friend}
              </Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noFriendsText}>No new friends available.</Text>
        )}
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={handleNext}>
        <Image source={require("../assets/SAVE.png")} style={styles.buttonImage} />
      </TouchableOpacity>
    </View>
    </TouchableWithoutFeedback>
    
  );
};

const styles = StyleSheet.create({
  friendsStatement: {
    position: "absolute",
    color: "#378258",
    top: 175,
    left: 8,
    fontStyle: "italic",
  },
  noFriendsText: {
    fontSize: 18,
    color: "#888",
    marginTop: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#E3F3FF",
  },
  title: {
    fontFamily: "Manjari",
    color: "#378258",
    fontSize: 35,
    width: "80%",
    position: "absolute",
    top: 110,
    left: 10,
  },
  scrollView: {
    flex: 1,
    width: "100%",
    marginTop: 210,
    marginBottom: 170, 
  },
  scrollContent: {
    alignItems: "center",
    paddingBottom: 20,
  },
  friendButton: {
    width: "100%",
    height: 70,
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#378258",
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
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
    bottom: 110, 
    right: 20,
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
    resizeMode: "contain",
  },
  divider: {
    height: 2,
    backgroundColor: "#378258",
    width: "110%",
    position: "absolute",
    top: 165,
  },
});

export default AddFriends;
