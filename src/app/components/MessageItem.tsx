import React from 'react';
import { Text, View } from 'react-native';

export default function MessageItem({message,currentUser}:any) {
  if(currentUser?.userId == message?.userId){
    return (
      <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20, marginRight: 10}}>
        <View style={{borderWidth: 2, borderRadius: 10, padding: 10, backgroundColor: '#ffffff', borderColor: '#e9e9e9ff', alignItems:'flex-end'}}>
          <Text style={{fontSize: 12}}>
            {message?.text}
          </Text>
        </View>
      </View>
    );
  }else{
    return (
      <View style={{flexDirection:'row',justifyContent: 'flex-start',marginLeft:5,marginBottom: 20}}>
        <View style={{borderWidth: 2, borderRadius: 10, padding: 10, backgroundColor: '#bbcef7ff', borderColor: '#c8ccffff', alignItems:'flex-start'}}>
          <Text style={{fontSize:12}}>
            {message?.text}
          </Text>
        </View>
      </View>
    );
  }
}