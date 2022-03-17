import {connect} from 'react-redux';
import {withApollo} from '@apollo/react-hoc';
import { getBooks } from '../../../redux/actions/bookActions';
import SearchBox from '../../../components/shared/search/SearchBox';

const mapStateToProp = (state)=>{
    return {
        booksState: state.books
    }
}

const mapDispatchToProp = (dispatch,ownProps)=>{
    return {
        getBooks: ({where, orderBy, first,skip,selection})=>{
            dispatch(getBooks(ownProps.client, {where, orderBy,first,skip,selection}))
        }
    }
}

export default withApollo(connect(mapStateToProp,mapDispatchToProp)(SearchBox));