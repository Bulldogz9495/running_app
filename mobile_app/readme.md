# Challenge Run
An idea that will allow runners to compete with each other in teams. The initial idea is a simple running app that will provide a score for each run. This score will be summed for a team and the teams scores will be calculated and compared allowing for competition. The original idea was for a city wide team (this can be the default) and cities can compete with each other. This will hopefully be an exciting and enjoyable way for runners and non-runners to get out their and move and compete. 

## Scoring Algorithm
SUM of points for each mile where points = 2^((1500-x)/140)
This should allow runners new runners to score some points and experienced runners to see real value in improvement promoting new users and old users to push themselves.
* A 25 minute pace is worth 1 point with the value asymptotically approaching 0.
* A 15 minute pace is worth approximately 20 points.
* A 10 minute pace is worth approximately 85 points.
* A 5 minute pace is worth approximately 380 points.
* An olympic mile pace of 220 seconds is worth approximately 560 points.



## Dev environment
### Docker
The front end is written in react-native and uses docker to reduce env noise. (If you are doing front end dev then use npx expo start in local to dev rather than container)
You need to change the REACT_NATIVE_PACKAGER_HOSTNAME env variable in the docker file to your local IP address (IPV4)
```
docker build -t running_app .
```
```
docker run -it -p 8081:8081 -p 19000:19000 -p 19001:19001 -p 19002:19002 -v ${PWD}/running_app/:/usr/src/app running_app
```

Once docker is up and running the web host is at localhost:8081

### Android or iOS with a Device
1. Downlaod the expo go app
2. Ensure you are on the same network as the computer you are using.
3. Capture the QR code on your device.
4. Start debugging.
### Android Without an Android device
We are using expo go to run the android app. 
1. Install the Android sdks via android studio.
2. Create a virtual android device. 
3. Download the expo go apk and install to the virtual device.

## Stack:
Docker
Android sdk







# Issue Tracker
Hot Reloads aren't working in docker container - App changes require server restart - Check if true not in container