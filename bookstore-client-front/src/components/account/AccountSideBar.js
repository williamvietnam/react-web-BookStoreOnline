import React from 'react';
import { NavLink } from 'react-router-dom';
import './account-sidebar.css';
import { Avatar } from 'antd';
import getAvatarAlt from '../../utils/getAvatarAlt';

function AccountSideBar(props) {
    const { userInfo } = props;
    return (
        <aside className="Account__StyledSideBar-sc-1ee42ku-3 fJbFvc">
            <div className="m-b-12 d-flex align-items-center">
                <Avatar size="large" src={userInfo.avatar} alt={getAvatarAlt(userInfo)}>
                    {getAvatarAlt(userInfo)}
                </Avatar>
                <div className="d-flex flex-column m-l-8"><span>Tài khoản của&nbsp;</span><strong>{userInfo.fullName ? userInfo.fullName : userInfo.username}</strong></div>
            </div>
            <ul className="sidebar-list">
                <li>
                    <NavLink to="/auth/account/edit" activeClassName="is-active">
                        <svg stroke="#999999" fill="#999999" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg><span>Thông tin tài khoản</span>
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink to="/customer/notification" activeClassName="is-active">
                        <svg stroke="#999999" fill="#999999" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
                        </svg><span>Thông báo của tôi</span><span className="badge">1</span>
                    </NavLink>
                </li> */}
                <li>
                    <NavLink to="/auth/account/orders/history" activeClassName="is-active">
                        <svg stroke="#999999" fill="#999999" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M13 12h7v1.5h-7zm0-2.5h7V11h-7zm0 5h7V16h-7zM21 4H3c-1.1 0-2 .9-2 2v13c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 15h-9V6h9v13z" />
                        </svg><span>Quản lý đơn hàng</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/auth/account/address" activeClassName="is-active">
                        <svg stroke="#999999" fill="#999999" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" /></svg>
                        <span>Sổ địa chỉ</span>
                    </NavLink>
                </li>
                {/* <li>
                    <NavLink to="/danh-rieng-cho-ban" activeClassName="is-active"><svg stroke="#999999" fill="#999999" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" /></svg>
                        <span>Sản phẩm bạn đã xem</span>
                    </NavLink>
                </li> */}
                <li>
                    <NavLink to="/auth/account/wish-list" activeClassName="is-active"><svg stroke="#999999" fill="#999999" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg>
                        <span>Sản phẩm yêu thích</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/auth/account/review" activeClassName="is-active"><svg stroke="#999999" fill="#999999" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 9.24l-7.19-.62L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.63-7.03L22 9.24zM12 15.4V6.1l1.71 4.04 4.38.38-3.32 2.88 1 4.28L12 15.4z" /></svg>
                        <span>Nhận xét của tôi</span>
                    </NavLink>
                </li>
            </ul>
        </aside>
    )
}

export default AccountSideBar;