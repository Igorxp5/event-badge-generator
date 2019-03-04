import array
from pathlib import Path
from application.constants import *
from flask_socketio import SocketIO
from tempfile import NamedTemporaryFile
from werkzeug.contrib.cache import SimpleCache
from application import font_utils, psd_utils, utils, psdtemplater
from flask import Flask, request, render_template, jsonify

# Setting Flask Server
app = Flask(__name__, static_url_path='', static_folder='public')
app.config['SECRET_KEY'] = '9HVgsyXx7M67NDwj'
io = SocketIO(app)
cache = SimpleCache()

connected_clients = {}


@app.route('/')
def main():
    return app.send_static_file('index.html')


@app.route('/available-fonts')
def available_fonts():
    fonts_response = cache.get('available_fonts_response')
    if not fonts_response:
        ttf_fonts = psd_file_path.get_system_ttf_dict()
        fonts_response = jsonify([name for name in ttf_fonts])
        cache.set('available_fonts_response', fonts_response, 0)
    return fonts_response


@io.on('connect')
def handle_connect():
    connected_clients[request.sid] = {}


@io.on('disconnect')
def handle_disconnect():
    del connected_clients[request.sid]


@io.on('send_psd')
def handle_send_psd(psd_data):
    client = connected_clients[request.sid]
    psd_data = array.array('B', psd_data).tobytes()
    client[IO_CLIENT_PSD_DATA] = psd_data
    psd_file = NamedTemporaryFile(suffix='.psd', delete=False)
    with psd_file as file:
        file.write(psd_data)
    psd_file_path = Path(psd_file.name)
    psd = psd_utils.getPSD(psd_file_path)
    psd_fonts = psd_utils.get_psd_fonts(psd)
    client[IO_CLIENT_PSD] = psd
    client[IO_CLIENT_PSD_FONTS] = psd_fonts
    client[IO_CLIENT_PSD_FILE_PATH] = Path(psd_file.name)

    available_fonts_ = cache.get('available_fonts')
    if not available_fonts_:
        available_fonts_ = font_utils.get_system_ttf_dict()
        cache.set('available_fonts', available_fonts_, 0)

    available_psd_fonts = []
    for font in psd_fonts:
        if font + '.ttf' in available_fonts_.values():
            available_psd_fonts.append(font)

    if len(available_psd_fonts) != len(psd_fonts):
        unavailable = [f for f in psd_fonts if f not in available_psd_fonts]
        io.emit('unavailable_fonts', {
            'psd_fonts': psd_fonts,
            'available_psd_fonts': available_psd_fonts,
            'unavailable_psd_fonts': unavailable
        })
    else:
        editable_psd_layers = psd_utils.get_editable_psd_layers(psd_file_path)
        psd_image = psdtemplater.render_psd(psd_file_path)
        psd_image_data = utils.get_base64_from_pil_image(psd_image)
        io.emit('psd_layers', {
            'editable_psd_layers': editable_psd_layers,
            'psd_image_data': psd_image_data
        })

if __name__ == '__main__':
    io.run(app, port=3000, debug=True)
