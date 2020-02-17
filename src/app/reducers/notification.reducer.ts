import { Notification } from '../models/notification.model';
import * as NotificationActions from '../actions/notification.actions';

const initialState: Notification = {
    count: 0
}

export function reducer(state: Notification = initialState, action: NotificationActions.Actions) {
    console.log("State", state)
    console.log("Action", action)
    switch (action.type) {
        case NotificationActions.SETCOUNT:
            return Object.assign({}, state)
        case NotificationActions.RESETCOUNT:
            return Object.assign({}, { count: 0 })
        default:
            return state;
    }
}