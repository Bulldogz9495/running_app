#Challenge Run
An idea that will allow runners to compete with each other in teams. The initial idea is a simple running app that will provide a score for each run. This score will be summed for a team and the teams scores will be calculated and compared allowing for competition. The original idea was for a city wide team (this can be the default) and cities can compete with each other. This will hopefully be an exciting and enjoyable way for runners and non-runners to get out their and move and compete. 

##Scoring Algorithm
SUM of points for each mile where points = 2^((1500-x)/140)
This should allow runners new runners to score some points and experienced runners to see real value in improvement promoting new users and old users to push themselves.
*A 25 minute pace is worth 1 point with the value asymptotically approaching 0.
*A 15 minute pace is worth approximately 20 points.
*A 10 minute pace is worth approximately 85 points.
*A 5 minute pace is worth approximately 380 points.
*An olympic mile pace of 220 seconds is worth approximately 560 points.



##Dev environment
The front end is written in react-native and uses docker to reduce env noise.
docker build -t running_app .
```
docker run -it -p 8081:8081 -v ${PWD}/running_app/:/usr/src/app running_app
```
```
Once docker is up and running the web host is at localhost:8081
```


##Stack:
Docker