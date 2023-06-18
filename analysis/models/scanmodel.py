from models.scanresult import ScanResult

class ScanModel:
    def __init__(self, begin_port, end_port, n_scans, n_sockets, socket_timeout, scanning_technique, total_scan_time,
                 scan_results: list[list[ScanResult]]):
        self.begin_port = begin_port
        self.end_port = end_port
        self.n_scans = n_scans
        self.n_sockets = n_sockets
        self.socket_timeout = socket_timeout
        self.scanning_technique = scanning_technique
        self.total_scan_time = total_scan_time
        self.scan_results = scan_results