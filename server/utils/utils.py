from functools import wraps
from flask import g, jsonify, request, redirect, url_for, make_response

class NotFoundError(Exception):
    """Error custom en caso de que un objeto no sea encontrado en la base de datos"""

class NotCreatedErorr(Exception):
    """Error custom en caso de que la creacion de un objeto en la base de datos no haya sido creado"""


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.cookies.get("currentUserType") is None:
            return make_response(jsonify({'error': 'usted no esta logeado en la aplicacion'}), 401)
        return f(*args, **kwargs)
    return decorated_function

def manager_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        currentUser = request.cookies.get("currentUserType")
        if currentUser is None:
            return make_response(jsonify({'error': 'usted no esta logeado en la aplicacion'}), 401)

        if currentUser != 'GERENTE':
            return make_response(jsonify({'error': 'usted no tiene permisos para realizar esta accion'}), 403)

        return f(*args, **kwargs)
    return decorated_function

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        currentUser = request.cookies.get("currentUserType")
        if currentUser is None:
            return make_response(jsonify({'error': 'usted no esta logeado en la aplicaion'}), 401)

        if currentUser != 'ADMIN':
            return make_response(jsonify({'error': 'usted no tiene permisos para realizar esta accion'}), 403)
            
        return f(*args, **kwargs)
    return decorated_function