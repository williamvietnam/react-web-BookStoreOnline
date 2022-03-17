import React from 'react';
import '../../css/not-found.css';

function NotFound404Page(props){
    return (
        <section className="page_error section-padding--lg bg--white">
        <div className="container">
            <div className="row">
                <div className="col-lg-12">
                    <div className="error__inner text-center">
                        <div className="error__logo">
                            <a href="#"><img src="/images/others/404.png" alt="error images" /></a>
                        </div>
                        <div className="error__content">
                            <h2>error - not found</h2>
                            <p>It looks like you are lost! Try searching here</p>
                            <div className="search_form_wrapper">
                                <form action="#">
                                    <div className="form__box">
                                        <input type="text" placeholder="Search..." />
                                        <button><i className="fa fa-search"></i></button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
    )
}

export default NotFound404Page;