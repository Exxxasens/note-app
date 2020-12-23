import colorList from './ColorList';

export default (_id) => {
    const idx = colorList.findIndex(({ id }) => id === _id);
    if (idx >= 0) {
        return colorList[idx];
    }
    return null;
}