from models.scanresult import ScanResult

class ScanModel:
    def __init__(self, beginPort, endPort, nScans, nSockets, socketTimeout, scanningTechnique, totalScanTime,
                 results: list[list[ScanResult]]):
        self.begin_port = beginPort
        self.end_port = endPort
        self.n_scans = nScans
        self.n_sockets = nSockets
        self.socket_timeout = socketTimeout
        self.scanning_technique = scanningTechnique
        self.total_scan_time = totalScanTime
        self.results = [[ScanResult(**y) for y in x] for x in results]
