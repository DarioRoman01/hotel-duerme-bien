from typing import Dict
from db import DB
from datetime import datetime

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

    def createClient(self, rut: str, nombre: str) -> Dict:
        if self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (rut,)):
            return {'error': f'ya existe un cliente con el rut: {rut}'}

        self.__db.queryDB("INSERT INTO cliente (rut, nombre, reputacion) VALUES (%s, %s, 100)", (rut, nombre))
        self.__db.commit()
        return {'ok': 'ok'}


    def asingRoom(self, codigo_habitacion: int, codigo_cliente: str, acompanantes: list[str], fecha_termino: str):
        if not self.__db.checkExistanse("SELECT * FROM habitacion WHERE codigo = %s", (codigo_habitacion,)):
            return f"No se encontro una habitacion con el codigo {codigo_habitacion}"

        if not self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (codigo_cliente,)):
            return {"error": f"No se encontro un cliente con rut {codigo_cliente}"}
        for acompanante in acompanantes:
            if not self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (acompanante,), ):
                return {"error": f"No se encontro un cliente con rut {acompanante}"}

        now = datetime.now()
        fecha_asignacion = now.strftime("%d/%m/%Y %H:%M:%S")
        result = self.__db.queryDB("""
            INSERT INTO historial_habitacion (codigo_habitacion, codigo_cliente, activa, fecha_asignacion, fecha_termino)
            VALUES(%s, %s, true, %s, %s);
        """, (codigo_habitacion, codigo_cliente, fecha_asignacion, fecha_termino))
        
        historial =  result.fetchone()
        res = self.__db.queryDB("INSERT INTO cliente_historial (rut_cliente, codigo_historial, responsable) VALUES (%s, %s, true)", (codigo_cliente, historial[0]))
        self.__db.checkCreation(res)
        for acompanante in acompanantes:
            res = self.__db.queryDB("INSERT INTO cliente_historial (rut_cliente, codigo_historial, responsable) VALUES (%s, %s, false)", (acompanante, historial[0]))
            self.__db.checkCreation(res)

        self.__db.commit()
        return {'ok': 'ok'}

            

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

