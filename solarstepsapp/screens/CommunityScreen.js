import React, { useState, useEffect } from "react";
import { View, Keyboard, TouchableWithoutFeedback, Text, Image, FlatList, StyleSheet} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProofSubmissionsScreen = () => {
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    const loadProofs = async () => {
      try {
        const storedData = await AsyncStorage.getItem("user_data");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const phoneNumber = parsedData.phoneNumber || "Unknown";
          
          const storedProofs = await AsyncStorage.getItem(`proofs_${phoneNumber}`);
          if (storedProofs) {
            const proofList = JSON.parse(storedProofs);
            const formattedProofs = proofList.map(proof => ({
              ...proof,
              phoneNumber
            }));
            setProofs(formattedProofs);
          }
        }
      } catch (error) {
        console.error("Error loading proofs:", error);
      }
    };

    loadProofs();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
    
    <View style={styles.container}>
      <Text style={styles.title}>Community Feed</Text>
      <View style={styles.divider} />
      
      {proofs.length > 0 ? (
        <FlatList
          data={proofs}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.proofItem}>
              <Text style={styles.phoneNumber}> {item.phoneNumber}</Text>
              <Text style={styles.comment}> "{item.message}"</Text>
              <Image source={{ uri: item.image }} style={styles.proofImage} />
            </View>
          )}
        />
      ) : (
        <Text style={styles.noProofsText}>No proofs submitted yet.</Text>
      )}
    </View>
    </TouchableWithoutFeedback>
    
  );
};

export default ProofSubmissionsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E3F3FF",
    position: 'absolute', 
    top: 170, 
    left: 20, 
    height: '70%', 
    width: '100%'
  },
  title: {
    fontSize: 30,
    color: "#378258",
    marginBottom: 10,
    position: 'absolute', 
    top: -60, 
  },
  proofItem: {
    width: "350",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  phoneNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#378258",
  },
  comment: {
    fontSize: 14,
    marginVertical: 5,
    color: "#333",
    textAlign: "right",
  },
  proofImage: {
    width: 320,
    height: 320,
    borderRadius: 10,
    marginTop: 10,
  },
  noProofsText: {
    marginTop: 20,
    fontSize: 18,
    color: "#888",
  },
  divider: {
    height: 2,
    backgroundColor: "#378258",
    width: "120%",
    position: "absolute",
    top: -10,
    left: -20
  },
});
