import { connect } from 'react-redux';
import ShopGrid from '../../components/shared/shop/ShopGrid';
import { withApollo } from '@apollo/react-hoc';
import { getBooks } from '../../redux/actions/bookActions';
import { changeViewMode, changeSortDirection, changeShopPage } from '../../redux/actions/userSettingsActions';

const mapStateToProps = state => {
    return {
        books: state.books,
        userSettings: state.userSettings,
        filters: state.filters
    }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
    getBooks: ({ where, orderBy, skip, first,selection }) => {
        dispatch(getBooks(ownProps.client, { where, orderBy, skip, first, selection }));
    },
    changeViewMode: (viewMode)=>{
        dispatch(changeViewMode(viewMode));
    },
    changeSortDirection: (sortDirection)=>{
        dispatch(changeSortDirection(sortDirection));
    },
    changeShopPage: (shopPage)=>{
        dispatch(changeShopPage(shopPage));
    }
})

export default withApollo(connect(mapStateToProps,mapDispatchToProps)(ShopGrid));