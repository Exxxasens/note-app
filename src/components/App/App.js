import React from 'react';
import './App.scss';
import Menu from '../Menu';
import MainPage from '../pages/MainPage';
import { HashRouter as Router, Switch, Route } from "react-router-dom";


export default () => {

    const [data, setData] = React.useState(null);

    return (
        <Router>
            <div className='wrapper'>
                <Menu/>
                <Switch>
                    <Route path='/list/:id' component={MainPage} />
                </Switch>
            </div>
        </Router>
    )
}