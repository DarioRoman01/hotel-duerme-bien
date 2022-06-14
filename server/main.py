from cgitb import handler
from flask import Flask, jsonify, request
from flask_cors import CORS
from db import DB   
from staff import StaffHandler

app = Flask(__name__)
CORS(app, origins="*")
# cors = CORS(app, resource={
#     r"/*":{
#         "origins":"*"
#     }
# })

@app.route("/")
def hello():
    return "Hello World!"

@app.route("/login", methods=["POST"])
def login():
    content = request.get_json()
    res = handler.loginUser(content["username"], content["password"])
    return jsonify({"success": res})


if __name__ == "__main__":
    global handler
    handler = StaffHandler(DB())
    app.run()