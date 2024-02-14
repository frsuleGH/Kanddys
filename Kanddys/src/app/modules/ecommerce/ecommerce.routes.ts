import { Routes } from '@angular/router';

// ! IMPORTANT: Always include this comment before the loadComponent line.
// It serves to disable specific ESLint rules for the next line of code, preventing any ESLint errors that may occur during code execution.
// eslint-disable-next-line @typescript-eslint/promise-function-async
// ! EXAMPLE:
// {
// 	path: 'example',
// // eslint-disable-next-line @typescript-eslint/promise-function-async
// 	loadComponent: () => import('./example/example.component').then((m) => m.ExampleComponent)
// },

export const routes: Routes = [
	{
		path: '',
		// eslint-disable-next-line @typescript-eslint/promise-function-async
		loadComponent: () => import('./ecommerce.component').then((m) => m.EcommerceComponent),
		children: [
			{
				path: 'shop',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/shop/shop.component').then((m) => m.ShopComponent)
			},
			{
				path: 'product/:id',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/product/product.component').then((m) => m.ProductComponent)
			},
			{
				path: 'cart',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/cart/cart.component').then((m) => m.CartComponent)
			},
			{
				path: 'traditional',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/traditional/traditional.component').then((m) => m.TraditionalComponent)
			},
			{
				path: 'payment',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/payment/payment.component').then((m) => m.PaymentComponent)
			},
			{
				path: 'calendar',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/calendar/calendar.component').then((m) => m.CalendarComponent)
			},
			{
				path: 'invoice/:id',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/invoice/invoice.component').then((m) => m.InvoiceComponent)
			},
			{
				path: 'address',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/address/address.component').then((m) => m.AddressComponent)
			},
			{
				path: 'order',
				// eslint-disable-next-line @typescript-eslint/promise-function-async
				loadComponent: () => import('./pages/order/order.component').then((m) => m.OrderComponent)
			},
			{
				path: '**',
				redirectTo: 'shop',
				pathMatch: 'full'
			}
		]
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'
	}
];
