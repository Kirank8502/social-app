import { collection, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { db } from '../../../FirebaseConfig';
import { formatDate, getRoomId } from '../utils/common';

export default function ChatItem({item, router, noBorder, currentUser}:any) {

  const [lastMessage, setLastMessage] = useState(undefined);

  useEffect(() => {
    let roomId = getRoomId(currentUser?.userId as string, item?.userId as string);
    const docRef = doc(db,"rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef,orderBy('createdAt', 'asc'));
    let unsub = onSnapshot(q, (snapshot)=>{
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      });
      setLastMessage(allMessages[0]? allMessages[0]:null);
    });

    return unsub;
  }, []);

  const openChatRoom = () => {
    router.push({pathname: '/chatRoom', params: item});
  };

  const renderTime = () => {
    if(lastMessage){
      let date = lastMessage?.createdAt;
      return formatDate(new Date(date?.seconds * 1000));
    }
  };

  const renderLastMessage = () => {
    if(typeof lastMessage == "undefined") return 'Loading...';
    if(lastMessage){
      if(currentUser?.userId == lastMessage?.userId) return "You: " + lastMessage?.text;
      return lastMessage?.text;
    }else{
      return "Say Hi 👋"
    }
  };

  return (
    <TouchableOpacity onPress={openChatRoom} style={{flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: noBorder ? 0 : 1, borderBottomColor: '#ccc'}}>
      <Image
        source={{uri: item?.profileUrl || 'https://randomuser.me/api/portraits/men/4.jpg'}}
        style={{width: 50, height: 50, borderRadius: 30, marginRight: 10}}
      />
      <View style={{flex: 1}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontWeight: 'bold', fontSize: 16}}>{item.username}</Text>
          <Text style={{fontWeight: 'medium', fontSize: 14}}>{renderTime()}</Text>
        </View>
        <Text style={{color: '#555'}}>{renderLastMessage()}</Text>
      </View>
    </TouchableOpacity>
  );
}