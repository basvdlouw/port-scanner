def read_file(file_path):
    try:
        with open(file_path, 'r') as file:
            file_contents = file.read()
            return file_contents
    except FileNotFoundError:
        raise Exception("File not found.")
    except IOError:
        raise Exception("An error occurred while reading the file.")
