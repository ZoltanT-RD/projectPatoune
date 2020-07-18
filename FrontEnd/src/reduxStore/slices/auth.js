import { createSlice } from '@reduxjs/toolkit';

const slice = createSlice({
    name: "auth",
    initialState: [], //for fast lookups and by default; use object / if item order matters; use array; if need both, use object with "byId" data structure, and "order" top level array, to store order
    reducers: {
        // action => action-handler
        // eventough these are Reducers, obj. mutation is OK, because of reduxjs/toolkit encapsulation

        userLoggedIn: (currentState, action) => {
            //logic here
            currentState.push({
                ///fixme this is just for testing
                description: action.payload.description,
                someDefaultValue: false
            });
        }
    }
});

export const { userLoggedIn } = slice.actions;
export default slice.reducer;