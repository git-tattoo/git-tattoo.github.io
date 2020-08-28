import { color_map } from './grid.js';

let preset_preview_idx = 0;

let preset_map = {
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
};

function click_preset_button(key) {
  preset_preview_idx = null;
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


function presets_auto_preview() {
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

export function presets_init() {
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

  presets_auto_preview();
}
