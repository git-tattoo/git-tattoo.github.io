import { setcolor } from './grid.js';

function overlay_links(ids) {
  for (const id of ids) {
    for (const link of document.getElementsByClassName(`${id}-link`)) {
      link.onclick = () => show_overlay(`${id}-overlay`);
    }
  }
}

export function focus_form_input(el) {
  while (el.parentElement !== undefined) {
    el = el.parentElement;
    if (el.classList.contains("form-line")) {
      focus_form_line(el);
      return;
    }
  }
}

export function focus_form_line(form_line) {
  for (const other_form_line of document.getElementsByClassName("form-line")) {
    other_form_line.classList.remove("focused-form-line");
  }
  form_line.classList.add("focused-form-line");
}

function clear_overlays() {
  for (const overlay of document.getElementsByClassName("overlay")) {
    overlay.classList.remove("shown");
  }
}

export function show_overlay(id) {
  clear_overlays();
  document.getElementById(id).classList.add("shown");
}

export function layout_init() {
  for (const overlay of document.getElementsByClassName("overlay")) {
    overlay.onclick = (event) => {
      if (event.target === overlay && !is_loading) {
        overlay.classList.remove("shown");
      }
    }
  }

  for (const overlay of document.getElementsByClassName("overlay")) {
    overlay.onclick = (event) => {
      if (event.target === overlay && !is_loading) {
        overlay.classList.remove("shown");
      }
    }
  }

  for (const form_input of document.getElementsByClassName("form-input")) {
    form_input.onfocus = () => {focus_form_input(form_input)};
  }

  overlay_links(["faq", "draw"]);
  loading_init();
  document.getElementById("success").style.display = "none";
  document.getElementById("error").style.display = "none";
}

function loading_init() {
  let loading_div = document.getElementById("loading-div");
  let loading_svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  loading_svg.id = "loading-svg";
  loading_svg.style.height = "10px";
  loading_svg.style.width = "88px";

  for (let x = 0; x <= 78; x += 13) {
    let rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.style.height = "10px";
    rect.style.width = "10px";
    rect.style.x = x;
    setcolor(rect, 0);
    rect.classList.add("day");
    loading_svg.appendChild(rect);
  }

  loading_div.appendChild(loading_svg);

  setInterval(loading_animation, 50);
  loading(false);
}

let loading_idx = 0;
function loading_animation() {
  loading_idx += 1;
  let svg = document.getElementById("loading-svg");
  let nodes = svg.childNodes;
  setcolor(nodes[loading_idx % nodes.length], Math.floor(loading_idx / 7) % 5);
}


export function error(msg) {
  loading(false);
  document.getElementById("error-text").innerHTML = msg;
  document.getElementById("success").style.display = "none";
  document.getElementById("error").style.display = "block";
}

export function success(email) {
  loading(false);
  document.getElementById("error").style.display = "none";
  document.getElementById("payform").style.display = "none";
  document.getElementById("success").style.display = "block";
  document.getElementById("success-email").innerHTML = email;
}

let is_loading = false;
export function loading(should_show) {
  is_loading = should_show;
  if (is_loading) {
    document.getElementById("pay-button").style.display = "none";
    document.getElementById("loading").style.display = "flex";
  } else {
    document.getElementById("pay-button").style.display = "block";
    document.getElementById("loading").style.display = "none";
  }
}
