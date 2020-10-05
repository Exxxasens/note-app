import React from 'react';
import { useRouteMatch } from 'react-router-dom';

export default (Component, fn) => {
    return ({ match, location, history, ...rest}) => {
        const newProps = fn({ match, location, history });
        return <Component {...rest} {...newProps}/>
    }
}