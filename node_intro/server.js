const http = require("http");
  
  const server = http.createServer(function (req,res) {
    res.write("Welcome to Node.js!");
    res.end();
    
  });

  server.listen(3232,function (err) {
    if (err) {
      console.log(err);
    }
    else
      console.log("its listening");
  });