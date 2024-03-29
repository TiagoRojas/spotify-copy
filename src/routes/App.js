import {useEffect, useState} from "react";
import Login from "../Components/Login";

import OfflineModeView from "./offlineMode";
import OnlineMode from "./onlineMode";
import {useDispatch, useSelector} from "react-redux";
import {changeData, changeMode} from "../store/slice/spotifySlice";
import {changeCode, updatePlaylist, updateUserData} from "../store/slice/dataSlice";
import {useNavigate} from "react-router-dom";
import {useLazyFetchUserPlaylistQuery} from "../store/api/spotifyApi";
function App() {
	const [fetchUserPlaylist, results] = useLazyFetchUserPlaylistQuery();
	const currentMode = useSelector((state) => state.spotifyData.mode);
	const dispatch = useDispatch();
	const accessToken = useSelector((state) => state.data.code);
	const navigate = useNavigate();
	const code = new URLSearchParams(window.location.search).get("code");
	const commonParams = {
		redirect_uri: process.env.REACT_APP_SPOTIFY_CALLBACK_HOST,
		client_id: process.env.REACT_APP_CLIENT_ID,
		client_secret: process.env.REACT_APP_CLIENT_SECRET
	};
	const params = {
		code,
		grant_type: "authorization_code",
		...commonParams
	};
	const searchParams = Object.keys(params)
		.map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(params[key]))
		.join("&");
	useEffect(() => {
		if (accessToken === "" && code !== null) {
			fetch("https://accounts.spotify.com/api/token", {
				method: "POST",
				body: searchParams,
				headers: {"Content-type": "application/x-www-form-urlencoded"}
			})
				.then((res) => res.json())
				.then((data) => {
					dispatch(changeMode("online"));
					dispatch(changeCode(data.access_token));
					navigate("/");
					fetch("https://api.spotify.com/v1/me/player/recently-played", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${data.access_token}`
						}
					})
						.then((response) => response.json())
						.then((recentData) => {
							console.log(recentData);
							dispatch(changeData({type: "recent", data: recentData.items}));
						});
					fetch("https://api.spotify.com/v1/me", {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${data.access_token}`
						}
					})
						.then((response) => response.json())
						.then((userData) => {
							dispatch(updateUserData(userData));
							document.title = userData.display_name + " - Spotify";
						});
					fetchUserPlaylist({token: data.access_token});
				});
		}
	}, [code]);
	useEffect(() => {
		if (results.data) {
			dispatch(updatePlaylist(results.data.items));
		}
	}, [results]);
	switch (currentMode) {
		case "":
			return <Login />;
		case "online":
			return <OnlineMode />;
		case "offline":
			return <OfflineModeView />;
	}
}

export default App;
