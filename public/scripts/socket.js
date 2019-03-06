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

socket.on('converting_images_progress', function(data) {
    let progress = data['progress'];
    let progressValue = parseInt(progress * 100);
    loadingGeneratePDF(true, progressValue);
});

socket.on('converted_images', function(data) {
    let urlBlob = generatePDFFromImages(data['images']);
    loadingGeneratePDF(true, 100);
    setPDFLinkButton(true, urlBlob);
    window.open(urlBlob);

    //let url = data['url'];
    //setPDFLinkButton(true, url);
});