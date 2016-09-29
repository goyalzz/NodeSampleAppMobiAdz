// add an event listener to the shorten button for when the user clicks it
$('.btn-shorten').on('click', function(){
  // AJAX call to /api/shorten with the URL that the user entered in the input box
  var value = $('#url-field').val();
  $.ajax({
    url: "/api/urlshorten",
    type: "POST",
    headers: {
      'Content-Type':'application/json'
    },
    data: JSON.stringify({
      url: value
    }),
    success: function(data){
        // display the shortened URL to the user that is returned by the server
        var resultHTML = '<a class="result" href="' + data.data + '">'
            + data.data + '</a>';
        $('#link').html(resultHTML);
        $('#link').hide().fadeIn('slow');
    },
    error: function (textStatus, errorThrown) {
        console.log(textStatus.responseText);
    }
  });

});