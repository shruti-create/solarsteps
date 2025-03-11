import React, { useState, useEffect } from "react";
import { 
    View, Text, Keyboard, TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Alert, Modal, TextInput, Image, Button
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";

const weeklyTasksList = [
    "Exercise for 30 minutes",
    "Read a book for 1 hour",
    "Cook a homemade meal",
    "Meditate for 15 minutes",
];

const generalTasksList = [
    "Drink 8 glasses of water",
    "Take a 10-minute walk",
    "Journal for 5 minutes",
    "Clean your workspace",
    "Call a friend or family",
];

const TasksScreen = () => {
    const [weeklyTask, setWeeklyTask] = useState(weeklyTasksList[0]); 
    const [generalTasks, setGeneralTasks] = useState(generalTasksList);
    const [earnedPoints, setEarnedPoints] = useState(0);  
    const [pointsGoal, setPointsGoal] = useState(100); 
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [proofText, setProofText] = useState("");
    const [proofImage, setProofImage] = useState(null);

    useEffect(() => {
        loadPointsData();
    }, []);

    const loadPointsData = async () => {
        try {
            const storedData = await AsyncStorage.getItem("user_data"); 
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const phoneNumber = parsedData.phoneNumber; 

                if (phoneNumber) {
                    const storedGoal = parsedData.points;
                    if (storedGoal !== null) {
                        setPointsGoal(parseInt(storedGoal));
                    } 
                    const storedEarned = await AsyncStorage.getItem(`earnedPoints_${phoneNumber}`);
                    if (storedEarned !== null) {
                        setEarnedPoints(parseInt(storedEarned));
                    } else {
                        setEarnedPoints(0); 
                    }
                }
            }
        } catch (error) {
            console.error("Error loading points:", error);
        }
    };

    const saveEarnedPoints = async (newEarnedPoints) => {
        try {
            setEarnedPoints(newEarnedPoints);
            const storedData = await AsyncStorage.getItem("user_data");
            if (storedData) {
                const parsedData = JSON.parse(storedData);
                const phoneNumber = parsedData.phoneNumber;
                if (phoneNumber) {
                    await AsyncStorage.setItem(`earnedPoints_${phoneNumber}`, newEarnedPoints.toString());
                }
            }
        } catch (error) {
            console.error("Error saving earned points:", error);
        }
    };

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setModalVisible(true);
    };

    const handlePickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setProofImage(result.assets[0].uri);
        }
    };

    const handleSubmitTask = async () => {
        if (!proofText || !proofImage) {
            Alert.alert("Incomplete", "Please add a description and a proof image.");
            return;
        }
    
        try {
            const storedData = await AsyncStorage.getItem("user_data");
            if (!storedData) {
                Alert.alert("Error", "No user data found.");
                return;
            }
    
            const parsedData = JSON.parse(storedData);
            const phoneNumber = parsedData.phoneNumber;
    
            if (!phoneNumber) {
                Alert.alert("Error", "No phone number associated with the account.");
                return;
            }
    
            const storedProofs = await AsyncStorage.getItem(`proofs_${phoneNumber}`);
            let proofs = storedProofs ? JSON.parse(storedProofs) : [];
    
            const newProof = {
                task: selectedTask,
                message: proofText,
                image: proofImage,
                timestamp: new Date().toISOString(),
            };
    
            proofs.push(newProof);
    
            await AsyncStorage.setItem(`proofs_${phoneNumber}`, JSON.stringify(proofs));
    
            let newEarnedPoints = earnedPoints;
            if (selectedTask === weeklyTask) {
                newEarnedPoints += 60;
                setWeeklyTask(weeklyTasksList[Math.floor(Math.random() * weeklyTasksList.length)]);
            } else {
                newEarnedPoints += 20;
                setGeneralTasks(generalTasks.filter((task) => task !== selectedTask));
            }
            saveEarnedPoints(newEarnedPoints);
    
            setModalVisible(false);
            setProofText("");
            setProofImage(null);
    
            Alert.alert("Success", "Your proof has been saved!");
        } catch (error) {
            console.error("Error saving proof:", error);
            Alert.alert("Error", "Failed to save proof. Please try again.");
        }
    };
    

    return (
        
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', top: 90, left: 5, position: 'absolute'}}>
                <View style={styles.progressContainer}>
                    <Text style = {styles.progressText} >{pointsGoal}</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { height: `${(earnedPoints / pointsGoal) * 100}%` }]}/>
                    </View>
                    <Text style={styles.progressText}>{earnedPoints}</Text>
                </View>
                <View style={{ flexDirection: 'column', position: 'absolute', left: 50}}>
                <Text style = {styles.mainText}> Solar Steps </Text>
                
                <TouchableOpacity style={styles.weeklyTask} onPress={() => handleTaskClick(weeklyTask)}>
                    <Text style = {{color: '#378258', fontSize: 30}}>Weekly Task </Text>
                    <Text style={styles.weeklyTaskText}>{weeklyTask}</Text>
                </TouchableOpacity>

                <View style={styles.divider} />

                
                {generalTasks.map((task, index) => (
                    <TouchableOpacity key={index} style={styles.taskItem} onPress={() => handleTaskClick(task)}>
                    <Text style={styles.taskText}>{task}</Text>
                    </TouchableOpacity>
                ))}
                </View>
        </View>

        {/* Task Completion Modal */}
        <Modal visible={modalVisible} animationType="slide" transparent={false} >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

            <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Create a Post</Text>            
            <Text style={styles.modalCaption}>
                <Text style={{ fontStyle: 'italic' }}>Share Some solarpunk</Text> with your friends today!
                {"\n"}
                {"\n"}
                Task: {selectedTask}
            </Text>
            <Text style = {styles.message}> Message </Text>
            <View style={styles.inputContainer}>
                {proofText.length === 0 && (
                    <Text style={styles.placeholderText}>What are you sharing?...</Text>
                )}
                <TextInput
                    style={styles.input}
                    value={proofText}
                    onChangeText={setProofText}
                    multiline={true} 
                    textAlignVertical="top" 
                />
            </View>


            <Text style = {styles.addMedia}> Add Media </Text>
            <TouchableOpacity onPress={handlePickImage} style={styles.imageButton}>
               
                {!proofImage ? (
                    <Image source={require('../assets/add_media.png')} style={styles.buttonImage} />
                ) : (
                    <Image source={{ uri: proofImage }} style = {styles.previewImage}/>
                )}
            </TouchableOpacity>

            
            <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => {
                    setProofImage(null); 
                    setProofText(""); 
                    setModalVisible(false); 
                }}
            >
                <Image source={require("../assets/back.png")} style={styles.buttonImage2} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmitTask}>
                <Image source={require("../assets/post.png")} style={styles.buttonImage} />
            </TouchableOpacity>
            
            </View>
            </TouchableWithoutFeedback>

        </Modal>
        </View>
        
    );
};

export default TasksScreen;

const styles = StyleSheet.create({
    message:{
        position: 'absolute', 
        top: 270, 
        left: 30,
        color: '#378258',  
        textDecorationLine: 'underline',  
        fontSize: '18'
      },
    addMedia:{
      position: 'absolute', 
      top: 465, 
      left: 30,
      color: '#378258',  
      textDecorationLine: 'underline',  
      fontSize: '18'
    },
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: "#E3F3FF",
    },
    progressContainer: {
      alignItems: "center",
      marginBottom: 20,
    },
    progressBar: {
      width: 20,
      height: 650,
      backgroundColor: "#BBD2E2",
      borderRadius: 10,
      overflow: "hidden",
    },
    progressFill: {
      width: "100%",
      backgroundColor: "#378258",
      position: "absolute",
      bottom: 0,
    },
    progressText: {
      marginTop: 5,
      fontWeight: "bold",
      color: "#378258",
    },
    weeklyTask: {
        backgroundColor: "#BBD2E2",
        padding: 20,
        borderRadius: 20,
        width: 290, 
        height: 150,
        alignItems: "top",
        justifyContent: "left",
        marginBottom: 20,
        top: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5, 
    },      
    weeklyTaskText: {
      color: "#378258",
      fontSize: 20,
      top: 10
    },
    divider: {
      height: 2,
      backgroundColor: "#378258",
      width: "290",
      marginVertical: 15,
      height: 4,
    },
    taskItem: {
      backgroundColor: "#fff",
      padding: 15,
      borderRadius: 20,
      width: "290",
      height: "70",
      marginVertical: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 5,
      elevation: 5, 
    },
    taskText: {
      color: "#378258",
      fontSize: 20,
    },
    submitButton: {
        position: "absolute",
        top: 680,
        left: 200, 
        height: 60,
        justifyContent: "center",
        alignItems: "center",
      },
    buttonImage: {
        width: 180,
        resizeMode: "contain",
      },
    buttonImage2: {
        width: 120,
        resizeMode: "contain",
      },
    imageButton: {
        top: 380, 
        left: 26, 
        position: 'absolute'
    },

    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#E3F3FF",  
    },
    modalContent: {
      width: "85%",
      backgroundColor: "#fff",
      borderRadius: 20,
      padding: 20,
      alignItems: "center",
      elevation: 10,  
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
    },
    modalTitle: {
      fontSize: 30,
      color: "#378258",
      marginBottom: 10,
      top:150, 
      left: 30, 
      position: 'absolute'
    },
    modalCaption: {
        fontSize: 15,
        color: "#378258",
        marginBottom: 10,
        top:200, 
        left: 30, 
        position: 'absolute'
      },
    previewImage: {
      width: 150,
      height: 150,
      marginVertical: 10,
      borderRadius: 10,
      top: 120,
      left: 8,  
    },
    modalButtons: {
      flexDirection: "row",
      marginTop: 10,
    },
    cancelButton: {
      borderRadius: 10,
      marginRight: 10,
      width: 100,
      position: 'absolute', 
      top: 40, 
      left: 20
    },
    buttonText: {
      color: "#fff",
      fontSize: 16,
      fontWeight: "bold",
    },
    mainText: {
        left: 130,
        fontSize: 30,
        color: "#378258",
    }, 
    inputContainer: {
        backgroundColor: "#E1E7EC",
        padding: 10,
        width: "85%",
        height: 150, 
        borderRadius: 20,
        borderWidth: 1,
        borderColor: "#ccc",
        marginBottom: 15,
        position: 'absolute', 
        top: 300, 
        left: 30, 
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      placeholderText: {
        position: 'absolute',
        top: 20,
        left: 15,
        fontSize: 16,
        color: "#888", 
      },
      input: {
        fontSize: 16,
        color: "#000",
        flex: 1, 
        textAlignVertical: "top",  
        padding: 5,
        height: "100%",  
        width: "100%",  
        multiline: true,  
    },
    
  });
  