import React from 'react';
import Layout from '../Layout';
import NoteList from '../NoteList';
import CreateNote from '../CreateNote';
import { useRouteMatch } from 'react-router-dom';

const notes = [
    {
        title: 'Сделать приложение',
        isImportant: true,
        category: null,
        color: 'blue',
        isSync: false,
        done: false,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        title: 'Сделать добавление заметок',
        isImportant: true,
        category: 'Работа',
        color: 'red',
        isSync: false,
        done: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }
];


export default () => {
    const [data, setData] = React.useState(notes);
    let filterFn = (i) => i;
    let { params } = useRouteMatch("/list/:match");
    if(params.match === 'all') {
        filterFn = (item) => !item.done
    }
    if(params.match === 'done') {
        filterFn = (item) => item.done
    }

    const handleCreate = (note) => {
        setData(data => {
            let array = data.map(item => Object.assign({}, item));
            array.push(note);
            return array;
        });
    }

    return (
        <Layout topBar={<h2>Мои напоминания</h2>} bottomBar={<CreateNote onCreate={handleCreate}/>}>
            <NoteList list={data} filterFn={filterFn}/>
        </Layout>
    )
}