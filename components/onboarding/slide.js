import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Pressable,
    Platform,
    Modal,
  } from "react-native";
import React, { useState } from "react";
import { Defs, RadialGradient, Rect, Stop, Svg } from "react-native-svg";
import { HEIGHT, WIDTH } from "@/configs/constants";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import {
  fontSizes,
  SCREEN_WIDTH,
  windowHeight,
  windowWidth,
} from "@/themes/app.constant";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import AuthModal from "../auth/auth.modal";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import JWT from "expo-jwt"; 
import axios from "axios";

  
  export default function Slide({ slide, index, setIndex, totalSlides }) {
    const [modalVisible, setModalVisible] = useState(false);


    const generateToken = async () => {
      console.log("I am in generate token")

      const response = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/generate-token`);
      const token = response.data.token;
      return token
    }


  
    const handlePress = async (index, setIndex) => {
      if (index === 2) {
        // setModalVisible(true);
        try{
          const staticUser = {
            name: "Test User",
            email: "test@example.com",
            avatar: "https://placeholder.com/avatar.jpg"
          };
          // console.log("jwt secret key", process.env.EXPO_PUBLIC_JWT_SECRET_KEY)
          // console.log("server url", process.env.EXPO_PUBLIC_SERVER_URI)
          const token = await generateToken()
          // console.log("New token here", new_token)
          // const token = JWT.encode(staticUser, process.env.EXPO_PUBLIC_JWT_SECRET_KEY);
                  // Make the same API call you had before
          console.log(`${process.env.EXPO_PUBLIC_SERVER_URI}/login`)
          const res = await axios.post(`${process.env.EXPO_PUBLIC_SERVER_URI}/login`, {
            signedToken: token,
          },{
            headers:{
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            timeout: 5000
          });
          // console.log("Login response", res)
          // console.log("Came till here, logging user")
          // Save the token
          await SecureStore.setItemAsync("accessToken", res.data.accessToken);
          router.push("/(tabs)");
        }catch(error){
          console.log("Error saving token:", error);
          console.log(Object.keys(error))
          console.log(error.code)
          console.log(error.message)
          console.log(error.request)
        }

      } else {
        setIndex(index + 1);
      }
    };
  
    return (
      <>
        <Svg style={StyleSheet.absoluteFill}>
          <Defs>
            <RadialGradient id="gradient" cx="50%" cy="35%">
              <Stop offset="0%" stopColor={slide.color} />
              <Stop offset="100%" stopColor={slide.color} />
            </RadialGradient>
          </Defs>
          <Rect
            x={0}
            y={0}
            width={WIDTH}
            height={HEIGHT}
            fill={"url(#gradient)"}
          />
        </Svg>
        <View style={styles.container}>
          <View>{slide.image}</View>
          <View>
            <View
              style={{
                width: SCREEN_WIDTH * 1,
                paddingHorizontal: verticalScale(25),
              }}
            >
              <Text
                style={{
                  fontSize: fontSizes.FONT30,
                  fontWeight: "600",
                  color: "#05030D",
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                {slide.title}
              </Text>
              <Text
                style={{
                  fontSize: fontSizes.FONT30,
                  fontWeight: "600",
                  color: "#05030D",
                  fontFamily: "Poppins_600SemiBold",
                }}
              >
                {slide.secondTitle}
              </Text>
              <Text
                style={{
                  paddingVertical: verticalScale(4),
                  fontSize: fontSizes.FONT18,
                  color: "#3E3B54",
                  fontFamily: "Poppins_300Light",
                }}
              >
                {slide.subTitle}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.indicatorContainer}>
          {Array.from({ length: totalSlides }).map((_, i) => (
            <TouchableOpacity
              key={i}
              style={[styles.indicator, i === index && styles.activeIndicator]}
            />
          ))}
        </View>
        {/* Next Button */}
        {index <= totalSlides - 1 && (
          <LinearGradient
            colors={["#6D55FE", "#8976FC"]}
            style={styles.nextButton}
          >
            <Pressable
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
              }}
              onPress={() => handlePress(index, setIndex)}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </Pressable>
          </LinearGradient>
        )}
        {index < totalSlides - 1 && (
          <TouchableOpacity
            style={styles.arrowButton}
            onPress={() => handlePress(index, setIndex)}
          >
            <Ionicons
              name="chevron-forward-outline"
              size={scale(18)}
              color="black"
            />
          </TouchableOpacity>
        )}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible)
          }}
          >
           <View style={styles.modalContainer}>
            <Pressable 
              style={styles.modalOverlay} 
              onPress={() => setModalVisible(false)}
            >
              <Pressable 
                style={styles.modalContent}
                onPress={(e) => e.stopPropagation()} // Prevents modal from closing when clicking content
              >
                <AuthModal setModalVisible={setModalVisible} />
              </Pressable>
            </Pressable>
          </View>
        </Modal>


      </>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      ...StyleSheet.absoluteFillObject,
      padding: scale(60),
      paddingTop: verticalScale(100),
      alignItems: "center",
    },
    indicatorContainer: {
      flexDirection: "row",
      marginTop: verticalScale(35),
      position: "absolute",
      bottom: verticalScale(55),
      left: scale(22),
    },
    indicator: {
      height: verticalScale(7),
      width: scale(18),
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      marginHorizontal: scale(4),
      borderRadius: scale(4),
    },
    activeIndicator: {
      height: verticalScale(7),
      width: scale(35),
      backgroundColor: "white",
    },
    nextButton: {
      position: "absolute",
      zIndex: 999999999,
      right: windowWidth(25),
      bottom: windowHeight(50),
      marginTop: windowHeight(30),
      alignItems: "center",
      justifyContent: "center",
      width: windowWidth(140),
      height: windowHeight(37),
      borderRadius: windowWidth(20),
    },
    nextButtonText: {
      color: "white",
      fontSize: fontSizes.FONT22,
      fontWeight: "bold",
    },
    arrowButton: {
      position: "absolute",
      width: scale(30),
      height: scale(30),
      borderRadius: scale(20),
      backgroundColor: "rgba(255, 255, 255, 0.3)",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 1000,
      right: moderateScale(5),
      top: Platform.OS === "ios" ? verticalScale(345) : verticalScale(385),
      transform: [{ translateY: -30 }],
    },
    modalContainer: {
      flex: 1
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: '90%',
      flex: 1
    },
  });