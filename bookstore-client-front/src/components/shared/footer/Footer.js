import React from 'react';
import './footer.css';
import { NavLink } from 'react-router-dom';

function Footer(props){

    return(<footer id="wn__footer" className="footer__area bg__cat--8 brown--color">
    <div className="footer-static-top">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="footer__widget footer__menu">
              <div className="ft__logo">
                <a href="index.html">
                  <img src="/images/logo/3.png" alt="logo" />
                </a>
                <p>Hãy đến với chúng tôi - hệ thống bán sách trực tuyến uy tín. Nơi bạn có thể tìm được những giây phút giá trị bên những trang sách.</p>
              </div>
              <div className="footer__content">
                <ul className="social__net social__net--2 d-flex justify-content-center">
                  <li><a target="_blank" href="https://www.facebook.com/Bookstore_Fanpage-108050860802757"><i className="bi bi-facebook" /></a></li>
                  <li><a target="_blank" href="https://twitter.com/home"><i className="bi bi-twitter" /></a></li>
                  <li><a target="_blank" href="https://www.youtube.com/channel/UCDvi5T9FaC19M1piWpq65pw"><i className="bi bi-youtube" /></a></li>
                </ul>
                <ul className="mainmenu d-flex justify-content-center">
                  <li><NavLink to="/best-seller">Bán chạy</NavLink></li>
                  <li><NavLink to="/books">Tất cả sách</NavLink></li>
                  <li><NavLink to="/auth/account/wish-list">Yêu thích</NavLink></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="copyright__wrapper">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="copyright">
              <div className="copy__right__inner text-left">
                <p>Copyright <i className="fa fa-copyright" /> <a href="https://freethemescloud.com/">Free themes Cloud.</a> All Rights Reserved</p>
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-12">
            <div className="payment text-right">
              <p>Redesigned by Giang Nguyen</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </footer>)

}

export default Footer;