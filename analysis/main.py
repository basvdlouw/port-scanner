import json
import os
from models.scanmodel import ScanModel
from util.utils import read_file

scan_results_directory= "scan-results"

def main():
    dir = os.path.abspath(os.path.join(os.path.realpath(__file__), "../..", scan_results_directory))
    for item in os.listdir(dir):
        file = os.path.join(dir, item, "results\scan-results.json")
        x = json.loads(read_file(file), object_hook=lambda d: ScanModel(**d))
        print(x)

if __name__ == "__main__":
    main()


