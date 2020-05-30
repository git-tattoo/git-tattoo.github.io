/* 	Color reference chart:
	0: #ebedf0
	1: #c6e48b
	2: #7bc96f
	3: #239a3b
	4: #196127
*/

color_map = {
		0: "#ebedf0",
		1: "#c6e48b",
		2: "#7bc96f",
		3: "#239a3b",
		4: "#196127",
	}

/* Advances stored color for rect x */
function increment(x) {
	if (typeof x.getAttribute("data-count") != "string") {
		x.setAttribute("data-count", 0);
	}
	let count = (parseInt(x.getAttribute("data-count")) + 1) % 5;
	x.setAttribute("data-count", count);
	x.style.fill = color_map[count];
}


/* payment handling */
function pay() {
	console.log("Register click event -- pay button");
}