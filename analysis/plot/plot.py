import matplotlib.pyplot as plt
from datetime import datetime

from models.scanmodel import ScanModel



def get_plot_parallel_sockets(data: list[ScanModel], filename: str):
    plt.style.use('_mpl-gallery')
    plt.rcParams["figure.autolayout"] = True
    plt.figure(figsize=(10, 6))  # Width: 10 inches, Height: 6 inches
    plt.tight_layout()
    plt.xlabel("Time (seconds)")
    plt.ylabel("Ports scanned")
    plt.title("N Parallel sockets, 200ms Socket timeout")
    # fig = plt.figure(figsize=(10, 10))

    y: list[int] = [*range(1, 65536)]
    x = []

    for scan in data:
        z = []
        begin_date: str = scan.results[0][0].measurement.startTimeOfScan
        start_date = datetime.strptime(begin_date[:-1], "%Y-%m-%dT%H:%M:%S.%f")
        for scan_result in scan.results:
            end_time: str = scan_result[0].measurement.endTimeOfScan
            end_date = datetime.strptime(end_time[:-1], "%Y-%m-%dT%H:%M:%S.%f")
            delta = (end_date - start_date).total_seconds()
            z.append(delta)
        x.append(z)

    for index, scan in enumerate(x):
        plt.plot(scan, y, color="rbgkm"[index], label=data[index].n_sockets)
    plt.legend()
    plt.savefig(f"figs/{filename}", dpi=300)
    return plt
