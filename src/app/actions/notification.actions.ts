import { Action } from '@ngrx/store';

export const SETCOUNT = 'SETCOUNT';
export const RESETCOUNT = 'RESETCOUNT';

export class SetCount implements Action {
    readonly type = SETCOUNT

    constructor(public payload) { }
} 

export class ResetCount implements Action {
    readonly type = RESETCOUNT

    constructor(public payload) { }
} 

export type Actions = SetCount | ResetCount