from db import DB

class RoomHandler:
    def __init__(self, db: DB) -> None:
        self.__db = db

    def createRoom(self, capacity, orientation, occupied):
        if self.__db.getCurrentUserType() is None:
            return "usted no tiene permisos" 

        self.__db.queryDB("INSERT INTO habitacion(capacidad, orientacion, ocupada) VALUES (%s, %s, %d)", capacity, orientation, occupied)
        self.__db.commit()
        return "success"

    def listAllRooms(self):
        if self.__db.getCurrentUserType() is None:
            return "usted no tiene permisos" 

        self.__db.queryDB("""
            SELECT h.codigo, h.orientacion, h.ocupada, AVG(oh.estado) as 'estado' FROM habitacion as h
            INNER JOIN objeto_habitacion AS oh ON oh.codigo_habitacion = h.codigo
            WHERE eliminada = false
            group by h.codigo;
        """)

        return self.__db.fetchAll()

    def deleteRoom(self, roomId):
        if self.__db.getCurrentUserType() is None:
            return "usted no tiene permisos" 

        habitacion = self.__db.queryDB("SELECT * FROM habitaicon WHERE codigo = %s", (roomId, ))
        if habitacion is None:
            return "La habitacion no existe"

        self.__db.queryDB("UPDATE habitacion SET eliminada = true WHERE codigo = %s",  (roomId, ))
        self.__db.commit()
        return "La habitacion se ha eliminada correctamente"

        

    