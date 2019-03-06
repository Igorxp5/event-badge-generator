# Output File
AVAILABLE_OUTPUT_FILE_EXTENSIONS = ('png',)
DEFAULT_OUTPUT_FILE_EXTENSION = AVAILABLE_OUTPUT_FILE_EXTENSIONS[0]

# Template
INPUT_FIELD_LAYER_KINDS = ['type', 'pixel']
TEMPLATE_KEY_TITLE = 'title'
TEMPLATE_KEY_PSD_FILE = 'psd_file'
TEMPLATE_KEY_PSD_COLOR_MODE = 'color_mode'
TEMPLATE_KEY_IMAGE_SIZE = 'image_size'
TEMPLATE_KEY_EXCLUDED_LAYERS = 'excluded_layers'
TEMPLATE_KEY_INPUT_FIELDS = 'input_fields'
TEMPLATE_KEY_INPUT_FIELD_LAYER_ID = 'layer_id'
TEMPLATE_KEY_INPUT_FIELD_TYPE = 'type'
TEMPLATE_KEY_INPUT_FIELD_VALUE = 'value'
TEMPLATE_KEY_INPUT_FIELD_POSITION = 'position'
TEMPLATE_KEY_INPUT_FIELD_SIZE = 'size'
TEMPLATE_KEY_INPUT_FIELD_TYPE_PROPERTIES = 'type_properties'
TEMPLATE_KEY_INPUT_FIELD_TEXT_FONT = 'font'
TEMPLATE_KEY_INPUT_FIELD_TEXT_FONT_SIZE = 'font_size'
TEMPLATE_KEY_INPUT_FIELD_TEXT_FONT_STYLE = 'font_style'
TEMPLATE_KEY_INPUT_FIELD_TEXT_ALIGNMENT = 'alignment'
TEMPLATE_KEY_INPUT_FIELD_TEXT_CHAR_CASE = 'char_case'

# Template Value
TEMPLATE_REPLACE_PATTERN = r'\{\{([^\{\}]*)\}\}'

# Base64 Pattern
BASE64_IMAGE_PATTERN = '^data:image/.+;base64,'

# DEFAULT FONT
DEFAULT_RENDER_FONT = 'arial'
