// import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
// import LoginScreen from '../signIn';
import { userRef } from '@/FirebaseConfig';
import { getDocs, query, where } from 'firebase/firestore';
import ChatList from '../components/ChatList';
import { useAuth } from "../context/AuthContext";


// const profiles = [
//   {
//     id: '1',
//     name: 'Alice Johnson',
//     status: 'Active',
//     avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
//   },
//   {
//     id: '2',
//     name: 'Bob Smith',
//     status: 'Away',
//     avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
//   },
//   // Add more profiles as needed...
// ];


// const renderProfile = ({ item }: any) => (
//     <View style={styles.profileCard}>
//       <Image source={{ uri: item.avatar }} style={styles.avatar} />
//       <View>
//         <Text style={styles.name}>{item.name}</Text>
//         <Text style={styles.status}>{item.status}</Text>
//       </View>
//     </View>
//   );

const index = () => {

  const {user} = useAuth(); 
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if(user?.uid)
      getUsers();
  },[user?.uid])

  const getUsers = async () => {
    const q = query(userRef, where('userId', '!=', user?.uid));
    const querySnapshot = await getDocs(q);
    let data:any = [];
    querySnapshot.forEach((doc) => {
      data.push({...doc.data()});
    });
    setUsers(data);
  };

  return (
    <View>
      {
        users.length > 0 ? (
          <ChatList currentUser={user} users={users} />
        ) : (
          <Text>No chats found</Text>
        )
      }
    </View>
  );
}

export default index;



const styles = StyleSheet.create({
    container: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  title: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 4,
    borderColor: '#20232a',
    borderRadius: 6,
    backgroundColor: '#61dafb',
    color: '#20232a',
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
  },
  iconButton: {
    padding: 4,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 14,
    marginHorizontal: 16,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
  },
  avatar: { width: 55, height: 55, borderRadius: 28, marginRight: 18 },
  name: { fontSize: 18, fontWeight: '600' },
  status: { color: '#666' },
});