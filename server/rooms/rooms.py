from typing import Dict
from db import DB
from clients import Client
from utils import AlreadyExistsError, NotFoundError, NotCompatibleError

class RoomHandler:
    def __init__(self, db: DB) -> None:
        self.__db = db

    def createRoom(self, code, capacity, orientation):
        """Crea una habitacion y verfica que el codigo de habitacion ingresado sea unico"""
        if self.__db.checkExistanse("SELECT * FROM habitacion WHERE codigo = %s", (code, )):
            raise AlreadyExistsError(f'ya existe una habitacion con el codigo {code}')

        self.__db.queryDB("INSERT INTO habitacion(codigo, capacidad, orientacion) VALUES (%s ,%s, %s)", (code, capacity, orientation))
        self.__db.commit()
        return Room(code, capacity, orientation, 'libre', None).toDict()

    def listAllRooms(self):
        """lista todas las habitaciones que no hayan sido eliminadas en la base de datos"""
        self.__db.queryDB("""
            SELECT h.codigo, h.capacidad, h.orientacion, h.estado, AVG(oh.estado) as 'estado' FROM habitacion as h
            LEFT JOIN objeto_habitacion AS oh ON oh.codigo_habitacion = h.codigo
            WHERE eliminada = false
            group by h.codigo;
        """, None)

        return [Room(r[0], r[1], r[2], r[3], r[4]).toDict() for r in self.__db.fetchAll()]

    def appendClientsToRecord(self, raw_records):
        """
        recibe un array de historiales representados como tuplas, 
        por cada historial crea un objeto de la clase RoomHistory y le agrega los clientes a este objeto 
        finalmente devuelve un array de objetos de la clase RoomHistory
        """
        records = []
        for r in raw_records:
            self.__db.queryDB("""
                select c.rut, c.nombre, c.reputacion, ch.responsable from client_historial ch
                inner join cliente c on ch.rut_cliente = c.rut
                where ch.codigo_historial = %s;
            """, (r[0], ))

            startDate = r[3].strftime("%Y-%m-%d %H:%M")
            finishDate = r[4].strftime("%Y-%m-%d %H:%M")

            record = RoomHistory(r[0], r[1], r[2], str(startDate), str(finishDate)) 
            record.setClients([Client(c[0], c[1], c[2], c[3]).toDict() for c in self.__db.fetchAll()])
            records.append(record.toDict())

        return records

    def getRoomsHistory(self):
        """Lista todos los historiales en la base de datos que no hayan sido eliminados"""
        self.__db.queryDB("SELECT * FROM historial_habitacion WHERE eliminada = false")
        raw_historys = self.__db.fetchAll()
        return self.appendClientsToRecord(raw_historys)

    def filterRoomHistory(self, filters: Dict):
        """
        Aplica filtros que son representados como un diccionario agregando clausulas a
        la delcaracion WHERE si es que el filtro es enviado por el cliente
        """
        query = "SELECT * FROM historial_habitacion WHERE eliminada = false"
        if filters.get('room') != None:
            query += f"AND codigo_habitacion = '{filters.get('room')}'" 

        if filters.get('state') != None:
            query += f" AND activa = {filters.get('state')}"

        if filters.get('start') != None:
            query += f" AND fecha_asignacion >= '{filters.get('start')}'"

        if filters.get('finish') != None:
            query += f" AND fecha_termino <= '{filters.get('finish')}'"

        self.__db.queryDB(query)
        raw_records = self.__db.fetchAll()
        return self.appendClientsToRecord(raw_records)


    def filterRooms(self, filters: Dict):
        """
        Aplica filtros al listado de habitaciones, los filtros son representados como un diccionario 
        agregando clausulas a la declaracion WHERE si es que el filtro fue enviado por el cliente
        """

        query = """
        SELECT h.codigo, h.capacidad, h.orientacion, h.estado, AVG(oh.estado) as 'estado_i' FROM habitacion as h
        LEFT JOIN objeto_habitacion AS oh ON oh.codigo_habitacion = h.codigo
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

        print(query)
        self.__db.queryDB(query)
        return [Room(r[0], r[1], r[2], r[3], r[4]).toDict() for r in self.__db.fetchAll()]

    def getRoomDetail(self, roomId):
        """Trae el detalle de una habitacion la funcion recibe el codigo el cual sera enviado por el cliente"""
        if not self.__db.checkExistanse("SELECT * FROM habitacion WHERE codigo = %s", (roomId, )):
            raise NotFoundError(f"no se encotro una habitacion con el codigo {roomId}")
            
        self.__db.queryDB("SELECT DISTINCT tipo, COUNT(tipo), AVG(estado) FROM objeto_habitacion WHERE codigo_habitacion = %s GROUP BY tipo;", (roomId, ))
        objects = [{'type': d[0], 'total': d[1], 'state': d[2]} for d in self.__db.fetchAll()]
        detail = RoomDetail(objects)

        self.__db.queryDB(""" 
        SELECT c.rut, c.nombre, c.reputacion, ch.responsable FROM historial_habitacion
        INNER JOIN client_historial ch on historial_habitacion.codigo = ch.codigo_historial
        INNER JOIN cliente c on ch.rut_cliente = c.rut
        WHERE codigo_habitacion = %s AND activa = TRUE AND eliminada = FALSE;
        """, (roomId, ))

        clients = self.__db.fetchAll()
        if clients != None:
            detail.setClients([Client(c[0], c[1], c[2], c[3]).toDict() for c in clients])

        return detail.toDict()

    def listAllObjects(self):
        """Lista todos los objetos almacenados en la base de datos que pertenescan a habitacion que no hayan sido eliminadas"""
        self.__db.queryDB("""
        SELECT oh.codigo, oh.codigo_habitacion, oh.estado, oh.tipo FROM objeto_habitacion oh
        inner join habitacion h on oh.codigo_habitacion = h.codigo
        where h.eliminada = false;
        """)
        return [RoomObject(obj[0], obj[1], obj[2], obj[3]).toDict() for obj in self.__db.fetchAll()]

    def filterObjects(self, filters: dict):
        """Aplica filtros sobre el listado de objetos recibiendo los filtros como un diccionario"""
        query = """SELECT oh.codigo, oh.codigo_habitacion, oh.estado, oh.tipo FROM objeto_habitacion oh
        inner join habitacion h on oh.codigo_habitacion = h.codigo
        where h.eliminada = false"""

        if filters.get('room') != None:
            query += f" AND oh.codigo_habitacion = '{filters.get('room')}'"

        if filters.get('type') != None:
            query += f" AND oh.tipo = '{filters.get('type')}'"

        if filters.get("max") != None or filters.get("min") != None:
            if filters.get("max") != None and filters.get("min") != None:
                query += f" AND oh.estado BETWEEN {filters['min']} AND {filters['max']}"
            
            elif filters.get("min"):
                query += f" AND oh.estado >= {filters['min']}"

            else:
                query += f" AND oh.estado <= {filters['max']}"

        self.__db.queryDB(query)
        return [RoomObject(obj[0], obj[1], obj[2], obj[3]).toDict() for obj in self.__db.fetchAll()]

    def createRoomObject(self, room, state, type):
        """Crea el un objeto de una habitacion"""
        if not self.__db.checkExistanse('SELECT * FROM habitacion WHERE codigo = %s', (room, )):
            raise NotFoundError(f'no se encontro una habitacion con el codigo: {room}')

        self.__db.queryDB('INSERT INTO objeto_habitacion (codigo_habitacion, estado, tipo) VALUES (%s, %s, %s)', (room, state, type))
        self.__db.commit()

    def deleteRoom(self, roomId):
        """Elimina logicamente una habitacion, las habitaciones solo podran ser eliminadas si es que la habitacion no esta siendo usada actualmente"""
        room = self.__db.checkExistanse("SELECT estado FROM habitacion WHERE codigo = %s", (roomId, ))
        if not room:
            raise NotFoundError(f'no se encontro una habitacion con el codigo {roomId}')
        elif room[0] != 'libre':
            raise NotCompatibleError(f'La habitacion {roomId} no puede ser eliminada porque esta siendo usada en este momento')

        self.__db.queryDB("UPDATE habitacion SET eliminada = true WHERE codigo = %s",  (roomId, ))
        self.__db.commit()

    def deleteRoomObject(self, objectId):
        """Elimina un objeto de una habitacion"""
        if not self.__db.checkExistanse("SELECT * FROM objeto_habitacion WHERE codigo = %s", (objectId, )):
            raise NotFoundError(f'No se encontro un objeto con el codigo: {objectId}')

        self.__db.queryDB("DELETE FROM objeto_habitacion WHERE codigo = %s", (objectId, ))
        self.__db.commit()

    def deleteRoomRecord(self, recordId):
        """Elimina un historial de una habitacion, el historial solo podra eliminada si es que ya no se encuentra activo"""
        record = self.__db.checkExistanse(f"SELECT activa, codigo_habitacion FROM historial_habitacion WHERE codigo = {recordId}", None)
        if not record:
            raise NotFoundError(f'no se encontro un historial de habitacion con el codigo = {recordId}')

        elif record[0] == 1:
            raise NotCompatibleError(f"este historial no puede ser eliminado por que se encuentra activa en este momento")

        self.__db.queryDB(f"UPDATE historial_habitacion SET eliminada = true WHERE codigo = {recordId}")
        self.__db.commit()

    def updateRoomObject(self, objectId, state, type):
        """actualiza la informacion de un objeto de una habitacion, solo se podra actualizar el estado y el tipo del objeto"""
        if not self.__db.checkExistanse("SELECT * FROM objeto_habitacion WHERE codigo = %s", (objectId, )):
            raise NotFoundError(f'No se encontro un objeto con el codigo: {objectId}')

        self.__db.queryDB("UPDATE objeto_habitacion SET tipo = %s, estado = %s WHERE codigo = %s", (type, state, objectId))
        self.__db.commit()

    def updateRoom(self, room, newCapacity, newOrientation, newState):
        """Actualiza la informacion de una habitacion, solo se permitira cambiar la orientacion, estado y capacidad"""
        if not self.__db.checkExistanse("SELECT * FROM habitacion WHERE codigo = %s", (room, )):
            raise NotFoundError(f'No se ha encontrado una habitacion con el codigo {room}')
        
        self.__db.queryDB("UPDATE habitacion SET orientacion = %s, capacidad = %s, estado = %s WHERE codigo = %s", (newOrientation, newCapacity, newState, room))
        self.__db.commit()

    def updateRecord(self, recordId, state, finish):
        """Actualiza un historial de una habitacion, solo se permitira cambiar el estado y la fecha en la cual los clientes dejaran la habitacion"""
        if not self.__db.checkExistanse("SELECT * FROM historial_habitacion WHERE codigo = %s", (recordId, )):
            raise NotFoundError(f'no se encontro un registro con el codigo: {recordId}')

        self.__db.queryDB("UPDATE historial_habitacion SET activa = %s, fecha_termino = %s WHERE codigo = %s", (state, finish, recordId))
        self.__db.commit()


class Room:
    """Representa una habitacion"""
    def __init__(self, codigo, capacidad, orientacion, estado, estad_i) -> None:
        self.__codigo = codigo
        self.__capacidad = capacidad
        self.__orientacion = orientacion
        self.__estado = estado
        self.__estado_i = estad_i

    def toDict(self) -> Dict:
        """combierta la clase a un diccionario"""
        return {
            "codigo": self.__codigo,
            "capacidad": self.__capacidad,
            "orientacion": self.__orientacion,
            "estado": self.__estado,
            "estado_i": round(self.__estado_i, 1) if self.__estado_i != None else 0
        }

class RoomDetail:
    """Representa el detalle de una habitacion"""
    def __init__(self, objs) -> None:
        self.__objs = objs
        self.__clients = []

    def setClients(self, clients):
        """setter para los clientes ya que no se reciben en el constructor"""
        self.__clients = clients

    def toDict(self) -> Dict:
        """combierta la clase a un diccionario"""
        return {
            "objects": self.__objs,
            "clients": self.__clients
        }

class RoomObject:
    """Representa el objeto de una habitacion"""
    def __init__(self, codigo, codigo_habitacion, estado, tipo) -> None:
        self.__codigo = codigo
        self.__codigo_habitacion = codigo_habitacion
        self.__estado = estado
        self.__tipo = tipo

    def toDict(self) -> Dict:
        """combierta la clase a un diccionario"""
        return {
            "codigo": self.__codigo,
            "habitacion": self.__codigo_habitacion,
            "estado": self.__estado,
            "tipo": self.__tipo,
        }

class RoomHistory:
    """representa un historial de una habitacion"""
    def __init__(self, codigo, codigo_habitacion, activa, fecha_asignacion, fecha_termino) -> None:
        self.__codigo = codigo
        self.__codigo_habitacion = codigo_habitacion
        self.__activa = activa
        self.__fecha_asignacion = fecha_asignacion
        self.__fecha_termino = fecha_termino
        self.__clients = []
        
    def toDict(self) -> Dict:
        """combierte el objeto en un diccionario"""
        return {
            "codigo": self.__codigo,
            "codigo_habitacion": self.__codigo_habitacion,
            "activa": self.__activa,
            "fecha_asignacion": self.__fecha_asignacion,
            "fecha_termino": self.__fecha_termino,
            "clientes": self.__clients
        }

    def setClients(self, clients):
        """setter para los clientes ya que no se reciben en el constructor"""
        self.__clients = clients
        