import {useDispatch, useSelector} from "react-redux";
import {isPlaying, timestamp} from "../store/slice/spotifySlice";

const useMusic = () => {
	const dispatch = useDispatch();
	let a = useSelector((state) => state.spotifyData.currentAudio);
	let test;
	const start = (i) => {
		console.log("started");
		const audio = document.querySelector(`.audio${i}`);
		const seeker = document.querySelector("#seeker");
		audio.currentTime = 0;
		audio.volume = 0.1;
		dispatch(isPlaying(true));
		audio.play();
		audio.addEventListener("timeupdate", () => {
			seeker.oninput = () => {
				audio.currentTime = seeker.value;
			};
			seeker.value = audio.currentTime;

			dispatch(timestamp({timestamp: audio.currentTime, currentAudio: `.audio${i}`}));
		});
	};
	const stop = (i) => {
		const audio = document.querySelector(`.audio${i}`);
		audio.currentTime = 0;
		dispatch(isPlaying(false));
		dispatch(timestamp({timestamp: 0, currentAudio: ""}));

		audio.pause();
	};
	const pause = (audioPlaying) => {
		if (audioPlaying !== undefined) {
			const audio = document.querySelector(audioPlaying);
			audio.pause();
			dispatch(timestamp({timestamp: audio.currentTime, currentAudio: audioPlaying}));
			dispatch(isPlaying(false));
		}
	};
	const resume = (audioPlaying) => {
		if (a !== undefined) {
			let audio = document.querySelector(a);
			audio.volume = 0.1;
			dispatch(timestamp({timestamp: audio.currentTime, currentAudio: a}));
			dispatch(isPlaying(true));
			audio.play();
		}
	};
	return {start, stop, pause, resume};
};

export default useMusic;
