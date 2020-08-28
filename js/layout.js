function overlay_clear() {

}

function overlay_links(ids) {
  for (const id of ids) {
    console.log(id);
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

export function show_overlay(id) {
  document.getElementById(id).classList.add("shown");
}

export function layout_init() {
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

  overlay_links(["faq", "draw"]);
}
