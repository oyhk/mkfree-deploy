import dva from 'dva';
import './index.css';
import {browserHistory} from 'dva/router';

// 1. Initialize
const app = dva({
    history: browserHistory,
});

// 2. Plugins
// app.use({});

// 3. Model
app.model(require('./models/InstallModel'));
app.model(require('./models/ProjectModel'));
app.model(require('./models/ProjectInfoModel'));
app.model(require('./models/UserModel'));
app.model(require('./models/EnvModel'));
app.model(require('./models/ServerMachineModel'));
app.model(require('./models/UserProjectPermissionModel'));
app.model(require('./models/TagModel'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
