import React from 'react';
import './MainPage.scss';
import CreateNote from '../CreateNote';
import TopBar from '../TopBar';

export default ({ filterNotesFn, topBarSubTitle }) => {
    return (
        <div className='main-page'>
            <TopBar>
                <h1>Напоминания</h1>
                { topBarSubTitle ? <div>{ topBarSubTitle }</div> : null } 
            </TopBar>
            <CreateNote onCreate={() => console.log(1)}/>
        </div>
    )
}