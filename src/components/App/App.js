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

    const handleSubMenuSelect = ({ title, type, id }) => {
        if(type === 'category') {
            setCategory(id);
        } else {
            setCategory(null);
        }
        setTitle(title);
    }

    const mapFn = ({ title, _id, color }) => {
        const titleDiv = (
            <>
                <div className='circle' style={{ backgroundColor: globalThis.getColor(color) }}></div>
                { title }
            </>
        )
        return (title && _id) ? <MenuItem className='menu-item row' title={titleDiv} link={`/list/category/${_id}`} type='category' key={_id} id={_id}/> : null;
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

    window.storage = storage;

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
        console.log('sub')
        return () => {
            console.log('deleted APP compononent')
            console.log(storage.removeAllListeners('update'));
        }
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
                            render={({ match }) => {
                                let filterFn = null;
                                const { type } = match.params;
                                if(type === 'done') filterFn = ({ done }) => done;
                                return <MainPage 
                                    topBarSubTitle={title} 
                                    notes={notes} 
                                    handleCreate={onCreate}
                                    filterNotesFn={filterFn}
                                />

                            }}
                        />
                    </Switch>
                </div>
            </StorageContext.Provider>
        </Router>
    )
}