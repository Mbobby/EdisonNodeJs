/*jslint node:true,vars:true,bitwise:true,unparam:true */

/*jshint unused:true */

/*
The Local Temperature Node.js sample application distributed within Intel® XDK IoT Edition under the IoT with Node.js Projects project creation option showcases how to read analog data from a Grover Starter Kit Plus – IoT Intel® Edition Temperature Sensor, start a web server and communicate wirelessly using WebSockets.

MRAA - Low Level Skeleton Library for Communication on GNU/Linux platforms
Library in C/C++ to interface with Galileo & other Intel platforms, in a structured and sane API with port nanmes/numbering that match boards & with bindings to javascript & python.

Steps for installing MRAA & UPM Library on Intel IoT Platform with IoTDevKit Linux* image
Using a ssh client: 
1. echo "src maa-upm http://iotdk.intel.com/repos/1.1/intelgalactic" > /etc/opkg/intel-iotdk.conf
2. opkg update
3. opkg upgrade

Article: https://software.intel.com/en-us/html5/articles/iot-local-temperature-nodejs-and-html5-samples
*/

var B = 3975;
var mraa = require("mraa");

//GROVE Kit A0 Connector --> Aio(0)
var myAnalogPin = new mraa.Aio(0);

/*
Function: startSensorWatch(socket)
Parameters: socket - client communication channel
Description: Read Temperature Sensor and send temperature in degrees of Fahrenheit every 4 seconds
*/
function startSensorWatch(res) {
    'use strict';
    var a = myAnalogPin.read();
    console.log("Analog Pin (A0) Output: " + a);
    //console.log("Checking....");

    var resistance = (1023 - a) * 10000 / a; //get the resistance of the sensor;
    //console.log("Resistance: "+resistance);
    var celsius_temperature = 1 / (Math.log(resistance / 10000) / B + 1 / 298.15) - 273.15;//convert to temperature via datasheet ;
    //console.log("Celsius Temperature "+celsius_temperature); 
    var fahrenheit_temperature = (celsius_temperature * (9 / 5)) + 32;
    console.log("Fahrenheit Temperature: " + fahrenheit_temperature);
    res.send("Fahrenheit Temperature: " + fahrenheit_temperature);
}

console.log("Sample Reading Grove Kit Temperature Sensor");

//Create express server
var express = require('express');
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/temperature', function(req, res) {
    startSensorWatch(res);
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});


