import React, { useState, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import { useQuery } from '@apollo/react-hooks';
import { GET_COLLECTIONS } from '../../api/collectionApi';
import { message, Skeleton, Empty } from 'antd';
import CollectionItem from './CollectionItem';
import Search from 'antd/lib/input/Search';
import Pagination from '../shared/pagination/Pagination';

function CollectionsPage(props) {

    const [currentPage, setCurrentPage] = useState(1);

    const [name, setName] = useState('');
    let searchTimeout = null;
    const { loading, data = {} } = useQuery(GET_COLLECTIONS, {
        onError() {
            message.error("Có lỗi xảy ra khi lấy dữ liệu");
        },
        variables: {
            name,
            orderBy: 'updatedAt_DESC',
            first: 20,
            skip: (currentPage - 1) * 20
        }
    });

    return (
        <div style={{ minHeight: 500 }}>
            <div className="ht__bradcaump__area bg-image--6">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="bradcaump__inner text-center">
                                <h2 className="bradcaump-title">Tuyển tập</h2>
                                <nav className="bradcaump-content">
                                    <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                                    <span className="brd-separetor">/</span>
                                    <span className="breadcrumb_item active">Tuyển tập</span>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="m-t-40 p-l-80 p-r-80 m-b-40">
                <div className="row m-b-24" style={{ justifyContent: 'space-between' }}>
                    <div className="shop__list__wrapper d-flex flex-wrap flex-md-nowrap justify-content-between">
                        <div></div>
                        {!loading && data.getCollections &&
                            <p>Hiển thị {(currentPage - 1) * 20 + 1 > data.getCollections.totalCount ? data.getCollections.totalCount : (currentPage - 1) * 20 + 1} – {(currentPage - 1) * 20 + 20 >
                                data.getCollections.totalCount ? data.getCollections.totalCount : (currentPage - 1) * 20 + 20} trên {data.getCollections.totalCount} kết quả</p>}
                        <Search loading={loading} onChange={(e) => {
                            e.persist();
                            clearTimeout(searchTimeout);
                            searchTimeout = setTimeout(() => {
                                setName(e.target.value);
                            }, 300);
                        }}
                            style={{ maxWidth: 300 }} placeholder="Tìm kiếm tuyển tập..." />
                    </div>

                </div>
                <div className="row">
                    {loading && <Skeleton loading active />}
                    {!loading && data.getCollections && data.getCollections.collections.length > 0 ?
                        data.getCollections.collections.map(collection => {
                            return <CollectionItem collection={collection} key={collection.id} />
                        }) : <div className="d-flex justify-content-center w-100"> <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" /></div>}
                </div>
            </div>
            <div className="m-b-40">
                {!loading && data.getCollections &&
                    <Pagination totalCount={data.getCollections.totalCount} itemsPerPage={20}
                        goToPage={(page) => setCurrentPage(page)}
                        page={currentPage} />}
            </div>
        </div>
    )

}

export default CollectionsPage;