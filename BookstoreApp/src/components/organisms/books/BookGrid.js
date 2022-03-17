import React from 'react';
import { FlatList } from 'react-native-gesture-handler';
import BookItem from '../../molecules/books/BookItem';
import { View, ActivityIndicator, RefreshControl } from 'react-native';
import Empty from '../../atomics/Empty';
import { isCloseToBottom } from '../../../utils/common';
import ListLoadMoreIndicator from '../../atomics/ListLoadMore';

function BookGrid(props) {
    const { books, fetchMore, loading, reload } = props;

    function renderBook({ item, index }) {
        return <BookItem book={item} index={index} />
    }
    return (
        <>{books.length === 0 ? <View
            style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center'
            }}>
            <Empty /></View>
            : <FlatList data={books}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={reload}
                    />
                }
                refreshing={loading}
                style={{ backgroundColor: '#fff' }}
                horizontal={false} numColumns={2}
                renderItem={renderBook}
                ListFooterComponent={<ListLoadMoreIndicator loading={loading}/>}
                onScroll={(e) => {
                    if (isCloseToBottom(e.nativeEvent) && !loading) {
                        fetchMore();
                    }
                }}>
            </FlatList>}</>
    )
}

export default BookGrid;