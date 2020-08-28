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
}

