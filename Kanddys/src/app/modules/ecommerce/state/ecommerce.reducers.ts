import { createReducer, on } from '@ngrx/store';

// * State.
import { loaded, loading } from '@core/state';

// * Interfaces.
import { IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
import { clearCart, loadEcommerce, loadedEcommerce, updateCart, updatedCart } from './ecommerce.actions';

// * Initial state.
export const initialState: IEcommerce = {
	status: loading,
	shop: {
		merchant: {
			title: '',
			description: '',
			logo: '',
			email: ''
		},
		products: []
	},
	conf: {
		traditional: false,
		virtual: false,
		delivery: false,
		pickup: false,
		reservation: false
	},
	cart: {
		products: [],
		traditional: null,
		total: 0,
		count: 0,
		valid: true
	},
	calendar: {
		delay: 0,
		batch: []
	}
};

// * Reducers.
export const ecommerceReducer = createReducer(
	initialState,
	// * LOAD ECOMMERCE.
	on(loadEcommerce, (state): IEcommerce => {
		return {
			...state,
			status: loading
		};
	}),
	on(loadedEcommerce, (state, { ecommerce }): IEcommerce => {
		return {
			...state,
			status: loaded,
			shop: {
				merchant: ecommerce.shop.merchant,
				products: ecommerce.shop.products
			},
			conf: ecommerce.conf,
			cart: ecommerce.cart,
			calendar: ecommerce.calendar,
			disabled: ecommerce.disabled
		};
	}),

	// * UPDATE CART.
	on(updateCart, (state): IEcommerce => {
		return {
			...state,
			status: loading
		};
	}),
	on(updatedCart, (state, { cart }): IEcommerce => {
		return {
			...state,
			status: loaded,
			cart
		};
	}),

	// * CLEAR CART.
	on(clearCart, (state): IEcommerce => {
		return {
			...state,
			cart: initialState.cart
		};
	})
);
