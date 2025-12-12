// PAYPAL SUBSCRIPTION TEST SCRIPT

document.addEventListener("DOMContentLoaded", function () {
  paypal.Buttons({
    style: {
      shape: "rect",
      color: "gold",
      layout: "vertical",
      label: "subscribe",
    },

    createSubscription: function (data, actions) {
      return actions.subscription.create({
        plan_id: "P-4PR01064KE522260HNDPDC6Q", // Your Plan ID
      });
    },

    onApprove: function (data, actions) {
      alert("Subscription ID: " + data.subscriptionID);
      console.log("Subscription Approved:", data);
    },

    onError: function (err) {
      console.error("PayPal Error:", err);
      alert("An error occurred (See console)");
    },
  }).render("#paypal-button-container-P-4PR01064KE522260HNDPDC6Q");
});
