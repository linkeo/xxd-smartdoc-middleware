import dva from 'dva';
import 'antd/dist/antd.css';
import './index.less';

// global.app = require('../test/spec.json');
// global.app.address = 'http://localhost:3000';
// console.log('app is replaced.');

// detect api mount path at first
require('./utils/api_mount_root');

// 1. Initialize
const app = dva();

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/actionModel'));
app.model(require('./models/options'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
