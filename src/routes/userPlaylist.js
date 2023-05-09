import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import Cards from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {createRandomString} from "../Components/complements";
import heartFilled from "../assets/heartFilled.png";
import heart from "../assets/heart.png";
import {
	useLazyAddPlaylistFavoriteQuery,
	useLazyCheckUserFollowPlaylistQuery,
	useLazyFetchUserPlaylistQuery,
	useLazyRemovePlaylistFavoriteQuery
} from "../store/api/spotifyApi";
import {DotWave} from "@uiball/loaders";
import {updatePlaylist} from "../store/slice/dataSlice";

function UserPlaylist() {
	const [fetchUserPlaylist, resultsPlaylist] = useLazyFetchUserPlaylistQuery();
	const dispatch = useDispatch();
	const playlist = useSelector((state) => state.data.userPlaylist);
	const code = useSelector((state) => state.data.code);
	const navigate = useNavigate();
	const tracks = useSelector((state) => state.spotifyData.data.userPlaylist.tracks);
	const userData = useSelector((state) => state.data.userData);
	const playlistName = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.name);
	const playlistImg = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.img);
	const playlistOwner = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.owner);
	const playlistId = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.id);
	const playlistFollowers = useSelector((state) => state.spotifyData.data.userPlaylist.playlistInfo.followers);
	const loaded = useSelector((state) => state.spotifyData.loaded);
	const [checkUserFollowPlaylist, results] = useLazyCheckUserFollowPlaylistQuery();
	const [addPlaylist, resultsAdded] = useLazyAddPlaylistFavoriteQuery();
	const [removePlaylist, resultsRemoved] = useLazyRemovePlaylistFavoriteQuery();

	useEffect(() => {
		if (code === "") {
			navigate("/");
		} else return;
	}, [code]);

	useEffect(() => {
		if (playlistId !== "") {
			checkUserFollowPlaylist({token: code, id: playlistId, userId: userData.id});
		}
	}, [playlistId]);

	useEffect(() => {
		fetchUserPlaylist({token: code});
	}, [resultsAdded, resultsRemoved]);

	useEffect(() => {
		if (resultsPlaylist.data) dispatch(updatePlaylist(resultsPlaylist.data.items));
	}, [resultsPlaylist]);

	const handleAddOrRemovePlaylist = () => {
		const heartElement = document.querySelector(".heartPlaylist");
		if (heartElement.src === heart) {
			addPlaylist({token: code, id: playlistId});
			heartElement.src = heartFilled;
		} else {
			removePlaylist({token: code, id: playlistId});
			heartElement.src = heart;
		}
	};
	return (
		<div className="min-h-screen min-w-screen">
			<SideMenu />
			{!loaded ? (
				<div className="w-full h-screen flex justify-center items-center">
					<DotWave size={47} speed={1} color="white" />
				</div>
			) : (
				<>
					<div
						className="sm:pl-52 w-full text-white font-bold h-[500px] pl-12 z-[1] absolute top-1"
						style={{background: `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`}}
					>
						<div className="flex items-center h-[250px] sm:pl-5">
							{playlistImg !== undefined ? <img src={playlistImg.url} className="w-24 h-24 sm:w-48 sm:h-48 shadow-lg shadow-black" /> : null}
							<div className="items-center pl-2">
								<p className="sm:text-[18px]">PLAYLIST</p>
								<p className="text-[24px] sm:text-[38px] align-middle">{playlistName}</p>
								{playlistOwner === userData.display_name ? null : results.data !== undefined ? (
									<img
										src={results.data ? heartFilled : heart}
										alt="heart"
										className={"w-8 h-7 cursor-pointer heartPlaylist"}
										onClick={() => handleAddOrRemovePlaylist()}
									/>
								) : null}
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
					<div className="sm:pl-52 sm:pb-32 relative top-[210px] sm:top-[250px] z-10">
						{tracks.length >= 1 ? (
							<div className="pt-5 pb-5 bg-black/[0.3]">
								<Cards type="playlistView" />
							</div>
						) : (
							<div className="w-full flex justify-center items-center text-white font-bold">
								<p>Oh no, la playlist esta vacia.</p>
							</div>
						)}
					</div>
				</>
			)}
			<Player />
		</div>
	);
}
export default UserPlaylist;
