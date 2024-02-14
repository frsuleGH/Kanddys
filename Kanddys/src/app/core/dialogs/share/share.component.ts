import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

// * CDK's.
import { Clipboard } from '@angular/cdk/clipboard';

// * Material.
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

// * Dialogs.
import { QRDialogComponent } from '@app/core/dialogs/qr/qr.component';

// * Shared.
import { ButtonComponent } from '../../components/button/button.component';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-shared-dialog',
	standalone: true,
	imports: [MatIconModule, ButtonComponent],
	templateUrl: 'share.component.html',
	styleUrl: 'share.component.scss'
})
export class SharedDialogComponent {
	private _mode: 'COPY' | 'INITIAL' = 'INITIAL';

	private _data: { title: string; descripcion: string } = inject(MAT_DIALOG_DATA);
	private _document: Document = inject(DOCUMENT);
	private _dialogRef: MatDialogRef<SharedDialogComponent> = inject(MatDialogRef);
	private _clip: Clipboard = inject(Clipboard);
	private _dialog: MatDialog = inject(MatDialog);

	public get mode(): 'COPY' | 'INITIAL' {
		return this._mode;
	}

	public set mode(value: 'COPY' | 'INITIAL') {
		this._mode = value;
	}

	public share(): void {
		navigator
			.share({
				title: this._data.title,
				text: this._data.descripcion,
				url: this._document.location.href
			})
			.then(() => {
				console.log('Contenido compartido exitosamente');
			})
			.catch((error) => {
				console.log('Hubo un error al compartir', error);
			});
	}

	public copy(): void {
		this._clip.copy(this._document.location.href);
		setTimeout(() => {
			this.close();
		}, 3000);
	}

	public qr(): void {
		this.close();
		this._dialog.open(QRDialogComponent, {
			data: {
				title: this._data.title,
				descripcion: this._data.descripcion,
				url: this._document.location.href
			}
		});
	}

	public close(): void {
		this._dialogRef.close();
	}
}
