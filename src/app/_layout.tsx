import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { AuthProvider, useAuth } from "../app/context/AuthContext";


const MainLayout = () => {
  const {isAuthenticated} = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(()=> {
  if(typeof isAuthenticated=='undefined') return;
  const inApp = segments[0] == '(drawer)';
  if(isAuthenticated && !inApp){
    router.replace('/(drawer)');
  }else if(isAuthenticated==false){
    router.replace('/signIn');
  }
  }, [isAuthenticated]);
return(<Stack screenOptions={{headerShown:false}}>
        <Stack.Screen name="(drawer)" />
        <Stack.Screen name="profile" />
      </Stack>);
};
export default function RootLayout() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
