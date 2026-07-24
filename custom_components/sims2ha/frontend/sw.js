// Service worker to inject Sims 2 theme into the login page
self.addEventListener("fetch", (event) => {
  // Check if the request is for the login page
  if (event.request.url.endsWith("/auth/signin")) {
    event.respondWith(
      fetch(event.request).then((response) => {
        return response.text().then((html) => {
          // Inject a link to our login screen CSS
          const cssLink =
            '<link rel="stylesheet" href="/sims2ha/login-screen.css">';
          // Insert before the closing head tag
          const modifiedHtml = html.replace("</head>", cssLink + "\n</head>");
          return new Response(modifiedHtml, {
            headers: {
              "Content-Type": "text/html",
              "Content-Length": String(modifiedHtml.length),
            },
          });
        });
      }),
    );
  }
});
