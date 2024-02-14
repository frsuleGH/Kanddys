import { ChangeDetectionStrategy, Component, inject, NgZone, OnInit, ViewChild } from '@angular/core';
import { take } from 'rxjs';

// * State.

// * Actions.

// * Selectors.

// * Components.
import { CdkTextareaAutosize, TextFieldModule } from '@angular/cdk/text-field';
import { ReactiveFormsModule, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { environment } from '../../../../../environments/environment';
import { ButtonComponent } from '../../../../core/components/button/button.component';
import { CoreService } from '../../../../core/services/core.service';
import { getErrorMessage, notOnlySpaces } from '../../../../core/validators/character.validators';
import { ICart } from '../../interfaces/ecommerce.interface';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-ecommerce-traditional',
	standalone: true,
	imports: [TextFieldModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, ButtonComponent],
	templateUrl: './traditional.component.html',
	styleUrl: './traditional.component.scss'
})
export class TraditionalComponent implements OnInit {
	@ViewChild('autosize') public autosize?: CdkTextareaAutosize;

	public form: UntypedFormGroup = this._setUpForm();
	public getErrorMessage = getErrorMessage;

	private _core: CoreService = inject(CoreService);
	private _zone: NgZone = inject(NgZone);

	public ngAfterViewInit(): void {
		this._resize();
	}

	public ngOnInit(): void {
		const document: string = `${this._core.hash}${environment.slug}`;
		const local = localStorage.getItem(document);
		if (local) {
			const cart: ICart = JSON.parse(local);
			this.form.controls['textarea'].setValue(cart.traditional);
		}
	}

	public save(): void {
		if (this.form.invalid) return;
		const document: string = `${this._core.hash}${environment.slug}`;
		const local = localStorage.getItem(document);
		if (local) {
			const cart: ICart = JSON.parse(local);
			cart.traditional = this.form.controls['textarea'].value;
			localStorage.setItem(document, JSON.stringify(cart));
			this.back();
		}
	}

	public remove(): void {
		const document: string = `${this._core.hash}${environment.slug}`;
		const local = localStorage.getItem(document);
		if (local) {
			const cart: ICart = JSON.parse(local);
			cart.traditional = '';
			localStorage.setItem(document, JSON.stringify(cart));
		}
		this.form.controls['textarea'].setValue(null);
		this.back();
	}

	public back(): void {
		this._core.back();
	}

	private _resize(): void {
		this.form.controls['textarea'].valueChanges.subscribe(() => {
			this._zone.onStable.pipe(take(1)).subscribe(() => this.autosize?.resizeToFitContent(true));
		});
	}

	private _setUpForm(): UntypedFormGroup {
		return new UntypedFormGroup({
			textarea: new UntypedFormControl(null, [
				Validators.required,
				Validators.minLength(3),
				Validators.maxLength(255),
				notOnlySpaces()
			])
		});
	}
}
