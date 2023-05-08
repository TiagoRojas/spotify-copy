import {useEffect, useState} from "react";
import Login from "../Components/Login";

import OfflineModeView from "./offlineMode";
import OnlineMode from "./onlineMode";
import {useDispatch, useSelector} from "react-redux";
import {changeMode} from "../store/slice/spotifySlice";
import {changeCode, updatePlaylist, updateUserData} from "../store/slice/dataSlice";
import {useNavigate} from "react-router-dom";

function App() {
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
					fetch(`https://api.spotify.com/v1/me/playlists`, {
						method: "GET",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${data.access_token}`
						}
					})
						.then((responsePlaylist) => responsePlaylist.json())
						.then((playlist) => dispatch(updatePlaylist(playlist.items)));
				});
		}
	}, [code]);
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
