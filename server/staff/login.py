from typing import Dict
from db import DB
import bcrypt

class StaffHandler:
    """StaffHandler es una clase encargada del CRUD relacionado con los usuarios la mayoria de las acciones solo podran ser realizadas por un administrador"""
    def __init__(self, db: DB) -> None:
        self.__db = db

    def crearUsuario(self, username, pwd, userType):
        """crea un usuario en la base de datos y hashea el password para que solo el usuario conozca su contraseña"""

        salt = bcrypt.gensalt()
        hashPassword = bcrypt.hashpw(bytes(pwd, 'utf-8'), salt)

        self.__db.queryDB("""
            INSERT INTO usuario (username, password, type)
            VALUES(%s, %s, %s)
        """, (username, hashPassword, userType))
        self.__db.commit()

    def listUsers(self):
        """Lista a todos los usuarios registrados dentro de la aplicacion"""
        if self.__db.getCurrentUserType() != "administrador":
            return "no tiene permisos para realizar esta accion"

        self.__db.queryDB("SELECT codigo, username, type from usuarios;")
        return [User(u[0], u[1], u[2]) for u in self.__db.fetchAll()]

    def modifyUser(self, username, newUsername, pwd):
        """se encarga de la modificacion de los usuarios solo se permitira cambiar su nombre de usuario y contraseña"""

        if self.__db.getCurrentUserType() != "administrador":
            return "no tiene permisos para realizar esta accion"

        salt = bcrypt.gensalt()
        hashPassword = bcrypt.hashpw(bytes(pwd, 'utf-8'), salt)
        self.__db.queryDB("""
            UPDATE usuarios
            set username = %s, password = %s
            WHERE username = %s 
        """, (newUsername, hashPassword, username))
        self.__db.commit()

    def deleteUser(self, username):
        """Elimina a un usuario de la base de datos"""

        if self.__db.getCurrentUserType() != "administrador":
            return "no tiene permisos para realizar esta accion"

        user = self.__db.queryDB("SELECT * FROM usuario WHERE username = %s", (username, ))
        if user is None:
            return "el usuario indicado no existe"

        self.__db.queryDB("DELETE FROM usario WHERE codigo = %s", (user[0]))
        self.__db.commit()

    def loginUser(self, username, pwd):
        """Verifica las credenciales ingresadas por el usuario al momento de hacer login"""
        self.__db.queryDB("""
            SELECT password, type FROM usuario WHERE username = %s
        """, (username,))

        usuario = self.__db.fetchOne()
        if usuario is None:
            return False

        storePwd = usuario[0]
        if bcrypt.checkpw(bytes(pwd, 'utf-8'), bytes(storePwd, 'utf-8')):
            self.__db.setCurrentUserType(usuario[1])
            return True
        else:
            return False

class User:
    def __init__(self, codigo, username, type) -> None:
        self.codigo = codigo
        self.username = username
        self.type = type

    def toDict(self) -> Dict:
        return {
            "codigo": self.codigo,
            "username": self.username,
            "type": self.type
        }
