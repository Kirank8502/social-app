import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
// import { getAuth, signOut } from "firebase/auth";
import React from 'react';
import { Button, View } from 'react-native';
import { useAuth } from '../context/AuthContext';
// import LoginScreen from '../signIn';


const DrawerNav = () => {

  // const [user, setUser] = useState<any>(null);

  // useEffect(() => {
  //   const auth = getAuth();
  //   const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
  //     setUser(firebaseUser);
  //   });
  //   return () => unsubscribe();
  // }, []);

  const {user, logout} = useAuth();

  const signOut = async () => {
    await logout();
  };

  function CustomDrawerContent(props:any) {
    return (
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <View style={{ margin: 20 }}>
          <Button
            title="Logout"
            onPress={signOut}
          />
        </View>
      </DrawerContentScrollView>
    );
  }

  return (
    <Drawer drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="index" options={{title: "Home"}}/>
      <Drawer.Screen name="profile" options={{title: "Profile"}}/>
    </Drawer>
  );
}

export default DrawerNav;