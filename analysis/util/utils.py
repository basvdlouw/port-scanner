import os


def read_file(file_path):
    try:
        with open(file_path, 'r') as file:
            file_contents = file.read()
            return file_contents
    except FileNotFoundError:
        print("File not found")
        return None
    except IOError:
        return None


def get_results_dir(scan_results_directory: str):
    return os.path.abspath(os.path.join(os.path.realpath(__file__), "../../..", scan_results_directory))


def get_results_file(scan_results_directory: str):
    directory = get_results_dir(scan_results_directory)
    results_file = None
    for item in os.listdir(directory):
        results_file = os.path.join(directory, item, "results\\scan-results.json")
    return results_file


# get ports artificially opened via metadata file
def get_metadata_property(metadata_file: str, metadata_property: str):
    metadata_content = read_file(metadata_file)
    for line in metadata_content.split("\n"):
        separator = "="
        if separator in line:
            key, value = line.split(separator)
            if key == metadata_property:
                return value
    raise f"Property {metadata_property} not found"