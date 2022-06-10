from db import DB  
from staff import StaffHandler

if __name__ == "__main__":
    handler = StaffHandler(DB())
    print(handler.loginUser('admin1', 'admin123'))