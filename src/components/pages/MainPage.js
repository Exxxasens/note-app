import React from 'react';
import './MainPage.scss';
import TopBar from '../TopBar';

export default ({ topBarSubTitle, topBarTitle, children }) => {
    return (
        <div className='main-page'>
            <TopBar>
                <h1>{ topBarTitle }</h1>
                { topBarSubTitle ? <div className='top-bar-div'>{ topBarSubTitle }</div> : null } 
            </TopBar>
            { children }
        </div>
    )
}