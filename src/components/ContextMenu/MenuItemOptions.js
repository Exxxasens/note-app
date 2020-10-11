import React from 'react';
export default ({ onClick, children, title }) => {
    const [show, setShow] = React.useState(false);

    const showItem = () => {
        if(children.length === 0) {
            return <div>Нет категорий :(</div>
        }
        return React.Children.map(
            children, 
            (item) => React.cloneElement(item, { onClick })
        );
    }
    return (
        <div 
            className='context-menu-item'
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
        >
            { title }
            { show ? <div className='sublist'>{ showItem() } </div> : null }
        </div>
    )
}