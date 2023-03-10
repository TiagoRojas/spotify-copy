import {createSlice} from "@reduxjs/toolkit";
const initialState = {
	data: {
		tracks: [],
		album: [],
		artists: [],
		playlists: []
	},
	loaded: false,
	isBlank: true,
	timestamp: 0,
	currentAudio: "",
	isPlaying: false,
	offset: 0,
	currentId: "",
	musicFav: []
};
export const spotifySlice = createSlice({
	name: "SpotifyData",
	initialState,
	reducers: {
		addData: (state, action) => {
			if (action.payload !== undefined) {
				state.data.tracks = action.payload.tracks.items;
				state.loaded = true;
			}
		},
		isBlank: (state, action) => {
			state.isBlank = action.payload;
		},
		timestamp: (state, action) => {
			state.currentAudio = action.payload.currentAudio;
			state.timestamp = action.payload.timestamp;
		},
		isPlaying: (state, action) => {
			state.isPlaying = action.payload;
		},
		changeOffset: (state, action) => {
			state.offset = state.offset + action.payload;
		},
		changeId: (state, action) => {
			state.currentId = action.payload;
		},
		updateMusicFav: (state, action) => {
			state.musicFav = [{id: action.payload.id, fav: action.payload.data[0]}];
		}
	}
});

export const {addData, isBlank, timestamp, isPlaying, changeOffset, changeId, updateMusicFav} = spotifySlice.actions;
