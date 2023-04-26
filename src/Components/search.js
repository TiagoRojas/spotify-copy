import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {changeData, isBlank, isPlaying, timestamp, updateSearch} from "../store/slice/spotifySlice";
import {useLazyGetTrackQuery} from "../store/api/spotifyApi";
import {createSearchParams, useNavigate} from "react-router-dom";
import {handleScroll} from "./complements";
export default function Search() {
	const [getTrack, results] = useLazyGetTrackQuery();
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = useSelector((state) => state.data.code);
	const searchValue = useSelector((state) => state.spotifyData.searchValue);
	const offset = useSelector((state) => state.spotifyData.offset);
	let timer;
	const handlerSearch = (e) => {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			if (e.target.value !== "") {
				dispatch(changeData({type: "reset"}));
				navigate({
					pathname: "/search",
					search: createSearchParams({
						q: e.target.value
					}).toString()
				});
				dispatch(isPlaying(false));
				dispatch(updateSearch(e.target.value));
				getTrack({value: e.target.value, token: token, offset});
				dispatch(isBlank(false));
			}
			if (e.target.value === "") {
				dispatch(isBlank(true));
				dispatch(updateSearch(e.target.value));
				dispatch(timestamp({timestamp: 0, audio: ""}));
				dispatch(isPlaying(false));
			}
		}, 1000);
	};
	useEffect(() => {
		if (results.data !== undefined) {
			dispatch(changeData({data: results.data, type: "search", loaded: true}));
		}
	}, [results.data]);
	useEffect(() => {
		clearTimeout(timer);
		if (searchValue !== "") {
			timer = setTimeout(() => {
				getTrack({value: searchValue, token: token, offset});
			}, 1000);
		} else return;
	}, [offset]);
	return (
		<div className="w-full flex flex-col lg:flex-row items-center ml-2 sm:ml-0">
			<input
				type="text"
				onChange={(e) => handlerSearch(e)}
				placeholder="Search song"
				className="p-5 mx-5 text-lg text-white w-1/2 w-full rounded-xl bg-zinc-900 border-gray-700 border-2"
			/>
			<p className="text-white">Solo podras escuchar una vista previa de la musica</p>
		</div>
	);
}
