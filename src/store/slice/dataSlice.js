import {createSlice} from "@reduxjs/toolkit";

const initialState = {
	code: "",
	userPlaylist: [],
	currentLocation: "",
	userData: {}
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
		},
		updateCurrentLocation: (state, action) => {
			state.currentLocation = action.payload;
		},
		updateUserData: (state, action) => {
			state.userData = action.payload;
		}
	}
});

export const {changeCode, updatePlaylist, updateCurrentLocation, updateUserData} = dataSlice.actions;
