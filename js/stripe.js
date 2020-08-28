import { focus_form_input, focus_form_line, show_overlay } from './layout.js';

const stripe = Stripe('pk_test_TYooMQauvdEDq54NiTphI7jx');

/* payment handling */
function show_payment_form() {
  show_overlay("payform-overlay");
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
    card.on("focus", () => focus_form_input(document.getElementById("stripe-card")));

    card.on("change", function (event) {
      // Disable the Pay button if there are no card details in the Element
      document.querySelector("#pay-button").disabled = event.empty;
      document.querySelector("#card-error").textContent = event.error ? event.error.message : "";
    });


    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#stripe-card');
  })

  document.getElementById("tattoo-button").onclick = show_payment_form;
}

