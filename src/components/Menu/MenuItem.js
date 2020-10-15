import React from 'react';
import { Link } from 'react-router-dom';

export default ({ link, icon, children, selected, className, title, onSelect, onSubMenuSelect, ...rest }) => {
    const [selectedItem, setSelectedItem] = React.useState(null);
    let classList = [];
    classList.push(className ? className : 'menu-item');
    if(selected) classList.push('active');
    classList = classList.join(' ');

    let innerContent = (
        <>
            { icon ? <div className='icon'><span className="material-icons">{ icon }</span></div> : null }
            { title ? <div className='title'>{title}</div> : null }
        </>
    )


    return (
        <>
            {
                link ? <Link to={link} className={classList} onClick={() => onSelect(children)} {...rest}>{ innerContent }</Link>
                : <div className={classList} onClick={() => onSelect(children)} {...rest}>{ innerContent }</div>
            }
            { selected && children ? 
                    <div className='submenu'>
                        {React.Children.map(
                            children, 
                            (item, i) => {
                                let handleSelect = () => {
                                    setSelectedItem(i);
                                    onSubMenuSelect(item.props);
                                }
                                return React.cloneElement(item, 
                                    { selected: i === selectedItem, onSelect: handleSelect })
                            })
                        }
                    </div>
                : 
                    null 
            }
        </>
    )
}