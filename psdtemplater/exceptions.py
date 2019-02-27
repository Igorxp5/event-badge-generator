class FileError(Exception):
    """Raise if file has read or write error."""

    def __init__(self, file, message):
        self.file = file
        self.message = message


class FontNotFoundError(OSError):
    """Raised if a font is not in OS."""

    def __init__(self, font_name, message=None):
        self.font_name = font_name
        self.message = message

    def __str__(self):
        """Return default message or message passed on constructor."""
        message = self.message
        if not self.message:
            message = f'Font {self.font_name} not found.'
        return message


class FieldNotFilled(Exception):
    """Raise if a template field is not filled"""

    def __init__(self, field, message=None):
        self.field = field
        self.message = message

    def __str__(self):
        """Return default message or message passed on constructor."""
        message = self.message
        if not self.message:
            message = f'{self.field} is not filled'
        return message
