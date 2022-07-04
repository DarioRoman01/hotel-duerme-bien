# Hotel Duerme Bien

## What is this? why?
This is a project for my institute, we have to build an application for a hotel wich features things like controll over the clients currently hosted on the hotel, controll over the inventory of the rooms and the rooms its selfs and many other things.

## How to run it?
requirements:
```
MySQL: version 8
Python: version 3.8 or higher
NodeJs: version 16
npm: version 8
```

### Client side:
go to the client folder and just run:
```
npm install or yarn install
```
then if you want to run it on the browser just run:
```
npm run start or yarn start
``` 
if you want to try it in electron run:
```
npm run electron:serve
```

### Server side
first you need to setup the enviroment variables in the server folder you will find a .env.example file just replace the values in the file to your database values and rename the file to .env
```
db_username=exampleusername
db_password=examplepassowrd
db_host=examplehost
db_port=3306
db_name=exampledbname
```

then create a virtual enviroment with:
```
python3 -m venv <your virtual enviroment name>
```
and install the dependencies:
```
pip install -r requirements.txt
```
to start the server run:
```
python3 app.py
```