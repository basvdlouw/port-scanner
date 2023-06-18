import os
from util.utils import read_file

scan_results_directory= "scan-results"

def main():
    try:
        for item in os.listdir(os.path.abspath(os.path.join(os.path.realpath(__file__), "../..", scan_results_directory))):
            for result in os.listdir(item):
                print(result)
                print(read_file(os.path.join(result, "results/scan_results.json")))
    except FileNotFoundError:
        print("Directory not found.")

if __name__ == "__main__":
    main()


