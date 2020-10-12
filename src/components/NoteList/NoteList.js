import React from 'react';
import './NoteList.scss';
import { ContextMenu, ContextMenuItem as MenuItem, MenuSeparator } from '../ContextMenu';
import StorageContext from '../contexts/StorageContext';
import MenuItemOptions from '../ContextMenu/MenuItemOptions';
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

const NoteItem = ({ id, title, important, category, done, createdAt, categories, storage }) => {
    const inputRef = React.useRef();
    const [show, setShow] = React.useState(false);
    const [position, setPosition] = React.useState({});
    const beautifyDate = (date) => new Date(date).toLocaleString();
    const handleInput = (event) => {
        let { innerText } = event.target;
        if(innerText.length === 0) return onDelete();
    }
    const onDelete = () => {
        storage.deleteNote(id);
    }
    const toggleImportant = () => {
        storage.updateNote(id, { important: !important });
    }
    const toggleDone = () => {
        storage.updateNote(id, { done: !done });
    }
    const handleTitleChange = () => {
        storage.updateNote(id, { title: inputRef.current.innerText });
    }
    const handleCategoryChange = (id, cId) => {
        if(category && (cId === category._id)) return storage.updateNote(id, { category: null });
        return storage.updateNote(id, { category: cId });
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
            { done ? null : 
                (<MenuItemOptions onClick={(_, cId) => handleCategoryChange(id, cId)} title='Категория'>
                    { categories.map(({ title, _id }) => <MenuItem key={_id} id={_id}>
                        <div>{ title }</div>
                    </MenuItem>) }
                </MenuItemOptions>)
            }
            <MenuSeparator/>
            <MenuItem onClick={onDelete}>Удалить</MenuItem>
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
                { category ? <div className='circle' style={{ backgroundColor: globalThis.getColor(category.color) }}></div> : null }
                { category ? <div className='category'>{ category.title }</div> : null }
                { important ?  <div className='important'><span className="material-icons icon">star</span>Важное</div> : null }
                <div className='item-create-date'>{ beautifyDate(createdAt) }</div>
            </div>
        </div>
        { show ? contextMenu : null }
        </>
    )
}