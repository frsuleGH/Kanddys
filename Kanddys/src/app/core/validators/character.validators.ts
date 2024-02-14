import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// Letras y números.
export function isAlphanumeric(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const regex = /^[a-zA-Z0-9]*$/;
		return regex.test(control.value) ? null : { notAlphanumeric: true };
	};
}

// Letras, números y espacios.
export function isAlphanumericWithSpaces(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const regex = /^[A-Za-z0-9\s]+$/g;
		return regex.test(control.value) ? null : { notAlphanumericWithSpaces: true };
	};
}

// Letras.
export function isAlpha(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const regex = /^[a-zA-Z]+$/;
		return regex.test(control.value) ? null : { notAlpha: true };
	};
}

// Números.
export function isNumeric(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (control.value === null || control.value === '') {
			return null;
		}
		const regex = /^[0-9]+$/;
		return regex.test(control.value) ? null : { notNumeric: true };
	};
}

// Distinto de espacios.
export function notOnlySpaces(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		if (control.value === null || control.value === '') {
			return null;
		}
		const regex = /^\s+$/;
		return regex.test(control.value) ? { onlySpaces: true } : null;
	};
}

// Distinto de cero.
export function notZeroValidator(): ValidatorFn {
	return (control: AbstractControl): ValidationErrors | null => {
		const regex = /^[1-9][0-9]*$/;
		return regex.test(control.value) ? null : { differentFromZero: true };
	};
}

export function getErrorMessage(control: AbstractControl): string {
	if (control.errors?.['required']) {
		return `Este campo es obligatorio.`;
	} else {
		if (control.errors?.['minlength']) {
			return `Debe tener al menos ${control.errors['minlength'].requiredLength} caracteres.`;
		}
		if (control.errors?.['maxlength']) {
			return `No puede tener más de ${control.errors['maxlength'].requiredLength} caracteres.`;
		}
		if (control.errors?.['email']) {
			return `Debe ser un correo electrónico válido.`;
		}
		if (control.errors?.['notAlphanumeric']) {
			return `Solo se permiten letras y números.`;
		}
		if (control.errors?.['notAlphanumericWithSpaces']) {
			return `No puede tener caracteres especiales.`;
		}
		if (control.errors?.['notAlpha']) {
			return `Solo se permiten letras.`;
		}
		if (control.errors?.['notNumeric']) {
			return `Solo se permiten números.`;
		}
		if (control.errors?.['differentFromZero']) {
			return `No puede ser 0 (cero).`;
		}
		if (control.errors?.['onlySpaces']) {
			return `No puede tener solo espacios en blanco.`;
		}
		if (control.errors?.['notAlphanumericWithPoint']) {
			return `No puede tener caracteres especiales.`;
		}
	}
	return '';
}
