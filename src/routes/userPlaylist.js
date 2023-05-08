import React, {useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Cards from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {createRandomString} from "../Components/complements";

function UserPlaylist() {
	const code = useSelector((state) => state.data.code);
	const navigate = useNavigate();
	const tracks = useSelector((state) => state.spotifyData.data.userPlaylist.tracks);
	const playlistName = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.name);
	const playlistImg = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.img);
	const playlistOwner = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.owner);
	const playlistFollowers = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.followers);
	useEffect(() => {
		if (code === "") {
			navigate("/");
		} else return;
	}, [code]);
	return (
		<div className="min-h-screen min-w-screen bg-zinc-900">
			<SideMenu />
			<div
				className="absolute sm:pl-52 w-full text-white font-bold h-[500px] pl-12 z-[1]"
				style={{background: `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`}}
			>
				<div className="flex items-center h-[250px] sm:pl-5">
					{playlistImg !== undefined ? <img src={playlistImg.url} className="w-24 h-24 sm:w-48 sm:h-48 shadow-lg shadow-black" /> : null}
					<div className="items-center pl-2">
						<p className="sm:text-[18px]">PLAYLIST</p>
						<p className="text-[24px] sm:text-[38px] align-middle">{playlistName}</p>
						<p className="sm:text-[18px]">
							{playlistOwner}
							<> &middot;</>
							<i className="sm:text-[18px] not-italic"> {playlistFollowers} me gusta, </i>
							<i className="sm:text-[18px] not-italic">
								{tracks.length} {tracks.length <= 1 ? "cancion" : "canciones"}
							</i>
						</p>
					</div>
				</div>
			</div>
			<div className="sm:pl-52 pt-52 sm:pt-64 relative z-10">
				{tracks.length >= 1 ? (
					<div className=" pt-5 bg-black/[0.3]">
						<Cards type="playlistView" />
					</div>
				) : (
					<div className="w-full flex justify-center items-center text-white font-bold">
						<p>Oh no, la playlist esta vacia.</p>
					</div>
				)}
			</div>
			<Player />
		</div>
	);
}
export default UserPlaylist;
