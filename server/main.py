from cgitb import handler
from urllib import response
from flask import Flask, jsonify, make_response, request, Response
from flask_cors import CORS
from db import DB   
from staff import StaffHandler

app = Flask(__name__)
CORS(app, origins="http://localhost:3000", supports_credentials=True)

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/login", methods=["POST"])
def login():
    content = request.get_json()
    user = handler.loginUser(content["username"], content["password"])
    if user is None:
        return make_response(jsonify({"error": "credenciales invalidas"}), 401)

    response = make_response(jsonify(user.toDict()), 200)
    response.set_cookie('currentUserType', user.type)
    return response

if __name__ == "__main__":
    global handler
    handler = StaffHandler(DB())
    app.run()