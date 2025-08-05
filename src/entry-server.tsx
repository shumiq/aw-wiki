// @refresh reload
import { createHandler, StartServer } from "@solidjs/start/server";

export default createHandler(() => (
  <StartServer
    document={({ assets, children, scripts }) => (
      <html lang="en" data-theme="cupcake">
        <head>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
          <link
            rel="stylesheet"
            media="all"
            href="/static/arwar.ru/css/main/content/tankopedia/tankopedia.css"
          />
          <link
            rel="stylesheet"
            media="all"
            href="/static/arwar.ru/css/main/content/tankopedia/tankopedia_tanksm.css"
          />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link
            rel="preconnect"
            href="https://fonts.gstatic.com"
            crossorigin="anonymous"
          />
          <link
            href="https://fonts.googleapis.com/css2?family=Itim&display=swap"
            rel="stylesheet"
          />
          {assets}
        </head>
        <body class="itim-regular">
          <div id="app">{children}</div>
          {scripts}
        </body>
      </html>
    )}
  />
));
