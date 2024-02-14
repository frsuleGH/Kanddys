import { ActionReducerMap } from '@ngrx/store';

// * Interfaces.
import { IAppState } from '@core/interfaces/app.interface';

// * Reducers.
// * USER.
import { userReducer } from '@core/state/user.reducers';

// * ECOMMERCE.
import { ecommerceReducer } from '@ecommerce/state/ecommerce.reducers';

// import { cartReducer } from '@ecommerce-cart/state/cart.reducers';
// import { formReducer } from '@ecommerce-form/state/form.reducers';
// import { productReducer } from '@ecommerce-product/state/product.reducers';
// import { shopReducer } from '@ecommerce-shop/state/shop.reducers';
// import { traditionalReducer } from '@ecommerce-traditional/state/traditional.reducers';
// import { virtualReducer } from '@ecommerce-virtual/state/virtual.reducers';
// import { merchantReducer } from '@ecommerce/state/ecommerce.reducers';

export const ROOT_REDUCERS: ActionReducerMap<IAppState> = {
	// * USER.
	user: userReducer,
	// * ECOMMERCE.
	ecommerce: ecommerceReducer
	// ecommerce: combineReducers({
	// merchant: merchantReducer,
	// shop: shopReducer,
	// product: productReducer,
	// cart: cartReducer,
	// form: formReducer,
	// traditional: traditionalReducer,
	// virtual: virtualReducer
	// }),
};
