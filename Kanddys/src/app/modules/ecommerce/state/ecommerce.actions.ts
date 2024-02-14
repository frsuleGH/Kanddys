import { createAction, props } from '@ngrx/store';

// * Interfaces.
import { IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * Actions.
// * LOAD ECOMMERCE.
export const loadEcommerce = createAction('[Ecommerce] Load Ecommerce', props<{ slug: string }>());
export const loadedEcommerce = createAction('[Ecommerce] Loaded Ecommerce', props<{ ecommerce: IEcommerce }>());

// * UPDATE CART.
export const updateCart = createAction(
	'[Ecommerce] Update Cart',
	props<{ product: IEcommerce['cart']['products'][number]; operation: 'UPDATE' | 'DELETE' | 'ADD' }>()
);
export const updatedCart = createAction('[Ecommerce] Updated Cart', props<{ cart: IEcommerce['cart'] }>());

// * CLEAR CART.
export const clearCart = createAction('[Ecommerce] Clear Cart');
