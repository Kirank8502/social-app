import { router } from "expo-router";
import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../../../FirebaseConfig";

// type AuthContextType = {
//   user: any;
//   loading: boolean;
//   signIn: (email: string, password: string) => Promise<void>;
//   register: (email: string, password: string, username: string, profileUrl: string) => Promise<void>;
//   logout: () => Promise<void>;
//   verify: () => Promise<void>;
// };

const AuthContext = createContext("" as any);

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }:any) {
  const [user, setUser] = useState("" as any);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(Boolean);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      if(currentUser){
        setIsAuthenticated(true);
        setUser(currentUser);
        setLoading(false);
        updateUserData(currentUser?.uid);
      } else {
        setIsAuthenticated(false);
        setUser(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  const updateUserData = async (uid: string) => {
    if (!uid) {
    console.error("UID is undefined or null");
    return;
  }
    const docRef = doc(db, "users", uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()) {
      let data = docSnap.data();
      setUser({...user, username:data.username, profileUrl:data.profileUrl, userId:data.userId});
    }
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await signInWithEmailAndPassword(auth, email, password);
      return {success: true}
      // router.replace('/(drawer)');
    } catch (error: any) {
      return {success: false, msg: error.message}
      // alert('Sign-in failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string, profileUrl: string) => {
    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);

      if (response.user) {
        // Save additional user information to Firestore
        await setDoc(doc(db, "users", response?.user?.uid), {
          username,
          profileUrl,
          userId: response?.user?.uid,
        });
        return {success: true, data: response?.user}
        // router.replace('/(drawer)');
      }
    } catch (error: any) {
      // alert('Sign-up failed: ' + error.message);
      return {success: false, msg: error.message}
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      router.replace('/signIn');
    } catch (error: any) {
      alert('Logout failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const verify = async () => {
    if (auth.currentUser) {
      try {
        await sendEmailVerification(auth.currentUser);
        alert('Verification email sent!');
      } catch (error: any) {
        alert('Verification failed: ' + error.message);
      }
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, verify }}>
      {children}
    </AuthContext.Provider>
  );
}
