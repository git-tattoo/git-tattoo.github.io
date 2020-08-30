import { error, success, focus_form_input, focus_form_line, loading, show_overlay } from './layout.js';
import { get_tattoo } from './tattoo.js';

const stripe = Stripe('pk_test_51H9IkdBov8cpWbK0dibeYhICML2GZTiqpnb89DuuJlkUEcHlZ6BADH1TP1ShwT1twlBLPpxdc72dTgsVdtBiiZjr00RL1VQRO0');
const api = "https://git-tattoo.herokuapp.com/";

/* payment handling */
function show_payment_form() {
  show_overlay("payform-overlay");
}

export function stripe_init() {
  // Setup payment
  const payform = document.getElementById("payform");
  payform.disabled = true;

  fetch(`${api}/payment_intent`, {
    method: "GET",
  })
  .then(res => res.json())
  .then(json => stripe_postinit(json))

  document.getElementById("tattoo-button").onclick = show_payment_form;

}

function stripe_postinit(data) {
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
  });

  // Add an instance of the card Element into the `card-element` <div>.
  card.mount('#stripe-card');

  // Setup submit button
  const form = document.getElementById("payform");
  form.onsubmit = (event) => {
    event.preventDefault();
    console.log(get_tattoo());
    pay_with_card(document.getElementById("username").value,
                  document.getElementById("email").value,
                  get_tattoo(),
                  card,
                  data.client_secret);
  }
}

function pay_with_card(username, email, tattoo, card, client_secret) {
  loading(true);

  console.log(`paying ${username} ${email} ${card} ${client_secret}`);

  stripe.confirmCardPayment(client_secret,
    {
      payment_method: {card},
      receipt_email: email,
    }
  ).then(result => {
    if (result.error) {
      error(result.error.message);
    } else {
      console.log(result);
      success(email);

      fetch(`${api}/paint_tattoo`, {
        method: "POST",
        body: JSON.stringify({
          id: result.paymentIntent.id,
          username,
          email,
          tattoo,
        })
      })
    }
  });
}
