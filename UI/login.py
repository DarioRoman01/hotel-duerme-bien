from tkinter import *


#Ventana / ajustar w y h
window = Tk()
window.geometry("500x350")
# ===========================Titulo de la app===================================== #
window.title("Hotel Duerme Bien")

# ===========================Login como administrador o gerente (button)===================================== #
label = Label(window, text= "Login",
            font=("monospace", 20),
            padx=20,
            pady=20)
label.pack()

#Botones para ingresar como administrador o gerente
button1 = Button(window,
                text="Gerente",
                font=("monospace", 15),
                state=ACTIVE,
                padx=10,
                pady=10,)
button1.pack()

button2 = Button(window,
                text="Administrador",
                font=("monospace", 15),
                state=ACTIVE,
                padx=10,
                pady=10,)
button2.pack()

# =========================Final======================================= #
#Hasta aca se ejecuta todo lo que va en el archivo
window.mainloop()