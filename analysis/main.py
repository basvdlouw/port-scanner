import json
import os

from analysis.plot.table import get_table
from plot.plot import get_plot_efficacy, get_plot_parallel_sockets
from models.scanmodel import ScanModel
from util.utils import read_file, get_results_dir

# scan_results_directory = "scan-results/efficacy/firefox"
# browser = "Firefox"
scan_results_directory = "scan-results/efficacy/chrome"
browser = "Chrome"
op_sys = "Windows"
# op_sys = "Ubuntu"
image = "mcr.microsoft.com/windows:20H2-amd64"
# image = "library/ubuntu:22.04"
plot_type = "efficacy"
scan_technique = "WebSocket"
filename = f"{plot_type}/{op_sys.lower()}_{browser.lower()}_{plot_type}_{scan_technique}.png"
begin_art_ports = "50000"
end_art_ports = "50099"
filter = ["BASE_IMAGE", "SCANNING_TECHNIQUE", "BEGIN_ARTIFICIAL_PORT_RANGE", "END_ARTIFICIAL_PORT_RANGE"]
filter_values = [image, scan_technique, begin_art_ports, end_art_ports]

def main():
    scan_results: tuple[list[ScanModel], list[str]] = get_results(filter, filter_values, "total_scan_time")
    # plot = get_plot_parallel_sockets(scan_results, filename)
    plot = get_plot_efficacy(scan_results, filename, f"{op_sys} {browser} {scan_technique}")
    # plot = get_table(scan_results, "table.png")
    plot.show()


# returns list of typed <ScanModel, metadata> objects based on scan results (json files)
# Returns tuple[list[ScanModel], list[str]]
def get_results(filter_properties: [], filter_values: [], sort_key: str):
    directory = get_results_dir(scan_results_directory)
    results: list[ScanModel] = []
    metadata_files: list[str] = []
    for item in os.listdir(directory):
        results_file = os.path.join(directory, item, "results\\scan-results.json")
        metadata_file = os.path.join(directory, item, "metadata.txt")
        metadata_content = read_file(metadata_file)
        results_content = read_file(results_file)
        if results_content:
            properties_found: set = set()
            for line in metadata_content.split("\n"):
                separator = "="
                if separator in line:
                    key, value = line.split(separator)
                    for index, metadata_property in enumerate(filter_properties):
                        if key == metadata_property and value.lower() == filter_values[index].lower():
                            properties_found.add(metadata_property)
            if len(properties_found) == len(filter_properties):
                results.append(ScanModel(**json.loads(results_content)))
                metadata_files.append(metadata_file)
    # results.sort(key=lambda x: getattr(x, sort_key))
    return results, metadata_files


if __name__ == "__main__":
    main()
