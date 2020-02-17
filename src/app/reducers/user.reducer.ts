import { User } from '../models/user.model';
import * as UserActions from '../actions/user.actions';

const initialState: User = {
    email: ""
}

export function reducer(state: User = initialState, action: UserActions.Actions) {
    switch (action.type) {
        case UserActions.LOGIN:
            return Object.assign({}, state, { access_token: action.payload })
        case UserActions.LOGOUT:
            localStorage.removeItem('access_token')
            return Object.assign({}, { email: "" })
        default:
            return state;
    }
}