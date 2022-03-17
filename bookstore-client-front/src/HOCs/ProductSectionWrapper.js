import React from 'react';
import { Spin } from 'antd';
import { GET_BOOKS_FOR_BROWSING } from '../api/bookApi';

function productSectionWrapper(WrappedComponent, variables){
    return function(props){
        const {loading,error,data} = useQuery(GET_BOOKS_FOR_BROWSING, {
            variables
        })

        if (loading) return <Spin spinning={loading} />
        if (error) return <div>Error</div>

        return (
            <WrappedComponent books={data.getBooksForBrowsing} {...props} />
        )
    }
}

export default productSectionWrapper;