import {useLocation} from "react-router-dom";

export function millisToMinutesAndSeconds(millis) {
	let minutes = Math.floor(millis / 60000);
	let seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
export function handleScroll({currentMode}) {
	if (currentMode === "online") {
		let scrollPosition = window.scrollY;
		let searchElement = document.querySelector(".searchElement");
		if (searchElement === null) return;
		if (scrollPosition > 77) {
			searchElement.classList.add("bg-zinc-900");
		} else {
			searchElement.classList.remove("bg-zinc-900");
		}
	} else return;
}
export function createRandomString(length) {
	let chars = "0123456789ABCDEF",
		color = "";
	for (let i = 0; i < length; i++) {
		color += chars[Math.floor(Math.random() * 16)];
	}
	return "#" + color;
}
