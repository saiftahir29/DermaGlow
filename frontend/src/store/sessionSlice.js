import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice( {
    name: 'sessions',
    initialState: [],
    reducers: {
        addSession: ( state, action ) => {
            state.push( action.payload );
        },
        setSessions: ( state, action ) => {
            return action.payload;
        },
        removeSession: ( state, action ) => {
            return state.filter( session => session.id !== action.payload );
        },
    },
} );

export const { addSession, setSessions, removeSession } = sessionSlice.actions;
export default sessionSlice.reducer;