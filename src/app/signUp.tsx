import { router } from 'expo-router';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
import React, { useRef, useState } from 'react';
import { Alert, Pressable, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, useColorScheme, View } from 'react-native';
// import { auth } from '../../FirebaseConfig';
import { useAuth } from '../app/context/AuthContext';
import CustomKeyboardView from './components/CustomKeyboardView';

const SignUpScreen = () => {
    const colorScheme = useColorScheme();
    const {register} = useAuth();

    const themeContainerStyle = colorScheme === "light" ? styles.lightContainer : styles.darkContainer;
    const themeTextStyle = colorScheme === "light" ? styles.lightText : styles.darkText;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const usernameRef = useRef("");
    const profileRef = useRef("");

    const signUp = async () => {
        if(!email || !password || !usernameRef.current || !profileRef.current) {
            Alert.alert("Sign Up", 'Please enter email, password, username and profile');
        } else {
            try {
                const response = await register(email, password, usernameRef.current, profileRef.current);

                if (!response.success){
                    Alert.alert("Sign Up", response.msg);
                } else {
                    Alert.alert("Success", "Account created successfully. Please log in.");
                    router.replace('/signIn');
                }
            } catch (error: any) {
                console.log(error)
                alert('Sign in failed: ' + error.message);
            }
        }
    }

    return (
        <CustomKeyboardView>
            <SafeAreaView style={[styles.container, themeContainerStyle]}>
                <Text style={styles.title}>Sign Up</Text>
                <TextInput style={styles.textInput} placeholder="User Name" onChangeText={value=>usernameRef.current=value}/>
                <TextInput style={styles.textInput} placeholder="Email" value={email} onChangeText={setEmail} />
                <TextInput style={styles.textInput} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry/>
                <TextInput style={styles.textInput} placeholder="Profile URL" onChangeText={value=>profileRef.current=value}/>
                <TouchableOpacity style={styles.button} onPress={signUp}>
                    <Text style={[styles.text, themeTextStyle]}>Create Account</Text>
                </TouchableOpacity>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: 5}}>
                    <Text style={[{fontSize:14}, themeTextStyle]}>Already Have An Account?</Text>
                    <Pressable onPress={() => router.push('/signIn')}><Text style={[{fontSize:14}, themeTextStyle]}>Sign In</Text></Pressable>
                </View>
            </SafeAreaView>
        </CustomKeyboardView>
    )
}

export default SignUpScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FAFAFA', // A softer white for a modern, minimalist background
    },
    title: {
        fontSize: 28, // A bit larger for a more striking appearance
        fontWeight: '800', // Extra bold for emphasis
        marginBottom: 40, // Increased space for a more airy, open feel
        color: '#FFFFFF', // A deep indigo for a sophisticated, modern look
    },
    textInput: {
        height: 50, // Standard height for elegance and simplicity
        width: '90%', // Full width for a more expansive feel
        backgroundColor: '#FFFFFF', // Pure white for contrast against the container
        borderColor: '#E8EAF6', // A very light indigo border for subtle contrast
        borderWidth: 2,
        borderRadius: 15, // Softly rounded corners for a modern, friendly touch
        marginVertical: 15,
        paddingHorizontal: 25, // Generous padding for ease of text entry
        fontSize: 16, // Comfortable reading size
        color: '#3C4858', // A dark gray for readability with a hint of warmth
        shadowColor: '#9E9E9E', // A medium gray shadow for depth
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 4, // Slightly elevated for a subtle 3D effect
    },
    button: {
        width: '90%',
        marginVertical: 15,
        backgroundColor: '#5C6BC0', // A lighter indigo to complement the title color
        padding: 20,
        borderRadius: 15, // Matching rounded corners for consistency
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#5C6BC0', // Shadow color to match the button for a cohesive look
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        color: '#FFFFFF', // Maintained white for clear visibility
        fontSize: 18, // Slightly larger for emphasis
        fontWeight: '600', // Semi-bold for a balanced weight
    },
    lightContainer: { backgroundColor: "#fff" },
    darkContainer: { backgroundColor: "#222" },
    lightText: { color: "#222" },
    darkText: { color: "#fff" },
});