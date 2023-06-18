import datetime

class Measurement:
    def __init__(self, startTimeOfScan: datetime, endTimeOfScan: datetime, duration: int, receivedData: bool, timedOut: bool):
        self.startTimeOfScan = startTimeOfScan
        self.endTimeOfScan = endTimeOfScan
        self.duration = duration
        self.receivedData = receivedData
        self.timedOut = timedOut