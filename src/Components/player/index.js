import "./style.css";
import {useDispatch, useSelector} from "react-redux";
import {changeVolume, timestamp, changeLoop} from "../../store/slice/spotifySlice";
import PlayerBtn from "../../assets/playerBtn.png";
import PauseBtn from "../../assets/pauseBtn.png";
import volumeNormal from "../../assets/volumeNormal.png";
import volumeMuted from "../../assets/volumeMuted.png";
import loopIcon from "../../assets/loopIcon.png";
import loopIconActive from "../../assets/loopIconActive.png";
import useMusic from "../../hooks/useMusic";
import {useEffect} from "react";

export default function Player() {
	const dispatch = useDispatch();
	let audioPlaying = useSelector((state) => state.spotifyData.currentPlaying.audio);
	let currentVolume = useSelector((state) => state.spotifyData.volume);
	let isPlaying = useSelector((state) => state.spotifyData.isPlaying);
	let nowPlaying = useSelector((state) => state.spotifyData.currentPlaying.item);
	let isLooping = useSelector((state) => state.spotifyData.isLooping) || false;
	let dispatchAudio;
	let volumeIcon = document.querySelector(".volumeIcon");
	const {pause, resume} = useMusic();

	const changeTime = (e) => {
		dispatch(timestamp({timestamp: e, audio: audioPlaying}));
	};

	const handleVolume = (e) => {
		clearTimeout(dispatchAudio);
		dispatchAudio = setTimeout(() => {
			dispatch(changeVolume(e));
			clearTimeout(dispatchAudio);
		}, 500);
		if (audioPlaying !== "") {
			let audio = document.querySelector(audioPlaying);
			audio.volume = e;
		}
		if (e == 0) {
			console.log(e);
			volumeIcon.src = volumeMuted;
		} else volumeIcon.src = volumeNormal;
	};

	const handleMute = () => {
		let audio = document.querySelector(audioPlaying);
		let audioControler = document.querySelector("#controlVolume");
		if (audio.volume === 0) {
			audio.volume = currentVolume;
			audioControler.value = currentVolume;
			volumeIcon.src = volumeNormal;
		} else {
			audio.volume = 0;
			audioControler.value = 0;
			volumeIcon.src = volumeMuted;
		}
	};
	useEffect(() => {
		if (isPlaying) {
			let audio = document.querySelector(audioPlaying);
			let loopElement = document.querySelector(".loopIcon");
			if (isLooping === true) {
				audio.loop = true;
				loopElement.src = loopIconActive;
			} else {
				audio.loop = false;
				loopElement.src = loopIcon;
			}
		}
		return;
	}, [isLooping]);
	const handleLoop = () => {
		dispatch(changeLoop(!isLooping));
	};

	const playerMusic = () => {
		if (audioPlaying !== "") {
			isPlaying === true ? pause(audioPlaying) : resume(audioPlaying);
		}
	};
	useEffect(() => {
		document.querySelector("#controlVolume").value = currentVolume;
		document.querySelector("#seeker").value = 0;
	}, [nowPlaying]);
	return (
		<div className="grid grid-cols-3 grid-rows-1 fixed bottom-0 w-full md:h-32 sm:h-16 flex-shrink-0 bg-zinc-900 border-t border-zinc-700 text-white z-10">
			<div className="flex flex-row items-center">
				{nowPlaying.musicName !== undefined ? (
					<>
						<img src={nowPlaying.img} className="w-16 h-16 mr-6" />
						<div>
							<p className="text-white">{nowPlaying.musicName}</p>
							<div className="flex flex-row">
								{nowPlaying.autors.map((item, i) => (
									<p className="text-gray-500 text-sm">
										{item.name}
										{i < 1 ? <i className="pr-1">,</i> : ""}
									</p>
								))}
							</div>
						</div>
					</>
				) : null}
			</div>
			<div className="flex justify-center items-center flex-col">
				<input type="range" max={29.779592} min={0} step={0.01} onInput={(e) => changeTime(e.target.value)} id="seeker" className="w-full py-5 " />
				<div>
					<img src={isPlaying ? PauseBtn : PlayerBtn} onClick={() => playerMusic()} className="w-16 h-auto" />
				</div>
			</div>
			<div className="flex flex-row items-center ">
				<img src={loopIcon} className="w-6 h-6 mr-4 loopIcon" onClick={() => handleLoop()} />
				<img src={volumeNormal} className="w-6 h-6 invert mr-4 volumeIcon" onClick={() => handleMute()} />
				<input type="range" max={0.35} min={0} step={0.001} onInput={(e) => handleVolume(e.target.value)} id="controlVolume" />
			</div>
		</div>
	);
}
