import {createSlice} from "@reduxjs/toolkit";
const initialState = {
	mode: "",
	data: {
		tracks: [],
		albums: [],
		artists: [],
		playlists: [],
		userPlaylist: {
			tracks: [],
			playlistInfo: {
				img: "",
				name: "",
				owner: "",
				followers: 0
			}
		},
		newReleases: []
	},
	showingAlbum: {
		data: [],
		id: ""
	},
	showingPlaylist: {
		data: [],
		id: ""
	},
	searchValue: "",
	trackFavList: [],
	checkListPlaylist: [],
	checkedPlaylistId: "",
	loaded: false,
	isChecked: false,
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
	volume: 0.1,
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
		changeData: (state, action) => {
			if (action.payload.type === "search") {
				state.data.tracks = [...state.data.tracks, ...action.payload.data.tracks.items];
				state.data.artists = [...state.data.artists, ...action.payload.data.artists.items];
				state.data.playlists = [...state.data.playlists, ...action.payload.data.playlists.items];
				state.data.albums = [...state.data.albums, ...action.payload.data.albums.items];
			}
			if (action.payload.type === "playlist") {
				console.log(action.payload);
				state.data.userPlaylist.playlistInfo.owner = action.payload.data.owner.display_name;
				state.data.userPlaylist.playlistInfo.followers = action.payload.data.followers.total;
				state.data.userPlaylist.tracks = action.payload.data.tracks.items;
				state.data.userPlaylist.playlistInfo.name = action.payload.name;
				state.data.userPlaylist.playlistInfo.img = action.payload.image;
			}
			if (action.payload.type === "newReleases") {
				state.data.newReleases = action.payload.data;
			}
			if (action.payload.type === "reset") {
				state.data.tracks = [];
				state.data.artists = [];
				state.data.playlists = [];
				state.data.albums = [];
				state.data.userPlaylist.tracks = [];
			}
			state.loaded = action.payload.loaded;
		},
		updateShowingPlaylist: (state, action) => {
			if (action.payload.data === undefined) {
				state.showingPlaylist.id = action.payload;
				return;
			}
			state.showingPlaylist.data = action.payload.data;
		},
		changeShowingAlbum: (state, action) => {
			if (action.payload.data === undefined) {
				state.showingAlbum.id = action.payload.id;
			} else state.showingAlbum.data = action.payload.data;
		},
		updateSearch: (state, action) => {
			state.searchValue = action.payload;
		},
		updateCheckedPlaylist: (state, action) => {
			if (action.payload.playlist === undefined) {
				state.checkListPlaylist = state.data.checkListPlaylist;
				state.isChecked = action.payload.checked;
			}
			if (action.payload.playlist !== undefined) {
				state.checkListPlaylist = action.payload.playlist;
				state.isChecked = action.payload.checked;
			}
		},
		changeCheckedIdPlaylist: (state, action) => {
			state.checkedPlaylistId = action.payload;
		},
		isBlank: (state, action) => {
			state.isBlank = action.payload;
		},
		timestamp: (state, action) => {
			state.currentPlaying.audio = action.payload.audio;
			state.timestamp = action.payload.timestamp;
		},
		changeMusic: (state, action) => {
			if ((action.payload = undefined)) {
				state.currentPlaying.audio = "";
				state.currentPlaying.item = {};
			}
			state.currentPlaying.audio = action.payload.name;
			state.currentPlaying.item = action.payload.item;
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
			state.offset = action.payload;
		},
		changeId: (state, action) => {
			state.currentId = action.payload;
		},
		updateTrackFavList: (state, action) => {
			console.log(action.payload);
			if (action.payload.type === "reset") {
				state.trackFavList = [];
			}
			if (action.payload.type === "add") {
				state.trackFavList = [...state.trackFavList, ...action.payload.data];
			} else return;
		}
	}
});

export const {
	changeMode,
	changeData,
	updateShowingPlaylist,
	changeShowingAlbum,
	updateSearch,
	updateCheckedPlaylist,
	changeCheckedIdPlaylist,
	isBlank,
	changeMusic,
	changeLoop,
	timestamp,
	changeVolume,
	isPlaying,
	changeOffset,
	changeId,
	updateTrackFavList
} = spotifySlice.actions;
