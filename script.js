
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

current_color_idx = null;

color_map = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
}

preset_map = {
  "HIRE ME": [
      "00000000000000000000000000000000000000000000000000000",
      "00004100410444440044441004444400000040004104444400000",
      "00004100410004100041004104100000000044044104100000000",
      "00004444410004100044440004444400000041404104444400000",
      "00004100410004100041004104100000000041004104100000000",
      "00004100410444440041004104444400000041004104444400000",
      "00000000000000000000000000000000000000000000000000000",
  ],

  "FADE": [
      "00011122233344433322211100011122233344433322211100000",
      "00011122233344433322211100011122233344433322211100000",
      "00011122233344433322211100011122233344433322211100000",
      "00011122233344433322211100011122233344433322211100000",
      "00011122233344433322211100011122233344433322211100000",
      "00011122233344433322211100011122233344433322211100000",
      "00011122233344433322211100011122233344433322211100000",
  ],

  "EYES": [
      "00020000000000000000000000000000000000000000000020000",
      "00020000000333333333000000000000033333333300000020000",
      "00120000003111444111300000000000311144411130000021000",
      "00120000031114444411130001100003111444441113000021000",
      "00120000003111444111300001100000311144411130000021000",
      "00020000000333333333000002200000033333333300000020000",
      "00020000000000000000000022220000000000000000000020000",
  ],

  "MAZE": [
      "41414141414141414141414141414141414141414141414141414",
      "14141414141414141414141414141414141414141414141414141",
      "41414141414141414141414141414141414141414141414141414",
      "14141414141414141414141414141414141414141414141414141",
      "41414141414141414141414141414141414141414141414141414",
      "14141414141414141414141414141414141414141414141414141",
      "41414141414141414141414141414141414141414141414141414",
  ],
}

/* Advances stored color for rect x */
function increment(rect, overflow) {
  let coloridx = parseInt(rect.getAttribute("data-coloridx")) + 1;

  if (overflow) {
    coloridx = coloridx % Object.keys(color_map).length;
  } else {
    coloridx = Math.min(coloridx, Object.keys(color_map).length - 1);
  }

  setcolor(rect, coloridx);
  return coloridx;
}

function setcolor(rect, coloridx) {
  rect.setAttribute("data-coloridx", coloridx);
  rect.style.fill = color_map[coloridx];
}
function clear(rect) {
  setcolor(rect, 0)
}

function apply_preset(key) {
  let svg = document.getElementById("git-grid");
  let i = 0;
  for (const [week_idx, week] of svg.childNodes.entries()) {
    if (week.nodeName != "#text") {
      for (const [weekday_idx, weekday] of week.childNodes.entries()) {
        if (weekday.nodeName != "#text") {
          setTimeout(() => {
            weekday.style.fill = color_map[preset_map[key][weekday_idx][week_idx]];
          }, 3 * i + 100);

          setTimeout(() => {
            weekday.style.fill = color_map[i % 5];
          }, 3 * i);
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
      rect.onmousedown = (e) => {
        if (!e.shiftKey) {
          current_color_idx = increment(rect, true /* overflow */);
        } else {
          clear(rect);
        }
      }

      rect.addEventListener("mouseenter", (e) => {
        if (e.buttons !== 1) {
          return;
        }

        if (!e.shiftKey) {
          if (current_color_idx === null) {
            current_color_idx = increment(rect, false /* overflow */);
          } else {
            setcolor(rect, current_color_idx, true /* at least */);
          }
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

function global_mouse_handlers() {
  document.body.addEventListener("mouseup", e => {
    current_color_idx = null;
  });
}

/* payment handling */
function pay() {
  console.log("Register click event -- pay button");
}

// main
create_presets();
generate_svg();
global_mouse_handlers();
