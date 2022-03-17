import React, { useRef, useEffect, useCallback } from 'react';
import Header from '../components/organisms/shared/Header';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

function SearchScreen(props) {
    const { route, navigation } = props;
    const searchBarRef = useRef();

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', () => {
            if (searchBarRef.current)
                searchBarRef.current.focus();
            // do something
        });
  
        return unsubscribe;
    },[navigation]);

    useEffect(()=>{
        const unsubscribe = navigation.addListener('blur', () => {
            if (searchBarRef.current)
                searchBarRef.current.blur();
            // do something
        });
  
        return unsubscribe;
    },[navigation]);

    return (
        <View >
            <Header style={{ paddingRight: 0 }} searchBarRef={searchBarRef} hideCart />
        </View>
    )

}

export default SearchScreen;