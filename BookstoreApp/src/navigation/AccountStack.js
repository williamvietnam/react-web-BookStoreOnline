import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import BookScreen from '../screens/BookScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookDescriptionScreen from '../screens/BookDescriptionScreen';
import { COLOR_PRIMARY } from '../constants';
import AccountScreen from '../screens/AccountScreen';
import LoginSignupScreen from '../screens/LoginSignupScreen';
import AccountInfoScreen from '../screens/AccountInfoScreen';

const AccountStack = createStackNavigator();

function AccountStackScreen(props) {

    return (
        <AccountStack.Navigator initialRouteName="AccountScreen" >
            <AccountStack.Screen name="AccountScreen" options={{
                headerShown: false,
            }} component={AccountScreen} />
            <AccountStack.Screen name="LoginSignupScreen" options={{
                headerShown: false,
            }} component={LoginSignupScreen} />
              <AccountStack.Screen name="AccountInfoScreen" options={{
                headerShown: false,
            }} component={AccountInfoScreen} />
        </AccountStack.Navigator>
    )

}

export default AccountStackScreen;