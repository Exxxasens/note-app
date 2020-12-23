import React from 'react';
import useContextMenu from '../hooks/useContextMenu';
import PlatfromContext from '../contexts/PlatformContext';
import getColorFromListById from '../../getColorFromListById';


export default ({ id, title, important, category, done, createdAt, categories, storage, showPopUp }) => {
    const inputRef = React.useRef();
    const platform = React.useContext(PlatfromContext);
    const showContextMenu = useContextMenu(React.useCallback(() => {
        let categorySubmenu = categories.map(c => ({
            label: c.title,
            type: 'radio',
            checked: category ? (c._id === category._id) : false,
            click: () => handleCategoryChange(c._id)
        }))
        if(platform !== 'darwin') {
            categorySubmenu.unshift({
                label: 'Нет',
                type: 'radio',
                checked: !category,
                click: () => handleCategoryChange(null)
            })
        }
        return  [
            {
                label: 'Редактировать',
                click: () => inputRef.current && inputRef.current.focus()
            },
            {
                label: 'Выполнено',
                type: 'checkbox',
                checked: done,
                click: toggleDone
            },
            {
                label: 'Важное',
                type: 'checkbox',
                checked: important,
                click: toggleImportant
            },
            {
                label: 'Категория',
                type: 'submenu',
                submenu: categorySubmenu
            },
            {
                type: 'separator'
            },
            {
                label: 'Удалить',
                click: onDelete
            }]
    }, 
    [category, done, important, title, id, categories]));

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
    const handleCategoryChange = (cId) => {
        if(category && (cId === category._id)) return storage.updateNote(id, { category: null });
        return storage.updateNote(id, { category: cId });
    }

    let circleStyle = {};

    if (getColorFromListById(category.color)) {
        circleStyle = { backgroundColor: getColorFromListById(category.color).hex };
    }

    let classList = ['note-item'];
    if(done) classList.push('done');
    classList = classList.join(' ');
    return (
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
                { category ? <div className='circle' style={circleStyle}></div> : null }
                { category ? <div className='category'>{ category.title }</div> : null }
                { important ?  <div className='important'><span className="material-icons icon">star</span>Важное</div> : null }
                <div className='item-create-date'>{ beautifyDate(createdAt) }</div>
            </div>
        </div>
    )
}