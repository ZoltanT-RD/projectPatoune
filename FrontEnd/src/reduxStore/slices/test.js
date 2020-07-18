import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
    name: "bugs",
    initialState: [], //for fast lookups and by default; use object / if item order matters; use array; if need both, use object with "byId" data structure, and "order" top level array, to store order
    reducers: {
        // action => action-handler
        // eventough these are Reducers, obj. mutation is OK, because of reduxjs/toolkit encapsulation

        bugAdded: (currentState, action) => {
            //logic here
            currentState.push({
                description: action.payload.description,
                someDefaultValue: false
            });
        }
    }
});

export const {bugAdded} = slice.actions;
export default slice.reducer;