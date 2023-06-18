import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime, timedelta

from models.scanmodel import ScanModel

from analysis.util.utils import get_random_color


def get_plot(data: list[ScanModel]):
    plt.style.use('_mpl-gallery')

    y: list[int] = [*range(1, 65536)]
    x = []

    for scan in data:
        z = []
        begin_date: str = scan.results[0][0].measurement.startTimeOfScan
        start_date = datetime.strptime(begin_date[:-1], "%Y-%m-%dT%H:%M:%S.%f")
        for scan_result in scan.results:
            end_time: str = scan_result[0].measurement.endTimeOfScan
            end_date = datetime.strptime(end_time[:-1], "%Y-%m-%dT%H:%M:%S.%f")
            delta = (end_date - start_date).total_seconds() * 1000
            z.append(delta)
        x.append(z)

    for index, scan in enumerate(x):
        plt.plot(scan, y, color=get_random_color(), label=data[index].n_sockets)
    plt.rcParams["figure.autolayout"] = True
    plt.rcParams["figure.figsize"] = [1000, 1000]
    plt.xlabel("Time")
    plt.ylabel("Ports scanned")
    plt.title("Parallel sockets")
    plt.legend(loc='upper center')
    plt.savefig("output.png", dpi=10006)
    # plt.grid(True)
    return plt
