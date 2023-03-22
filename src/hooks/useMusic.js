import {useDispatch, useSelector} from "react-redux";
import {isPlaying, timestamp, changeMusic} from "../store/slice/spotifySlice";

const useMusic = () => {
	const dispatch = useDispatch();
	let currentAudio = useSelector((state) => state.spotifyData.currentPlaying.audio);
	let volume = useSelector((state) => state.spotifyData.volume);
	const start = ({i, item}) => {
		dispatch(changeMusic(item));
		const audio = document.querySelector(`.audio${i}`);
		const seeker = document.querySelector("#seeker");
		audio.currentTime = 0;
		audio.volume = volume;
		dispatch(isPlaying(true));
		audio.play();
		audio.addEventListener("timeupdate", () => {
			seeker.oninput = () => {
				audio.currentTime = seeker.value;
			};
			seeker.value = audio.currentTime;
			dispatch(timestamp({timestamp: audio.currentTime, audio: `.audio${i}`}));
		});
	};
	const stop = (i) => {
		const audio = document.querySelector(`.audio${i}`);
		audio.currentTime = 0;
		dispatch(isPlaying(false));
		dispatch(timestamp({timestamp: 0, audio: ""}));
		audio.pause();
	};
	const pause = (audioPlaying) => {
		if (audioPlaying !== undefined) {
			const audio = document.querySelector(audioPlaying);
			audio.pause();
			dispatch(timestamp({timestamp: audio.currentTime, audio: audioPlaying}));
			dispatch(isPlaying(false));
		}
	};
	const resume = () => {
		if (currentAudio !== undefined) {
			let audio = document.querySelector(currentAudio);
			audio.volume = 0.1;
			dispatch(timestamp({timestamp: audio.currentTime, audio: currentAudio}));
			dispatch(isPlaying(true));
			audio.play();
		}
	};
	return {start, stop, pause, resume};
};

export default useMusic;
