from collections import OrderedDict

import matplotlib.pyplot as plt
from datetime import datetime

import numpy as np

from models.scanmodel import ScanModel

from analysis.util.utils import get_metadata_property


def get_plot_parallel_sockets(data: list[ScanModel], filename: str):
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


def get_plot_efficacy(data: tuple[list[ScanModel], list[str]], filename: str, title: str):
    plt.rcParams["figure.autolayout"] = True
    plt.figure(figsize=(10, 6))  # Width: 10 inches, Height: 6 inches
    plt.tight_layout()

    x = []
    colors = []
    for scan, metadata in zip(*data):
        begin_open: int = int(get_metadata_property(metadata, "BEGIN_ARTIFICIAL_PORT_RANGE"))
        end_open: int = int(get_metadata_property(metadata, "END_ARTIFICIAL_PORT_RANGE"))
        begin: int = int(get_metadata_property(metadata, "BEGIN_PORT"))
        end: int = int(get_metadata_property(metadata, "END_PORT"))
        port_ranges = [(begin, begin_open - 1), (begin_open, end_open), (end_open + 1, end)]
        for scan_result in scan.results:
            if begin_open <= scan_result[0].port.number <= end_open:
                colors.append("green")
            else:
                colors.append("red")
            x.append(scan_result[0].measurement.duration)

    fig, ax = plt.subplots()

    for index, z in enumerate(x):
        if colors[index] == "green":
            plt.hist(z, bins=10, alpha=0.7, color=colors[index], label="Open port")
        else:
            plt.hist(z, bins=10, alpha=0.7, color=colors[index], label="Closed port")
    # ax.hist(x, bins=10, edgecolor='black')

    ax.set_xlabel('Duration (ms)')
    ax.set_title(title)

    plt.yticks([])
    handles, labels = plt.gca().get_legend_handles_labels()
    by_label = OrderedDict(zip(labels, handles))
    plt.legend(by_label.values(), by_label.keys())
    plt.savefig(f"figs/{filename}", dpi=300)
    return plt
