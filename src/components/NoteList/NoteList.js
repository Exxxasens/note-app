import React from 'react';
import './NoteList.scss';
import { ContextMenu, ContextMenuItem as MenuItem, MenuSeparator } from '../ContextMenu';
import StorageContext from '../contexts/StorageContext';

const colorList = {
    'blue': '#597aff',
    'red': 'red',
    'yellow': 'yellow',
    'green': 'green'
}

export default ({ list, filterFn }) => {
    const storage = React.useContext(StorageContext);
    const onDelete = (_id) => {
        storage.deleteNote(_id);
    }
    const onToggleImportant = (_id, i) => {
        storage.updateNote(_id, { important: !i });
    }
    const onToggleDone = (_id, d) => {
        storage.updateNote(_id, { done: !d });
    }
    const onTitleChange = (_id, title) => {
        storage.updateNote(_id, { title });
    }

    const mapFn = ({ _id, ...rest }) => 
        <NoteItem {...rest} 
            key={_id} 
            id={_id} 
            onDelete={onDelete} 
            onToggleImportant={onToggleImportant}
            onToggleDone={onToggleDone}
            onTitleChange={onTitleChange}
        />;
    return (
        <div className='note-list-wrapper'>
            <div className='note-list'>
                { filterFn ? list.filter(filterFn).map(mapFn) : list.map(mapFn) }
            </div>
        </div>
    )
}

const NoteItem = ({ id, title, color, important, category, done, createdAt, onDelete, onToggleDone, onToggleImportant, onTitleChange }) => {
    const inputRef = React.useRef();
    const [show, setShow] = React.useState(false);
    const [position, setPosition] = React.useState({});
    const beautifyDate = (date) => new Date(date).toLocaleString();
    const handleInput = (event) => {
        let { innerText } = event.target;
        if(innerText.length === 0) return onDelete(id);
    }
    const toggleImportant = () => {
        onToggleImportant(id, important);
    }
    const toggleDone = () => {
        onToggleDone(id, done);
    }
    const handleTitleChange = () => {
        onTitleChange(id, inputRef.current.innerText);
    }
    const contextMenu = (
        <ContextMenu position={position} onHide={() => setShow(false)}>
            <MenuItem onClick={toggleImportant}>
                { important ? 'Отметить как обычное' : 'Отметить как важное' }
            </MenuItem>
            <MenuItem onClick={toggleDone}>
                { done ? 'Отметить как не выполненное' : ' Отметить как выполненное'}
            </MenuItem>
            { done ? null : <MenuItem onClick={() => inputRef.current.focus()}>Изменить</MenuItem> }
            { done ? null : <MenuItem onClick={() => console.log('Категория')}>Категория</MenuItem>}
            <MenuSeparator/>
            <MenuItem onClick={() => onDelete(id)}>Удалить</MenuItem>
        </ContextMenu>
    );
    const showContextMenu = ({ clientX: x, clientY: y }) => {
        setShow(true);
        setPosition({ x, y });
    }
    let classList = ['note-item'];
    if(done) classList.push('done');
    classList = classList.join(' ');
    return (
        <>
        <div className={classList} onContextMenu={showContextMenu}>
            <div className='title-wrapper'>
                <div className='title' 
                    contentEditable={!done} 
                    onInput={handleInput} 
                    suppressContentEditableWarning
                    ref={inputRef}
                    onBlur={handleTitleChange}
                    >
                    { title }
                </div>
            </div>
            <div className='row'>
                { color ? <div className='circle' style={{ backgroundColor: colorList[color] }}></div> : null }
                { category ? <div className='category'>{ category }</div> : null }
                { important ?  <div className='important'><span className="material-icons icon">star</span>Важное</div> : null }
                <div className='item-create-date'>{ beautifyDate(createdAt) }</div>
            </div>
        </div>
        { show ? contextMenu : null }
        </>
    )
}