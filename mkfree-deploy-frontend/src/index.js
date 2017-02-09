import dva from 'dva';
import {browserHistory} from 'dva/router';
import createLoading from 'dva-loading';
import {message} from 'antd';
import './index.html';
import './index.css';

const ERROR_MSG_DURATION = 3; // 3 秒

// 1. Initialize
const app = dva({
    history: browserHistory,
    // onError(e) {
    //     message.error(e.message, ERROR_MSG_DURATION);
    // },
});

// 2. Plugins
app.use(createLoading());

// 3. Model
// Moved to router.js
const models = [
  'users',
  'userInfo',
  'projects',
  'serverMachine',
];

models.map((modelSrc) => {
  app.model(require('./models/' + modelSrc));
});


// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
