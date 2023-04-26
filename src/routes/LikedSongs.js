import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import CardsTracks from "../Components/Cards";
import Player from "../Components/player";
import SideMenu from "../Components/sideMenu";
import {useLazyGetFavoriteTracksQuery} from "../store/api/spotifyApi";
import {updateCheckedPlaylist, updateTrackFavList} from "../store/slice/spotifySlice";
import {handleScroll} from "../Components/complements";
import {useNavigate} from "react-router-dom";
import leftArrow from "../assets/leftArrow.png";
import rightArrow from "../assets/rightArrow.png";
import heart from "../assets/myLikesHeart.png";
function LikedSongs() {
	const token = useSelector((state) => state.data.code);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [offset, setOffset] = useState(0);
	const [getFavoriteTracks, results] = useLazyGetFavoriteTracksQuery();
	const tracks = useSelector((state) => state.spotifyData.trackFavList);
	const userData = useSelector((state) => state.data.userData);
	let timer;

	useEffect(() => {
		console.log(results.data);
		if (results.data !== undefined) {
			dispatch(updateTrackFavList({data: results.data.items, type: "add"}));
		}
	}, [results.data]);
	useEffect(() => {
		getFavoriteTracks({token, offset});
	}, [offset]);
	useEffect(() => {
		if (token === "") {
			navigate("/");
		}
	}, [token]);

	const handleAddOrRes = ({type, amount}) => {
		if (type === "res") {
			if (offset >= 25) {
				dispatch(updateCheckedPlaylist({checked: false}));
			} else return;
		} else {
			// setOffset(offset + 25);
			dispatch(updateCheckedPlaylist({checked: false}));
		}
	};

	window.onscroll = function (ev) {
		if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
			clearTimeout(timer);
			timer = setTimeout(() => {
				console.log("offset changed");
				setOffset(offset + 25);
			}, 200);
		}
	};
	return (
		<div className="min-h-screen min-w-screen bg-zinc-900">
			<SideMenu />
			<div className="absolute w-full flex flex-row bg-gradient-to-b sm:pl-52 from-[#513a9c] to-transparent h-[500px]">
				<div className="flex items-center justify-center h-max pt-10 sm:pl-10 mx-auto sm:mx-0 w-max">
					<img src={heart} className="w-24 h-24 sm:w-48 sm:h-48 relative bg-gradient-to-br from-blue-900 to-white p-8 sm:p-16 shadow-lg shadow-black" />
					<div className="ml-5">
						<p className="text-slate-100 text-[0.8rem] sm:text-[.9rem] font-bold relative sm:top-4">PLAYLIST</p>
						<p className="text-white text-[1.5rem] sm:text-[2rem] md:text-[4rem] font-bold inline-block">Tus me gusta</p>
						<p className="text-white text-[0.8rem] sm:text-[.9rem] font-bold sm:ml-4">
							{userData.display_name} <>&middot;</> {tracks.length + " canciones"}
						</p>
					</div>
				</div>
			</div>
			{results.data === undefined ? null : (
				<div className="relative w-full h-full flex flex-col justify-center items-center mr-8 z-[1] sm:pt-8">
					<div className="mt-40 sm:mt-64 bg-black/[0.3] w-full sm:pl-56 px-4 pt-5">
						<CardsTracks token={token} type="likedSongs" />
					</div>
				</div>
			)}
			<Player />
			<div className="sm:pl-56 text-white pb-32 text-center bg-black/[0.3]">
				<p className="p-5 text-[0.8rem]">Esto simplemente es un projecto para mi portafolio personal.</p>
			</div>
		</div>
	);
}

export default LikedSongs;
