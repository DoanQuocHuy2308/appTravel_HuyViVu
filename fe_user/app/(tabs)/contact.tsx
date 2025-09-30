import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { View, Text } from 'react-native';

export default function FacebookScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-100">
      <WebView
        source={{ uri: 'https://www.facebook.com/quochuy.doan.75248' }}
        className="flex-1"
        startInLoadingState={true} 
      />
    </SafeAreaView>
  );
}
