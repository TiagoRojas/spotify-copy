import {createSlice} from "@reduxjs/toolkit";
const initialState = {
	data: {
		tracks: [],
		album: [],
		artists: [],
		playlists: []
	},
	trackFavList: [],
	loaded: false,
	isBlank: true,
	timestamp: 0,
	currentPlaying: {
		audio: "",
		item: {
			name: "",
			image: "",
			autors: ""
		}
	},
	isLooping: false,
	volume: 0.35,
	isPlaying: false,
	offset: 0,
	currentId: ""
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
			state.currentPlaying.audio = action.payload.audio;
			state.timestamp = action.payload.timestamp;
		},
		changeMusic: (state, action) => {
			state.currentPlaying.item = action.payload;
		},
		changeLoop: (state, action) => {
			state.isLooping = action.payload;
		},
		changeVolume: (state, action) => {
			state.volume = action.payload;
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
		updateTrackFavList: (state, action) => {
			state.trackFavList = action.payload;
		}
	}
});

export const {addData, isBlank, changeMusic, changeLoop, timestamp, changeVolume, isPlaying, changeOffset, changeId, updateTrackFavList} = spotifySlice.actions;
