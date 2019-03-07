import re
from enum import Enum


class PSDLayer(str, Enum):
    """Possible PSD Layer types."""

    TYPE = 'type'
    PIXEL = 'pixel'
    SHAPE = 'shape'
    GROUP = 'group'
    PSD_IMAGE = 'psdimage'
    SMART_OBJECT = 'smartobject'


class TextLayerAlignment(int, Enum):
    """Represents text layer aligment, present in
    the 'Justification' property of the layer.
    """

    LEFT = 1
    CENTER = 2
    RIGHT = 3

    @staticmethod
    def get_text_layer_alignment(text_layer):
        """Get alignment of a text layer."""
        runarray = text_layer.engine_dict['ParagraphRun']['RunArray']
        paragraph_sheet = runarray[0]['ParagraphSheet']
        justification = paragraph_sheet['Properties']['Justification']
        return TextLayerAlignment(justification)


class CharSequenceCase(str, Enum):
    """Represents possible characters case: Title, Uppercase, Lowercase."""

    TITLE = ('title', lambda s: s.istitle(), lambda s: s.title())
    UPPERCASE = ('uppercase', lambda s: s.isupper(), lambda s: s.upper())
    LOWERCASE = ('lowercase', lambda s: s.islower(), lambda s: s.lower())

    def __new__(cls, *args, **kwds):
        # __new__ changed to JSON.dumps recognize this object as string.
        obj = str.__new__(cls, args[0])
        obj._value_ = args[0]
        return obj

    def __init__(self, value, test, func):
        self.test = test
        self.func = func

    def __call__(self, s):
        """Apply the character style into string passed."""
        return self.func(s)

    @staticmethod
    def get_char_sequence_case(s):
        """Get CharSequenceCase of a string."""
        for char_sequence_case in CharSequenceCase:
            if char_sequence_case.test(s):
                return char_sequence_case
        return None

    def test(self, s):
        """Test if the string passed is the type of character
        style that the enum object represents.
        """
        return self.test(s)


class FontStyle(str, Enum):
    """Represents possible font styles of a text layer."""

    BOLD = 'bold'
    ITALIC = 'italic'
    UNDERLINE = 'underline'

    def get_font_styles(text_layer):
        """Get a list of font styles in a text layer."""
        rundata = text_layer.engine_dict['StyleRun']['RunArray']
        stylesheet = rundata[0]['StyleSheet']['StyleSheetData']
        fontset = text_layer.resource_dict['FontSet']
        font_name = str(fontset[stylesheet['Font']]['Name']).lower()

        has_bold_font = 'bold' in font_name
        has_bold_font = has_bold_font or bool(stylesheet.get('FauxBold'))

        has_italic_font = 'italic' in font_name
        has_italic_font = has_italic_font or bool(stylesheet.get('FauxItalic'))

        has_underline_font = bool(stylesheet.get('Underline'))

        has_fonts_styles = {
            FontStyle.BOLD: has_bold_font,
            FontStyle.ITALIC: has_italic_font,
            FontStyle.UNDERLINE: has_underline_font
        }

        return [style for style, has in has_fonts_styles.items() if has]
