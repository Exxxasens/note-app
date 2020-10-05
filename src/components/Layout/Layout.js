import React from 'react';
import Bar from '../Bar';
import './Layout.scss';

export default ({ topBar, children, bottomBar }) => {
    return (
        <div className='layout'>
            <Bar className='top'>
                { topBar }
            </Bar>
            <div className='content-wrapper'>
                { children }
            </div>
            <Bar className='bottom'>
                { bottomBar }
            </Bar>
        </div>
    )
}