class FileError(Exception):
    """Represent some exception involving a file as read or write error."""

    def __init__(self, file, message):
        self.file = file
        self.message = message
