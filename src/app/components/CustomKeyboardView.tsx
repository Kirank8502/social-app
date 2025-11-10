import React from 'react';
import { KeyboardAvoidingView, Platform, ScrollView } from "react-native";

const CustomKeyboardView = ({ children, inChat }:any) => {
    let kavConfig = {};
    let scrollViewConfig = {};
    if(inChat){
        kavConfig = {keyboardVerticalOffset: 90};
    }
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            {...kavConfig}
        >
            <ScrollView
                style={{ flex: 1 }}
                // keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
            {children}
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default CustomKeyboardView;
