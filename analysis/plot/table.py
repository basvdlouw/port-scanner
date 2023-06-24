import numpy as np
from matplotlib import pyplot as plt

from analysis.models.portstatus import PortStatus
from analysis.models.scanmodel import ScanModel
from analysis.util.utils import get_metadata_property


def get_table(data: tuple[list[ScanModel], list[str]], filename: str):
    rows = []
    for scan, metadata in zip(*data):
        base_image: str = get_metadata_property(metadata, "BASE_IMAGE")
        begin_open: int = int(get_metadata_property(metadata, "BEGIN_ARTIFICIAL_PORT_RANGE"))
        end_open: int = int(get_metadata_property(metadata, "END_ARTIFICIAL_PORT_RANGE"))
        detected_open_ports = 0
        for scan_result in scan.results:
            print(scan_result[0].port.status)
            if scan_result[0].port.status == PortStatus.OPEN:
                detected_open_ports += 1
        rows.append([base_image, scan.scanning_technique, (end_open-begin_open+1), detected_open_ports, round(float(scan.total_scan_time), 1)])

    # Sample data
    data = rows

    # Create table
    fig, ax = plt.subplots(figsize=(13, 9))
    ax.axis('off')
    table = ax.table(
        cellText=data,
        colLabels=["Base Image", "Scanning technique", "Open Ports", "Ports Detected", "Scan Duration"],
        cellLoc='center',
        loc='center',
    )

    # Adjust table settings
    table.auto_set_font_size(True)
    table.scale(1.3, 1.3)
    plt.savefig(f"figs/{filename}", dpi=300)
    return plt
