const express = require("express");
const request = require("request");
const https = require("https");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
require("dotenv").config()

app.use(express.static("public"));

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

app.post("/", function(req, res){
    const email = req.body.email;
    const name = req.body.name;
    if(validateEmail(email)==false){
      res.sendFile(__dirname+"/failure.html");
    }
    var data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: name
          }
        }
      ]
    }
  
    const jsonData = JSON.stringify(data);
    const url = process.env.URL;
    const options = {
      method: "POST",
      auth: process.env.API_KEY
    }
    const request = https.request(url, options, function(response){
        if(response.statusCode==200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
          console.log(JSON.parse(data));
        });
    });
  
    request.write(jsonData);
    request.end();
  });

app.get("/", function(req, res){
    res.sendFile(__dirname+"/index.html");
});

app.listen(3000, function(){
    console.log("The server in running on port 3000.......");
});
  