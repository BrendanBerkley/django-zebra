
$(function() {
  var iOSCheck = false;
  var cardField = $("#id_card_number");

  if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) { // This could be more elegant; should sniff iOS 7.x specifically
    iOSCheck = true;
  }

  if (iOSCheck == true) {
    $("#id_card_number").attr('id','workaround-one'); // Rename ID. Nondescript name.
    $('#workaround-one').attr('autocomplete','off'); // Turn off autocomplete
    
    $("#w1-label").after('<div class="simulate-label">Credit Card</div>'); // Kill the label. Append the text,
    $("#w1-label").remove(); // Then remove the label. That way the text in the label doesn't link to the CC field.
    
    cardField = $('#workaround-one'); // Redefine our credit card field so we can reference it below.
  }

  cardField.parents("form").submit(function() {
    if ( cardField.is(":visible") ) {
      var form = this;
      var card = {
        number:   cardField.val(),
        expMonth: $("#id_card_expiry_month").val(),
        expYear:  $("#id_card_expiry_year").val(),
        cvc:      $("#id_card_cvv").val()
      };

      Stripe.createToken(card, function(status, response) {
        if (status === 200) {
          //console.log(status, response);
          $("#credit-card-errors").hide();
          $("#id_last_4_digits").val(response.card.last4);
          $("#id_stripe_token").val(response.id);
          form.submit();
          
          $("button[type=submit]").attr("disabled","disabled").html("Submitting..")
        } else {
          $(".payment-errors").text(response.error.message);
          $("#user_submit").attr("disabled", false);
        }
      });
      
      return false;
      
    } 
    
    return true;
    
  });
});
