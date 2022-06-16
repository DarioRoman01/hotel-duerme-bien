from typing import Dict, List
from db import DB
from utils import NotCreatedErorr
from datetime import datetime

class Client:
    def __init__(self, rut, nombre, reputacion) -> None:
        self.rut = rut
        self.nombre = nombre
        self.reputacion = reputacion

    def toDict(self) -> Dict:
        return {
            'rut': self.rut,
            'nombre': self.nombre,
            'reputacion': self.reputacion,
        }
        

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

        queryResponsable = False
        for acompanante in acompanantes:
            if not queryResponsable:
                self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (codigo_cliente,), f"No se encontro un cliente con rut {codigo_cliente}")
                queryResponsable = True

            self.__db.checkExistanse("SELECT * FROM cliente WHERE rut = %s", (acompanante,), f"No se encontro un cliente con rut {acompanante}")

        now = datetime.now()
        fecha_asignacion = now.strftime("%d/%m/%Y %H:%M:%S")
        result = self.__db.queryDB("""
            INSERT INTO historial_habitacion (codigo_habitacion, codigo_cliente, activa, fecha_asignacion, fecha_termino)
            VALUES(%s, %s, true, %s, %s);
        """, (codigo_habitacion, codigo_cliente, fecha_asignacion, fecha_termino))
        
        self.__db.checkCreation(result)

        historial =  result.fetchone()
        for acompanante in acompanantes:
            res = self.__db.queryDB("INSERT INTO acompañante (rut_acompañante, codigo_historial) VALUES (%s, %s)", (acompanante, historial[0]))
            self.__db.checkCreation(res)





        
