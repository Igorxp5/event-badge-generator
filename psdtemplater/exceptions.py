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


class FieldNotFilledError(Exception):
    """Raise if a template field is not filled."""

    def __init__(self, field, message=None):
        self.field = field
        self.message = message

    def __str__(self):
        """Return default message or message passed on constructor."""
        message = self.message
        if not self.message:
            message = f'{self.field} is not filled.'
        return message


class LayerIDNotFoundError(Exception):
    """Raise when it is tried to acess a layer that doesn't exist."""

    def __init__(self, id_, message=None):
        self.id = id_
        self.message = message

    def __str__(self):
        message = self.message
        if not self.message:
            message = f'The id {self.id} doesn\'t exist.'
        return message


class InvalidLayerTypeError(Exception):
    """Raise if a layer type unknown or invalid is used."""

    def __init__(self, type_, message):
        self.type = type_
        self.message = message

    def __str__(self):
        return self.message


class UsageColisionError(Exception):
    """Raise if the same resource are used in more than one local."""

    def __init__(self, message, extra=None):
        self.message = message
        self.extra = extra

    def __str__(self):
        return self.message
