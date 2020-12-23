import React from 'react';
import { MenuItem } from '../Menu';
import useContextMenu from '../hooks/useContextMenu';
import ColorPicker from '../ColorPicker';
import StorageContext from '../contexts/StorageContext';
import getColorFromListById from '../../getColorFromListById';


export default ({ setPopUpContent, title,...rest }) => {
    const storage = React.useContext(StorageContext);
    const { colorId } = rest;
    let style = {};
    if (getColorFromListById(colorId)) {
        style = { backgroundColor: getColorFromListById(colorId).hex }
    }
    const titleDiv = (
        <React.Fragment>
            <div className='circle' style={style}></div>
            { title }
        </React.Fragment>
    );

    const deleteCategory = (id) => {
        storage.deleteCategory(id);
        setPopUpContent(null);
    }

    const clearCategory = (id) => {
        storage.clearCategory(id);
        setPopUpContent(null);
    }

    const handleColorSelect = ({ id }) => {
        storage.updateCategory(rest.id, { color: id });
        setPopUpContent(null);
    }

    const renderDeletePopUp = () => {
        const { title, id } = rest;
        return (
            <div className='popup-category'>
                <h1>Удалить категорию {title}?</h1>
                <div className='btn-items'>
                    <button onClick={() => deleteCategory(id)}>Удалить только категорию</button>
                    <button onClick={() => clearCategory(id)}>Удалить категорию и все вложения</button>
                    <button onClick={() => setPopUpContent(null)}>Отмена</button>
                </div>
            </div>
        )
    }
    const renderColorPicker = () => {
        const { title } = rest;
        return (
            <div className='popup-category'>
                <h2>Выберите цвет для категории {title}</h2>
                <ColorPicker 
                    onColorSelect={handleColorSelect}
                    selectedColorId={colorId}
                />
                <div className='btn-items picker'>
                    <button onClick={() => setPopUpContent(null)}>Отмена</button>
                </div>
            </div>
        )
    }

    const showContextMenu = useContextMenu(
        React.useCallback(() => {
            let str = '';
            if (colorId) {
                str = 'Изменить цвет';
                console.log(colorId);
            } else {
                str = 'Добавить цвет';
            }

            return [
                {
                    label: 'Удалить',
                    click: () => setPopUpContent(renderDeletePopUp())
                },
                {
                    label: str,
                    click: () => setPopUpContent(renderColorPicker())
                }
            ]

        }, [colorId])
    );

    console.log(titleDiv);

    return (
        <React.Fragment>
            <MenuItem {...rest} onContextMenu={showContextMenu} title={titleDiv} />
        </React.Fragment>
    ) 
}