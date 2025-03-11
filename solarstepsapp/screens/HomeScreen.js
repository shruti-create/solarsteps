import React, { useState, useEffect } from "react";
import { View,Keyboard, TouchableWithoutFeedback, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import TasksScreen from "./TasksScreen";  
import FriendsScreen from "./AddFriends";
import CommunityScreen from "./CommunityScreen";

const HomeScreen = ({ navigation }) => {
  const [isNavVisible, setIsNavVisible] = useState(false); 
  const [currentComponent, setCurrentComponent] = useState(<TasksScreen />)
  const toggleNavbar = () => {
    setIsNavVisible(!isNavVisible);
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("user_data");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Error", "Failed to log out. Please try again.");
      console.error("Error logging out:", error);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      
      <View style={styles.container}>
        <View style={styles.navbar}>
          <TouchableOpacity onPress={toggleNavbar}>
            <MaterialIcons name="menu" size={50} color="black" />
          </TouchableOpacity>
        </View>

        {isNavVisible && (
          <View style={styles.navbarContainer}>
          <TouchableOpacity onPress={() => setCurrentComponent(() => <TasksScreen />)}>
          <Text style={styles.navItem}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity  onPress={() => setCurrentComponent(() => <FriendsScreen />)}>
          <Text style={styles.navItem}>Add Friends</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCurrentComponent(() => <CommunityScreen />)}>
          <Text style={styles.navItem}>Community Feed</Text>
          </TouchableOpacity>``

          </View>
        )}

        <View style={styles.tasksContainer}>
          {currentComponent}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
    
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F3FF",
    alignItems: "center",
  },
  navbar: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 100, 
  },
  navbarContainer: {
    position: "absolute",
    left: 0,
    width: 200,
    backgroundColor: "#BBD2E2",
    paddingVertical: 110,
    elevation: 5,
    zIndex: 99,  
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    height: '100%', 
  },
  navItem: {
    fontSize: 18,
    paddingVertical: 20,
    paddingHorizontal: 20,
    textAlign: "center",
    justifyContent: "center", 
    borderBottomWidth: 1,
    borderBottomColor: "#14405F",
    color: '#14405F', 
    height:62, 
  },
  tasksContainer: {
    flex: 1,
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  logoutButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
