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

export default function PlayPreview({music, img, name, i, id, token}) {
	const playing = useSelector((state) => state.spotifyData.isPlaying);
	let valueTime = useSelector((state) => state.spotifyData.timestamp);
	let currentAudio = useSelector((state) => state.spotifyData.currentAudio);
	const dispatch = useDispatch();
	const [currentPlaying, setCurrentPlaying] = useState();
	const [checkId, setCheckId] = useState();
	const {start, stop} = useMusic();
	const {refetch, data} = useCheckTrackExistQuery({id: checkId, token}, {manual: true});

	// This function start from 0 the track and adds to "currentPlaying" variable so the ternary operator from "return" change what's returning
	const startPlay = ({index}) => {
		let audio = document.querySelector(`.audio${index}`);
		setCurrentPlaying("." + audio.classList[0]);
		if (currentPlaying !== currentAudio) {
			start(index);
		} else {
			stop(index);
			setCurrentPlaying("");
		}
	};

	// This function resets and stop the music
	const handleReset = ({index}) => {
		stop(index);
	};

	// This useEffect is executing every time the variable data changes replaces the "heart button" src if user has the track added to favorites
	useEffect(() => {
		let image = document.querySelector(".heart" + i);
		if (data === undefined) {
			return;
		}
		if (data[0] === true) {
			image.src = heartFilled;
		} else {
			image.src = heart;
		}
	}, [data]);

	// This function is checking on image load if user has the track added to favorites on Spotify
	const checkFavorite = () => {
		let image = document.querySelector(".heart" + i);
		setCheckId(id);
		refetch(id);
	};

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
		<div className={"flex flex-row items-center divtest" + i} onClick={() => startPlay({index: i})} key={"playPreview" + i}>
			<audio src={music} className={`audio${i}`} onEnded={() => handleReset({index: i})} />
			<img
				src={img}
				alt={name}
				className="imagePlayer"
				onLoad={(e) => {
					checkFavorite();
				}}
			/>
			{playing && currentPlaying === currentAudio ? (
				<ProgressProvider valueStart={0} valueEnd={valueTime}>
					{(value) => <CircularProgressbar value={value} maxValue={29.779592} className="musicRadial" />}
				</ProgressProvider>
			) : (
				<img src={playButton} alt="playbutton" className="playButton" />
			)}
		</div>
	);
}
