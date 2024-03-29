export function millisToMinutesAndSeconds(millis) {
	let minutes = Math.floor(millis / 60000);
	let seconds = ((millis % 60000) / 1000).toFixed(0);
	return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}
export function formatSecondsAsTime(secs) {
	let hr = Math.floor(secs / 3600);
	let min = Math.floor((secs - hr * 3600) / 60);
	let sec = Math.floor(secs - hr * 3600 - min * 60);
	if (sec < 10) {
		sec = "0" + sec;
	}
	return min + ":" + sec;
}
export function generateRandomGradient() {
	return `linear-gradient(180deg, ${createRandomString(6)} 0%, rgba(0,0,0,0) 100%)`;
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
