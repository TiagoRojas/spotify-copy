import React, {useEffect} from "react";
import {useSelector} from "react-redux";

function TrackView() {
	const trackInfo = useSelector((state) => state.spotifyData.trackView);
	const code = useSelector((state) => state.data.code);
	useEffect(() => {
		console.log(trackInfo);
		const url = trackInfo.url;
		fetch(url, {
			method: "GET",
			headers: {
				"content/type": "application/json",
				Authorization: `Bearer ${code}`
			}
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			});
	}, []);
	return <div>TrackView</div>;
}

export default TrackView;
