from analysis.models.port import Port
from analysis.models.measurement import Measurement

class ScanResult:
    def __init__(self, measurement: "Measurement", port: "Port"):
        self.measurement = measurement
        self.port = port