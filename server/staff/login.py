from typing import Dict, List
from db import DB
import bcrypt
from utils import AlreadyExistsError, NotFoundError

class User:
    def __init__(self, codigo, username, pwd, type) -> None:
        self.codigo = codigo
        self.pwd = pwd
        self.username = username
        self.type = type

    def toDict(self) -> Dict:
        return {
            "codigo": self.codigo,
            "username": self.username,
            "type": self.type
        }

class StaffHandler:
    """StaffHandler es una clase encargada del CRUD relacionado con los usuarios la mayoria de las acciones solo podran ser realizadas por un administrador"""
    def __init__(self, db: DB) -> None:
        self.__db = db

    def crearUsuario(self, username, pwd, userType):
        """crea un usuario en la base de datos y hashea el password para que solo el usuario conozca su contraseña"""

        if self.__db.checkExistanse("SELECT * FROM usuario WHERE username = %s", (username, )):
            raise AlreadyExistsError(f"ya existe un usuario con el nombre: {username}")

        salt = bcrypt.gensalt()
        hashPassword = bcrypt.hashpw(bytes(pwd, 'utf-8'), salt)

        self.__db.queryDB("""
            INSERT INTO usuario (username, password, type)
            VALUES(%s, %s, %s)
        """, (username, hashPassword, userType))
        self.__db.commit()

    def listUsers(self) -> List[Dict[str, str]]:
        """Lista a todos los usuarios registrados dentro de la aplicacion"""
        self.__db.queryDB("SELECT codigo, username, password, type from usuario")
        return [User(u[0], u[1], u[2], u[3]).toDict() for u in self.__db.fetchAll()]

    def deleteUser(self, userId):
        """Elimina a un usuario de la base de datos"""
        if not self.__db.checkExistanse("SELECT * FROM usuario WHERE codigo = %s", (userId, )):
            raise NotFoundError(f'no se encontro un usuario con el codigo {userId}')

        self.__db.queryDB("DELETE FROM usuario WHERE codigo = %s", (userId,))
        self.__db.commit()

    def loginUser(self, username, pwd) -> User | None:
        """Verifica las credenciales ingresadas por el usuario al momento de hacer login"""

        self.__db.queryDB("SELECT * FROM usuario WHERE username = %s", (username,))
        raw_user = self.__db.fetchOne()
        if raw_user is None:
            return None

        user = User(raw_user[0], raw_user[1], raw_user[2], raw_user[3])
        return user if bcrypt.checkpw(bytes(pwd, 'utf-8'), bytes(user.pwd, 'utf-8')) else None
