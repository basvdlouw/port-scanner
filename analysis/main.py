import json
import os
from plot.plot import get_plot_efficacy, get_plot_parallel_sockets
from models.scanmodel import ScanModel
from util.utils import read_file, get_results_dir

scan_results_directory = "scan-results\\efficacy"
op_sys = "windows"
browser = "chrome"
image = "mcr.microsoft.com/windows:20H2-amd64"
# image = "library/ubuntu:22.04"
plot_type = "efficacy"
scan_technique = "fetch"
filename = f"{plot_type}/{op_sys}_{browser}_{plot_type}_{scan_technique}.png"
art_ports = "50033"

def main():
    scan_results: tuple[list[ScanModel], list[str]] = get_results(["SCANNING_TECHNIQUE", "END_ARTIFICIAL_PORT_RANGE", "BASE_IMAGE"], [scan_technique, art_ports, image], "total_scan_time")
    # plot = get_plot_parallel_sockets(scan_results, filename)
    plot = get_plot_efficacy(scan_results, filename)
    plot.show()


def get_results(filter_properties: [], filter_values: [], sort_key: str):
    directory = get_results_dir(scan_results_directory)
    results: list[ScanModel] = []
    metadata_files: list[str] = []
    for item in os.listdir(directory):
        results_file = os.path.join(directory, item, "results\\scan-results.json")
        metadata_file = os.path.join(directory, item, "metadata.txt")
        metadata_files.append(metadata_file)
        metadata_content = read_file(metadata_file)
        results_content = read_file(results_file)
        if results_content:
            properties_found: set = set()
            for line in metadata_content.split("\n"):
                separator = "="
                if separator in line:
                    key, value = line.split(separator)
                    for index, metadata_property in enumerate(filter_properties):
                        if key == metadata_property and value == filter_values[index]:
                            properties_found.add(metadata_property)
            print(properties_found)
            if len(properties_found) == len(filter_properties):
                results.append(ScanModel(**json.loads(results_content)))
    results.sort(key=lambda x: getattr(x, sort_key))
    return results, metadata_files


if __name__ == "__main__":
    main()
