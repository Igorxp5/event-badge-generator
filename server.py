import array
from application import util
from flask_socketio import SocketIO
from tempfile import NamedTemporaryFile
from werkzeug.contrib.cache import SimpleCache
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
    fonts_response = cache.get('fonts_response')
    if not fonts_response:
        ttf_fonts = util.get_system_ttf_font_files()
        fonts_response = jsonify([name for name in ttf_fonts])
        cache.set('fonts_response', fonts_response, 0)
    return fonts_response


@io.on('connect')
def handle_connect():
    connected_clients[request.sid] = {}


@io.on('disconnect')
def handle_disconnect():
    del connected_clients[request.sid]


@io.on('send_psd')
def handle_send_psd(psd_data):
    psd_data = array.array('B', psd_data).tobytes()
    connected_clients[request.sid]['psd_data'] = psd_data
    psd_file = NamedTemporaryFile(suffix='.psd', delete=False)
    with psd_file as file:
        file.write(psd_data)
    connected_clients[request.sid]['psd_file'] = psd_file

if __name__ == '__main__':
    io.run(app, port=3000, debug=True)
