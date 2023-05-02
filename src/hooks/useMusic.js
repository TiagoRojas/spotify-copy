import {useDispatch, useSelector} from "react-redux";
import {isPlaying, timestamp, changeMusic} from "../store/slice/spotifySlice";
import Swal from "sweetalert2";
const useMusic = () => {
	const dispatch = useDispatch();
	const userData = useSelector((state) => state.data.userData);
	let currentAudio = useSelector((state) => state.spotifyData.currentPlaying.audio);
	let volume = useSelector((state) => state.spotifyData.volume);
	const start = ({i, item, music}) => {
		if (music === null) {
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
		const seeker = document.querySelector("#seeker");
		audio.currentTime = 0;
		audio.volume = volume;
		dispatch(isPlaying(true));
		audio.play();
		audio.addEventListener("timeupdate", (e) => {
			audio.onended = () => {
				dispatch(isPlaying(false));
				document.title = userData.display_name + " - Spotify";
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
			console.log(volume);
			dispatch(timestamp({timestamp: audio.currentTime, audio: currentAudio}));
			dispatch(isPlaying(true));
			audio.play();
		}
	};
	const reset = () => {
		dispatch(changeMusic());
	};
	return {start, stop, pause, resume, reset};
};

export default useMusic;
