export function currency(value: number | undefined): string {
	if (value === 0) {
		return 'Gratis';
	} else if (value) {
		const formattedValue = value.toLocaleString('es-ES', {
			minimumFractionDigits: 2,
			useGrouping: true
		});
		return `$${formattedValue}`;
	} else {
		return '';
	}
}
