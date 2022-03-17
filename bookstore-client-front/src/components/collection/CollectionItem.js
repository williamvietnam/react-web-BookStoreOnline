import React from 'react';
import { NavLink } from 'react-router-dom';

function CollectionItem(props) {

    const { id, thumbnail, name } = props.collection;

    return (
        <div style={{maxWidth: 200}}>
            <div className="d-flex align-items-center justify-content-center flex-column">
                <NavLink to={`/collection/${id}`}>
                    <img height={150} src={thumbnail} />
                </NavLink>
                <NavLink className="m-t-12" style={{textAlign: 'center', wordBreak: 'break-word'}} to={`/collection/${id}`}>
                    {name}
                </NavLink>
            </div>
        </div>
    )

}

export default CollectionItem;