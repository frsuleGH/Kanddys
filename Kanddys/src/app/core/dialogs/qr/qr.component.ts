/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';

// * QR.
import { QRCodeComponent, QRCodeModule } from 'angularx-qrcode';

// * Material.
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'app-qr-dialog',
	standalone: true,
	imports: [QRCodeModule],
	templateUrl: 'qr.component.html',
	styleUrl: 'qr.component.scss'
})
export class QRDialogComponent {
	@ViewChild('qrCode') public qrCode?: QRCodeComponent;

	private _qrData: string;

	public constructor(
		@Inject(MAT_DIALOG_DATA) private _data: { title?: string; descripcion?: string; url?: string },
		@Inject(DOCUMENT) private _document: Document,
		private _dialogRef: MatDialogRef<QRDialogComponent>
	) {
		this._qrData = this._data?.url ?? this._document.location.href;
	}

	public get qrData(): string {
		return this._qrData;
	}

	public close(): void {
		this._dialogRef.close();
	}

	public send(): void {
		navigator
			.share({
				title: this._data?.title,
				text: this._data?.descripcion,
				url: this._qrData
			})
			.then(() => {
				console.log('Contenido compartido exitosamente');
			})
			.catch((error) => {
				console.log('Hubo un error al compartir', error);
			});
	}

	public download(): void {
		const canvas = this.qrCode?.qrcElement.nativeElement.querySelector('canvas');
		const downloadLink = document.createElement('a');
		downloadLink.download = 'qr-code.png';
		downloadLink.href = canvas.toDataURL();
		downloadLink.click();
	}
}
