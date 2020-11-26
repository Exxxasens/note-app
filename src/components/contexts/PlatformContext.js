import React from 'react';
var os = require('os');
export default React.createContext(os.platform());