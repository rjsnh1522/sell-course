import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import NotificationScreen from '@/screens/notification.screen'
import { GestureHandlerRootView } from "react-native-gesture-handler";

const NotificationIndex = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NotificationScreen />
    </GestureHandlerRootView>
  )
}

export default NotificationIndex

const styles = StyleSheet.create({})