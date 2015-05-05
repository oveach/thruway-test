Thruway websocket PHP lib test
===

Install
---

1. Use the `thruway-test.conf` file provided for your virtual host (Apache 2.4 needed).
2. Add `thruway-test.localhost` to your hosts file, pointing to `127.0.0.1`.
3. Launch the websocket server (Thruway):

        php router.php
Warning: needs at least PHP 5.4.

Usage
---
1. Browse to http://thruway-test.localhost and open a second tab at the same URL.
You should see that the connection with the websocket server is established.
2. When the connection is ready, type a message and click Send or press Enter. You'll see your message appear in both browser tabs: it works!
