import React from 'react';
import './MainPage.scss';
import CreateNote from '../CreateNote';
import TopBar from '../TopBar';
import NoteList from '../NoteList/NoteList';

export default ({ filterNotesFn, topBarSubTitle, notes, handleCreate }) => {
    return (
        <div className='main-page'>
            <TopBar>
                <h1>Напоминания</h1>
                { topBarSubTitle ? <div className='top-bar-div'>{ topBarSubTitle }</div> : null } 
            </TopBar>
            <NoteList 
                list={notes} 
            />
            <CreateNote onCreate={handleCreate}/>
        </div>
    )
}