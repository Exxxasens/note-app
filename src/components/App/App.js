import React from 'react';
import './App.scss';
import { Menu, MenuItem } from '../Menu';
import MainPage from '../pages/MainPage';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import withRouteToProps from '../hoc/withRouteToProps';
import StorageApi from '../../Storage';
import StorageContext from '../contexts/StorageContext';
import CreateCategory from '../CreateCategory';
import useContextMenu from '../hooks/useContextMenu';

const WrappedMainPage = withRouteToProps(MainPage, ({ match: { params: { type }} }) => {
    let filterFn = null;
    if(type === 'all') {
        filterFn = (item) => !item.done
    }
    if(type === 'done') {
        filterFn = (item) => item.done;
    }
    return { filterNotesFn: filterFn };
});

const { dialog, getCurrentWindow } = require('electron').remote;
const CategoryMenuItem = ({ storage, name, ...rest}) => {
    const onDelete = () => {
        const options = {
            type: 'question',
            buttons: ['Отменить', 'Удалить категорию и все вложения', 'Удалить только категорию'],
            defaultId: 2,
            title: 'Удалить',
            message: `Удалить категорию "${name}"?`,
        };
        dialog.showMessageBox(getCurrentWindow(), options)
            .then(({ response }) => {
                if(response === 2) storage.deleteCategory(rest.id);
                // TODO: add method to delete all notes with the specified cateogry
                if(response === 1) console.log('delete all');
            });
    }
    const showContextMenu = useContextMenu(
        React.useCallback(() => [
                {
                    label: 'Удалить',
                    click: onDelete
                }
            ], [])
    );
    return <MenuItem {...rest} onContextMenu={showContextMenu} />
}

export default () => {
    const storage = React.useMemo(() => new StorageApi(), []);
    const [notes, setNotes] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [title, setTitle] = React.useState(null);
    const [category, setCategory] = React.useState(null);

    const handleSubMenuSelect = ({ title, type, id }) => {
        type === 'category' ? setCategory(id) : setCategory(null);
        setTitle(title);
    }
    const mapFn = ({ title, _id, color }) => {
        if(!title || !_id) return null;
        const titleDiv = (
            <React.Fragment>
                <div className='circle' style={{ backgroundColor: globalThis.getColor(color) }}></div>
                { title }
            </React.Fragment>
        )
        return <CategoryMenuItem
            storage={storage}
            className='menu-item row'
            name={title}
            title={titleDiv}
            link={`/list/category/${_id}`}
            type='category'
            id={_id}
            key={_id}
        />;
    }

    const onCreate = (title) => {
        let note = { title, done: false, important: false };
        if(category) note['category'] = category;
        storage.addNote(note);
    }

    const onCategoryCreate = (title, color) => {
        storage.addCategory({ title, color })
            .then(doc => console.log(doc))
            .catch(err => console.log(err));
    }
    
    // TODO: delete this
    // window.storage = storage;

    React.useEffect(() => {
        const updateState = () => {
            storage.getAllNotesWithCategories()
                .then(notes => setNotes(notes.sort((a, b) => a.createdAt - b.createdAt)))
                .catch(err => console.log(err));
            storage.getAllCategories()
                .then(categories => setCategories(categories))
                .catch(err => console.log(err));
        }
        storage.on('update', updateState);
        updateState();
        return () => storage.removeAllListeners('update');
    }, []);

    return (
        <Router>
            <StorageContext.Provider value={storage}>
                <div className='wrapper'>
                    <Menu onSubMenuSelect={handleSubMenuSelect}>
                        <MenuItem icon='list' title='Напоминания'>
                            <MenuItem title='Все' link='/list/all'/>
                            <MenuItem title='Завтра' link='/list/tomorrow'/>
                            <MenuItem title='Выполненные' link='/list/done'/>
                            <div className='menu-separator'></div>
                            { categories ? categories.map(mapFn) : null }
                            <CreateCategory onCreate={onCategoryCreate} />
                        </MenuItem>
                        <MenuItem link='/calendar' icon='calendar_today' title='Календарь'></MenuItem>
                        <MenuItem link='/settings' icon='settings' title='Настройки'></MenuItem>
                    </Menu>
                    <Switch>
                        <Route path='/list/category/:id' 
                            render={({ match }) => {
                                let filterFn = ({ category: c }) => c && (c._id === match.params.id);
                                return  <MainPage 
                                    topBarSubTitle={title} 
                                    notes={notes} 
                                    handleCreate={onCreate}
                                    filterNotesFn={filterFn}
                                />
                            }} 
                        />
                        <Route path='/list/:type'
                            render={
                                ({ match, location, history }) => <WrappedMainPage
                                        match={match}
                                        location={location}
                                        history={history}
                                        topBarSubTitle={title} 
                                        notes={notes} 
                                        handleCreate={onCreate} 
                                    />
                                }
                        />
                    </Switch>
                </div>
            </StorageContext.Provider>
        </Router>
    )
}