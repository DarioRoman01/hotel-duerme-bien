import tkinter as tk


class EntryWithPlaceholder(tk.Entry):
    def __init__(self, master=None, placeholder="PLACEHOLDER", color='grey', pwd=False):
        super().__init__(master)
        self.pwd = pwd
        self.placeholder = placeholder
        self.placeholder_color = color
        self.default_fg_color = self['fg']

        self.bind("<FocusIn>", self.foc_in)
        self.bind("<FocusOut>", self.foc_out)

        self.put_placeholder()

    def put_placeholder(self):
        self.insert(0, self.placeholder)
        self['fg'] = self.placeholder_color

    def foc_in(self, args):
        if self.pwd:
            self["show"] = "*"
        if self['fg'] == self.placeholder_color:
            self.delete('0', 'end')
            self['fg'] = self.default_fg_color

    def foc_out(self,args):
        if not self.get():
            self["show"] = ""
            self.put_placeholder()

