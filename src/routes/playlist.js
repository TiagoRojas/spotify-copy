import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CardsTracks from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";

function Playlist() {
	const accessToken = useSelector((state) => state.data.code);
	const navigate = useNavigate();
	const tracks = useSelector((state) => state.spotifyData.data.tracks);
	const newData = tracks.map((item) => item.track) || [];
	useEffect(() => {
		if (accessToken === "") {
			navigate("/");
		} else return;
	}, [accessToken]);
	return (
		<div>
			<SideMenu />
			<div className="ml-52 min-w-screen min-h-screen flex flex-col justify-center items-center">
				{newData !== [] ? <CardsTracks token={accessToken} data={newData} /> : "loading"}
			</div>
			<Player />
		</div>
	);
}

export default Playlist;
