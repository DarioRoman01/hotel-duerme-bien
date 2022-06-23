from typing import Dict
from db import DB
from datetime import datetime

class Client:
    def __init__(self, rut, nombre, reputacion, responsable="no esta ospedado actualmente") -> None:
        self.__rut = rut
        self.__nombre = nombre
        self.__reputacion = reputacion
        self.__responsable = responsable
        self.__habitacion = "no esta hospedado actualmente"

    def toDict(self) -> Dict:
        return {
            'rut': self.__rut,
            'nombre': self.__nombre,
            'reputacion': self.__reputacion,
            'habitacion': self.__habitacion,
            'responsable': self.__responsable,
        }
    
    def getRut(self):
        return self.__rut

    def setResponsable(self, responsable):
        self.__responsable = responsable

    def setHabitacion(self, codigo_habitacion) -> None:
        self.__habitacion = codigo_habitacion

class ClientsHandler:
    def __init__(self, db: DB) -> None:
        self.__db = db

    def createClient(self, rut: str, nombre: str) -> None:
        self.__db.queryDB("INSERT INTO cliente (rut, nombre, reputacion) VALUES (%s, %s, 100)", (rut, nombre))
        self.__db.commit()


    def asingRoom(self, codigo_habitacion: int, codigo_cliente: str, acompanantes: list[str], fecha_termino: str):
        self.__db.checkExistanse(
            "SELECT * FROM habitacion WHERE codigo = %s", (codigo_habitacion,), 
            f"No se encontro una habitacion con el codigo {codigo_habitacion}"
        )

        self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (codigo_cliente,), f"No se encontro un cliente con rut {codigo_cliente}")
        for acompanante in acompanantes:
            self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (acompanante,), f"No se encontro un cliente con rut {acompanante}")

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

    def listCurrentClients(self):
        self.__db.queryDB("""
            SELECT c.rut, c.nombre, c.reputacion, ch.responsable, h.codigo_habitacion FROM cliente c
            INNER JOIN client_historial as ch ON ch.rut_cliente = c.rut
            INNER JOIN historial_habitacion as h ON h.codigo = ch.codigo_historial
            WHERE h.activa = true;
        """)

        clientes = self.__db.fetchAll()
        return [Client(c[0], c[1], c[2], c[3], c[4]).toDict() for c in clientes]

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
                client.setResponsable("pasajero responsable") if client_data[0] == 1 else client.setResponsable("acompañante")
                client.setHabitacion(client_data[1])

            clients.append(client.toDict())

        return clients
