var express = require("express");
var app = express();
app.get("/info", function(req, res) {
    try{
	    var address,
		ifaces = require('os').networkInterfaces();
	    for (var dev in ifaces) {
		ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
	    }
	    
	    console.log(address);
            let s = address + " v2"
            res.send(s)
    }
    catch(err){
        res.send(err);
    }
    
  });
app.get("/headers", function(req, res) {
    res.json(req.headers);
  });  
  app.listen(8001, function() {
    console.log("Server running on port 8001");
  });
  



