import React, {useEffect} from "react";
import {useLazyCheckTrackExistQuery} from "../../store/api/spotifyApi";
import {useSelector} from "react-redux";
import heartFilled from "../../assets/heartFilled.png";
import heart from "../../assets/heart.png";
function CheckComponent({ids}) {
	const [checkTrackExist, results] = useLazyCheckTrackExistQuery();

	const code = useSelector((state) => state.data.code);
	useEffect(() => {
		checkTrackExist({id: ids, token: code});
	}, []);
	useEffect(() => {
		if (results.data !== undefined) {
			results.data.map((item, i) => {
				let heartElement = document.querySelector(".heart" + i);
				if (item) {
					heartElement.src = heartFilled;
				} else heartElement.src = heart;
			});
		}
	}, [results]);
}

export default CheckComponent;
