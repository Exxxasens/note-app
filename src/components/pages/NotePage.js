import React from 'react';
import MainPage from './MainPage';
import NoteList from '../NoteList';
import CreateNote from '../CreateNote';

export default ({ notes, filterNotesFn, handleCreate, ...rest }) => {
    return (
        <MainPage topBarTitle="Напоминания" {...rest}>
            <NoteList 
                list={notes}
                filterFn={filterNotesFn}
            />
            <CreateNote onCreate={handleCreate}/>
        </MainPage>
    )
}