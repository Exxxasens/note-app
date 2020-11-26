import React from 'react';
import './NoteList.scss';
import NoteItem from './NoteItem';
import PopUp from '../PopUp';
import StorageContext from '../contexts/StorageContext';
import useStorage from '../hooks/useStorage';

export default ({ list, filterFn }) => {
    const storage = React.useContext(StorageContext);
    const categories = useStorage('categories');
    const mapFn = ({ _id, ...rest }) => 
        <NoteItem {...rest} 
            key={_id} 
            id={_id} 
            categories={categories}
            storage={storage}
        />;
    return (
        <div className='note-list-wrapper'>
            <div className='note-list'>
                { filterFn ? list.filter(filterFn).map(mapFn) : list.map(mapFn) }
            </div>
        </div>
    )
}