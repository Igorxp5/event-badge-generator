let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function () {
    console.log('connected');
});

socket.on('unavailable_fonts', function(data) {
    console.log(data);
});
var result = undefined;
socket.on('psd_layers', function (data) {
    result = data;
    console.log(data);
});

$('#psd-file').change(function() {
    if (!check_connection()) return;

    let reader = new FileReader();
    reader.onload = function() {
        let data = Array.from(new Uint8Array(reader.result));
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