import json
import os
from plot.plot import get_plot
from models.scanmodel import ScanModel
from util.utils import read_file


scan_results_directory = "scan-results"


def main():
    scan_results: list[ScanModel] = get_results("mcr.microsoft.com/windows:20H2-amd64", "fetch")
    plot = get_plot(scan_results)
    plot.show()

def get_results(operating_system: str, scanning_technique: str):
    directory = os.path.abspath(os.path.join(os.path.realpath(__file__), "../..", scan_results_directory))
    results: list[ScanModel] = []
    for item in os.listdir(directory):
        results_file = os.path.join(directory, item, "results\\scan-results.json")
        metadata_file = os.path.join(directory, item, "metadata.txt")
        metadata_content = read_file(metadata_file)
        results_content = read_file(results_file)
        if results_content:
            technique_found = False
            os_found = False
            for line in metadata_content.split("\n"):
                separator = "="
                if separator in line:
                    key, value = line.split(separator)
                    if key == "SCANNING_TECHNIQUE" and value == scanning_technique:
                        technique_found = True
                        continue
                    if key == "BASE_IMAGE" and value == operating_system:
                        os_found = True
                        continue
            if technique_found and os_found:
                results.append(ScanModel(**json.loads(results_content)))
    return results


if __name__ == "__main__":
    main()
