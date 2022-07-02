from flask import Flask, jsonify, make_response, request
from flask_cors import CORS
from db import DB
from staff import StaffHandler
from rooms import RoomHandler
from clients import ClientsHandler
from utils import login_required, NotFoundError, AlreadyExistsError, NotCompatibleError

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

@app.route("/rooms", methods=["GET", "POST", "PATCH", "DELETE"])
@login_required
def handleRoomRequest():
    try: 
        if request.method == "POST":
            content = request.get_json()
            rooms = roomHandler.filterRooms(content)
            return make_response(jsonify({'rooms': rooms}), 200)

        elif request.method == "PATCH":
            data = request.get_json()
            roomHandler.updateRoom(data.get("room"), data.get('capacity'), data.get('orientation'))
            return make_response(jsonify({'ok': 'ok'}), 200)
        
        elif request.method == "DELETE":
            args = request.args.to_dict()
            if args.get('room') == None:
                return make_response(jsonify({'error': 'debe indicar una habitacion en los parametros de la url'}), 400)

            roomHandler.deleteRoom(args.get('room'))
            return make_response(jsonify({'ok': 'ok'}), 200)
            
        rooms = roomHandler.listAllRooms()
        return make_response(jsonify({'rooms': rooms}), 200)
    
    except NotFoundError as err:
        return make_response(jsonify({'error': str(err)}), 404)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)

@app.route("/users", methods=["GET"])
@login_required
def listUsers():
    users = userHandler.listUsers()
    return make_response(jsonify({'users': users}), 200)

@app.route("/users/create", methods=["POST"])
@login_required
def createUser():
    try:
        data = request.get_json()
        userHandler.crearUsuario(data.get("username"), data.get("password"), "gerente")
        return make_response(jsonify({'ok': 'ok'}), 200)
    except AlreadyExistsError as err:
        return make_response(jsonify({'error': str(err)}), 400) 
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)

@app.route("/clients", methods=["GET", "POST", "PATCH", "DELETE"])
@login_required
def handleClientsRequests():
    try: 
        if request.method == "POST":
            filters = request.get_json()
            clients = clientsHandler.filterClients(filters)
            return make_response(jsonify({'clients': clients}), 200)

        elif request.method == "PATCH":
            data = request.get_json()
            clientsHandler.updateClient(data.get('rut'), data.get('reputation'), data.get('name'))
            return make_response(jsonify({'ok': 'ok'}), 200)

        elif request.method == "DELETE":
            args = request.args.to_dict()
            clientsHandler.deleteClient(args.get('rut'))
            return make_response(jsonify({'ok': 'ok'}), 200)

        else:
            clients = clientsHandler.listAllClients()
            return make_response(jsonify({'clients': clients}), 200)

    except NotFoundError as err:
        return make_response(jsonify({'error': str(err)}), 404)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)


@app.route('/clients/create', methods=["POST"])
def createClient():
    try:
        body = request.get_json()
        clientsHandler.createClient(body.get('rut'), body.get('name'))
        return make_response(jsonify({'ok': 'ok'}), 200)
    except AlreadyExistsError as err:
        return make_response(jsonify({'error': str(err)}), 400)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)

@app.route('/rooms/create', methods=["POST"])
def createRoom():
    try:
        body = request.get_json()
        roomHandler.createRoom(body['code'], body['capacity'], body['orientation'])
        return make_response(jsonify({'ok': 'ok'}), 200)
    except AlreadyExistsError as err:
        return make_response(jsonify({'error': str(err)}), 400)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)

@app.route("/detail", methods=["GET"])
@login_required
def getRoomDetail():
    try:
        args = request.args.to_dict()
        if args.get('room') == None:
            make_response(jsonify({'error': 'debe especificar una habitacion'}), 400)
        details = roomHandler.getRoomDetail(args.get('room'))
        return make_response(jsonify(details), 200)
    except NotFoundError as err:
        return make_response(jsonify({'error': str(err)}), 404)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)


@app.route("/records", methods=["GET", "POST", "PATCH", "DELETE"])
@login_required
def handleRecordsRequests():
    try:
        if request.method == "POST":
            content = request.get_json()
            records = roomHandler.filterRoomHistory(content)
            return make_response(jsonify({'records': records}), 200)

        elif request.method == "PATCH":
            data = request.get_json()
            roomHandler.updateRecord(data.get('recordId'), data.get('state'), data.get('finish'))
            return make_response(jsonify({'ok': 'ok'}), 200)

        elif request.method == "DELETE":
            args = request.args.to_dict()
            roomHandler.deleteRoomRecord(args.get('record'))
            return make_response(jsonify({'ok': 'ok'}), 200)

        else:
            historys = roomHandler.getRoomsHistory()
            return make_response(jsonify({'records': historys}), 200)

    except NotFoundError as err:
        return make_response(jsonify({'error': str(err)}), 404)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)

@app.route("/records/create", methods=["POST"])
@login_required
def createRecord():
    try:
        data = request.get_json()
        print(data.get('companions'))
        clientsHandler.asingRoom(data.get('room'), data.get('companions'), data.get('start'), data.get('finish'), data.get('responsable'))
        return make_response(jsonify({'ok': 'ok'}))

    except NotCompatibleError as err:
        return make_response(jsonify({'error': str(err)}), 400)

    except NotFoundError as err:
        return make_response(jsonify({'error': str(err)}), 404)

    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)

@app.route("/objects", methods=["GET", "POST", "PATCH", "DELETE"])
@login_required
def handleObjsRequests():
    try:
        if request.method == "POST":
            filters = request.get_json()
            objs = roomHandler.filterObjects(filters)
            return make_response(jsonify({'objects': objs}), 200)
        
        elif request.method == "PATCH":
            data = request.get_json()
            roomHandler.updateRoomObject(data.get('codigo'), data.get('state'), data.get('type'))
            return make_response(jsonify({'ok': 'ok'}))

        elif request.method == "DELETE":
            args = request.args.to_dict()
            roomHandler.deleteRoomObject(args.get('objectId'))
            return make_response(jsonify({'ok': 'ok'}), 200)

        objs = roomHandler.listAllObjects()
        return make_response(jsonify({'objects': objs}), 200)

    except NotFoundError as err:
        return make_response(jsonify({'error': str(err)}), 404)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)
    

@app.route("/objects/create", methods=["POST"])
@login_required
def createObject():
    try:
        data = request.get_json()
        roomHandler.createRoomObject(data.get('room'), data.get('state'), data.get('type'))
        return make_response(jsonify({'ok': 'ok'}))
    except NotFoundError as err:
        return make_response(jsonify({'error': str(err)}), 400)
    except:
        return make_response(jsonify({'error': 'ocurrio un error inesperado'}), 500)

if __name__ == "__main__":
    global userHandler
    global roomHanlder
    global clientsHandler
    db = DB()
    roomHandler = RoomHandler(db)
    userHandler = StaffHandler(db)
    clientsHandler = ClientsHandler(db)
    app.run()