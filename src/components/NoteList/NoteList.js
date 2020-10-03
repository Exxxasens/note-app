import React from 'react';
import './NoteList.scss';

const colorList = {
    'blue': '#597aff',
    'red': 'red',
    'yellow': 'yellow',
    'green': 'green'
}

export default ({ list }) => {
    const beautifyDate = (date) => new Date(date).toLocaleString();
    const mapFn = ({ title, color, isImportant, category, complete, createdAt }, i) => {
        return (
            <div className='note-item' key={i}>
                <div className='title'>{title}</div>
                <div className='row'>
                    { color ? <div className='circle' style={{ backgroundColor: colorList[color] }}></div> : null }
                    { category ? <div className='category'>{ category }</div> : null }
                    <span className="material-icons icon">{ isImportant ? 'star' : 'star_outline' }</span>
                    <div className='item-create-date'>{ beautifyDate(createdAt) }</div>
                </div>
            </div>
        )
    }

    return (
        <div className='note-list'>
            { list.map(mapFn) }
        </div>
    )
}