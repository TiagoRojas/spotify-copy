import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	code: ""
};
export const dataSlice = createSlice({
	name: "SpotifyData",
	initialState,
	reducers: {
		changeCode: (state, action) => {
			state.code = action.payload;
		}
	}
});

export const {changeCode} = dataSlice.actions;
