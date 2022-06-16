import mysql.connector
import os
from dotenv import load_dotenv
from utils import NotFoundError, NotCreatedErorr


class DB:
    """
    DB es una clase encargada de la conexion con la base de datos ademas
    de la creacion de las tablas, querys y commits
    """

    def __init__(self) -> None:
        load_dotenv()
        config = {
            'user': os.getenv("db_username"),
            'password': os.getenv("db_password"),
            'host': os.getenv("db_host"),
            'database': os.getenv("db_name"),
            'port': os.getenv("db_port")
        }

        self.__conn = mysql.connector.connect(**config)
        self.__cursor = self.__conn.cursor()
    
    def disconnect(self) -> None:
        """Se encarga de la desconeccion con la base de datos cerrando el cursor y luego la coneccion"""
        self.__cursor.close()
        self.__conn.close()

    def migrate(self) -> None:
        """migrate es una funcion que se encarga de crear las tablas en la base de datos si es que estas no existen"""
        self.queryDB("""
        CREATE TABLE IF NOT EXISTS usuario (
            codigo bigint PRIMARY KEY AUTO_INCREMENT NOT NULL,
            username varchar(50) NOT NULL,
            password varchar(20) NOT NULL ,
            type enum('administrador', 'gerente') NOT NULL
        );


        CREATE TABLE IF NOT EXISTS habitacion (
            codigo bigint PRIMARY KEY AUTO_INCREMENT NOT NULL ,
            capacidad tinyint NOT NULL,
            orientacion varchar(20) NOT NULL,
            ocupada bool NOT NULL,
            eliminada bool default false NOT NULL
        );

        CREATE TABLE IF NOT EXISTS cliente (
            rut varchar(12) PRIMARY KEY NOT NULL,
            nombre varchar(100) NOT NULL,
            reputacion tinyint(100) NOT NULL
        );

        CREATE TABLE IF NOT EXISTS historial_habitacion (
            codigo BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            codigo_habitacion BIGINT NOT NULL,
            codigo_cliente VARCHAR(12) NOT NULL,
            activa BOOL NOT NULL,
            fecha_asignacion DATETIME NOT NULL,
            fecha_termino DATETIME NOT NULL,
            FOREIGN KEY (codigo_cliente) REFERENCES  cliente(rut),
            FOREIGN KEY (codigo_habitacion) REFERENCES habitacion(codigo)
        );

        CREATE TABLE IF NOT EXISTS acompañante (
            codigo BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            codigo_historial BIGINT NOT NULL,
            rut_acompañante VARCHAR(12),
            FOREIGN KEY (codigo_historial) REFERENCES historial_habitacion(codigo),
            FOREIGN KEY (rut_acompañante) REFERENCES cliente(rut)
        );

        CREATE TABLE IF NOT EXISTS objeto_habitacion (
            codigo BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            codigo_habitacion BIGINT NOT NULL,
            estado TINYINT(10),
            tipo ENUM(
                'cama', 
                'espejo', 
                'velador', 
                'televisor', 
                'silla', 
                'control', 
                'aire_acondicionado', 
                'sabanas', 
                'frasadas', 
                'toallas', 
                'almohadas', 
                'nevera',
                'caja_fuerte',
                'telefono_servicio'
            ),
            FOREIGN KEY (codigo_habitacion) REFERENCES habitacion(codigo)
        );

        CREATE TABLE IF NOT EXISTS daño_habitacion (
            codigo BIGINT PRIMARY KEY AUTO_INCREMENT NOT NULL,
            codigo_habitacion BIGINT NOT NULL,
            rut_cliente VARCHAR(12),
            codigo_objeto BIGINT NOT NULL,
            descripcion varchar(500),
            nivel_daños TINYINT(100),
            FOREIGN KEY (codigo_habitacion) REFERENCES habitacion(codigo),
            FOREIGN KEY (rut_cliente) REFERENCES cliente(rut)
        );
        """)

    def fetchOne(self):
        """trae un elemento actualmente guardado en el cursor"""
        return self.__cursor.fetchone()

    def fetchAll(self):
        """trae todos los elementos actualmente guardados en el cursor"""
        return self.__cursor.fetchall()

    def checkExistanse(self, query, args, errMessage):
        self.queryDB(query, args)
        obj = self.fetchOne()
        if obj is None:
            raise NotFoundError(errMessage)

    def checkCreation(self, result):
        if not result.with_rows:
            raise NotCreatedErorr("No se ha creado el objeto correctamente") 

    def commit(self):
        """realiza el commmit para que los cambios se vean reflejados en la base de datos"""
        self.__conn.commit()

    def queryDB(self, query: str, args: tuple):
        """queryDB es la funcion encargada de ejecutar los querys enviados por otras clases o funciones que lo requieran"""
        return self.__cursor.execute(query, args)


