import { Stack } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

export default function ChatRoomHeader() {
  return (
    <Stack.Screen 
    options={{
      title: 'Chat Room',
      headerShadowVisible: false,
      headerLeft:()=>(
        <View>
          <Text>Chat Room Header</Text>
        </View>
      )
    }}
    />
      // <View>
      //   <Text>Chat Room Header</Text>
      // </View>
  );
};