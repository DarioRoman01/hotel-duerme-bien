from cgitb import text
from logging import PlaceHolder
from sqlite3 import DateFromTicks
from tkinter import *
from utils import EntryWithPlaceholder


#Ventana / ajustar w y h
window = Tk()
window.geometry("500x350")
# ===========================Titulo de la app===================================== #
window.title("Hotel Duerme Bien")


# ===========================Login como administrador o gerente (ingresa datos)===================================== #
label = Label(window, text= "Login",
            font=("monospace", 20),
            padx=20,
            pady=20)
label.pack()



#input de los datos de usuario y contraseña mas boton aceptar y cancelar
user = EntryWithPlaceholder(master=window,
                            placeholder="Usuario",)
user.pack()


password = EntryWithPlaceholder(master=window, 
                                placeholder="Contraseña",
                                pwd=True)
password.pack()


btnAccept = Button(window,
                text="Aceptar",
                font=("monospace", 10),
                state=ACTIVE,
                padx=5,
                pady=5,)
btnAccept.pack()

btnCancel = Button(window,
                text="Cancelar",
                font=("monospace", 10),
                state=ACTIVE,
                padx=5,
                pady=5,)
btnCancel.pack()



















# =========================Final======================================= #
#Hasta aca se ejecuta todo lo que va en el archivo
window.mainloop()