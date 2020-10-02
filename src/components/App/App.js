import React from 'react';
import './App.scss';
import Menu from '../Menu';
import TopBar from '../TopBar';
import {
    HashRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

export default () => {
    return (
        <Router>
            <div className='wrapper'>
                <Menu/>
                <div className='content'>
                    <Switch>
                        <Route path='/create' >
                            <TopBar>
                                <h1>Создайте первую заметку!</h1>
                            </TopBar>
                        </Route>
                    </Switch>
                </div>
            </div>
        </Router>
    )
}