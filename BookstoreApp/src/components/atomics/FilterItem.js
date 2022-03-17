import React, { useEffect } from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { COLOR_PRIMARY, FILTER_TYPE_CAT, FILTER_TYPE_PUBLISHER, FILTER_TYPE_AUTHOR, FILTER_TYPE_PRICE, FILTER_TYPE_RATING, FILTER_TYPE_COLLECTION } from '../../constants';
import { Icon } from 'react-native-elements';
import { useSelector, useDispatch, connect } from 'react-redux';
import { changeFilter } from '../../redux/actions/filtersActions';
import _ from 'lodash';

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#c5e5fa",
        borderRadius: 3,
        width: '49.3%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        textAlign: "center",
        alignItems: 'center',
        justifyContent: 'center',
        display: 'flex',
        marginBottom: 4,
        borderWidth: 1,
        borderColor: 'transparent',
        overflow: 'hidden',
        minHeight: 46
    },
    buttonText: {
        textAlign: "center",
    },
    buttonOverlay: {
        borderWidth: 1,
        borderColor: COLOR_PRIMARY,
        position: 'absolute',
        top: -20,
        right: -20,
        height: 40,
        transform: [{
            rotate: '45deg'
        }],
        width: 40,
        backgroundColor: COLOR_PRIMARY,
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    layoutIcon: {
        position: 'absolute',
        bottom: 0,
        zIndex: 10,
        top: 2,
        right: 3
    }
});


function isFilterSelected(type, value, filters) {
    switch (type) {
        case FILTER_TYPE_CAT:
            if (filters.categoryTemporary?.id === value.id) return true;
            break;
        case FILTER_TYPE_PUBLISHER:
            if (filters.publisherTemporary?.id === value.id) return true;
            break;
        case FILTER_TYPE_AUTHOR:
            if (filters.authorTemporary?.id === value.id) return true;
            break;
        case FILTER_TYPE_PRICE:
            if (filters.priceTemporary?.id === value.id) {
                return true;
            }
            break;
        case FILTER_TYPE_RATING:
            if (value.id === filters.ratingTemporary?.id) return true;
            break;
        case FILTER_TYPE_COLLECTION:
            if (value.id === filters.collectionTemporary?.id) return true;
            break;
        default: return false;
    }
}

function FilterItem(props) {
    const { name, style = {}, type, value } = props;

    const { filters } = useSelector(state => ({
        filters: state.filters
    }));
    const dispatch = useDispatch();
    const isSelected = isFilterSelected(type, value, filters);

    return (
        <TouchableOpacity activeOpacity={1} onPress={() => dispatch(changeFilter(type, value, true))}
            style={{ ...styles.button, ...style, borderColor: isSelected ? COLOR_PRIMARY : 'transparent' }}>
            <><Text style={styles.buttonText}>{name}</Text>
                {isSelected && <><View style={styles.buttonOverlay}>
                </View>
                    <Icon containerStyle={styles.layoutIcon} color="#fff"
                        size={12} type="font-awesome" name="close" /></>}
            </>
        </TouchableOpacity>

    )
}

export default FilterItem;

// class FilterItem extends React.PureComponent {

//     shouldComponentUpdate(nextProps, nextState) {

//         switch (this.props.type) {
//             case FILTER_TYPE_CAT:
//                 if (this.props.filters.categoryTemporary !== this.props.value&&nextProps.filters.categoryTemporary===this.props.value) return true;
//                 break;
//             case FILTER_TYPE_PUBLISHER:
//                 if (this.props.filters.publisherTemporary !== this.props.value&&nextProps.filters.publisherTemporary===this.props.value) return true;
//                 break;
//             case FILTER_TYPE_AUTHOR:
//                 if (this.props.filters.authorTemporary !== this.props.value&&nextProps.filters.authorTemporary===this.props.value) return true;
//                 break;
//             default: return false;
//         }
//         // console.log("prevProps", prevProps.filters)
//     }

//     render() {
//         const { name, style = {}, type, value, filters, changeFilter } = this.props;
//         const isSelected = isFilterSelected(type, value, filters);
//         return (
//             <TouchableOpacity activeOpacity={1} onPress={() => changeFilter(type, value, true)}
//                 style={{ ...styles.button, ...style, borderColor: isSelected ? COLOR_PRIMARY : 'transparent' }}>
//                 <><Text style={styles.buttonText}>{name}</Text>
//                     {isSelected && <><View style={styles.buttonOverlay}>
//                     </View>
//                         <Icon containerStyle={styles.layoutIcon} color="#fff"
//                             size={12} type="font-awesome" name="close" /></>}
//                 </>
//             </TouchableOpacity>
//         )
//     }

// }

// const mapStateToProps = state => {
//     return {
//         filters: state.filters
//     }
// }

// const mapDispatchToProps = dispatch => {
//     return {
//         changeFilter: (type, value, isTemporary) => {
//             dispatch(changeFilter(type, value, isTemporary))
//         }
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(FilterItem);
