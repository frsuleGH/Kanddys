import { createSelector, MemoizedSelector } from '@ngrx/store';

// * State.
import { state } from '@core/state';

// * Interfaces.
import { IAppState, ILoading } from '@core/interfaces/app.interface';
import { ICart, IEcommerce, IProduct } from '@ecommerce/interfaces/ecommerce.interface';

// * Selectors.
// * Loading.
export const selectEcommerceLoading = createSelector(state, (state: IAppState): ILoading => state.ecommerce.status);

// * Shop.
export const selectEcommerceShop = createSelector(
	state,
	(state: IAppState): IEcommerce['shop'] => state.ecommerce.shop
);

// * Product.
export const selectEcommerceProduct = (id: string): MemoizedSelector<IAppState, IProduct> =>
	createSelector(state, (state: IAppState): IProduct => {
		return (
			state.ecommerce.shop.products.find((product: IProduct) => product.id === id) || {
				id: '',
				title: '',
				description: '',
				price: 0,
				images: [],
				stock: 0
			}
		);
	});

// * Cart.
export const selectEcommerceCart = createSelector(state, (state: IAppState): ICart => state.ecommerce.cart);

// * Conf.
export const selectEcommerceConf = createSelector(
	state,
	(state: IAppState): IEcommerce['conf'] => state.ecommerce.conf
);

// * Disabled.
export const selectEcommerceDisabled = createSelector(
	state,
	(state: IAppState): IEcommerce['disabled'] => state.ecommerce.disabled
);

// * Calendar.
export const selectEcommerceCalendar = createSelector(
	state,
	(state: IAppState): IEcommerce['calendar'] => state.ecommerce.calendar
);

// * Count.
export const selectEcommerceCount = createSelector(state, (state: IAppState): number => state.ecommerce.cart.count);
