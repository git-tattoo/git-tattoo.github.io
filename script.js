/* 	Color reference chart:
	0: #ebedf0
	1: #c6e48b -> #9be9a8
	2: #7bc96f -> #40c463
	3: #239a3b -> #30a14e
	4: #196127 -> #216e39

	black: rgb(36, 41, 46);
	sub-heading grey: rgb(102, 102, 102);
	paragraph grey: rgb(88, 96, 105);;
*/

color_map = {
		0: "#ebedf0",
		1: "#9be9a8",
		2: "#40c463",
		3: "#30a14e",
		4: "#216e39",
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