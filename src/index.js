import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { View,Text, StatusBar  } from 'react-native';
import './config/ReactotronConfig';

import Routes from './routes';


export default function App() {
  return (
      <NavigationContainer>

      <StatusBar barStyle="light-content" backgroundColor="#7159c1" />
      <Routes />

      </NavigationContainer>
  );
};
