import React from 'react';
import './NoteList.scss';

const colorList = {
    'blue': '#597aff',
    'red': 'red',
    'yellow': 'yellow',
    'green': 'green'
}

export default ({ list, filterFn }) => {
    const beautifyDate = (date) => new Date(date).toLocaleString();
    const mapFn = ({ title, color, isImportant, category, done, createdAt }, i) => {
        let classList = ['note-item'];
        if(done) classList.push('done');
        classList = classList.join(' ');
        return (
            <div className={classList} key={i}>
                <div className='title-wrapper'><div className='title'>{title}</div></div>
                <div className='row'>
                    { color ? <div className='circle' style={{ backgroundColor: colorList[color] }}></div> : null }
                    { category ? <div className='category'>{ category }</div> : null }
                    { isImportant ?  <div className='important'><span className="material-icons icon">star</span>Важное</div> : null }
                    <div className='item-create-date'>{ beautifyDate(createdAt) }</div>
                </div>
            </div>
        )
    }

    return (
        <div className='note-list-wrapper'>
            <div className='note-list'>
                { filterFn ? list.filter(filterFn).map(mapFn) : list.map(mapFn) }
            </div>
        </div>
    )
}