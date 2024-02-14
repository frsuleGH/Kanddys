import { Location } from '@angular/common';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

// * Auth.
import {
	ActionCodeSettings,
	Auth,
	createUserWithEmailAndPassword,
	sendPasswordResetEmail,
	signInWithEmailAndPassword
} from '@angular/fire/auth';

// * Firebase.
import {
	addDoc,
	collection,
	doc,
	DocumentData,
	DocumentReference,
	DocumentSnapshot,
	Firestore,
	getDoc,
	getDocs,
	query,
	setDoc,
	updateDoc,
	where
} from '@angular/fire/firestore';

import { getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

// * Interfaces.
import { IAppState, IMail } from '@core/interfaces/app.interface';

// * Actions.
import { loadUser } from '@core/state/user.actions';
import { IAddress } from '../../modules/ecommerce/pages/address/address.component';

@Injectable({ providedIn: 'root' })
export class CoreService {
	public user: string | undefined;
	private _address: IAddress['address'] | undefined;
	private _calendar: string | undefined;
	private _reservation: { id: string; reservation: number[] } | undefined;
	private _pickUp: boolean = false;

	private _hash: string = localStorage.getItem('hash') ?? this._createHash();
	private _authentication: boolean = false;

	public constructor(
		private _store: Store<IAppState>,
		private _location: Location,
		private _fire: Firestore,
		private _router: Router,
		private _route: ActivatedRoute,
		private _auth: Auth,
		private _storage: Storage
	) {
		window.addEventListener('resize', () => {
			this._setVH();
		});
		this._setVH();

		this._auth.onAuthStateChanged((user) => {
			// console.log(user);

			if (user) {
				if (user.email) {
					this.user = user.email;
					this._store.dispatch(loadUser({ mail: user.email }));
				}
			}
		});
	}

	public get pickUp(): boolean {
		return this._pickUp;
	}

	public set pickUp(value: boolean) {
		this._pickUp = value;
	}

	public get reservation(): { id: string; reservation: number[] } | undefined {
		return this._reservation;
	}

	public set reservation(reservation: { id: string; reservation: number[] } | undefined) {
		this._reservation = reservation;
	}

	public get address(): IAddress['address'] | undefined {
		return this._address;
	}

	public set address(value: IAddress['address'] | undefined) {
		this._address = value;
	}

	public get calendar(): string | undefined {
		return this._calendar;
	}

	public set calendar(value: string | undefined) {
		this._calendar = value;
	}

	public get authentication(): boolean {
		return this._authentication;
	}

	public set authentication(value: boolean) {
		this._authentication = value;
	}

	public uploadImage(file: File): Observable<string | null> {
		const imgRef = ref(this._storage, `comprobantes/${file.name}`);

		return from(uploadBytes(imgRef, file)).pipe(
			switchMap(() => from(getDownloadURL(imgRef))),
			catchError((error) => {
				console.error('Error al subir - obtener la imagen:', error);
				return [null];
			})
		);
	}

	/**
	 * Get Document.
	 */
	public get<T>(collect: string, document: string): Observable<T> {
		const ref = doc(this._fire, collect, document);

		return from(getDoc(ref)).pipe(
			map((doc: DocumentSnapshot<DocumentData>) => {
				if (doc.exists()) {
					// console.log('get => collect: ', collect, ' document: ', document, ' data: ', doc.data());
					return doc.data() as T;
				} else {
					throw new Error('Document ID not found');
				}
			})
		);
	}

	public getEmail<T>(email: string): Observable<T[]> {
		const q = query(collection(this._fire, 'address'), where('user', '==', email));

		// console.log('getEmail => email: ', email, ' q: ', q);

		return from(getDocs(q)).pipe(
			map((querySnapshot) => {
				if (!querySnapshot.empty) {
					return querySnapshot.docs.map((doc) => doc.data() as T);
				} else {
					throw new Error('Document ID not found');
				}
			})
		);
	}

	/**
	 * Post Document.
	 */
	public post<T>(collect: string, document: string, data: any): Observable<T> {
		const docRef: DocumentReference<DocumentData> = doc(this._fire, collect, document);
		return from(setDoc(docRef, data)).pipe(
			map(() => {
				// console.log('post => collect: ', collect, ' document: ', document, ' data: ', data);
				return data;
			}),
			catchError(() => {
				throw new Error('Error adding document');
			})
		);
	}

	/**
	 * Post Document not ID.
	 */
	public postDocument<T>(collect: string, data: any): Observable<T> {
		const ref = collection(this._fire, collect);
		return from(
			(async () => {
				try {
					const snap = await addDoc(ref, { ...data });
					const newData = { ...data, id: snap.id };
					await setDoc(doc(this._fire, collect, newData.id), newData);
					return newData;
				} catch (error) {
					console.error('Error en postDocument:', error);
					throw error;
				}
			})()
		);
	}

	/**
	 * Put Property.
	 * !  prop : this._core.put('collect', 'document', 'prop', 'value');
	 * ! [prop]: this._core.put('collect', 'document', 'prop.index', 'value');
	 */
	public put(collect: string, document: string, prop: string, value: any): Observable<void> {
		const docRef: DocumentReference<DocumentData> = doc(this._fire, collect, document);
		const updateData = { [prop]: value };
		return from(updateDoc(docRef, updateData));
	}

	public sendEmail(email: IMail): void {
		const ref = collection(this._fire, 'mail');
		addDoc(ref, email);
	}

	public register(email: string, pass: string): Observable<unknown> {
		return from(createUserWithEmailAndPassword(this._auth, email, pass));
	}

	public login<T>(email: string, password: string): Observable<T> {
		return from(signInWithEmailAndPassword(this._auth, email, password)).pipe(
			map((data) => data as T),
			catchError((error) => {
				throw new Error('Error signing in');
			})
		);
	}

	public recover(email: string): Observable<boolean> {
		const actionCodeSettings: ActionCodeSettings = {
			url: 'http://localhost:4200/recuperacion-completa',
			handleCodeInApp: true
		};

		return from(sendPasswordResetEmail(this._auth, email, actionCodeSettings)).pipe(
			map(() => true),
			catchError(() => of(false))
		);
	}

	public get hash(): string {
		return this._hash;
	}

	public back(): void {
		this._location.back();
	}

	public redirect(url: string, id?: string): void {
		if (id) {
			void this._router.navigate([`${url}/${id}`], { relativeTo: this._route });
			return;
		} else {
			void this._router.navigate([url], { relativeTo: this._route });
			return;
		}
	}

	public createPassword(): string {
		const first = Math.random().toString(36).substring(2);
		const last = Math.random().toString(36).substring(2);
		const time = Date.now().toString(36);
		return `${first}-${time}-${last}`;
	}

	private _createHash(): string {
		const first = Math.random().toString(36).substring(2);
		const last = Math.random().toString(36).substring(2);
		const time = Date.now().toString(36);
		localStorage.setItem('hash', `${first}-${time}-${last}`);
		return `${first}-${time}-${last}`;
	}

	private _setVH(): void {
		document.documentElement.style.setProperty('--vh', `${window.innerHeight}px`);
	}
}
