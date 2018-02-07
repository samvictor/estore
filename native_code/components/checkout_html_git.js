export default checkout_html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css?family=Raleway:200|Work+Sans:300" rel="stylesheet">
    <script src="https://js.braintreegateway.com/web/3.26.0/js/client.min.js"></script>
    <script src="https://js.braintreegateway.com/web/dropin/1.9.1/js/dropin.min.js"></script>
  <title>eCommerce</title>
  </head>
  <body>
    <div style="background-color: pink">
      <h1>Hello world</h1>

      <t id="message">message</t>
      <h5 id="dropin_loading">Loading...</h5>
      <div id="dropin-container"></div>
      <button id="submit-button" className="btn btn-outline-success">
        Submit Payment of $
      </button>
    </div>
    <noscript>
      You need to enable JavaScript to run this app.
    </noscript>
    <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-app.js"></script>
    <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-auth.js"></script>
    <script src="https://www.gstatic.com/firebasejs/4.6.2/firebase-database.js"></script>

    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>

    <script>
      document.querySelector('#message').innerHTML = JSON.stringify({
        'message': 'snack',
        'extra': 'html checking in'
      });

      var submitButton = document.querySelector('#submit-button');

      $.get('https://us-central1-estore-7e485.cloudfunctions.net/client_token',
        function(data){
          braintree.dropin.create({
            authorization: data,
            container: '#dropin-container'
          }).then(function (dropinInstance) {
            $('#dropin_loading').css('display', 'none');

            //submitButton.addEventListener('click', temp_this.handle_submit
            //                                        .bind(temp_this, dropinInstance));
          }).catch(function (err) {
            // Handle any errors that might've occurred when creating Drop-in
            //console.log('creating dropin: ', err);

            window.postMessage(JSON.stringify({
              'message': 'snack',
              'extra': 'creating dropin: '+ err.toString()
            }), '*');
            document.querySelector('#message').innerHTML = 'creating dropin: '+err.toString();
          });
        }
      ).fail(function(){
        //console.log('Error getting client token');
        window.postMessage(JSON.stringify({
          'message': 'snack',
          'extra': 'Error getting client token'
        }), '*');
        document.querySelector('#message').innerHTML = 'Error getting client token';
      });
    </script>
  </body>
</html>




`;
