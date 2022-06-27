from typing import Dict
from db import DB
from datetime import datetime
from utils import AlreadyExistsError, NotCompatibleError, NotFoundError

class Client:
    def __init__(self, rut, nombre, reputacion, tipo="no esta ospedado actualmente") -> None:
        self.__rut = rut
        self.__nombre = nombre
        self.__reputacion = reputacion
        self.__tipo = tipo
        self.__habitacion = "no esta hospedado actualmente"

    def toDict(self) -> Dict:
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
    def __init__(self, db: DB) -> None:
        self.__db = db

    def createClient(self, rut: str, nombre: str):
        if self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (rut,)):
            raise AlreadyExistsError(f'ya existe un cliente con el rut: {rut}')

        self.__db.queryDB("INSERT INTO cliente (rut, nombre, reputacion) VALUES (%s, %s, 100)", (rut, nombre))
        self.__db.commit()

    def asingRoom(self, codigo_habitacion: int, acompanantes: list[str], start: str,  finish: str, responsable: str):
        if not self.__db.checkExistanse("SELECT * FROM habitacion WHERE codigo = %s", (codigo_habitacion,)):
            raise NotFoundError(f"No se encontro una habitacion con el codigo {codigo_habitacion}")

        roomData = self.__db.fetchOne()
        if len(acompanantes) > roomData[1]:
            raise NotCompatibleError(f'La habitacion {codigo_habitacion} solo tiene capacidad para {roomData[1]}')

        if not self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (responsable,)):
            raise NotFoundError(f"No se encontro un cliente con rut {responsable}")

        for acompanante in acompanantes:
            if not self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (acompanante,), ):
                raise NotFoundError(f"No se encontro un cliente con rut {acompanante}")

        if not start:
            now = datetime.now()
            fecha_asignacion = now.strftime("%d/%m/%Y %H:%M:%S")
        else:
            fecha_asignacion = start

        result = self.__db.queryDB("""
            INSERT INTO historial_habitacion (codigo_habitacion, activa, fecha_asignacion, fecha_termino)
            VALUES(%s, true, %s, %s);
        """, (codigo_habitacion, fecha_asignacion, finish))
        
        historial =  result.fetchone()
        res = self.__db.queryDB("INSERT INTO cliente_historial (rut_cliente, codigo_historial, responsable) VALUES (%s, %s, true)", (responsable, historial[0]))
        self.__db.checkCreation(res)

        for acompanante in acompanantes:
            res = self.__db.queryDB("INSERT INTO cliente_historial (rut_cliente, codigo_historial, responsable) VALUES (%s, %s, false)", (acompanante, historial[0]))
            self.__db.checkCreation(res)

        self.__db.commit()

    def listAllClients(self):
        self.__db.queryDB("SELECT * FROM cliente")
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
        query = "SELECT * FROM cliente"
        if filters.get("name") != None:
            query += f" WHERE nombre like '%{filters.get('name')}%'"

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

