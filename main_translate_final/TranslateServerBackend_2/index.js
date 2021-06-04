const express = require('express');
const AWS = require('aws-sdk')
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const path = require('path');

//CONFIG OPTIONS
const PORT = 3355;
const USE_HTTPS = true;

AWS.config.loadFromPath(path.join(__dirname, 'awsconfig.json'));
AWS.config.update({region:"us-east-1"})

AWS.config.getCredentials(function(err) {
  if (err){
      console.error("Not able to log into AWS!")
      console.error(err);
      console.error(err.stack);
  } else {
      console.log("Access key:", JSON.stringify(AWS.config.credentials.accessKeyId));
      console.log("Logged into AWS!");
      main();
  }
});

function main(){
    const AWSTranslate = new AWS.Translate()
    let app = express();

    app.use(express.json())
    app.use(cors())

    app.post("/translate",function(req, res){
        console.log(`body: ${JSON.stringify(req.body)}`);
        if(req.body.translate_parameters){
            AWSTranslate.translateText(req.body.translate_parameters, 
            function(err, data){
                if(err){
                    console.log("An error occured with AWS request.")
                    console.error(err)
                    console.error(err.stack);
                    res.status(500).send(err.toString());
                    return;
                }
                console.log(data);
                res.send(JSON.stringify(data));
            })
        }
    })

    function onServerStart(method){
        console.log(`The server is running on: ${method}://localhost:${PORT}`)
    }

    if(USE_HTTPS){
        https.createServer({
            key: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.key')),
            cert: fs.readFileSync(path.join(__dirname, 'ssl', 'selfsigned.crt'))
        }, app).listen(PORT, ()=>onServerStart("https"));
    }else{
        app.listen(PORT, ()=>onServerStart("http"));
    }
}
