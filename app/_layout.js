import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { ThemeProvider } from '@/context/theme.context'

const RootLayout = () => {
  return (
    <ThemeProvider>
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Screen name="index"/>
        <Stack.Screen name="(routes)/onboarding/index"/>
      </Stack>
    </ThemeProvider>
  )
}

export default RootLayout 

const styles = StyleSheet.create({})