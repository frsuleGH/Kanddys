// * Interfaces.
// * ECOMMERCE.
import { IEcommerce } from '@ecommerce/interfaces/ecommerce.interface';

// * CORE.
export interface IAppState {
	ecommerce: IEcommerce;
	user: IUserState;
}

// * Entities loading.
export interface ILoadableEntities<T> {
	status: ILoading;
	items: T[];
}

// * Entity loading.
export interface ILoadableEntity<T> {
	status: ILoading;
	data: T;
}

// * Prop loading.
export type ILoading = 'LOADING' | 'LOADED' | 'ERROR';

// * Prop image.
export interface Img {
	src: string;
	alt: string;
}

export interface IUserState {
	status: ILoading;
	mode: 'LOGIN' | 'WELCOME' | 'PASSWORD' | 'OPTIONS' | 'EMAIL' | 'HELLO' | 'ERROR' | 'SUCCESS';
	data: string;
}

export interface IMail {
	message: {
		html: string;
		subject: string;
		text: string;
	};
	to: string;
}
