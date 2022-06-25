from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from db import DB
from staff import StaffHandler
from rooms import RoomHandler
from clients import ClientsHandler
from utils import login_required, NotFoundError, NotCreatedErorr

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

@app.route("/login", methods=["POST"])
def login():
    content = request.get_json()
    user = userHandler.loginUser(content["username"], content["password"])
    if user is None:
        return make_response(jsonify({"error": "credenciales invalidas"}), 401)

    response = make_response(jsonify(user.toDict()), 200)
    response.set_cookie('currentUserType', user.type)
    return response

@app.route("/rooms", methods=["GET", "POST"])
@login_required
def handleRoomRequest():
    if request.method == "POST":
        content = request.get_json()
        rooms = roomHandler.filterRooms(content)
        return make_response(jsonify({'rooms': rooms}), 200)
        
    rooms = roomHandler.listAllRooms()
    return make_response(jsonify({'rooms': rooms}), 200)

@app.route("/clients", methods=["GET", "POST"])
@login_required
def handleClientsRequests():
    if request.method == "POST":
        filters = request.get_json()
        clients = clientsHandler.filterClients(filters)
        return make_response(jsonify({'clients': clients}), 200)
    else:
        clients = clientsHandler.listAllClients()
        return make_response(jsonify({'clients': clients}), 200)


@app.route('/clients/create', methods=["POST"])
def createClient():
    body = request.get_json()
    res = clientsHandler.createClient(body.get('rut'), body.get('name'))
    return make_response(jsonify(res), 200) if res.get('ok') else make_response(res, 400)

@app.route('/rooms/create', methods=["POST"])
def createRoom():
    body = request.get_json()
    res = roomHandler.createRoom(body['code'], body['capacity'], body['orientation'])
    return make_response(jsonify(res), 200) if res.get('ok') else make_response(res, 400)

@app.route("/detail", methods=["GET"])
@login_required
def getRoomDetail():
    args = request.args.to_dict()
    if args.get('room') == None:
        make_response(jsonify({'error': 'debe especificar una habitacion'}), 400)

    try:
        details = roomHandler.getRoomDetail(args.get('room'))
        return make_response(jsonify(details), 200)
    except NotFoundError as err:
        return make_response(jsonify({'error': err}), 404)


@app.route("/records", methods=["GET", "POST"])
@login_required
def handleRecordsRequests():
    if request.method == "POST":
        content = request.get_json()
        records = roomHandler.filterRoomHistory(content)
        return make_response(jsonify({'records': records}), 200)
    else:
        historys = roomHandler.getRoomsHistory()
        return make_response(jsonify({'records': historys}), 200)

@app.route("/objects", methods=["GET", "POST"])
@login_required
def handleObjsRequests():
    if request.method == "POST":
        filters = request.get_json()
        objs = roomHandler.filterObjects(filters)
        return make_response(jsonify({'objects': objs}), 200)

    objs = roomHandler.listAllObjects()
    return make_response(jsonify({'objects': objs}), 200)


if __name__ == "__main__":
    global userHandler
    global roomHanlder
    global clientsHandler
    db = DB()
    roomHandler = RoomHandler(db)
    userHandler = StaffHandler(db)
    clientsHandler = ClientsHandler(db)
    app.run()