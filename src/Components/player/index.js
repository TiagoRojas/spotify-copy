import "./style.css";
import {useDispatch, useSelector} from "react-redux";
import {changeVolume, timestamp, changeLoop} from "../../store/slice/spotifySlice";
import PlayerBtn from "../../assets/playerBtn.png";
import PauseBtn from "../../assets/pauseBtn.png";
import SkipBtn from "../../assets/skipBtn.png";
import volumeNormal from "../../assets/volumeNormal.png";
import volumeHalf from "../../assets/volumeHalf.png";
import volumeLow from "../../assets/volumeLow.png";
import volumeMuted from "../../assets/volumeMuted.png";
import loopIcon from "../../assets/loopIcon.png";
import loopIconActive from "../../assets/loopIconActive.png";
import useMusic from "../../hooks/useMusic";
import {useEffect} from "react";
import {useState} from "react";
import {formatSecondsAsTime} from "../complements";

export default function Player() {
	let currentVolume = useSelector((state) => state.spotifyData.volume);
	let isPlaying = useSelector((state) => state.spotifyData.isPlaying);
	let audioPlaying = useSelector((state) => state.spotifyData.currentPlaying.audio);
	let nowPlaying = useSelector((state) => state.spotifyData.currentPlaying.item);
	let isLooping = useSelector((state) => state.spotifyData.isLooping) || false;
	let dispatchAudio;
	const {pause, resume} = useMusic();
	const dispatch = useDispatch();
	const [audioTime, setAudioTime] = useState(0);
	const volumeIcon = document.querySelector(".volumeIcon");
	let audioControler = document.querySelector("#controlVolume");

	// This function changes volume icon, dispatch the volume selected and if the user is playing something then updates the song volume.
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

	// This function changes volume icon depending which the value is.
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

	// This functions change between mute or unmute the song or future song
	const handleMute = () => {
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
	const handleLoop = () => {
		dispatch(changeLoop(!isLooping));
	};
	// This useEffect executes every time the user is playing something and clicks the loop button, updates the song for looping until disables it
	useEffect(() => {
		let loopElement = document.querySelector(".loopIcon");
		let loopElementMobile = document.querySelector(".loopIconMobile");
		if (isLooping) {
			loopElement.src = loopIconActive;
			loopElementMobile.src = loopIconActive;
		} else {
			loopElement.src = loopIcon;
			loopElementMobile.src = loopIcon;
		}
		if (isPlaying) {
			let audio = document.querySelector("." + audioPlaying);
			if (audio === null) return;
			audio.loop = isLooping;
		}
	}, [isLooping]);

	// This function pause or resume the song if is one track on "cache"
	const playerMusic = () => {
		if (audioPlaying !== "") {
			isPlaying ? pause(audioPlaying) : resume(audioPlaying);
		}
	};

	// This useEffect executes every time the user changes the song, it updates seeker value, updates audio controler volume and updates audio current time so it can show on screen the current time of the song.
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
		<div className="flex flex-col md:grid grid-cols-3 grid-rows-1 fixed bottom-0 w-full sm:h-32 flex-shrink-0 bg-[#181818] border-t border-zinc-700 text-white z-40">
			<div className="hidden lg:flex flex-row items-center ml-10">
				{audioPlaying !== "" ? (
					<>
						{nowPlaying.img === undefined ? null : <img src={nowPlaying.img} className="w-16 h-16 mr-2 select-none" />}
						<div>
							<p className="text-white">{nowPlaying.musicName}</p>
							<div className="flex flex-row">
								{nowPlaying.autors.map((item, i) => (
									<p className="text-gray-500 text-sm" key={"playerAutorName" + i}>
										{i >= 1 ? `, ${item.name}` : item.name}
									</p>
								))}
							</div>
						</div>
					</>
				) : null}
			</div>
			<div className="flex justify-evenly md:justify-center items-center flex-col col-span-3 lg:col-span-1 px-5 sm:px-0 select-none">
				<div className="w-full flex flex-row items-center">
					<p className="m-2 text-white text-[0.9rem] timestamp">{audioPlaying !== "" ? formatSecondsAsTime(audioTime) : "0:00"}</p>
					<input
						type="range"
						max={audioPlaying !== "" ? document.querySelector("." + audioPlaying)?.duration : 30}
						min={0}
						step={0.01}
						onInput={(e) => setAudioTime(e.target.value)}
						id="seeker"
						className="w-full py-5"
					/>
					<p className="m-2 text-white text-[0.9rem]">{audioPlaying === "" ? "0:00" : formatSecondsAsTime(document.querySelector("." + audioPlaying)?.duration)}</p>
				</div>
				<div className="items-center grid grid-flow-col lg:flex w-full grid-cols-3">
					<img
						src={loopIcon}
						className="w-8 h-8 mr-4 loopIconMobile inline lg:hidden justify-self-center"
						onClick={() => dispatch(changeLoop(!isLooping))}
						title="Activar repetición"
					/>
					<div className="flex items-center mx-auto">
						<img src={SkipBtn} className="h-12 w-auto mx-1 rotate-[180deg] invert" />
						<img
							src={isPlaying ? PauseBtn : PlayerBtn}
							onClick={() => playerMusic()}
							className="h-16 w-auto cursor-pointer"
							title={isPlaying ? "Pausar" : "Reproducir"}
						/>
						<img src={SkipBtn} className="h-12 w-auto mx-1 invert" />
					</div>
				</div>
			</div>
			<div className="lg:flex flex-row items-center justify-center sm:justify-self-end mr-10 pb-5 hidden select-none">
				<img src={loopIcon} className="w-6 h-6 mr-4 loopIcon" onClick={() => handleLoop()} title="Activar repetición" />
				<img
					src={volumeHalf}
					className="w-6 h-6 invert mr-4 volumeIcon"
					onClick={() => handleMute()}
					title={currentVolume === 0 ? "Desactivar silenciar" : "Silenciar"}
				/>
				<input type="range" max={0.35} min={0} step={0.001} onInput={(e) => handleVolume(e.target.value)} id="controlVolume" />
			</div>
		</div>
	);
}
