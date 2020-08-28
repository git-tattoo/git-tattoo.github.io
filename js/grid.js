let current_color_idx = null;

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

export let color_map = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
};

function global_mouse_handlers() {
  document.body.addEventListener("mouseup", e => {
    current_color_idx = null;
  });
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

export function grid_init() {
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

  global_mouse_handlers();
}
