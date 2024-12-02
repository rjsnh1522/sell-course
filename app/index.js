import { Platform, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as SecureStore from "expo-secure-store";
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const index = () => {
    const [loggedInUser, setLoggedInUser] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const subscription = async () => {
            let token = false
            SecureStore.deleteItemAsync('accessToken')
            if (Platform.OS === 'web'){
                token = await AsyncStorage.getItem("accessToken")
                console.log('its a web')
            }else{
                console.log("I am in index page getting accessToken")
                token = SecureStore.getItem("accessToken");
            }
                
            setLoggedInUser(token ? true : false)
        };
        subscription();
    }, [])


  return (
    <>
     {
        loading ? (<></>) : (<Redirect 
            href={!loggedInUser ? "/(routes)/onboarding" : "/(tabs)"} />)
     }
    </>
  )
}

export default index

const styles = StyleSheet.create({})