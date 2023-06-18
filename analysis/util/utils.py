from random import randrange


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


def get_random_color():
    r = randrange(256)  # Random value for red (0-255)
    g = randrange(256)  # Random value for green (0-255)
    b = randrange(256)  # Random value for blue (0-255)
    color = f'#{r:02x}{g:02x}{b:02x}'  # Format RGB values as a hexadecimal color code
    return color
