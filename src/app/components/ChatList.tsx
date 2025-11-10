import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, View } from 'react-native';
import ChatItem from './ChatItem';

export default function ChatList({users,currentUser}:any) {
  const router = useRouter();

  return (
    <View>
      <FlatList
        data={users}
        contentContainerStyle={{ paddingVertical: 25 }}
        keyExtractor={item=>Math.random()}
        showsVerticalScrollIndicator={false}
        renderItem={({item, index})=>(<ChatItem
          noBorder={index+1 == users.length}
          item={item}
          currentUser={currentUser}
          router={router}
          index={index}
          />)}
      />
    </View>
  );
}