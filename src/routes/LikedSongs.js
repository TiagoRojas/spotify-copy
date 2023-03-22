import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import CardsTracks from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useTrackFavoriteListQuery} from "../store/api/spotifyApi";
import {updateTrackFavList} from "../store/slice/spotifySlice";

function LikedSongs() {
	const token = useSelector((state) => state.data.code);
	const dispatch = useDispatch();
	const {refetch, data} = useTrackFavoriteListQuery(token);
	const tracks = useSelector((state) => state.spotifyData.trackFavList);
	useEffect(() => {
		if (data !== undefined) {
			dispatch(updateTrackFavList(data.items));
		}
	}, [data]);
	const newTracksArray = tracks.map((item) => item.track) || [];
	return newTracksArray === [] ? null : (
		<div className="bg-zinc-900 min-h-screen min-w-screen">
			<SideMenu />
			<div className="flex flex-col ml-44 bg-gradient-to-r from-emerald-900 to-emerald-600">
				<p className="text-slate-500 sm:text-[.3rem] md:text-[.9rem]  font-bold ml-10 relative top-10">PLAYLIST</p>
				<p className="text-white sm:text-[1rem] md:text-[6rem] font-bold ml-10 inline">Tus me gusta</p>
			</div>
			<div className="flex flex-col justify-center items-center ml-56 pt-10 mr-8 pb-32">
				<div className="grid grid-cols-6 grid-rows-1 items-center justify-between w-full">
					<p className="text-white col-span-3 w-full px-3">#</p>
					<p className="text-white w-full">Titulo</p>
					<p className="text-white w-full text-center">Time</p>
					<p className="text-white w-full">Album</p>
				</div>
				<CardsTracks token={token} data={newTracksArray} />
			</div>
			<Player />
		</div>
	);
}

export default LikedSongs;
