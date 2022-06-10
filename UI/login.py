import kivy
from kivy.app import App
from kivy.uix.label import Label
from kivy.uix.gridlayout import GridLayout
from kivy.uix.textinput import TextInput
from kivy.uix.button import Button
from kivy.properties import ObjectProperty
from kivy.uix.screenmanager import Screen, ScreenManager

class LoginLayout(GridLayout):
    def __init__(self, **kwargs,):
        super(LoginLayout, self).__init__(**kwargs)
        # Set columns
        self.cols = 1
        self.spacing=10
        self.row_force_default=True
        self.row_default_height=40

        # Add widgets
        self.add_widget(Label(text="username: "))
        self.username = TextInput(multiline=True)
        self.add_widget(self.username)

        self.add_widget(Label(text="password: "))
        self.pwd = TextInput(multiline=False)
        self.add_widget(self.pwd)

    def press(self, manager):
        username = self.username.text
        pwd = self.pwd.text
        if username == "admin" and pwd == "admin":
            manager.current = 'main'
        else:
            self.username.text = ""
            self.pwd.text = ""

class LoginScreen(Screen):
    pass

class MainScreen(Screen):
    pass

class HotelApp(App):
    def build(self):
        self.__sm = ScreenManager()
        self.__sm.add_widget(LoginScreen(name="login"))
        self.__sm.add_widget(MainScreen(name="main"))
        return self.__sm

if __name__ == '__main__':
	HotelApp().run()