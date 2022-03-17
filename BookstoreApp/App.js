import * as React from 'react';
import 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Header, Icon } from 'react-native-elements';
import HomeScreen from './src/screens/HomeScreen';
import client from './src/apollo-client/index';
import { ApolloProvider } from '@apollo/react-hooks';
import SearchScreen from './src/screens/SearchScreen';
import thunk from 'redux-thunk';
import rootReducer from './src/redux/reducers/index';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import moment from 'moment';
import 'moment/locale/vi';
import { createStackNavigator } from '@react-navigation/stack';
import BookDescriptionScreen from './src/screens/BookDescriptionScreen';
import BookDetailScreen from './src/screens/BookDetailScreen';
import AccountInfoScreen from './src/screens/AccountInfoScreen';
import LoginSignupScreen from './src/screens/LoginSignupScreen';
import BookScreen from './src/screens/BookScreen';
import AccountScreen from './src/screens/AccountScreen';
import CartScreen from './src/screens/CartScreen';
import ReviewScreen from './src/screens/ReviewScreen';
import ReplyReviewScreen from './src/screens/ReplyReviewScreen';
import CreateReviewScreen from './src/screens/CreateReviewScreen';
import AddressListScreen from './src/screens/AddressListScreen';
import EditAddressScreen from './src/screens/EditAddressScreen';
import AddAddressScreen from './src/screens/AddAddressScreen';
import WishListScreen from './src/screens/WishListScreen';
import MyReviewScreen from './src/screens/MyReviewScreen';
import OrderListScreen from './src/screens/OrderListScreen';
import OrderDetailScreen from './src/screens/OrderDetailScreen';
import CheckoutScreen from './src/screens/CheckoutScreen';
import BestSellerScreen from './src/screens/BestSellerScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import ScanScreen from './src/screens/ScanScreen';
import OrderStatusScreen from './src/screens/OrderStatusScreen';

const composeEnhancers = composeWithDevTools({
  // Specify here name, actionsBlacklist, actionsCreators and other options
});
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
moment.locale('vi');

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function TabNav() {
  return (
    <Tab.Navigator screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        let iconType;
        if (route.name === 'Trang chủ') {
          iconName = "home";
          iconType = "antdesign"
        } else if (route.name === 'Cá nhân') {
          iconName = "user";
          iconType = "feather";
        }
        else if (route.name === 'Sách') {
          iconName = "book";
          iconType = "feather";
        }
        else if (route.name === 'Tìm kiếm') {
          iconName = "search";
          iconType = "feather";
        } else if (route.name === 'Bán chạy') {
          iconName = "star";
          iconType = "feather";
        }

        // You can return any component that you like here!
        return <Icon name={iconName} type={iconType} size={20} color={color} />;
      },
    })}
    >
      <Tab.Screen name="Trang chủ" component={HomeScreen} />
      <Tab.Screen name="Sách" component={BookScreen}
        options={{ tabBarVisible: false }} />
      <Tab.Screen name="Tìm kiếm" component={SearchScreen} initialParams={{ focusInput: true }} />
      <Tab.Screen name="Bán chạy" component={BestSellerScreen} />
      <Tab.Screen name="Cá nhân" component={AccountScreen} />
    </Tab.Navigator>
  )
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen name="TabScreen" component={TabNav}
              options={{ headerShown: false }} />
            <Stack.Screen name="StackScreen" component={TabNav}
              options={{ headerShown: false }} />
            <Stack.Screen name="BookDetailScreen"
              options={{
                headerShown: false,
              }} component={BookDetailScreen} />
            <Stack.Screen name="BookDescriptionScreen"
              options={{
                headerShown: false,
              }} component={BookDescriptionScreen} />
            <Stack.Screen name="LoginSignupScreen" options={{
              headerShown: false,
            }} component={LoginSignupScreen} />
            <Stack.Screen name="AccountInfoScreen" options={{
              headerShown: false,
            }} component={AccountInfoScreen} />
            <Stack.Screen name="CartScreen" options={{
              headerShown: false,
            }} component={CartScreen} />
            <Stack.Screen name="ReviewScreen" options={{
              headerShown: false,
            }} component={ReviewScreen} />
            <Stack.Screen name="ReplyReviewScreen" options={{
              headerShown: false,
            }} component={ReplyReviewScreen} />
            <Stack.Screen name="CreateReviewScreen" options={{
              headerShown: false,
            }} component={CreateReviewScreen} />
            <Stack.Screen name="AddressListScreen" options={{
              headerShown: false,
            }} component={AddressListScreen} />
            <Stack.Screen name="EditAddressScreen" options={{
              headerShown: false,
            }} component={EditAddressScreen} />
            <Stack.Screen name="AddAddressScreen" options={{
              headerShown: false,
            }} component={AddAddressScreen} />
            <Stack.Screen name="WishListScreen" options={{
              headerShown: false,
            }} component={WishListScreen} />
            <Stack.Screen name="MyReviewScreen" options={{
              headerShown: false,
            }} component={MyReviewScreen} />
            <Stack.Screen name="OrderListScreen" options={{
              headerShown: false,
            }} component={OrderListScreen} />
            <Stack.Screen name="OrderDetailScreen" options={{
              headerShown: false,
            }} component={OrderDetailScreen} />
            <Stack.Screen name="OrderStatusScreen" options={{
              headerShown: false,
            }} component={OrderStatusScreen} />
            <Stack.Screen name="CheckoutScreen" options={{
              headerShown: false,
            }} component={CheckoutScreen} />
            <Stack.Screen name="ForgotPasswordScreen" options={{
              headerShown: false,
            }} component={ForgotPasswordScreen} />
            <Stack.Screen name="ScanScreen" options={{
              headerShown: false,
            }} component={ScanScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </ApolloProvider>
  );
}