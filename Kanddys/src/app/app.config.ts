import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';

// * Fire.
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
// ? Fire Auth.
import { getAuth, provideAuth } from '@angular/fire/auth';
// ? Fire Storage
import { getStorage, provideStorage } from '@angular/fire/storage';
// ? Fire Cloud Store.
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

// * Animations.
import { provideAnimations } from '@angular/platform-browser/animations';

// * Routing.
import { provideRouter } from '@angular/router';

// * Service worker.
import { provideServiceWorker } from '@angular/service-worker';

// * NgRx.
import { provideEffects } from '@ngrx/effects';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

// * State.
import { ROOT_EFFECTS } from './app.effects';
import { ROOT_REDUCERS } from './app.reducers';

// * Routes.
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
	providers: [
		provideAnimations(),
		provideRouter(routes),
		provideStore(ROOT_REDUCERS),
		provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }),
		provideServiceWorker('ngsw-worker.js', {
			enabled: !isDevMode(),
			registrationStrategy: 'registerWhenStable:30000'
		}),
		provideEffects(ROOT_EFFECTS),
		importProvidersFrom(
			provideFirebaseApp(() =>
				initializeApp({
					projectId: 'kanddys-1088e',
					appId: '1:70333651002:web:07d2332b5124d25bc47d03',
					storageBucket: 'kanddys-1088e.appspot.com',
					apiKey: 'AIzaSyDwX24O42qCpanCLqo7xM4JMprIrbdjdws',
					authDomain: 'kanddys-1088e.firebaseapp.com',
					messagingSenderId: '70333651002',
					measurementId: 'G-QRJ2LRYQ0Q'
				})
			)
		),
		importProvidersFrom(provideFirestore(() => getFirestore())),
		importProvidersFrom(provideStorage(() => getStorage())),
		importProvidersFrom(provideAuth(() => getAuth()))
	]
};
