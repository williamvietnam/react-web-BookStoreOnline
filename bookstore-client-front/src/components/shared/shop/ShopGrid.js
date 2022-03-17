import React, { useEffect, useState, Fragment } from 'react';
import ProductItem from '../../products/ProductItem';
import ListProductItem from '../../products/ListProductItem';
import Pagination from '../pagination/Pagination';
import { VIEW_MODE_GRID, VIEW_MODE_LIST, SORT_DIRECTION_LATEST, SORT_DIRECTION_NAME_AZ, SORT_DIRECTION_NAME_ZA, SORT_DIRECTION_PRICE_ASC, SORT_DIRECTION_PRICE_DESC, FILTER_TYPE_CAT, FILTER_TYPE_AUTHOR, FILTER_TYPE_PUBLISHER } from '../../../constants';
import CommonFilter from '../filters/CommonFilter';
import { GET_CATEGORIES } from '../../../api/categoryApi';
import { GET_AUTHORS } from '../../../api/authorApi';
import { GET_PUBLISHERS } from '../../../api/publisherApi';
import PriceFilter from '../filters/PriceFilter';
import { NavLink } from 'react-router-dom';
import { message, Empty, Skeleton } from 'antd';

const sortDirections = [
  {
    value: SORT_DIRECTION_LATEST,
    label: "Mới nhất",
  }, {
    value: SORT_DIRECTION_NAME_AZ,
    label: "Tên A-Z",
  }, {
    value: SORT_DIRECTION_NAME_ZA,
    label: "Tên Z-A"
  }, {
    value: SORT_DIRECTION_PRICE_ASC,
    label: "Giá tăng dần"
  }, {
    value: SORT_DIRECTION_PRICE_DESC,
    label: "Giá giảm dần"
  }
]

function ShopGrid(props) {
  // const [currentPage, setCurrentPage] = useState(1);
  // const [viewMode,setViewMode] = useState('grid');

  // console.log(viewMode)

  // const goToPage = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // }
  const { books, userSettings, changeShopPage, changeSortDirection, changeViewMode, filters, client } = props;
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    let authBookWhere = {};
    let catBookWhere = {};
    let pubBookWhere = {};

    if (filters.price) {
      if (filters.price.operator === 'gt') {
        catBookWhere = {
          authors_some: {
            id: filters.author
          },
          publisher: {
            id: filters.publisher
          },
          basePrice_gt: filters.price.range[0]
        };
        authBookWhere = {
          categories_some: {
            id: filters.category
          },
          publisher: {
            id: filters.publisher
          },
          basePrice_gt: filters.price.range[0]
        };
        pubBookWhere = {
          authors_some: {
            id: filters.author
          },
          publisher: {
            id: filters.publisher
          },
          basePrice_gt: filters.price.range[0]
        };
      } else if (filters.price.operator === 'lt') {
        catBookWhere = {
          authors_some: {
            id: filters.author
          },
          publisher: {
            id: filters.publisher
          },
          basePrice_lt: filters.price.range[0]
        };
        authBookWhere = {
          categories_some: {
            id: filters.category
          },
          publisher: {
            id: filters.publisher
          },
          basePrice_lt: filters.price.range[0]
        };
        pubBookWhere = {
          authors_some: {
            id: filters.author
          },
          publisher: {
            id: filters.publisher
          },
          basePrice_lt: filters.price.range[0]
        };
      } else if (filters.price.operator === 'between') {
        catBookWhere = {
          AND: [{
            authors_some: {
              id: filters.author
            },
            publisher: {
              id: filters.publisher
            },
            basePrice_gt: filters.price.range[0]
          }, {
            authors_some: {
              id: filters.author
            },
            publisher: {
              id: filters.publisher
            },
            basePrice_lt: filters.price.range[1]
          }]
        };
        authBookWhere = {
          AND: [{
            categories_some: {
              id: filters.category
            },
            publisher: {
              id: filters.publisher
            },
            basePrice_gt: filters.price.range[0]
          }, {
            categories_some: {
              id: filters.category
            },
            publisher: {
              id: filters.publisher
            },
            basePrice_lt: filters.price.range[1]
          }]
        };
        pubBookWhere = {
          AND: [{
            authors_some: {
              id: filters.author
            },
            publisher: {
              id: filters.publisher
            },
            basePrice_gt: filters.price.range[0]
          }, {
            authors_some: {
              id: filters.author
            },
            publisher: {
              id: filters.publisher
            },
            basePrice_lt: filters.price.range[1]
          }]
        };
      }
    } else {
      catBookWhere = {
        authors_some: {
          id: filters.author
        },
        publisher: {
          id: filters.publisher
        }
      };
      pubBookWhere = {
        authors_some: {
          id: filters.author
        },
        categories_some: {
          id: filters.category
        },
      };
      authBookWhere = {
        categories_some: {
          id: filters.category
        },
        publisher: {
          id: filters.publisher
        }
      }
    }
    (async function getFilters() {
      try {
        const resCat = await client.query({
          query: GET_CATEGORIES,
          variables: {
            bookWhere: catBookWhere,
            where: {
              books_some: {
                authors_some: {
                  id: filters.author
                },
                publisher: {
                  id: filters.publisher
                }
              }
            },
            orderBy: "name_ASC"
          },
        });
        const resAuth = await client.query({
          query: GET_AUTHORS,
          variables: {
            bookWhere: authBookWhere,
            where: {
              books_some: {
                categories_some: {
                  id: filters.category
                },
                publisher: {
                  id: filters.publisher
                }
              }
            },
            orderBy: "pseudonym_ASC"
          }
        });
        const resPub = await client.query({
          query: GET_PUBLISHERS,
          variables: {
            bookWhere: pubBookWhere,
            where: {
              books_some: {
                authors_some: {
                  id: filters.author
                },
                categories_some: {
                  id: filters.category
                },
              }
            },
            orderBy: "name_ASC"
          }
        });
        setAuthors(resAuth.data.getAuthors);
        setCategories(resCat.data.getCategories);
        setPublishers(resPub.data.getPublishers);
      } catch (err) {
        message.error("Có lỗi xảy ra khi lấy dữ liệu");
      }
    })()

  }, [filters.category, filters.author, filters.publisher, filters.price ? filters.price.id : undefined])

  useEffect(() => {
    let where = {};
    if (filters.price) {
      if (filters.price.operator === 'gt') {
        where = {
          categories_some: filters.category ? {
            id: filters.category
          } : undefined,
          authors_some: filters.author ? {
            id: filters.author
          } : undefined,
          publisher: filters.publisher ? {
            id: filters.publisher
          } : undefined,
          basePrice_gt: filters.price.range[0],
        }
      } else if (filters.price.operator === 'lt') {
        where = {
          categories_some: filters.category ? {
            id: filters.category
          } : undefined,
          authors_some: filters.author ? {
            id: filters.author
          } : undefined,
          publisher: filters.publisher ? {
            id: filters.publisher
          } : undefined,
          basePrice_lt: filters.price.range[0],
        }
      } else if (filters.price.operator === 'between') {
        where = {
          AND: [{
            categories_some: filters.category ? {
              id: filters.category
            } : undefined,
            authors_some: filters.author ? {
              id: filters.author
            } : undefined,
            publisher: filters.publisher ? {
              id: filters.publisher
            } : undefined,
            basePrice_gt: filters.price.range[0],
          }, {
            categories_some: filters.category ? {
              id: filters.category
            } : undefined,
            authors_some: filters.author ? {
              id: filters.author
            } : undefined,
            publisher: filters.publisher ? {
              id: filters.publisher
            } : undefined,
            basePrice_lt: filters.price.range[1],
          }]
        }
      }
    } else {
      where = {
        categories_some: filters.category ? {
          id: filters.category
        } : undefined,
        authors_some: filters.author ? {
          id: filters.author
        } : undefined,
        publisher: filters.publisher ? {
          id: filters.publisher
        } : undefined,
        basePrice: filters.price,
      }
    }
    props.getBooks({
      where,
      orderBy: userSettings.sortDirection,
      skip: (userSettings.shopPage - 1) * 9,
      first: 9
    });
  }, [userSettings.shopPage,
  userSettings.sortDirection,
  filters.price ? filters.price.id : undefined, filters.publisher,
  filters.category,
  filters.author])//effect này chỉ chạy khi một trong những giá trị trong array thay đổi với lần render trước đó



  const renderProducts = () => {
    const listWrapper = document.querySelector(".shop__list__wrapper");
    if (books.loading) {
      return (<Fragment><div className="d-flex w-100 m-b-8">
        <Skeleton active loading />
        <Skeleton active loading />
        <Skeleton active loading />
        <Skeleton active loading />
      </div>
        <div className="d-flex w-100">
          <Skeleton active loading />
          <Skeleton active loading />
          <Skeleton active loading />
          <Skeleton active loading />
        </div>
      </Fragment>)
    }
    // if (listWrapper) {
    //   listWrapper.scrollIntoView();
    // }
    if (books && books.books && books.books.length) {
      return books.books.map((book, index) => {
        return (
          <div key={index}><ProductItem width={220} thumbHeight={240} book={book} /></div>
        )
      });
    } else {
      return (
        <div className="d-flex justify-content-center w-100"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" /></div>
      )
    }
  }

  const renderProductsList = () => {
    const listWrapper = document.querySelector(".shop__list__wrapper");
    if (books.loading) {
      return <Skeleton active />
    }
    if (books && books.books && books.books.length) {
      return books.books.map((book, index) => {
        return (
          <div key={index}><ListProductItem width={300} thumbHeight={360} book={book} /></div>
        )
      });
    } else {
      return (
        <div className="d-flex justify-content-center w-100"><Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="Không có dữ liệu" /></div>
      )
    }
  }

  return (
    <Fragment>
      <div className="ht__bradcaump__area bg-image--6">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="bradcaump__inner text-center">
                <h2 className="bradcaump-title">Cửa hàng sách</h2>
                <nav className="bradcaump-content">
                  <NavLink className="breadcrumb_item" to="/">Trang chủ</NavLink>
                  <span className="brd-separetor">/</span>
                  <span className="breadcrumb_item active">Cửa hàng sách</span>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="page-shop-sidebar left--sidebar bg--white section-padding--lg">
        <div className="container">
          <div className="row">
            <div className="col-lg-3 col-12 order-2 order-lg-1 md-mt-40 sm-mt-40">
              <div className="shop__sidebar">
                <CommonFilter filterType={FILTER_TYPE_CAT} filterName="Thể loại" filterItems={categories} />
                <CommonFilter filterType={FILTER_TYPE_AUTHOR} filterName="Tác giả" filterItems={authors} />
                <PriceFilter />
                <CommonFilter filterType={FILTER_TYPE_PUBLISHER} filterName="Nhà xuất bản" filterItems={publishers} />

                <aside className="wedget__categories sidebar--banner">
                  <img src="images/others/banner_left.jpg" alt="banner images" />
                  <div className="text">
                    <h2>new products</h2>
                    <h6>save up to <br /> <strong>40%</strong>off</h6>
                  </div>
                </aside>
              </div>
            </div>
            <div className="col-lg-9 col-12 order-1 order-lg-2">
              <div className="row">
                <div className="col-lg-12">
                  <div className="shop__list__wrapper d-flex flex-wrap flex-md-nowrap justify-content-between">
                    <div className="shop__list nav justify-content-center" role="tablist">
                      <a className={`nav-item nav-link${userSettings.viewMode === VIEW_MODE_GRID ? " active" : ""}`}
                        onClick={() => changeViewMode(VIEW_MODE_GRID)} data-toggle="tab" href="#nav-grid" role="tab"><i className="fa fa-th" /></a>
                      {/* <a className={`nav-item nav-link${userSettings.viewMode === VIEW_MODE_LIST ? " active" : ""}`}
                        data-toggle="tab" onClick={() => changeViewMode(VIEW_MODE_LIST)} href="#nav-list" role="tab"><i className="fa fa-list" /></a> */}
                    </div>
                    <p>Hiển thị {(userSettings.shopPage - 1) * 9 + 1 > books.totalCount ? books.totalCount : (userSettings.shopPage - 1) * 9 + 1} – {(userSettings.shopPage - 1) * 9 + 9 >
                      books.totalCount ? books.totalCount : (userSettings.shopPage - 1) * 9 + 9} trên {books.totalCount} kết quả</p>
                    <div className="orderby__wrapper">
                      <span>Sắp xếp theo: </span>
                      <select className="shot__byselect" value={userSettings.sortDirection} onChange={(e) => { changeSortDirection(e.target.value) }}>
                        {sortDirections.map(item => {
                          return (<option key={item.value} value={item.value}>{item.label}</option>)
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="tab__container">
                <div className={`shop-grid tab-pane fade${userSettings.viewMode === VIEW_MODE_GRID ? " show active" : ""}`} id="nav-grid" role="tabpanel">
                  <div className="row">
                    {userSettings.viewMode === VIEW_MODE_GRID && renderProducts()}
                  </div>

                </div>
                <div className={`shop-grid tab-pane fade${userSettings.viewMode === VIEW_MODE_LIST ? " show active" : ""}`} id="nav-list" role="tabpanel">
                  <div className="list__view__wrapper">
                    {userSettings.viewMode === VIEW_MODE_LIST && renderProductsList()}
                  </div>
                </div>
              </div>
              <br />
              <br />
              <Pagination page={userSettings.shopPage} goToPage={changeShopPage}
                totalCount={books.totalCount} itemsPerPage={9} />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default ShopGrid;
