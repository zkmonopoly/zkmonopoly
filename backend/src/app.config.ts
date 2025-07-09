import config from "@colyseus/tools";
import { monitor } from "@colyseus/monitor";
import { playground } from "@colyseus/playground";
import { exec } from "child_process";

/**
 * Import your Room files
 */
import { MonopolyRoom } from "./rooms/MonopolyRoom";

export default config({

    initializeGameServer: (gameServer) => {
        /**
         * Define your room handlers:
         */
        gameServer.define('my_room', MonopolyRoom);

    },

    initializeExpress: (app) => {
        /**
         * Bind your custom express routes here:
         * Read more: https://expressjs.com/en/starter/basic-routing.html
         */
        app.get("/hello_world", (req, res) => {
            res.send("It's time to kick ass and chew bubblegum!");
        });

        /**
         * Use @colyseus/playground
         * (It is not recommended to expose this route in a production environment)
         */
        app.use("/", playground());

        /**
         * Use @colyseus/monitor
         * It is recommended to protect this route with a password
         * Read more: https://docs.colyseus.io/tools/monitor/#restrict-access-to-the-panel-using-a-password
         */
        app.use("/monitor", monitor());

        app.get("/version", (_, res) => {
            exec("git log -1", (_, stdout) => {
                const censored = stdout.replace(/<[\w!#$%&'*+\-\/=?^`{|}~.]+@[\w!#$%&'*+\-\/=?^`{|}~.]+>/, "[REDACTED]")
                res.send(
                    `<!DOCTYPE html>
                    <html lang="en">
                        <head>
                            <meta charset="utf-8">
                            <title>Instance Version</title>
                        </head>
                    <body style="background-color: rgb(18, 18, 18); color: white;">
                        <pre>${censored}</pre>
                    </body>
                    </html>`
                )
            })
        });
    },


    beforeListen: () => {
        /**
         * Before before gameServer.listen() is called.
         */
    }
});
