import {createSlice} from "@reduxjs/toolkit";
const initialState = {
	mode: "",
	data: {
		tracks: [],
		albums: [],
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
		changeMode: (state, action) => {
			state.mode = action.payload;
		},
		addData: (state, action) => {
			if (action.payload.data !== undefined) {
				if (action.payload.type === "search") {
					state.data.tracks = action.payload.data.tracks.items;
					state.data.artists = action.payload.data.artists.items;
					state.data.playlists = action.payload.data.tracks.playlists;
					state.data.albums = action.payload.data.tracks.albums;
				}
				if (action.payload.type === "playlist") {
					console.log(action.payload);
					state.data.tracks = action.payload.data.tracks.items;
				}
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
			state.trackFavList = [...state.trackFavList, ...action.payload];
		}
	}
});

export const {changeMode, addData, isBlank, changeMusic, changeLoop, timestamp, changeVolume, isPlaying, changeOffset, changeId, updateTrackFavList} =
	spotifySlice.actions;
