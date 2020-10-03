import React from 'react';
import TopBar from '../TopBar';
import './Layout.scss';

export default ({ topBar, children }) => {
    return (
        <div className='layout'>
            <TopBar>
                { topBar }
            </TopBar>
            <div className='content-wrapper'>
                { children }
            </div>
        </div>
    )
}