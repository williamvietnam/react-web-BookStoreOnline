import {connect} from 'react-redux';
import { getBooks } from '../../redux/actions/bookActions';
import ProductSection from '../../components/products/ProductSection';
import {withApollo} from '@apollo/react-hoc';

const mapStateToProps = (state)=> ({
    books: state.books
})

const mapDispatchToProps = (dispatch,ownProps)=>({
    getBooks: ({where, orderBy, skip, first})=>{
        dispatch(getBooks(ownProps.client, {where,orderBy,skip,first}));
    }
})

export default withApollo(connect(mapStateToProps,mapDispatchToProps)(ProductSection))