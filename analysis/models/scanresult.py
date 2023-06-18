from models.port import Port
from models.measurement import Measurement

class ScanResult:
    def __init__(self, port: "Port", measurement: "Measurement"):
        self.port = port
        self.measurement = measurement
