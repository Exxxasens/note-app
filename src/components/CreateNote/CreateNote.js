import React from 'react';
import Button from '../Button';
import './CreateNote.scss';

export default ({ onCreate, options = {} }) => {
    const [value, setValue] = React.useState('');
    const resetStates = () => {
        setValue('');
        setImportant(false);
    }
    const handleSubmit = (event) => {
        event.preventDefault();
        if(value.length === 0) return null;
        onCreate({ 
            title: value,
            isImportant: options.isImportant || false,
            category: null,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        resetStates();
    }
    const handleInputChange = (event) => {
        const { value } = event.target;
        setValue(value);
    }
    return (
        <div className='create-note'>
            <div className='header-wrapper'>
                <h2>Создать заметку</h2>
            </div>
            <div className='form-wrapper'>
                <form onSubmit={handleSubmit}>
                    <div className='title-input-wrapper'>
                        <input 
                            className='title-input'
                            value={value}
                            type='text'
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button type='submit' className='create-btn'>Добавить</Button>
                </form>
            </div>
        </div>
    )
}
/*

<div className='option-list'>
    <div className='option-date'>
        <Button title='Добавить дату' onClick={() => showTime(s => !s)}>
            <span class="material-icons">schedule</span>
        </Button>
    </div>
</div>

<div className='option-is-important' title='Отметить как важное'>
    <button onClick={() => setImportant(i => !i)}>
        { isImportant ? <span className='material-icons'>star</span> : <span className='material-icons'>star_outline</span> }
    </button>
</div>

*/