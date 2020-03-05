
#include <DallasTemperature.h>
#include <OneWire.h>
#include "DHT.h"
#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
// DHT Sensor
uint8_t DHTPin = D8;
 
// Initialize DHT sensor.
DHT dht(DHTPin, DHTTYPE);


#define ONE_WIRE_BUS D4                          //D2 pin of nodemcu

OneWire oneWire(ONE_WIRE_BUS);
 
DallasTemperature sensors(&oneWire);            // Pass the oneWire reference to Dallas Temperature.



#include <ESP8266WiFi.h>

const char* ssid     = "NETGEAR31";
const char* password = "fluffywind2904";

const char* host = "54.184.128.170";

void setup() {
  pinMode(DHTPin, INPUT);

dht.begin();

  Serial.begin(115200);
  delay(10);

  // We start by connecting to a WiFi network

  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password);
  
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
     Serial.println(WiFi.macAddress());
 
  sensors.begin();
}

int value = 0;

void loop() {
  
    sensors.requestTemperatures();                // Send the command to get temperatures  
  String s = WiFi.macAddress() + "," + String(sensors.getTempFByIndex(0)) +"," + String(sensors.getTempFByIndex(1)) + "," + String(1.8*(dht.readTemperature())+32) + "," + dht.readHumidity();
  delay(500);
  delay(5000);
  ++value;

  Serial.print("connecting to ");
  Serial.println(host);
  
  // Use WiFiClient class to create TCP connections
  WiFiClient client;
  const int httpPort = 8080;
  if (!client.connect(host, httpPort)) {
    Serial.println("connection failed");
    return;
  }
  
  // We now create a URI for the request
  String url = "/setValue?v=";
  url += s;
  
  Serial.print("Requesting URL: ");
  Serial.println(url);
  
  // This will send the request to the server
  client.print(String("GET ") + url + " HTTP/1.1\r\n" +
               "Host: " + host + "\r\n" + 
               "Connection: close\r\n\r\n");
  unsigned long timeout = millis();
  while (client.available() == 0) {
    if (millis() - timeout > 5000) {
      Serial.println(">>> Client Timeout !");
      client.stop();
      return;
    }
  }
  
  // Read all the lines of the reply from server and print them to Serial
  while(client.available()){
    String line = client.readStringUntil('\r');
    Serial.print(line);
  }
  
  Serial.println();
  Serial.println("closing connection");
}
