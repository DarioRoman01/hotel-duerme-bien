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
    """
    Funcion decorador que encanpsula todas las peticiones que requieran login ademas 
    de verificar la ruta y definir que tipo de usuario tiene permisos sobre esa ruta
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if request.path == "/login":
            return f(*args, **kwargs)

        currentUserCookie = request.cookies.get("currentUserType")
        path = request.path
        if currentUserCookie is None:
            return make_response(jsonify({'error': 'usted no esta logeado en la aplicacion'}), 401)

        if path != "login" and path not in ["/users", "/logout"]:
            if currentUserCookie != "gerente":
                return make_response(jsonify({'error': 'usted no tiene permisos para realizar esta accion'}), 403)
       
        elif path != "/login" and path != '/logout':
            if currentUserCookie != "administrador":
                return make_response(jsonify({'error': 'usted no tiene permisos para realizar esta accion'}), 403)

        return f(*args, **kwargs)
    return decorated_function