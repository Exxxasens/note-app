window.getColor = (color) => {
    const colorList = {
        red    : '#FF2D00',
        yellow : '#FFE400',
        green  : '#00FF49',
        blue   : '#597aff',
        purple : '#AE00FF'
    }
    return colorList[color] || 'black';
}