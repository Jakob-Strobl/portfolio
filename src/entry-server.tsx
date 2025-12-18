// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";
import { createSignal, onMount } from "solid-js";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
          <link rel="icon" href="/favicon.ico" />
          {assets}
        </head>
        <body
          style={{
            // NOTE(style):
            //    To avoid flashbanging the user on refresh, we set inline style
            //    because we can't guarantee the tailwind styles will be loaded in time
            "background-color": "#130d20",
          }}
        >
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
