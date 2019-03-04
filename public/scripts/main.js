let socket = io.connect('http://' + document.domain + ':' + location.port);
socket.on('connect', function () {
    console.log('connected');
});

$('#psd-file').change(function() {
    if (!check_connection()) return;

    let reader = new FileReader();
    reader.onload = function() {
        let data = Array.from(new Uint8Array(reader.result));
        console.dir(data);
        socket.emit('send_psd', data);
    }
    let fileURL = $(this)[0].files[0];

    if (fileURL) {
        reader.readAsArrayBuffer(fileURL, 'utf-8');
    } else {
        alert('Arquivo não encontrado!');
    }
});

function check_connection() {
    let connected = socket.connected;
    if (!connected) {
        alert('Você ainda não está conectado ao servidor.');
    }
    return connected;
}