from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from db import DB   
from staff import StaffHandler
from rooms import RoomHandler

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/login", methods=["POST"])
def login():
    content = request.get_json()
    user = userHandler.loginUser(content["username"], content["password"])
    if user is None:
        return make_response(jsonify({"error": "credenciales invalidas"}), 401)

    response = make_response(jsonify(user.toDict()), 200)
    response.set_cookie('currentUserType', user.type)
    return response

@app.route("/rooms", methods=["GET"])
def handleRoomRequest():
    rooms = roomHandler.listAllRooms()
    return make_response(jsonify({'rooms': rooms}))

if __name__ == "__main__":
    global userHandler
    global roomHanlder
    db = DB()
    roomHandler = RoomHandler(db)
    userHandler = StaffHandler(db)
    app.run()