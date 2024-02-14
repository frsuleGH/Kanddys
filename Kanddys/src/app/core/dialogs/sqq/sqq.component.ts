import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { Store } from '@ngrx/store';

// * Interfaces.
import { IAppState } from '@core/interfaces/app.interface';

// * Forms.
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

// * Actions.
import { checkUser, login, recoverUser, userMode } from '@core/state/user.actions';

// * Selectors.
import { selectUser } from '@core/state/user.selectors';

// * Material.
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

// * Shared.
import { ButtonComponent } from '@core/components/button/button.component';
import { CoreService } from '../../services/core.service';

/**
 * 1. LOGIN: Ingresar correo electronico.
 * 2.1. WELCOME: Inicio de sesión. Se envió un correo.
 * 2.2. OPTIONS: Ingresar contraseña o recuperar contraseña.
 * 2.2.1. PASSWORD: Ingresar contraseña.
 * 2.2.2. EMAIL: Recuperar contraseña.
 * 2.2.2.1. SUCCESS: Se envió un correo.
 * 2.2.2.2. ERROR: No se envió un correo.
 * 3. HELLO: Mensaje de bienvenida.
 */
@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-sqq-dialog',
	standalone: true,
	imports: [ReactiveFormsModule, MatFormFieldModule, MatButtonModule, MatInputModule, MatIconModule, ButtonComponent],
	templateUrl: 'sqq.component.html',
	styleUrl: 'sqq.component.scss'
})
export class SqqDialogComponent {
	public form: UntypedFormGroup;
	public user: Signal<IAppState['user']>;
	public hide: boolean;

	public constructor(
		private _store: Store<IAppState>,
		private _dialogRef: MatDialogRef<SqqDialogComponent>,
		private _core: CoreService
	) {
		this.form = this._setForm();
		this.hide = true;
		this.user = this._store.selectSignal(selectUser);
	}

	public ngOnInit(): void {
		this._dialogRef.backdropClick().subscribe(() => {
			this.close();
		});
	}

	public check(): void {
		this._store.dispatch(checkUser({ mail: this.form.get('mail')?.value }));
	}

	public set(mode: IAppState['user']['mode']): void {
		switch (mode) {
			case 'EMAIL':
				this._store.dispatch(recoverUser({ mail: this.form.get('mail')?.value }));
				break;
			case 'ERROR':
				this.set('EMAIL');
				break;
			default:
				this._store.dispatch(userMode({ mode }));
				break;
		}
	}

	public login(): void {
		this._store.dispatch(login({ mail: this.form.get('mail')?.value, password: this.form.get('password')?.value }));
	}

	public close(): void {
		this._dialogRef.close(this._core.user);
	}

	private _setForm(): UntypedFormGroup {
		return new UntypedFormGroup({
			mail: new UntypedFormControl(null, Validators.compose([Validators.required, Validators.email])),
			password: new UntypedFormControl(null, Validators.compose([Validators.required, Validators.minLength(6)]))
		});
	}
}
