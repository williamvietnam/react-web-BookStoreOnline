import React from 'react';
import { ActivityIndicator, View } from 'react-native';

function ListLoadMoreIndicator({loading}) {
    if (!loading) return null;

    return (
        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingVertical: 10 }}>
            <ActivityIndicator animating size="small" />
        </View>
    );
}

export default ListLoadMoreIndicator;