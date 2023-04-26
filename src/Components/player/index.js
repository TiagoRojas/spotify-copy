import "./style.css";
import {useDispatch, useSelector} from "react-redux";
import {changeVolume, timestamp, changeLoop} from "../../store/slice/spotifySlice";
import PlayerBtn from "../../assets/playerBtn.png";
import PauseBtn from "../../assets/pauseBtn.png";
import volumeNormal from "../../assets/volumeNormal.png";
import volumeHalf from "../../assets/volumeHalf.png";
import volumeLow from "../../assets/volumeLow.png";
import volumeMuted from "../../assets/volumeMuted.png";
import loopIcon from "../../assets/loopIcon.png";
import loopIconActive from "../../assets/loopIconActive.png";
import useMusic from "../../hooks/useMusic";
import {useEffect} from "react";
import {useState} from "react";

export default function Player() {
	const dispatch = useDispatch();
	let audioPlaying = useSelector((state) => state.spotifyData.currentPlaying.audio);
	let currentVolume = useSelector((state) => state.spotifyData.volume);
	let isPlaying = useSelector((state) => state.spotifyData.isPlaying);
	let currentTime = useSelector((state) => state.spotifyData.timestamp);
	const [audioTime, setAudioTime] = useState(0);
	let nowPlaying = useSelector((state) => state.spotifyData.currentPlaying.item);
	let isLooping = useSelector((state) => state.spotifyData.isLooping) || false;
	let dispatchAudio;
	let volumeIcon = document.querySelector(".volumeIcon");
	const {pause, resume} = useMusic();

	const changeTime = (e) => {
		setAudioTime(e);
	};
	let number;
	const handleVolume = (e) => {
		changeVolumeIcon(e);
		clearTimeout(dispatchAudio);
		dispatchAudio = setTimeout(() => {
			dispatch(changeVolume(e));
			clearTimeout(dispatchAudio);
		}, 500);
		if (audioPlaying !== "") {
			let audio = document.querySelector("." + audioPlaying);
			audio.volume = e;
		}
	};
	const changeVolumeIcon = (e) => {
		if (e == 0) {
			volumeIcon.src = volumeMuted;
		}
		if (e > 0) {
			volumeIcon.src = volumeLow;
		}
		if (e >= 0.1) {
			volumeIcon.src = volumeHalf;
		}
		if (e > 0.24) {
			volumeIcon.src = volumeNormal;
		}
	};
	const handleMute = () => {
		let audioControler = document.querySelector("#controlVolume");
		if (audioPlaying === "") {
			if (currentVolume > 0) {
				dispatch(changeVolume(0));
				volumeIcon.src = volumeMuted;
				audioControler.value = 0;
			} else {
				dispatch(changeVolume(0.1));
				audioControler.value = 0.1;
				volumeIcon.src = volumeLow;
			}
		} else {
			let audio = document.querySelector("." + audioPlaying);
			if (audio.volume === 0) {
				dispatch(changeVolume(currentVolume));
				audio.volume = currentVolume;
				audioControler.value = currentVolume;
				changeVolumeIcon(currentVolume);
			} else {
				audio.volume = 0;
				audioControler.value = 0;
				volumeIcon.src = volumeMuted;
			}
		}
	};
	useEffect(() => {
		if (isPlaying) {
			let audio = document.querySelector("." + audioPlaying);
			if (audio === null) return;
			let loopElement = document.querySelector(".loopIcon");
			if (isLooping === true) {
				audio.loop = true;
				loopElement.src = loopIconActive;
			} else {
				audio.loop = false;
				loopElement.src = loopIcon;
			}
		}
	}, [isLooping]);
	const handleLoop = () => {
		dispatch(changeLoop(!isLooping));
	};

	const playerMusic = () => {
		if (audioPlaying !== "") {
			isPlaying ? pause(audioPlaying) : resume(audioPlaying);
		}
	};
	useEffect(() => {
		document.querySelector("#controlVolume").value = currentVolume;
		document.querySelector("#seeker").value = 0;
		if (audioPlaying !== "") {
			let audio = document.querySelector("." + audioPlaying);
			if (audio === null) return;
			audio.addEventListener("timeupdate", () => setAudioTime(audio.currentTime));
		}
	}, [nowPlaying]);
	return (
		<div className="flex flex-col sm:grid grid-cols-3 grid-rows-1 fixed bottom-0 w-full sm:h-32 flex-shrink-0 bg-[#181818] border-t border-zinc-700 text-white z-40">
			<div className="hidden sm:block flex flex-row items-center ml-10">
				{nowPlaying.musicName !== undefined ? (
					<>
						{nowPlaying.img === undefined ? null : <img src={nowPlaying.img} className="w-16 h-16 mr-6" />}
						<div>
							<p className="text-white">{nowPlaying.musicName}</p>
							<div className="flex flex-row">
								{nowPlaying.autors.map((item, i) => (
									<p className="text-gray-500 text-sm">{i >= 1 ? `, ${item.name}` : item.name}</p>
								))}
							</div>
						</div>
					</>
				) : null}
			</div>
			<div className="flex justify-center items-center flex-col px-5 sm:px-0">
				<div className="w-full flex flex-row items-center">
					<p className="m-2 text-white text-[0.9rem]">0:{audioTime < 10 ? "0" + Math.floor(audioTime) : Math.floor(audioTime)}</p>
					<input type="range" max={29.779592} min={0} step={0.01} onInput={(e) => changeTime(e.target.value)} id="seeker" className="w-full py-5" />
					<p className="m-2 text-white text-[0.9rem]">0:30</p>
				</div>
				<div>
					<img src={isPlaying ? PauseBtn : PlayerBtn} onClick={() => playerMusic()} className="w-16 h-auto" />
				</div>
			</div>
			<div className="flex flex-row items-center justify-center sm:justify-self-end mr-10 pb-5">
				<img src={loopIcon} className="w-6 h-6 mr-4 loopIcon" onClick={() => handleLoop()} title="Activar repetición" />
				<img
					src={volumeHalf}
					className="w-6 h-6 invert mr-4 volumeIcon"
					onClick={() => handleMute()}
					title={currentVolume === 0 ? "Desactivar silenciar" : "silenciar"}
				/>
				<input type="range" max={0.35} min={0} step={0.001} onInput={(e) => handleVolume(e.target.value)} id="controlVolume" />
			</div>
		</div>
	);
}
