import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';

// * Components.
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ButtonComponent } from '../../../../core/components/button/button.component';
import { SqqDialogComponent } from '../../../../core/dialogs/sqq/sqq.component';
import { CoreService } from '../../../../core/services/core.service';
import { getErrorMessage, isNumeric, notOnlySpaces } from '../../../../core/validators/character.validators';
import { EcommerceService } from '../../services/ecommerce.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-address',
	standalone: true,
	imports: [ReactiveFormsModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, ButtonComponent],
	templateUrl: './address.component.html',
	styleUrl: './address.component.scss'
})
export class AddressComponent implements OnInit {
	public mode: 'FORM' | 'LIST' | 'OPTIONS' = 'OPTIONS';
	public user: string | undefined;
	public address: IAddress[] | undefined;

	public form: UntypedFormGroup = this._setUpForm();
	public getErrorMessage = getErrorMessage;

	public constructor(
		private _core: CoreService,
		private _ecommerce: EcommerceService,
		private _dialog: MatDialog,
		private _cdr: ChangeDetectorRef
	) {
		this.user = this._core.user;
	}

	public ngOnInit(): void {
		this.user = this._core.user;
	}

	public ngAfterViewInit(): void {
		if (this._core.user) {
			this._core.getEmail<IAddress>(this._core.user).subscribe({
				next: (res) => {
					this.address = res;
					this._cdr.markForCheck();
				},
				error: (err) => console.error(err),
				complete: () => console.log('complete')
			});
		}
	}

	public next(mode: 'OPTIONS' | 'FORM' | 'LIST'): void {
		this.mode = mode;
	}

	public complete(): void {
		if (this._core.user) {
			this._core.postDocument<IAddress>('address', { user: this._core.user, address: this.form.value }).subscribe({
				next: (res) => {
					this._core.address = res['address'];
					this._ecommerce.redirect('calendar');
				},
				error: (err) => console.error(err),
				complete: () => console.log('complete')
			});
		} else {
			this._open();
		}
	}

	public continue(address?: IAddress): void {
		if (address) {
			this._core.address = address['address'];
		} else {
			this._core.pickUp = true;
		}
		this.redirect('calendar');
	}

	public back(): void {
		if (this.mode === 'OPTIONS') {
			this.redirect('cart');
		} else {
			this.mode = 'OPTIONS';
		}
	}

	public redirect(route: string, id?: string): void {
		this._ecommerce.redirect(route, id);
	}

	private _open(): void {
		const dialog = this._dialog.open(SqqDialogComponent, {
			maxWidth: '432px',
			width: '100%',
			position: { bottom: '0' }
		});

		dialog.afterClosed().subscribe((res) => {
			if (res) {
				this._core
					.postDocument<IAddress['address']>('address', { user: this._core.user, address: this.form.value })
					.subscribe({
						next: (res) => {
							this._core.address = res;
							this.redirect('calendar');
						},
						error: (err) => console.error(err),
						complete: () => console.log('complete')
					});
			} else {
				this._core.address = this.form.value;
				this.redirect('calendar');
			}
		});
	}

	private _setUpForm(): UntypedFormGroup {
		return new UntypedFormGroup({
			country: new UntypedFormControl(null, [Validators.minLength(2), Validators.maxLength(56), notOnlySpaces()]),
			city: new UntypedFormControl(null, [Validators.minLength(1), Validators.maxLength(100), notOnlySpaces()]),
			street: new UntypedFormControl(null, [Validators.minLength(1), Validators.maxLength(100), notOnlySpaces()]),
			number: new UntypedFormControl(null, [Validators.minLength(1), Validators.maxLength(30), notOnlySpaces()]),
			reference: new UntypedFormControl(null, [Validators.minLength(3), Validators.maxLength(100), notOnlySpaces()]),
			note: new UntypedFormControl(null, [Validators.minLength(3), Validators.maxLength(500), notOnlySpaces()]),
			addressee: new UntypedFormControl(null, [Validators.minLength(1), Validators.maxLength(50), notOnlySpaces()]),
			phone: new UntypedFormControl(null, [
				Validators.minLength(6),
				Validators.maxLength(15),
				notOnlySpaces(),
				isNumeric()
			]),
			sender: new UntypedFormControl(null, [Validators.maxLength(50), notOnlySpaces()]),
			save: new UntypedFormControl('Hogar', [Validators.maxLength(30), notOnlySpaces()])
		});
	}
}

export interface IAddress {
	user: string;
	address: Address;
	id: string;
}

interface Address {
	addressee: string | null;
	phone: number | null;
	sender: string | null;
	reference: string | null;
	country: string | null;
	city: string | null;
	save: string;
	note: string | null;
	number: string | null;
	street: string | null;
}
