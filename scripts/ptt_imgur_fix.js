let body = $response.body;
body = body.replace(
  "</body>",
  '<script defer type="text/javascript" src="//gginin.de/surge/scripts/imgur-links-rewriting-on-ptt.user.js"></script></body>',
);
$done({ body });
