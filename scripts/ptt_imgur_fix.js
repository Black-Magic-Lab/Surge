let body = $response.body;
body = body.replace(
  "</body>",
  '<script defer type="text/javascript" src="//kinta.ma/surge/scripts/imgur-links-rewriting-on-ptt.user.js"></script></body>',
);
$done({ body });
