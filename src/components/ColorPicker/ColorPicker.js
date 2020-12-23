import React from 'react';
import './ColorPicker.scss';
import colorList from '../../colorList';

export default ({ onColorSelect, selectedColorId }) => {
    const mapFn = ({ name, hex, id }) => {

        const selected = (id === selectedColorId);
        let classList = ['color-item-btn'];

        const handleColorClick = () => {
            if(selected) return;
            onColorSelect({ name, hex, id });
        }

        if(selected)
            classList.push('selected');

        classList = classList.join(' ');

        return (
            <button className={classList} onClick={handleColorClick}>
                <div className='color-circle' style={{ backgroundColor: hex }}></div>
                <div className='color-name'>
                    { name }
                </div>
            </button>
        )
    }

    return (
        <div className='color-picker'>
            <div className='color-list'>
                { colorList.map(mapFn) }
            </div>
        </div>
    )
}