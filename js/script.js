$(document).ready(function(){

//Hide form on success by local storage
var formSuccs = localStorage.getItem("form-success");
if(formSuccs == 'true'){
   $('.form-area').hide();
   $('.form-success-msg').show();
}    

// Tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip()
});

//only number validation
$('#phone, #cardnumber, #postcode, #cvv').on('keypress', function(evt){
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
});

//Credt Card Validation
$('#cardnumber').keyup(function (e) {
    var spaceCondition = $(this).val().split(" ").join("");
    if (spaceCondition.length > 0) {
        spaceCondition = spaceCondition.match(new RegExp('.{1,4}', 'g')).join(" ");
        $(this).val(spaceCondition);
    }
});

//Phone number validation 0 & 4
$('#phone').keyup(function (e) {
var phNum = $(this).val();
if(phNum.length >1){
var phCheck = /^(0)(4)/;
    if (!phCheck.test(phNum)) {
        $(this).css('border', '1px solid red');
    } else {
        $(this).css('border', '1px solid #ccc');
    }
}else {
    $(this).css('border', '1px solid #ccc');
}
});

// Form submit
$('#submit').on('click', function(e){
    e.preventDefault();
    var adrs1 = $('#address1').val();
    var adrs2 = $('#address2').val();
    var postcode = $('#postcode').val();
    var state = $('#state').val();
    var creditCard = $('#cardnumber').val();
    var prodName =$('.tab-pane.active .tab-title').text().trim();
    var valid = true;
    $('[required]').each(function() {
        if ($(this).is(':invalid') || !$(this).val()) valid = false;
    })
    if (!valid){
        alert("Please fill all required fields!");
    }
    else{ 
        console.log('Product: ' + prodName);
        console.log('Address1: ' + adrs1 + ', ' + 'Address2: ' + adrs2 + ', ' + 'PostCode: ' + postcode + ', ' + 'State: ' + state);
        console.log('Credit Card: ' + creditCard);
        localStorage.setItem("form-success", 'true');
    }
});

//Postcode Func
$('#postcode').keyup(function (e) {
   var postVal = $(this).val();
   if(postVal.length == 5){
      var url = 'https://www.wsjwine.com/api/address/zipcode/'+postVal;
      $.ajax({
         dataType: "json",
         url: url,
         type:"GET",
         success:function(data)
            {
                $('#city, #state').prop("disabled", false).addClass('top');
               var dataRes = data.response;
               $('#state').val(dataRes.stateName);
               $("#city").html("<option value='" + dataRes.city + "'>" + dataRes.city + "</option>");
               if(dataRes.zipCode == '06825'){
                  $('.form-input.alert-warning').slideDown();
                  $('.form-input.alert-danger').slideUp();
               }
               else{
                $('.form-input.alert-warning, .form-input.alert-danger').slideUp();
               }
            },
            error: function (xhr, exception, error) { 
                var err_msg = JSON.parse(xhr.responseText);
                $('.form-input.alert-warning').slideUp();
                $('.form-input.alert-danger').html(err_msg.statusMessage);
                $('.form-input.alert-danger').slideDown();
            },
       });
   }else{
    $('#city, #state').prop("disabled", true).removeClass('top');
    $("#city, #state").val('');
   }
});

// CC - Expiry date Validation
$('#expire').keyup(function (e) {
var expire = $(this).val();
if(!expire.match(/(0[1-9]|1[0-2])[/][0-9]{2}/)){
  $(this).css('border', '1px solid red');
  result = false;
} else {
  var d = new Date();
  var currentYear = d.getFullYear();
  var currentMonth = d.getMonth() + 1;
  var parts = expire.split('/');
  var year = parseInt(parts[1], 10) + 2000;
  var month = parseInt(parts[0], 10);
  if (year < currentYear || (year == currentYear && month < currentMonth)) {
    alert("The expiry date has passed. Please check once!");
    $(this).css('border', '1px solid red');
    result = false;
  }else{
        $(this).css('border', '1px solid #ccc');
  }
}
});

$('.input-text').keyup(function (e) {
if($(this).length && $(this).val().length){
    $(this).addClass('top');
}else{
    $(this).removeClass('top');
}
});

});