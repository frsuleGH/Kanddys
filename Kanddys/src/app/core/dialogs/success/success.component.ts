import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';

// * Material.
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

// * Shared.
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ButtonComponent } from '../../components/button/button.component';

// * Fire.

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-sqq-dialog',
	standalone: true,
	imports: [MatButtonModule, MatInputModule, MatIconModule, ButtonComponent],
	templateUrl: './success.component.html',
	styleUrl: 'success.component.scss'
})
export class SuccessDialogComponent {
	public date: string | undefined;

	public constructor(
		private _dialogRef: MatDialogRef<SuccessDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { date: string }
	) {
		this.date = data.date;
	}

	public close(): void {
		this._dialogRef.close();
	}
}
