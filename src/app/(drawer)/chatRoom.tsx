import { Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { addDoc, collection, doc, onSnapshot, orderBy, query, setDoc, Timestamp } from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, TextInput, TouchableOpacity, View } from 'react-native';
import { db } from '../../../FirebaseConfig';
import CustomKeyboardView from '../components/CustomKeyboardView';
import MessageList from '../components/MessageList';
import { useAuth } from '../context/AuthContext';
import { getRoomId } from '../utils/common';

export default function ChatRoom() {
  const item = useLocalSearchParams();
  const {user} = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const textRef = useRef('');
  const inputRef = useRef(null);
  const ScrollViewRef = useRef(null);

  useEffect(() => {
    createRoomIfNotExists();

    let roomId = getRoomId(user?.userId as string, item?.userId as string);
    const docRef = doc(db,"rooms", roomId);
    const messagesRef = collection(docRef, "messages");
    const q = query(messagesRef,orderBy('createdAt', 'asc'));
    let unsub = onSnapshot(q, (snapshot)=>{
      let allMessages = snapshot.docs.map(doc=>{
        return doc.data();
      });
      setMessages([...allMessages]);
    });

    return unsub;
  }, []);

  useEffect(() => {
    updateScrollView();
  }, [messages]);

  const updateScrollView = () => {
    setTimeout(()=>{
      ScrollViewRef?.current?.scrollToEnd({animated:true})
    },100);
  };


  const createRoomIfNotExists = async () => {
    let roomId = getRoomId(user?.userId as string, item?.userId as string);
    await setDoc(doc(db, "rooms", roomId), {
      roomId,
      createdAt: Timestamp.fromDate(new Date())
    });
  };

  const handleSendMessage = async () => {
    let message = textRef.current.trim();
    if(!message) return;
    try {
      let roomId = getRoomId(user?.userId as string, item?.userId as string);
      const docRef = doc(db,'rooms',roomId);
      const messagesRef = collection(docRef,"messages");
      textRef.current = '';
      if(inputRef) inputRef?.current?.clear();
      const newDoc = await addDoc(messagesRef,{
        userId: user?.userId,
        text: message,
        profileUrl: user?.profileUrl,
        senderName: user?.username,
        createdAt: Timestamp.fromDate(new Date())
      });

      console.log("Testing", newDoc.id)
    }catch(err:any){
      Alert.alert('Message', err.message);
    }
  };

  return (
    <CustomKeyboardView inChat={true}>
      <View style={{ flex: 1, padding: 16 }}>
        <View style={{flex: 1}}>
          <View style={{flex:1}}>
            <MessageList ScrollViewRef={ScrollViewRef} messages={messages} currentUser={user}/>
          </View>
        </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', padding: 8, borderRadius: 30, margin: 8}}>
            <TextInput 
            ref={inputRef}
            onChangeText={value=>textRef.current=value}
              placeholder="Type a message..."
              style={{ flex: 1, marginRight: 8 }}
            />
            <TouchableOpacity onPress={handleSendMessage} style={{padding: 8, backgroundColor: '#d7d4d4ff', borderRadius: 20}}>
              <Feather name="send" size={24} color="#737373"></Feather>
            </TouchableOpacity>
          </View>
      </View>
    </CustomKeyboardView>
  );
};