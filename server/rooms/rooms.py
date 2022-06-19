from typing import Dict
from db import DB

class RoomHandler:
    def __init__(self, db: DB) -> None:
        self.__db = db

    def createRoom(self, capacity, orientation, occupied):
        self.__db.queryDB("INSERT INTO habitacion(capacidad, orientacion, ocupada) VALUES (%s, %s, %d)", capacity, orientation, occupied)
        self.__db.commit()
        return "success"

    def listAllRooms(self):
        self.__db.queryDB("""
            SELECT h.codigo, h.capacidad, h.orientacion, h.estado, AVG(oh.estado) as 'estado' FROM habitacion as h
            INNER JOIN objeto_habitacion AS oh ON oh.codigo_habitacion = h.codigo
            WHERE eliminada = false
            group by h.codigo;
        """, None)

        return [Room(r[0], r[1], r[2], r[3], round(r[4], 1)).toDict() for r in self.__db.fetchAll()]

    def getAllRoomObjects(self, codgio_habitacion):
        self.__db.queryDB("SELECT * FROM objeto_habitacion WHERE codigo_habitacion = %s", (codgio_habitacion))
        return [RoomObject(o[0], o[0], o[0], o[0]).toDict() for o in self.__db.fetchAll()]   

    def deleteRoom(self, roomId):
        habitacion = self.__db.queryDB("SELECT * FROM habitaicon WHERE codigo = %s", (roomId, ))
        if habitacion is None:
            return "La habitacion no existe"

        self.__db.queryDB("UPDATE habitacion SET eliminada = true WHERE codigo = %s",  (roomId, ))
        self.__db.commit()
        return "La habitacion se ha eliminada correctamente"

        
class Room:
    def __init__(self, codigo, capacidad, orientacion, estado, estad_i) -> None:
        self.codigo = codigo
        self.capacidad = capacidad
        self.orientacion = orientacion
        self.estado = estado
        self.estado_i = estad_i

    def toDict(self) -> Dict:
        return {
            "codigo": self.codigo,
            "capacidad": self.capacidad,
            "orientacion": self.orientacion,
            "estado": self.estado,
            "estado_i": self.estado_i
        }

class RoomObject:
    def __init__(self, codigo, codigo_habitacion, estado, tipo) -> None:
        self.__codigo = codigo
        self.__codigo_habitacion = codigo_habitacion
        self.__estado = estado
        self.__tipo = tipo

    def toDict(self) -> Dict:
        return {
            "codigo": self.__codigo,
            "codigo_habitacion": self.__codigo_habitacion,
            "estado": self.__estado,
            "tipo": self.__tipo,
        }
    