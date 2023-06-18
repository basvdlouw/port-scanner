from models.portstatus import PortStatus

class Port:
    def __init__(self, ipaddress: str, number: int, status: "PortStatus"):
        self.ipaddress = ipaddress
        self.number = number
        self.status = status