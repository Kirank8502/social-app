import React from 'react';
// import { Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import MessageItem from './MessageItem';

export default function MessageList({messages,scrollViewRef,currentUser}:any) {

  return (
    <ScrollView ref={scrollViewRef} showsVerticalScrollIndicator={false} contentContainerStyle={{paddingTop: 10}}>
        {
            messages.map((message: any,index: any) => {
                return (
                    <MessageItem message={message} key={index} currentUser={currentUser}/>
                )
            })
        }
    </ScrollView>
  );
}