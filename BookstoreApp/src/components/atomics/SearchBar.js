import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { SearchBar as RNSearchBar } from 'react-native-elements'
import { useNavigation, useRoute } from '@react-navigation/native';
const styles = StyleSheet.create({
    searchBarCtn: {
        height: 54,
        flex: 1,
        backgroundColor: 'transparent',
        borderWidth: 0,
        borderColor: 'transparent',
        borderBottomColor: 'transparent',
        borderTopColor: 'transparent'
    },
    inputCtnStyle: {
        height: 36,
        backgroundColor: "#fff"
    },
    inputSearchStyle: {
        height: 28,
        backgroundColor: "#fff",
        marginLeft: 5,
        fontSize: 13
    },
})

function SearchBar(props) {
    const navigation = useNavigation();
    const { searchBarRef, searchKeyword, setSearchKeyWord, showCancel } = props;
    const route = useRoute();
    const [text, setText] = useState("")
    return (
        <RNSearchBar placeholder="Tìm kiếm sách..."
            containerStyle={styles.searchBarCtn}
            inputStyle={styles.inputSearchStyle}
            ref={searchBarRef}
            value={searchKeyword ?? text}
            onChangeText={(val) => {
                setText(val);
            }}
            clearIcon={showCancel}
            onSubmitEditing={(e) => {
                navigation.navigate('TabScreen', {
                    screen: "Sách",
                    params: {
                        searchKeyword: e.nativeEvent.text
                    }
                })
            }}
            onTouchEnd={() => {
                navigation.navigate("TabScreen", {
                    screen: 'Tìm kiếm'
                })
            }}
            // onFocus={() => {
            //     navigation.navigate("TabScreen", {
            //         screen: 'Tìm kiếm'
            //     })
            // }}
            searchIcon={{ size: 22 }}
            inputContainerStyle={styles.inputCtnStyle} />
    )
}

export default SearchBar;