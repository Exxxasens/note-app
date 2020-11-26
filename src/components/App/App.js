import React from 'react';
import './App.scss';
import { Menu, MenuItem, CategoryMenuItem } from '../Menu';
import MainPage from '../pages/MainPage';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import withRouteToProps from '../hoc/withRouteToProps';
import StorageContext from '../contexts/StorageContext';
import CreateCategory from '../CreateCategory';
import PlatformContext from '../contexts/PlatformContext';
import PopUp from '../PopUp';

const electron = require('electron');
const StorageApi = electron.remote.getGlobal('StorageApi');

const WrappedMainPage = withRouteToProps(MainPage, ({ match: { params: { type }} }) => {
    let filterFn = null;

    if(type === 'all') 
        filterFn = (item) => !item.done
    
    if(type === 'done') 
        filterFn = (item) => item.done;
    
    return { filterNotesFn: filterFn };
});

export default () => {
    const [notes, setNotes] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [title, setTitle] = React.useState(null);
    const [category, setCategory] = React.useState(null);
    const [popUpContent, setContent] = React.useState(null);

    const platform = React.useContext(PlatformContext);
    const storage = React.useMemo(() => new StorageApi(), []);
    
    const handleSubMenuSelect = ({ title, type, id }) => {
        (type === 'category') ? setCategory(id) : setCategory(null);
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

        const deleteCategory = (id) => {
            storage.deleteCategory(id);
            setContent(null);
        }

        const renderPopUp = () => (
            <div className='popup-category'>
                <h1>Удалить категорию {title}?</h1>
                <div className='btn-items'>
                    <button onClick={() => deleteCategory(_id)}>Удалить только категорию</button>
                    <button>Удалить категорию и все вложения</button>
                    <button onClick={() => setContent(null)}>Отмена</button>
                </div>
            </div>
        )

        return <CategoryMenuItem
            setPopUpContent={() => setContent(renderPopUp())}
            storage={storage}
            className='menu-item row'
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

    let classList = ['wrapper'];
    if(platform !== 'darwin') classList.push('bg');
    classList = classList.join(' ');

    return (
        <Router>
            <StorageContext.Provider value={storage}>
                <div className={classList}>
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
                { popUpContent ? <PopUp>{popUpContent}</PopUp> : null }
            </StorageContext.Provider>
        </Router>
    )
}