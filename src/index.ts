import { App } from './app';
import { ValidateEnv } from './utils/validateEnv';
import { AuthRoute } from './routes/auth.route';
import { IndexRoute } from './routes/index.route';
import { FavoriteRoute } from './routes/favorite.route';
import { ReviewRoute } from './routes/review.route';
import { ProductRoute } from './routes/product.route';
import { CategoryRoute } from './routes/category.route';
import { CartRoute } from './routes/cart.route';

ValidateEnv();

const app = new App([
	new IndexRoute(),
	new AuthRoute(),
	new FavoriteRoute(),
	new ReviewRoute(),
	new ProductRoute(),
	new CategoryRoute(),
	new CartRoute(),
]);

app.listen();
