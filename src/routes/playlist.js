import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import CardsTracks from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useState} from "react";
import {updateShowingPlaylist} from "../store/slice/spotifySlice";
import {createRandomString, handleScroll} from "../Components/complements";

function Playlist() {
	const accessToken = useSelector((state) => state.data.code);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const tracks = useSelector((state) => state.spotifyData.data.userPlaylist.tracks);
	const playlistName = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.name);
	const playlistImg = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.img);
	const playlistOwner = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.owner);
	const playlistFollowers = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.followers);
	let data = [];
	const [loaded, setLoaded] = useState(false);
	useEffect(() => {
		if (accessToken === "") {
			navigate("/");
		} else return;
	}, [accessToken]);
	useEffect(() => {
		setLoaded(false);
		if (tracks !== []) {
			tracks.map((item, i) => {
				data = [...data, item.track];
				if (i === tracks.length - 1) {
					setLoaded(true);
					dispatch(updateShowingPlaylist(data));
				}
			});
		}
	}, [tracks]);
	window.removeEventListener("scroll", () => handleScroll());
	return (
		<div className="min-h-screen min-w-screen bg-zinc-900">
			<SideMenu />
			<div
				className="absolute sm:pl-52 w-full text-white font-bold h-[500px] pl-12 z-[1]"
				style={{background: `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`}}
			>
				<div className="flex items-center h-[250px]">
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
				<div className=" pt-5 bg-black/[0.3]">{loaded ? <CardsTracks type="playlist" /> : null}</div>
			</div>
			<Player />
		</div>
	);
}
{
}
export default Playlist;
{
	/* <div
				className="absolute text-white font-bold h-[500px] pl-12 z-[1]"
				style={{background: `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`}}
			>
				<div className="flex items-center h-[250px]">
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
			<div className="mt-52 sm:mt-64 pt-5 bg-black/[.2] sm:w-max">{loaded ? <CardsTracks type="playlist" /> : null}</div> */
}
