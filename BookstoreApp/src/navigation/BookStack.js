import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'
import BookScreen from '../screens/BookScreen';
import BookDetailScreen from '../screens/BookDetailScreen';
import BookDescriptionScreen from '../screens/BookDescriptionScreen';
import { COLOR_PRIMARY } from '../constants';

const BookStack = createStackNavigator();

function BookStackScreen(props) {

    return (
        <BookStack.Navigator initialRouteName="BookScreen" >
            <BookStack.Screen name="BookScreen" options={{
                headerShown: false,
            }} component={BookScreen} />
            <BookStack.Screen name="BookDetailScreen"
                options={{
                    headerShown: false,
                }} component={BookDetailScreen} />
            <BookStack.Screen name="BookDescriptionScreen"
                options={{
                    headerShown: false,
                }} component={BookDescriptionScreen} />
        </BookStack.Navigator>
    )

}

export default BookStackScreen;