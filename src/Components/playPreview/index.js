import "react-circular-progressbar/dist/styles.css";
import "./style.css";
import playButton from "../../assets/playButton.png";
import {CircularProgressbar} from "react-circular-progressbar";
import ProgressProvider from "../ProgressProvider";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import useMusic from "../../hooks/useMusic";
import {useCheckTrackExistQuery} from "../../store/api/spotifyApi";
import heart from "../../assets/heart.png";
import heartFilled from "../../assets/heartFilled.png";

export default function PlayPreview({music, img, musicName, autors, i, token, checkId}) {
	const playing = useSelector((state) => state.spotifyData.isPlaying);
	let valueTime = useSelector((state) => state.spotifyData.timestamp);
	let currentAudio = useSelector((state) => state.spotifyData.currentPlaying.audio);
	const dispatch = useDispatch();
	const [playingNow, setPlayingNow] = useState();
	const {start, stop} = useMusic();
	const {refetch, data} = useCheckTrackExistQuery({id: checkId, token});

	// This function start from 0 the track and adds to "playingNow" variable so the ternary operator from "return" change what's returning
	const startPlay = () => {
		let audio = document.querySelector(`.audio${i}`);
		setPlayingNow("." + audio.classList[0]);
		if (playingNow !== currentAudio) {
			start({i, item: {musicName, img, autors}});
		} else {
			stop(i);
			setPlayingNow("");
		}
	};

	// This function resets and stop the music
	const handleReset = ({index}) => {
		stop(index);
	};

	useEffect(() => {
		// This part is checking if data is true or false depending if user has the track added to favorites on Spotify and changes the image heart src
		if (data !== undefined) {
			data.map((checked, i) => {
				let image = document.querySelector(".heart" + i);
				if (checked) {
					image.src = heartFilled;
				} else image.src = heart;
			});
		}
		//This part check if checkIdList length is exactly 10, and if is true then refetch with checkIdList
		if (checkId.length === 10) {
			refetch();
		}
	}, [data, checkId]);

	// This is for detecting if one audio is playing at the moment so the others stops
	const audios = document.querySelectorAll("audio");
	function pauseOtherAudios({target}) {
		for (const audio of audios) {
			if (audio !== target) {
				audio.pause();
			}
		}
	}
	for (const audio of audios) {
		audio.addEventListener("play", pauseOtherAudios);
	}

	return (
		<div className={"flex flex-row items-center divtest" + i} onClick={() => startPlay()} key={"playPreview" + i}>
			<audio src={music} className={`audio${i}`} onEnded={() => handleReset({index: i})} />
			<img src={img} alt={musicName} className="imagePlayer" />
			{playing && playingNow === currentAudio ? (
				<ProgressProvider valueStart={0} valueEnd={valueTime}>
					{(value) => <CircularProgressbar value={value} maxValue={29.779592} className="musicRadial" />}
				</ProgressProvider>
			) : (
				<img src={playButton} alt="playbutton" className="playButton" />
			)}
		</div>
	);
}
