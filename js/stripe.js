const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

/* payment handling */
function show_payment_form() {
  const payform_overlay = document.getElementById("payform_overlay");
  payform_overlay.classList.add("shown");
}

export function stripe_init() {
  // Setup payment
  const payform = document.getElementById("payform");
  payform.disabled = true;

  fetch("https://api.gittattoo.com/payment_intent", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(function(response) {
    return response.json();
  })
  .then(function(json) {
    // Create an instance of Elements.
    const elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    const style = {
      base: {
        color: '#32325d',
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: 'never',
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
    const card = elements.create('card', {style: style});
    card.on("focus", () => {focus_form_input(document.getElementById("stripe-card"))});

    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector("#pay-button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });


    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#stripe-card');
  })
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
