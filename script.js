
/*  Color reference chart:
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

preset_map = {
  "HIRE ME": new Array(371).fill(0),
  "RANDOM 1": new Array(371).fill(0),
  "RANDOM 2": new Array(371).fill(0),
  "RANDOM 3": new Array(371).fill(0),
  "RANDOM 4": new Array(371).fill(0),
  "RANDOM 5": new Array(371).fill(0),
  "RANDOM 6": new Array(371).fill(0),
  "RANDOM 7": new Array(371).fill(0),
}

/* Advances stored color for rect x */
function increment(rect, overflow) {
  let coloridx = parseInt(rect.getAttribute("data-coloridx")) + 1;

  if (overflow) {
    coloridx = coloridx % Object.keys(color_map).length;
  } else {
    coloridx = Math.min(coloridx, Object.keys(color_map).length - 1);
  }

  rect.setAttribute("data-coloridx", coloridx);
  rect.style.fill = color_map[coloridx];
}

function clear(rect) {
  rect.style.fill = color_map[0];
  rect.setAttribute("data-coloridx", 0);
}

function apply_preset(key) {
  let svg = document.getElementById("git-grid");
  let i = 0;
  for (let g of svg.childNodes) {
    if (g.nodeName != "#text") {
      for (let r of g.childNodes) {
        if (r.nodeName != "#text") {
          r.style.fill = color_map[preset_map[key][i]];
          i += 1;
        }
      }
    }
  }
}

function create_presets() {
  let preset_grid = document.getElementById("presets");
  for (let [key, value] of Object.entries(preset_map)) {
    // make and attach a "preset" div
    let preset = document.createElement("div");
    preset.classList.add("preset");
    preset_grid.appendChild(preset);

    // make and attach a button
    let button = document.createElement("button");
    button.classList.add("button");
    // attach text to the button
    let text = document.createTextNode(key);
    button.appendChild(text);
    // attach an onclick function
    button.onclick = () => apply_preset(key);
    preset.appendChild(button);
  }
}

function generate_svg() {
  let git_grid = document.getElementById("git-grid-div");
  let svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.id = "git-grid";
  svg.style.height = "88px";
  svg.style.width = "738px";
  for (let x = 0; x <= 728; x+=14) {
    let g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("transform", `translate(${x}, 0)`);
    for (let y = 0; y <= 78; y+=13) {
      let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.style.height = "10px";
      rect.style.width = "10px";
      rect.style.y = y + "px";
      rect.setAttribute("data-coloridx", 0);
      rect.style.fill = color_map[0];
      rect.onclick = (e) => {
        if (!e.shiftKey) {
          increment(rect, true /* overflow */);
        } else {
          clear(rect);
        }
      }

      rect.addEventListener("mouseenter", (e) => {
        if (e.buttons !== 1) {
          return;
        }
        if (!e.shiftKey) {
          increment(rect, false /* overflow */);
        } else if (e.shiftKey) {
          clear(rect);
        }
      });
      rect.classList.add("day");
      g.appendChild(rect);
    }
    svg.appendChild(g);
  }
  git_grid.appendChild(svg);
}

/* payment handling */
function pay() {
  console.log("Register click event -- pay button");
}

// main
create_presets();
generate_svg();
