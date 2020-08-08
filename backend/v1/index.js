const express = require('express');
const app = express();

//const cors = require('cors');
//app.use(cors());
app.use(express.json());
app.get("/info", function(req, res) {
    try{
	    var address,
		ifaces = require('os').networkInterfaces();
	    for (var dev in ifaces) {
		ifaces[dev].filter((details) => details.family === 'IPv4' && details.internal === false ? address = details.address: undefined);
	    }
	    
	    console.log(address);
            let s = address + " v1"
            res.send(s)
    }
    catch(err){
        res.send(err);
    }
    
  });
app.get("/headers", function(req, res) {
    res.json(req.headers);
  });


const util = require('util');
const exec = util.promisify(require('child_process').exec);

app.post("/stress",  async (req, res)=>{
    var cmd = `seq 1 ${req.body.r} | xargs -n1 -P${req.body.p}  curl ${req.body.u} -s -o /dev/null -w \"%{http_code}\"`;
	//res.send(await stress(cmd));
var data = {};

var success=0;
var failed=0;
var std=null;

    await exec(cmd, (err, stdout, stderr) => {
	std=stdout;
	console.log("STDOUT"+stdout);
     	console.error("ERR: \n"+err.stdout);
     if(stderr.length!=0) {res.send(stderr);}
     for(var i=0;i<stdout.length;i+=3){
	if(i+3<stdout.length && stdout.substring(i,i+3)!="000"){
		if(!(stdout.substring(i,i+3) in data)){
			data[stdout.substring(i,i+3)]= 1;
		}
		else{data[stdout.substring(i,i+3)]= data[stdout.substring(i,i+3)]+1;}		
		if(Number(stdout.substring(i,i+3))<Number(200) || Number(stdout.substring(i,i+3))>=Number(400)){
			failed=failed+1;
		}
		else{success = success+1;}
	}
        }
	data["success"] = success;
	data["failed"] = failed;
	data["percentage_success"] = (success/(success+failed))*100;
	data["percentage_failed"] =  (failed/(success+failed))*100;
	console.log(data);

	//console.log(err);
     res.send(data);
      });
}); 
app.get("/health", function(req, res) {
    res.send("[ OK ] Healthy");
  });  
  app.listen(8001, function() {
    console.log("Server running on port 8001");
  });
  




