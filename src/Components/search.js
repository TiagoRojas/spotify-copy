import {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {isBlank, isPlaying, timestamp} from "../store/slice/spotifySlice";
import SearchData from "./searchData";
export default function Search({accessToken}) {
	const dispatch = useDispatch();
	const blank = useSelector((state) => state.spotifyData.isBlank);
	const offset = useSelector((state) => state.spotifyData.offset);
	const [value, setValue] = useState("");
	let timer;

	const handlerSearch = (e) => {
		clearTimeout(timer);
		timer = setTimeout(async () => {
			if (e.target.value !== "") {
				dispatch(isPlaying(false));
				setValue(e.target.value);
				dispatch(isBlank(false));
			}
			if (e.target.value === "") {
				dispatch(isBlank(true));
				dispatch(timestamp({timestamp: 0, currentAudio: ""}));
				dispatch(isPlaying(false));
			}
		}, 1000);
	};
	return (
		<>
			<input
				type="text"
				onChange={(e) => handlerSearch(e)}
				placeholder="Search song"
				className="p-5 mx-5 text-lg text-white w-1/2 rounded-xl bg-zinc-900 border-gray-700 border-2"
			/>
			{blank ? null : <SearchData value={value} token={accessToken} offset={offset} />}
		</>
	);
}
