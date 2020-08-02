import * as actions from "../APIActions";

import ApiHub from '../../services/ApiHub';


const api = ({ dispatch }) => next => async action => {
    if (action.type !== actions.apiCallBegan.type) return next(action);

    const { onStart, onSuccess, onError } = action.payload;

    if (onStart) dispatch({ type: onStart });

    next(action);

    try {

        ///fixme this needs to be generic... to able to take in other calls as well in the future...
        const response = await ApiHub.getLibraryPageData();

        // General
        dispatch(actions.apiCallSuccess(response.data));
        // Specific
        if (onSuccess) dispatch({ type: onSuccess, payload: response.data });
    } catch (error) {
        // General
        dispatch(actions.apiCallFailed(error.message));
        // Specific
        if (onError) dispatch({ type: onError, payload: error.message });
    }
};

export default api;
