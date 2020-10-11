import React from 'react';
import './App.scss';
import { Menu, MenuItem } from '../Menu';
import MainPage from '../pages/MainPage';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import withRouteToProps from '../hoc/withRouteToProps';
import StorageApi from '../../Storage';
import StorageContext from '../contexts/StorageContext';
import CreateCategory from '../CreateCategory';

const MainPageWithProps = withRouteToProps(MainPage, ({ match: { params: { type }} }) => {
    let filterFn = null;
    if(type === 'all') {
        filterFn = (item) => !item.done
    }
    if(type === 'done') {
        filterFn = (item) => item.done;
    }
    return { filterNotesFn: filterFn };
})

export default () => {
    const storage = React.useMemo(() => new StorageApi(), []);
    const [notes, setNotes] = React.useState([]);
    const [categories, setCategories] = React.useState([]);
    const [title, setTitle] = React.useState(null);
    const [category, setCategory] = React.useState(null);

    const handleSlecteSubMenu = (title, type) => {
        if(type === 'category') setCategory(title);
        setTitle(title);
    }

    const mapFn = ({ title, _id }) => {
        return (title && _id) ? <MenuItem title={title} link={_id} type='category' key={_id} /> : null;
    }

    const onCreate = (title) => {
        let note = { title, category, done: false, important: false };
        console.log(note);
        storage.addNote({ title, category, done: false, important: false });
    }

    const onCategoryCreate = (title, color) => {
        storage.addCategory({ title, color })
            .then(doc => console.log(doc))
            .catch(err => console.log(err));
    }

    window.storage = storage;

    React.useEffect(() => {
        const updateState = () => {
            storage.getAllNotesWithCategories()
                .then(notes => setNotes(notes.sort((a, b) => a.createdAt - b.createdAt)))
                .catch(err => console.log(err));
            storage.getAllCategories()
                .then(categories => setCategories(categories))
                .catch(err => console.log(err));
            console.log('update');
            console.log(categories);
        }
        storage.on('update', updateState);
        updateState();
        return () => storage.removeAllListeners();
    }, []);

    console.log(categories);

    return (
        <Router>
            <StorageContext.Provider value={storage}>
                <div className='wrapper'>
                    <Menu onSubMenuSelect={({ title, type }) => handleSlecteSubMenu(title, type)}>
                        <MenuItem icon='list'>
                            <MenuItem title='Все' link='/list/all'/>
                            <MenuItem title='Завтра' link='/list/tomorrow'/>
                            <MenuItem title='Выполненные' link='/list/done'/>
                            <div className='menu-separator'></div>
                            { categories ? categories.map(mapFn) : null }
                            <CreateCategory onCreate={onCategoryCreate} />
                        </MenuItem>
                        <MenuItem link='/calendar' icon='calendar_today'></MenuItem>
                        <MenuItem link='/settings' icon='settings'></MenuItem>
                    </Menu>
                    <Switch>
                        <Route path='/list/:type'>
                            <MainPage 
                                topBarSubTitle={title} 
                                notes={notes} 
                                handleCreate={onCreate}/>
                        </Route>
                    </Switch>
                </div>
            </StorageContext.Provider>
        </Router>
    )
}