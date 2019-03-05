let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function () {
    console.log('connected');
});

socket.on('unavailable_fonts', function(data) {
    console.log(data);
});

socket.on('psd_layers', function (data) {
    setPSDImage(data['psd_image_data']);
    setListPSDLayers(data['editable_psd_layers']);
});

socket.on('pdf_file', function(data) {

});