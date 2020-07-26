
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

const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

var current_color_idx = null;
var preset_preview_idx = 0;

color_map = {
  0: "#ebedf0",
  1: "#9be9a8",
  2: "#40c463",
  3: "#30a14e",
  4: "#216e39",
}

preset_map = {
  "Hire Me": [
      "00000000000000000000000000000000000000000000000000000",
      "00004100410444440044441004444400000040004104444400000",
      "00004100410004100041004104100000000044044104100000000",
      "00004444410004100044440004444400000041404104444400000",
      "00004100410004100041004104100000000041004104100000000",
      "00004100410444440041004104444400000041004104444400000",
      "00000000000000000000000000000000000000000000000000000",
  ],

  "Fade": [
      "00011122233344433322211100011122233344433322211100011",
      "00111222333444333222111000111222333444333222111000111",
      "01112223334443332221110001112223334443332221110001112",
      "11122233344433322211100011122233344433322211100011122",
      "11222333444333222111000111222333444333222111000111222",
      "12223334443332221110001112223334443332221110001112223",
      "22233344433322211100011122233344433322211100011122233",
  ],

  "Eyes": [
      "00020000000000000000000000000000000000000000000020000",
      "00020000000333333333000000000000033333333300000020000",
      "00120000003111444111300000000000311144411130000021000",
      "00120000031114444411130001100003111444441113000021000",
      "00120000003111444111300001100000311144411130000021000",
      "00020000000333333333000002200000033333333300000020000",
      "00020000000000000000000022220000000000000000000020000",
  ],

  "Checkerboard": [
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

function click_preset_button(key) {
  preset_preview_idx = null;
  did_click_preset = true;
  apply_preset(key);
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
            weekday.style.fill = color_map[i % Object.keys(color_map).length];
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
    button.onclick = () => click_preset_button(key);

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
function show_payment_form() {
  const payform_overlay = document.getElementById("payform_overlay");
  payform_overlay.classList.add("shown");
}

function setup_preview() {
  let next_preview = () => {
    if (preset_preview_idx !== null) {
      let preset = Object.keys(preset_map)[preset_preview_idx];
      apply_preset(preset);
      preset_preview_idx = (preset_preview_idx + 1) % Object.keys(preset_map).length;
    }
  };
  setInterval(next_preview, 3000);
  next_preview();
}

function setup_overlay() {
  // const payform = document.getElementById("payform");
  for (const overlay of document.getElementsByClassName("overlay")) {
    overlay.onclick = (event) => {
      if (event.target === overlay) {
        overlay.classList.remove("shown");
      }
    }
  }

  for (const form_input of document.getElementsByClassName("form-input")) {
    form_input.onfocus = () => {focus_form_input(form_input)};
  }
}

function setup_stripe() {
  // Create an instance of Elements.
  var elements = stripe.elements();

  // Custom styling can be passed to options when creating an Element.
  // (Note that this demo uses a wider set of styles than the guide below.)
  var style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '14px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  // Create an instance of the card Element.
  var card = elements.create('card', {style: style});
  card.on("focus", () => {focus_form_input(document.getElementById("payform-stripe"))});

  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#payform-stripe');
}

function focus_form_input(el) {
  while (el.parentElement !== undefined) {
    el = el.parentElement;
    if (el.classList.contains("form-line")) {
      focus_form_line(el);
      return;
    }
  }
}

function focus_form_line(form_line) {
  for (const other_form_line of document.getElementsByClassName("form-line")) {
    other_form_line.classList.remove("focused-form-line");
  }
  form_line.classList.add("focused-form-line");
}

// main
create_presets();
generate_svg();
global_mouse_handlers();
setup_preview();
setup_overlay();
setup_stripe();
