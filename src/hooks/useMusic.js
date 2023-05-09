import {useDispatch, useSelector} from "react-redux";
import {isPlaying, timestamp, changeMusic} from "../store/slice/spotifySlice";
import Swal from "sweetalert2";
const useMusic = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.data.userData);
	let currentAudio = useSelector((state) => state.spotifyData.currentPlaying.audio);
	let currentMusicName = useSelector((state) => state.spotifyData.currentPlaying.item.musicName);
	let looping = useSelector((state) => state.spotifyData.isLooping) || false;
	let volume = useSelector((state) => state.spotifyData.volume);
	const seeker = document.querySelector("#seeker");
	const timestampElement = document.querySelector(".timestamp");
	const start = ({i, item, music}) => {
		if (music === null || music === undefined) {
			const Toast = Swal.mixin({
				toast: true,
				position: "top-right",
				showConfirmButton: false,
				timer: 5000,
				timerProgressBar: false,
				background: "#18181b",
				color: "white",
				didOpen: (toast) => {
					toast.addEventListener("mouseenter", Swal.stopTimer);
					toast.addEventListener("mouseleave", Swal.resumeTimer);
				}
			});
			Toast.fire({
				icon: "warning",
				title: "Previsualizacion aun no añadida"
			});
			return;
		}
		document.title = item.musicName + " - Spotify";
		dispatch(changeMusic({name: item.itemId, item}));
		const audio = document.querySelector(`.audio${i}`);
		audio.currentTime = 0;
		audio.volume = volume;
		audio.loop = looping;
		dispatch(isPlaying(true));
		audio.play();
		audio.addEventListener("timeupdate", (e) => {
			audio.onended = () => {
				seeker.value = 0;
				timestampElement.innerHTML = "0:00";
				dispatch(isPlaying(false));
				if (userData.display_name !== undefined) {
					document.title = userData.display_name + " - Spotify";
				} else document.title = "Spotify";
				reset();
			};
			seeker.oninput = () => {
				audio.currentTime = seeker.value;
			};
			seeker.value = audio.currentTime;
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
			document.title = userData.display_name + " - Spotify";
			const audio = document.querySelector("." + audioPlaying);
			audio.pause();
			dispatch(timestamp({timestamp: audio.currentTime, audio: audioPlaying}));
			dispatch(isPlaying(false));
		}
	};
	const resume = () => {
		if (currentAudio !== undefined) {
			let audio = document.querySelector("." + currentAudio);
			audio.volume = volume;
			audio.loop = looping;
			document.title = currentMusicName + " - Spotify";
			dispatch(timestamp({timestamp: audio.currentTime, audio: currentAudio}));
			dispatch(isPlaying(true));
			audio.play();
			audio.addEventListener("timeupdate", (e) => {
				audio.onended = () => {
					seeker.value = 0;
					timestampElement.innerHTML = "0:00";
					dispatch(isPlaying(false));
					if (userData.display_name !== undefined) {
						document.title = userData.display_name + " - Spotify";
					} else document.title = "Spotify";
					reset();
				};
				seeker.oninput = () => {
					audio.currentTime = seeker.value;
				};
				seeker.value = audio.currentTime;
			});
		}
	};
	const reset = () => {
		dispatch(changeMusic());
		dispatch(isPlaying(false));
	};
	return {start, stop, pause, resume, reset};
};

export default useMusic;
