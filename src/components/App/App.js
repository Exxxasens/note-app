import React from 'react';
import './App.scss';
import Menu from '../Menu';
import Layout from '../Layout';
import NoteList from '../NoteList';
import { HashRouter as Router, Switch, Route } from "react-router-dom";


const notes = [
    {
        title: 'Сделать приложение',
        isImportant: true,
        category: null,
        color: 'blue',
        isSync: false,
        complete: false,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: 'Выкинуть Андрея',
        isImportant: false,
        category: 'Работа',
        color: 'red',
        isSync: false,
        complete: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
]

export default () => {

    const [data, setData] = React.useState({
        notes
    });

    return (
        <Router>
            <div className='wrapper'>
                <Menu/>
                <Switch>
                    <Route path='/list' >
                        <Layout topBar={<h2>Мои напоминания</h2>}>
                            <NoteList list={notes}/>
                        </Layout>
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}