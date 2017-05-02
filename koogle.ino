#include <Servo.h>  //파일 폴더에 직접 추가 필요함
#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
const char* host = "api.thingspeak.com"; // Your domain  
String ApiKey = "9K109EPJFMOB69YF";
String path = "/update?api_key=" + ApiKey + "&field1=";
const char* server = "54.175.21.22";
String serverPath = "/data?snore=";

const char* ssid = "iPhone";
const char* password = "123456789";
void connect_ap() {
    Serial.println();
    Serial.print("connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(500);
        Serial.print(".");
    }
    Serial.print("\n Got WiFi, IP address: ");
    Serial.println(WiFi.localIP());  
}
const int PIN0 = D2; //조이스틱 핀
const int PIN1 = A0; //소리감지 핀
const int PIN2 = D4; //모터 핀
int LED_BUILTI = D3;
int value=0;
Servo servo;
int angle = 0; // 모터의 각도 조정을 위한 변수
int joy=1;

void setup() {
    Serial.begin(115200);
    pinMode(PIN0, INPUT);
    pinMode(A0, INPUT);
    pinMode(LED_BUILTI, OUTPUT);

    connect_ap();

    servo.attach(PIN2);
    servo.write(0);
    Serial.println("Dallas Temperature IC Control Library Demo");
}


void loop() {
    joy==1;
    digitalWrite(LED_BUILTI, LOW);
    joy=digitalRead(PIN0);
    delay(1000);
    Serial.println(joy); //조이스틱 터치에 따라 0, 1 값 출력
    delay(1000);
    //  Serial.println(value);
    //  if( joy == 1 ){  //조이스틱 터치가 됬을 경우 (사용자가 배게를 배고 잠이 든 경우)

    value = analogRead(A0); //소리감지 변수
    //    Serial.println(value);  // 소리 감지 값 출력 (코고는 소리 감지를 위해 소리 출력)
    Serial.println("hihi");
    delay(1000);
    Serial.println(value);

    if( value > 400){  //소리가 일정 크기 이상인 경우
        Serial.println("if");
        Serial.println(value);
        //모터에 진동이 울린다
        digitalWrite(LED_BUILTI, HIGH);   // turn the LED on (HIGH is the voltage level)
        WiFiClient client2;
        WiFiClient client1;
        const int httpPort = 80;
        if (!client2.connect(host, httpPort)) {
            Serial.println("connection failed");
            return;
        }
        const int serverPort=3000;

        if (!client1.connect(server, serverPort)) {
            Serial.println("connection failed!!");
            return;
        }
        while(1)
        {
            value = analogRead(A0);
            Serial.println(value);
            client1.print(String("GET ") + serverPath + value + " HTTP/1.1\r\n" +
                    "Host: " + server + "\r\n" + 
                    "Connection: keep-alive\r\n\r\n");
            client2.print(String("GET ") + path + value + " HTTP/1.1\r\n" +
                    "Host: " + host + "\r\n" + 
                    "Connection: keep-alive\r\n\r\n");
            delay(1000);
        }        
        delay(600);
        delay(2000000);
        /*      for(angle = 0; angle < 180; angle += 20){
                servo.write(angle);
                delay(100);

                }
                for(angle = 180; angle > 0; angle -=20){
                servo.write(angle);
                delay(100);
                }*/
        //  }
        //  else
        //  {

        //  }
} 


}

