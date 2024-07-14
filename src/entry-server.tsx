// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          {/* Cloudflare web analytics */}
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon='{"token": "26d93e6777624e64b2528e6f297960ee"}'
          ></script>
          {assets}
        </head>
        <body
          style={{
            // NOTE(style):
            //    To avoid flashbanging the user on refresh, we set inline style
            //    because we can't guarantee the tailwind styles will be loaded in time
            "background-color": "black",
          }}
        >
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
