import { IAppState, ILoading } from '@core/interfaces/app.interface';

// * Select feature.
export const state = (state: IAppState): IAppState => state;

export const loaded: ILoading = 'LOADED';
export const loading: ILoading = 'LOADING';
export const error: ILoading = 'ERROR';
