import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from "reselect";
import moment from "moment";

import { apiCallBegan } from "../APIActions";

import env from '../../../_env';

const slice = createSlice({
    name: "books",
    initialState: { //for fast lookups and by default; use object / if item order matters; use array; if need both, use object with "byId" data structure, and "order" top level array, to store order
        books: [],
        totalResults: 0,
        isLoading: false,
        lastFetch: null //last load timestamp
    },
    reducers: {
        // action => action-handler
        // eventough these are Reducers, obj. mutation is OK, because of reduxjs/toolkit encapsulation

        booksRequested: (books, action) => {
            books.isLoading = true;
        },
        booksReceived: (books, action) => {
            books.books = action.payload.rows;
            books.totalResults = books.books.length;
            books.isLoading = false;
            books.lastFetch = Date.now();
        },
        booksRequestFailed: (books, action) => {
            books.isLoading = false;
        }
    }
});

export const { booksRequested, booksReceived, booksRequestFailed } = slice.actions;
export default slice.reducer;


///section Action Creators


export const loadBooks = () => (dispatch, getState) => {
    const lastFetch = getState().books.lastFetch;

    const diffInMinutes = moment().diff(moment(lastFetch), "minutes");
    if (env.APICacheTimeoutInMinutes && diffInMinutes < env.APICacheTimeoutInMinutes) return;

    return dispatch(
        apiCallBegan({
            url:"",
            onStart: booksRequested.type,
            onSuccess: booksReceived.type,
            onError: booksRequestFailed.type
        })
    );
};


///section Selector
// take the state and returns a subset of that
// Memoization with reselect (basically if the passed in function props are the same, the results are returned from cache, rather than re-running the function)

export const getBooksFilteredByStatus = createSelector(
    data => data.allBooks,
    data => data.selectedFilters,
    data => data.pageNumber,
    data => data.maxItemPerPage,
    (allBooks, selectedFilters, pageNumber, maxItemPerPage) => {
        const filteredBooks = allBooks
            .filter(book => selectedFilters.includes(book.value.status))
            .sort((a, b) => (a.value.status > b.value.status) ? 1 : -1);

        let start = (pageNumber - 1) * maxItemPerPage;
        let end = start + maxItemPerPage;

        return {
            pagedResults: filteredBooks.slice(start,end),
            totalResultsCount: filteredBooks.length
        }
    }
);