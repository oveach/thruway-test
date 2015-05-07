<?php

require 'vendor/autoload.php';

use Thruway\ClientSession;

$client = new \Thruway\Peer\Client("realm1");


$client->on(
    'open',
    function (ClientSession $session){

        // to remember list of connected users
        $users_list = [];

        $session->register('com.app.user.connect', function($args) use ($session, &$users_list){
            // add username to list of users
            $username = $args[0];
            if (!in_array($username, $users_list)) {
                $users_list[] = $username;
            }

            // publish event to notify other clients
            $session->publish('com.app.user.join', [$username]);

            // return the list of users connected
            return ['users_list' => $users_list];
        });

    }
);


$client->addTransportProvider(new \Thruway\Transport\PawlTransportProvider());

$client->start();
