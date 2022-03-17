import React, { useState, useEffect, useCallback } from 'react';
import isTokenValid from '../utils/tokenValidation';
import AsyncStorage from '@react-native-community/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const useToken = () => {
    const [token, setToken] = useState("");
    const [userInfo, setUserInfo] = useState({});
    useFocusEffect(useCallback(() => {
        AsyncStorage.getItem("token", (err, token) => {
            if (err) {
                console.log(err)
            } else {
                setToken(token);
            }
        });
        AsyncStorage.getItem("userInfo", (err, data) => {
            if (err) {
                console.log(err)
            } else {
                if (data) {
                    setUserInfo(JSON.parse(data));
                }
            }
        });
    }, []));
    const tokenValid = isTokenValid(token);
    return [token, userInfo, tokenValid];
}

export { useToken };