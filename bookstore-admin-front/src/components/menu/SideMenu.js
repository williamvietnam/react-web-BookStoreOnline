import React, { Fragment, useState } from 'react';
import './SidebarNav.min.css';
import { NavLink, useLocation } from 'react-router-dom';


function SideMenu(props) {

    const location = useLocation();
    const { pathname } = location;

    const [navs, setNavs] = useState([
        {
            label: "Dashboard",
            link: "/",
            icon: 'dashboard'
        },
        {
            label: "Danh mục",
            icon: 'book',
            children: [{
                label: "Sách",
                link: "/catalog/books"
            }, {
                label: "Thể loại",
                link: '/catalog/categories'
            }, {
                label: "Tuyển tập",
                link: '/catalog/collections'
            }, {
                label: "Đánh giá",
                link: '/catalog/reviews',
            }, {
                label: "Tác giả",
                link: "/catalog/authors",
            },
            {
                label: "Nhà xuất bản",
                link: '/catalog/publishers'
            }]
        }, {
            label: "Bán hàng",
            icon: 'shopping-cart',
            children: [{
                label: "Đơn hàng",
                link: '/sale/order/list'
            }]
        }, {
            label: "Người dùng",
            icon: 'users',
            children: [{
                label: "Người dùng",
                link: '/users/users'
            }]
        }, 
        {
            label: "Khuyến mại",
            icon: "gift",
            children: [{
                link: "/promotion/discounts",
                label: 'Giảm giá'
            }]
        }
    ])
    const isLinkActive = (nav) => {
        if (nav.link) {
            if (pathname === nav.link)
                return true;
            return false;
        }
        return nav.children.some(item => item.link === pathname);
    }

    return (
        <div className="cbp-spmenu cbp-spmenu-vertical cbp-spmenu-left" id="cbp-spmenu-s1">
            {/*left-fixed -navigation*/}
            <aside className="sidebar-left">
                <nav className="navbar navbar-inverse">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".collapse" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                            <span className="icon-bar" />
                        </button>
                        <h1><NavLink className="navbar-brand" to="/"><span className="fa fa-area-chart" /> Admin<span className="dashboard_text">Bookstore</span></NavLink></h1>
                    </div>
                    <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
                        <ul className="sidebar-menu">
                            <li className="header">MENU CHÍNH</li>
                            {navs.map((nav, index) => (<li key={index}
                                onClick={(e) => {
                                    setNavs(prev => {
                                        const newState = [...prev];
                                        if (!newState[index].isOpen) {
                                            newState.forEach(item => item.isOpen = undefined);
                                            newState[index].isOpen = true;
                                        } else {
                                            newState[index].isOpen = undefined;
                                        }
                                        return newState;
                                    });
                                }}
                                className={`treeview${isLinkActive(nav) ? " active" : ""}`}>
                                {!nav.link ? <Fragment><a>
                                    <i className={`fa fa-${nav.icon}`} /> <span>{nav.label}</span>
                                    <i className={`fa fa-angle-${nav.isOpen ? 'down m-t-4' : 'left'} pull-right`}></i>
                                </a>
                                    {nav.children &&
                                        <ul className={`treeview-menu${nav.isOpen ? " menu-open" : ""}`} style={{ display: nav.isOpen ? 'block' : 'none' }}>
                                            {
                                                nav.children.map((c, i) => {
                                                    return (
                                                        <li key={i}>
                                                            <NavLink onClick={(e) => e.stopPropagation()} to={c.link} activeClassName="active">
                                                                <i className="fa fa-angle-right" /> {c.label}
                                                            </NavLink>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>}
                                </Fragment> : (<NavLink to={nav.link} activeClassName="active">
                                    <i className={`fa fa-${nav.icon}`} /> <span>{nav.label}</span>
                                </NavLink>)}
                            </li>))}
                        </ul>
                    </div>
                    {/* /.navbar-collapse */}
                </nav>
            </aside>
        </div>
    )
}

export default SideMenu;