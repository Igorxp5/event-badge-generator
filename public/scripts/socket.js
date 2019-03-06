let socket = io.connect('http://' + document.domain + ':' + location.port);

socket.on('connect', function () {
    console.log('connected');
});

socket.on('unavailable_fonts', function(data) {
    unavailableFonts = data['unavailable_psd_fonts'];
    unavailableFontsText = unavailableFonts.join(', ');
    defaultFont = data['default_font'];
    alertBox('As fontes <strong>' + unavailableFontsText + '</strong> '
        + 'não estão disponíveis para rederização. Elas foram '
        + 'substituídas pela fonte <strong>' + defaultFont + '</strong>.',
        ALERT_WARNING, 0);
});

socket.on('psd_layers', function (data) {
    setPSDImage(data['psd_image_data']);
    setListPSDLayers(data['editable_psd_layers']);
});

socket.on('converting_images_progress', function(data) {
    let progress = data['progress'];
    let progressValue = parseInt(progress * 100);
    loadingGeneratePDF(true, progressValue);
});

socket.on('converted_images', function(data) {
    setTimeout(function() {
        let urlBlob = generatePDFFromImages(data['images']);
        loadingGeneratePDF(true, 100);
        setPDFLinkButton(true, urlBlob);
        window.open(urlBlob);
    }, 500);
});

socket.on('error', function (data) {
    let error = data['error'];
    if (error == 'invalid_psd_file') {
        alertBox('O arquivo enviado não é um PSD válido!', ALERT_DANGER);
        loadingInputPSD(false);
    }
});