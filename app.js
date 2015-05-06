$("document").ready(function(){
    $("input#message").focus();
    
    // var connection = new autobahn.Connection({url: 'ws://127.0.0.1:9090/', realm: 'realm1'});
    // we're using an apache proxy to pass it to port 9090 without the need to expose the service
    var connection = new autobahn.Connection({url: 'ws://' + ROUTER_URL, realm: 'realm1'});

    // will hold the username during the chat session
    var username = null;

    connection.onopen = function(session) {
        // add status info
        $("#result").append("Websocket connection established succesfully :)\n\n");

        // show new user window
        $("div#user-modal").modal();
        $("div#user-modal").on("shown.bs.modal", function(e){
            $("input#username").focus();

            $("form#user").submit(function(e){
                e.preventDefault();
                if ($("input#username").val().length > 0) {
                    username = $("input#username").val();
                    $("div#user-modal").modal("hide");
                    $("input#message").focus();
                    session.publish("com.app.user.join", [username], {}, {exclude_me: false});
                }
            });
        });

        session.subscribe("com.app.user.join", function(args){
            $("#result").append("--- " + args[0] + " joined the chat ---\n");
            $("#users").append(args[0] + "\n");
        });

        // activate form
        $("input#message").prop("disabled", false);
        $("#btnSend").prop("disabled", false);
        $("input#message").focus();

        // display chat message
        session.subscribe("com.app.message", function(args){
            $("#result").append(args[0] + "\n");
        });

        // send chat message
        $("form#formMessage").submit(function(e){
            e.preventDefault();   // to handle submission all in js, with no http request

            // construct and send event if message not empty
            if (username && $("input#message").val().length > 0) {
                var msg = username + "> " + $("input#message").val();
                session.publish("com.app.message", [msg], {}, {exclude_me: false});
            }

            // clear input after submission, to let the user type another message easily
            $("input#message").val(null);
            $("input#message").focus();
        });
    };

    $("#result").append("Trying to connect to websocket server using WAMP protocol (may take some time)...\n");
    connection.open();
});
