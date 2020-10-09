import React from 'react';
import './App.scss';
import { Menu, MenuItem} from '../Menu';
import MainPage from '../pages/MainPage';
import { HashRouter as Router, Switch, Route } from "react-router-dom";
import withRouteToProps from '../hoc/withRouteToProps';
import Storage from '../../Storage';
import StorageContext from '../contexts/StorageContext';

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
    const [title, setTitle] = React.useState(null);
    return (
        <Router>
            <StorageContext.Provider value={Storage}>
                <div className='wrapper'>
                    <Menu onSubMenuSelect={({ title }) => setTitle(title)}>
                        <MenuItem link='/list/' icon='list'>
                            <MenuItem title='Все' link='all'></MenuItem>
                            <MenuItem title='Завтра' link='tomorrow'></MenuItem>
                            <MenuItem title='Выполненные' link='done'></MenuItem>
                        </MenuItem>
                        <MenuItem link='/calendar' icon='calendar_today'></MenuItem>
                        <MenuItem link='/settings' icon='settings'></MenuItem>
                    </Menu>
                    <Switch>
                        <Route path='/list/:type'>
                            <MainPage topBarSubTitle={title}/>
                        </Route>
                    </Switch>
                </div>
            </StorageContext.Provider>
        </Router>
    )
}