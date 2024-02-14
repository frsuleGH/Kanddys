// * USER.
import { UserEffects } from './core/state/user.effects';

// * ECOMMERCE.
// import { CartEffects } from '@ecommerce-cart/state/cart.effects';
// import { FormEffects } from '@ecommerce-form/state/form.effects';
// import { ProductEffects } from '@ecommerce-product/state/product.effects';
// import { ShopEffects } from '@ecommerce-shop/state/shop.effects';
// import { TraditionalEffects } from '@ecommerce-traditional/state/traditional.effects';
// import { VirtualEffects } from '@ecommerce-virtual/state/virtual.effects';
import { EcommerceEffects } from '@ecommerce/state/ecommerce.effects';

export const ROOT_EFFECTS = [
	// * USER
	UserEffects,
	// * ECOMMERCE.
	EcommerceEffects
	// ShopEffects,
	// ProductEffects,
	// CartEffects,
	// FormEffects,
	// VirtualEffects,
	// TraditionalEffects,
];
