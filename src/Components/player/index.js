import {useDispatch, useSelector} from "react-redux";
import {timestamp} from "../../store/slice/spotifySlice";
import "./style.css";
import PlayerBtn from "../../assets/playerBtn.png";
import PauseBtn from "../../assets/pauseBtn.png";
import useMusic from "../../hooks/useMusic";
import {useEffect} from "react";
export default function Player() {
	const dispatch = useDispatch();
	let audioPlaying = useSelector((state) => state.spotifyData.currentAudio);
	let isPlaying = useSelector((state) => state.spotifyData.isPlaying);
	const {pause, resume} = useMusic();

	const changeTime = (e) => {
		dispatch(timestamp({timestamp: e, currentAudio: audioPlaying}));
	};

	const playerMusic = () => {
		if (audioPlaying !== "") {
			isPlaying === true ? pause(audioPlaying) : resume(audioPlaying);
		}
	};
	useEffect(() => {
		document.querySelector("#seeker").value = 0;
	}, []);
	return (
		<div className="fixed bottom-0 w-full md:h-28 sm:h-16 flex-shrink-0 bg-zinc-800 text-white z-10">
			<div className="flex justify-center items-center flex-col">
				<input type="range" max={29.779592} min={0} step={0.0001} onInput={(e) => changeTime(e.target.value)} id="seeker" className="w-1/2 py-5" />
				<div>
					<img src={isPlaying ? PauseBtn : PlayerBtn} onClick={() => playerMusic()} className="w-16 h-auto" />
				</div>
			</div>
		</div>
	);
}
