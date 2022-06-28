from functools import wraps
from flask import jsonify, request, make_response

class NotFoundError(Exception):
    """Error custom en caso de que un objeto no sea encontrado en la base de datos"""

class AlreadyExistsError(Exception):
    """Error custom en caso de que ya exista un objeto con una propiedad unica"""

class NotCreatedErorr(Exception):
    """Error custom en caso de que la creacion de un objeto en la base de datos no haya sido creado"""

class NotCompatibleError(Exception):
    """
    Error custom en caso de que la creacion de un registro no pueda ser cumplida por errores de compatibilidad
    como clientes que sobrepasan la capacidad de una habitacion o la habitacion ya esta siendo usada
    """

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