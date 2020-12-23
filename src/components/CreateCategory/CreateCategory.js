import React from 'react';
import './CreateCategory.scss';

export default ({ onCreate }) => {
    const inputRef = React.useRef();
    const [show, setShow] = React.useState(false);
    const [name, setName] = React.useState('');
    const [color, setColor] = React.useState(null);

    const handleCreate = (e) => {
        if(e) e.preventDefault();
        if(name.length > 0) {
            onCreate(name, color);
        }
        setShow(false);
        setName('');
    }
    const onButtonClick = () => {
        setShow(true);
        console.log(inputRef.current.focus());
    }

    const btn = (
        <button onClick={onButtonClick}><span className="material-icons">add_box</span></button>
    )

    let classList = ['create-category-input-wrapper'];
    if(!show) classList.push('hidden');
    classList = classList.join(' ');

    return (
        <div className='create-category'>
            <form className={classList} onSubmit={handleCreate}>
                <input
                    value={name}
                    onChange={e => setName(e.target.value)}
                    ref={inputRef}
                    onBlur={handleCreate}
                />
            </form>
            { !show ? btn : null }
        </div>
    )
}