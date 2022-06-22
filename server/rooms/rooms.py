from typing import Dict
from db import DB
from clients import Client

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

    def appendClientsToRecord(self, raw_records):
        records = []
        for r in raw_records:
            self.__db.queryDB("""
                select c.rut, c.nombre, c.reputacion, ch.responsable from client_historial ch
                inner join cliente c on ch.rut_cliente = c.rut
                where ch.codigo_historial = %s;
            """, (r[0], ))

            record = RoomHistory(r[0], r[1], r[2], r[3], r[4]) 
            record.setClients([Client(c[0], c[1], c[2], c[3]).toDict() for c in self.__db.fetchAll()])
            records.append(record.toDict())

        return records

    def getRoomsHistory(self):
        self.__db.queryDB("SELECT * FROM historial_habitacion;")
        raw_historys = self.__db.fetchAll()
        return self.appendClientsToRecord(raw_historys)

    def filterRoomHistory(self, filters: Dict):
        query = "SELECT * FROM historial_habitacion WHERE "
        first = False

        if filters.get('room') != None:
            first = True
            query += f"codigo_habitacion = '{filters.get('room')}'" 

        if filters.get('state') != None:
            if first:
                query += f" AND activa = {filters.get('state')}"
            else: 
                first = True
                query += f" activa = {filters.get('state')}" 

        if filters.get('start') != None:
            if first:
                query += f" AND fecha_asignacion >= '{filters.get('start')}'"
            else:
                first = True
                query += f" fecha_asignacion >= '{filters.get('start')}'"

        if filters.get('finish') != None:
            if first:
                query += f" AND fecha_termino <= '{filters.get('finish')}'"
            else:
                first = True
                query += f" fecha_termino <= '{filters.get('finish')}'"

        print(query)
        self.__db.queryDB(query)
        raw_records = self.__db.fetchAll()
        return self.appendClientsToRecord(raw_records)


    def filterRooms(self, filters: Dict):
        query = """
        SELECT h.codigo, h.capacidad, h.orientacion, h.estado, AVG(oh.estado) as 'estado_i' FROM habitacion as h
        INNER JOIN objeto_habitacion AS oh ON oh.codigo_habitacion = h.codigo
        WHERE eliminada = false
        """        

        if filters.get("capacidad") != None:
            query += f" AND capacidad = {filters['capacidad']}"

        if filters.get("orientacion") != None:
            query += f" AND h.orientacion = '{filters['orientacion']}'"

        if filters.get("estado") != None:
            query += f" AND h.estado = '{filters['estado']}'"

        query += " group by h.codigo"
        if filters.get("max") != None or filters.get("min") != None:
            if filters.get("max") != None and filters.get("min") != None:
                query += f" HAVING estado_i BETWEEN {filters['min']} AND {filters['max']}"
            
            elif filters.get("min"):
                query += f" HAVING estado_i >= {filters['min']}"

            else:
                query += f" HAVING estado_i <= {filters['max']}"

        self.__db.queryDB(query)
        return [Room(r[0], r[1], r[2], r[3], round(r[4], 1)).toDict() for r in self.__db.fetchAll()]

    def getAllRoomObjects(self, codgio_habitacion):
        self.__db.queryDB("SELECT * FROM objeto_habitacion WHERE codigo_habitacion = %s", (codgio_habitacion))
        return [RoomObject(o[0], o[1], o[2], o[3]).toDict() for o in self.__db.fetchAll()]   

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

class RoomHistory:
    def __init__(self, codigo, codigo_habitacion, activa, fecha_asignacion, fecha_termino) -> None:
        self.__codigo = codigo
        self.__codigo_habitacion = codigo_habitacion
        self.__activa = activa
        self.__fecha_asignacion = fecha_asignacion
        self.__fecha_termino = fecha_termino
        self.__clients = []
        
    def toDict(self) -> Dict:
        return {
            "codigo": self.__codigo,
            "codigo_habitacion": self.__codigo_habitacion,
            "activa": self.__activa,
            "fecha_asignacion": self.__fecha_asignacion,
            "fecha_termino": self.__fecha_termino,
            "clientes": self.__clients
        }

    def setClients(self, clients):
        self.__clients = clients
        