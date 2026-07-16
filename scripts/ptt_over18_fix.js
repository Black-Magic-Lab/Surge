let body = $response.body;
body = body.replace(
  "</body>",
  '<script defer type="text/javascript" src="//kinta.ma/surge/scripts/ptt-over18-fix.user.js"></script></body>',
);
$done({ body });
