from typing import Dict
from db import DB
from datetime import datetime
from utils import AlreadyExistsError, NotCompatibleError, NotFoundError

class Client:
    """Representa a un cliente"""
    def __init__(self, rut, nombre, reputacion, tipo="no esta ospedado actualmente") -> None:
        self.__rut = rut
        self.__nombre = nombre
        self.__reputacion = reputacion
        self.__tipo = tipo
        self.__habitacion = "no esta hospedado actualmente"

    def toDict(self) -> Dict:
        """combierte la clase en un diccionario para ser parseado como un json"""
        return {
            'rut': self.__rut,
            'nombre': self.__nombre,
            'reputacion': self.__reputacion,
            'habitacion': self.__habitacion,
            'responsable': self.__tipo,
        }
    
    def getRut(self):
        return self.__rut
    
    def getTipo(self):
        return self.__tipo

    def getHabitacion(self):
        return self.__habitacion

    def setTipo(self, tipo):
        self.__tipo = tipo

    def setHabitacion(self, codigo_habitacion) -> None:
        self.__habitacion = codigo_habitacion

class ClientsHandler:
    """Clients handler es la clase encargada de las operaciones CRUD de los clientes"""
    def __init__(self, db: DB) -> None:
        self.__db = db

    def createClient(self, rut: str, nombre: str):
        """Crea un cliente en la base de datos y verifica que el rut no este registrado anteriormente"""
        if self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (rut,)):
            raise AlreadyExistsError(f'ya existe un cliente con el rut: {rut}')

        self.__db.queryDB("INSERT INTO cliente (rut, nombre, reputacion, eliminado) VALUES (%s, %s, 100, false)", (rut, nombre))
        self.__db.commit()
        return Client(rut, nombre, 100).toDict()

    def updateClient(self, rut, reputation, name):
        """actualiza la informacion de un cliente, solo se proda actualizar su reputacion y nombre"""
        if not self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (rut,)):
            raise NotFoundError(f'no se encontro un usuario con el rut: {rut}')

        self.__db.queryDB("UPDATE cliente SET reputacion = %s, nombre = %s WHERE rut = %s", (reputation, name, rut))
        self.__db.commit()

    def deleteClient(self, rut):
        """Elimina a un cliente de la base de datos, el cliente solo podra ser eliminado si no se encuentra hospedado actualmente en el hotel"""
        client = self.__db.checkExistanse("""select hh.activa, c.nombre from cliente c
        left join client_historial ch on c.rut = ch.rut_cliente
        left join historial_habitacion hh on ch.codigo_historial = hh.codigo
        where c.rut = %s;""", (rut,))

        if not client:
            raise NotFoundError(f'no se encontro un usuario con el rut: {rut}')

        elif client[0] == 1:
            raise NotCompatibleError(f'El cliente {client[1]} se encuentra hospedado actualmente')

        self.__db.queryDB("UPDATE cliente SET eliminado = true WHERE rut = %s", (rut, ))
        self.__db.commit()

    def validateRoomAsignment(self, room, responsable, companions):
        """Valida los datos enviados por el cliente al momente de asignar una habitacion a un cliente"""
        roomData = self.__db.checkExistanse("SELECT * FROM habitacion WHERE codigo = %s", (room,))
        if not roomData:
            raise NotFoundError(f"No se encontro una habitacion con el codigo {room}")

        if companions:
            if len(companions) > roomData[1]:
                raise NotCompatibleError(f'La habitacion {room} solo tiene capacidad para {roomData[1]}')

        if roomData[3] == 'ocupada':
            raise NotCompatibleError(f'La habitacion {room} ya esta ocupada')

        if not self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (responsable,)):
            raise NotFoundError(f"No se encontro un cliente con rut {responsable}")

        if self.__db.checkExistanse("""
        select c.rut, c.nombre from cliente c
        inner join client_historial ch on c.rut = ch.rut_cliente
        inner join historial_habitacion hh on ch.codigo_historial = hh.codigo
        where hh.activa = true and c.rut = %s;
        """, (responsable, )):
            raise NotCompatibleError(f'El cliente con rut {responsable} ya se encuentra hospedado en el hotel')


        if companions:
            for companion in companions:
                if not self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (companion,)):
                    raise NotFoundError(f"No se encontro un cliente con rut {companion}")

                if self.__db.checkExistanse("""
                select c.rut, c.nombre from cliente c
                inner join client_historial ch on c.rut = ch.rut_cliente
                inner join historial_habitacion hh on ch.codigo_historial = hh.codigo
                where hh.activa = true and c.rut = %s;
                """, (responsable, )):
                    raise NotCompatibleError(f'El cliente con rut {responsable} ya se encuentra hospedado en el hotel')
    def asingRoom(self, room: int, companions: list[str], start: str,  finish: str, responsable: str):
        """asigna una habitaicon a un cliente creadon un historial en la habitaicon indicada"""
        self.validateRoomAsignment(room, responsable, companions)
        start_date = ""

        if not start:
            now = datetime.now()
            start_date = now.strftime("%Y-%m-%d %H:%M:%S")
        else:
            start_date = start

        self.__db.queryDB("""
            INSERT INTO historial_habitacion (codigo_habitacion, activa, fecha_asignacion, fecha_termino, eliminada)
            VALUES(%s, true, %s, %s, false);
        """, (room, start_date, finish))
        
        recordId =  self.__db.getLastInsertedId()
        self.__db.queryDB("INSERT INTO client_historial (rut_cliente, codigo_historial, responsable) VALUES (%s, %s, true)", (responsable, recordId))

        if companions:
            for companion in companions:
                self.__db.queryDB("INSERT INTO client_historial (rut_cliente, codigo_historial, responsable) VALUES (%s, %s, false)", (companion, recordId))

        self.__db.commit()

    def listAllClients(self):
        """
        Lista a todos los clientes hospedados actualmente en la base datos y agrega informacion 
        como si esta hospedado actualmente mostrando si es el pasajero resposable o un acompañante
        """
        self.__db.queryDB("SELECT * FROM cliente where eliminado = false")
        raw_clients = self.__db.fetchAll()
        clients = []
        for c in raw_clients:
            client = Client(c[0], c[1], c[2])
            self.__db.queryDB("""
            select ch.responsable, hh.codigo_habitacion from client_historial ch
            inner join historial_habitacion hh on ch.codigo_historial = hh.codigo
            where ch.rut_cliente = %s and hh.activa = true LIMIT 1;
            """, (client.getRut(), ))

            client_data = self.__db.fetchOne()
            if client_data:
                client.setTipo("pasajero responsable") if client_data[0] == 1 else client.setTipo("acompañante")
                client.setHabitacion(client_data[1])

            clients.append(client.toDict())

        return clients

    def filterClients(self, filters: dict):
        """Aplica filtros sobre el listado de clientes recibiendo los filtros como un diccionario"""
        query = "SELECT * FROM cliente WHERE eliminado = false"
        if filters.get("name") != None:
            query += f" AND nombre like '%{filters.get('name')}%'"

        self.__db.queryDB(query)
        raw_clients = self.__db.fetchAll()
        clients = []
        for c in raw_clients:
            client = Client(c[0], c[1], c[2])
            self.__db.queryDB("""
            select ch.responsable, hh.codigo_habitacion from client_historial ch
            inner join historial_habitacion hh on ch.codigo_historial = hh.codigo
            where ch.rut_cliente = %s and hh.activa = true LIMIT 1;
            """, (client.getRut(), ))

            client_data = self.__db.fetchOne()
            if client_data:
                client.setTipo("pasajero responsable") if client_data[0] == 1 else client.setTipo("acompañante")
                client.setHabitacion(client_data[1])

            if filters.get('tipo') != None and filters.get('room') != None:
                if client.getHabitacion() == filters.get('room') and client.getTipo() == filters.get("tipo"):
                    clients.append(client.toDict())
                
            elif filters.get("tipo") != None:
                if client.getTipo() == filters.get("tipo"):
                    clients.append(client.toDict())

            elif filters.get("room") != None:
                if client.getHabitacion() == filters.get("room"):
                    clients.append(client.toDict())
            else:
                clients.append(client.toDict())


        return clients

