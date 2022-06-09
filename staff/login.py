from db import DB
import bcrypt

class StaffHandler:
    def __init__(self, db: DB) -> None:
        self.__db = db

    def crearUsuario(self, username, pwd, userType):
        salt = bcrypt.gensalt()
        hashPassword = bcrypt.hashpw(pwd, salt)

        self.__db.queryDB("""
            INSERT INTO usuario (username, password, type)
            VALUES(%s, %s, %s)
        """, (username, hashPassword, userType))



    def loginUser(self, username, pwd, userType):
        self.__db.queryDB("""
            SELECT password FROM usuario WHERE username = %s AND type = %s
        """, (username, userType))

        usuario = self.__db.fetchOne()
        if usuario is None:
            return None

        storePwd = usuario[0]
        if bcrypt.checkpw(pwd, storePwd):
            return True
        else:
            return False