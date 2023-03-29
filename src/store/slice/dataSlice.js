import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	code: "",
	userPlaylist: []
};
export const dataSlice = createSlice({
	name: "SpotifyData",
	initialState,
	reducers: {
		changeCode: (state, action) => {
			state.code = action.payload;
		},
		updatePlaylist: (state, action) => {
			state.userPlaylist = action.payload;
		}
	}
});

export const {changeCode, updatePlaylist} = dataSlice.actions;
