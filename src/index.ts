import { App } from './app';
import { ValidateEnv } from './utils/validateEnv';
import { AuthRoute } from './routes/auth.route';
import { IndexRoute } from './routes/index.route';

ValidateEnv();

const app = new App([
	new IndexRoute(),
	new AuthRoute(),
]);

app.listen();
