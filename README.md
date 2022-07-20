# Hotel Duerme Bien

## What is this? why?
This is a project for my institute, we have to build an application for a hotel wich features things like controll over the clients currently hosted on the hotel, controll over the inventory of the rooms and the rooms its selfs and many other things. you can check the requirements here [project requirements document](https://github.com/DarioRoman01/hotel-duerme-bien/wiki/Project-requirements) keep in mind that the file is in spanish.

## How to run it?
requirements:
```
MySQL
Golang
NodeJs
Memcached
```

### Client side:
go to the client folder and just run:
```
npm install or yarn install
```
then to run it:
```
npm run dev or yarn dev
``` 

### Server side
first you need to setup the enviroment variables in the server folder you will find a .env.example file just replace the values in the file to your database values and rename the file to .env
```
db_username=exampleusername
db_password=examplepassowrd
db_host=examplehost
db_port=3306
db_name=exampledbname
cache_url=memcachedhost:11211
port=1323
```

to install the dependencies just run:
```
go install
```
to start the server run:
```
go run main.go
```
or if want to build the app run:
```
go build -o <executable name>
```
