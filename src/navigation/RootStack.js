import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import AppHomePage from '../screens/AppHomePage';
import {NavigationContainer} from '@react-navigation/native';
import CallScreen from '../screens/CallScreen';

const HomeStack = createStackNavigator();

function RootStack() {
  return (
    <NavigationContainer>
      <HomeStack.Navigator headerMode="none" mode="modal">
        <HomeStack.Screen name="AppHomePage" component={AppHomePage} />
        <HomeStack.Screen name="CallScreen" component={CallScreen} />
      </HomeStack.Navigator>
    </NavigationContainer>
  );
}

export default RootStack;
