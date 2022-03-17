import React from 'react';
import './pagination.css';

function Pagination({ page, totalCount, itemsPerPage, paginationItemShown = 5, goToPage }) {
    const pageNumbers = Math.ceil(totalCount / itemsPerPage);
    let pageIndexes = [];
    if (page >= 1 && page < 3) {
        if (pageNumbers - page <= 1) {
            for (let i = 0; i < pageNumbers; i++) {
                pageIndexes.push(i + 1)
            }
        } else {
            for (let i = 0; i < page + 2; i++) {
                pageIndexes.push(i + 1)
            }
        }
    } else {
        if (pageNumbers - page <= 1) {
            for (let i = page - 2; i < pageNumbers; i++) {
                pageIndexes.push(i + 1)
            }
        } else {
            for (let i = page - 2; i < page + 2; i++) {
                pageIndexes.push(i + 1)
            }
        }
    }
    return (<ul className="wn__pagination">
        {page>=2&&<li onClick={()=>goToPage(1)}><a><i className="fa fa-angle-double-left"/></a></li>}
        {page >= 2 && <li onClick={()=>goToPage(page-1)}><a><i className="zmdi zmdi-chevron-left" /></a></li>}
        {pageIndexes.map(item => (
            <li className={item === page ? "active" : ""} key={item} onClick={() => goToPage(item)}>
                <a >{item}</a>
            </li>))}
        {page<pageNumbers&&<li onClick={()=>goToPage(page+1)}><a><i className="zmdi zmdi-chevron-right" /></a></li>}
        {page>=1 && page<pageNumbers && <li onClick={()=>goToPage(page+1)}><a><i className="fa fa-angle-double-right" /></a></li>}

    </ul>)
}

export default Pagination;