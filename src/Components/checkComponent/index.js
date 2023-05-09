import {useEffect, useState} from "react";
import {useLazyCheckTrackExistQuery} from "../../store/api/spotifyApi";
import {useDispatch, useSelector} from "react-redux";
import heartFilled from "../../assets/heartFilled.png";
import heart from "../../assets/heart.png";
import {changeData} from "../../store/slice/spotifySlice";
function CheckComponent({ids}) {
	const [checkTrackExist, results] = useLazyCheckTrackExistQuery();
	const code = useSelector((state) => state.data.code);
	const [checked, setChecked] = useState([]);
	const dispatch = useDispatch();
	useEffect(() => {
		if (ids < 50) {
			checkTrackExist({id: ids, token: code});
		} else {
			const half = Math.ceil(ids.length / 2);
			let firstHalf = ids.slice(0, half);
			let secondHalf = ids.slice(half);
			checkTrackExist({id: firstHalf, token: code});
			setTimeout(() => {
				checkTrackExist({id: secondHalf, token: code});
			}, 1000);
		}
	}, []);
	useEffect(() => {
		if (!results.isFetching && results.isSuccess) {
			setChecked([...checked, ...results.data]);
		}
	}, [results]);
	useEffect(() => {
		if (checked.length === ids.length) {
			checked.map((item, i) => {
				let heartElement = document.querySelector(".heart" + i);
				if (item) {
					heartElement.src = heartFilled;
				} else {
					heartElement.src = heart;
				}
			});
		} else return;
	}, [checked]);
}

export default CheckComponent;
