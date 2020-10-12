import React from 'react';
import StorageContext from '../contexts/StorageContext';

export default (type) => {
    const storage = React.useContext(StorageContext);
    const [data, setData] = React.useState([]);
    React.useEffect(() => {
        const getData = () => {
            if(type === 'categories') {
                storage.getAllCategories()
                    .then(c => setData(c))
                    .catch(e => console.log(e));
            } else if(type === 'notes') {
                storage.getAllNotes()
                    .then(c => setData(c))
                    .catch(e => console.log(e));
            }
        }
        storage.on('update', getData);
        getData();
        return () => storage.removeListener('update', getData);
    }, []);

    return [];
}