$("document").ready(function(){
    $("input#message").focus();
    
    // var connection = new autobahn.Connection({url: 'ws://127.0.0.1:9090/', realm: 'realm1'});
    // we're using an apache proxy to pass it to port 9090 without the need to expose the service
    var connection = new autobahn.Connection({url: 'ws://' + ROUTER_URL, realm: 'realm1'});

    connection.onopen = function(session) {
        $("input#message").prop("disabled", false);
        $("#btnSend").prop("disabled", false);
        $("input#message").focus();
        $("#result").append("Websocket connection established succesfully :)\n\n");

        session.subscribe("com.app.message", function(args){
            $("#result").append(args[0] + "\n");
        });

        $("form#formMessage").submit(function(e){
            e.preventDefault();   // to handle submission all in js, with no http request

            // construct and send event
            var msg = "(session #" + session.id + ") " + $("input#message").val();
            session.publish("com.app.message", [msg], {}, {exclude_me: false});

            // clear input after submission, to let the user type another message easily
            $("input#message").val(null);
            $("input#message").focus();
        });
    };

    $("#result").append("Trying to connect to websocket server using WAMP protocol (may take some time)...\n");
    connection.open();
});
