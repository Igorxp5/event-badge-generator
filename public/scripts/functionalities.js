//Exceptions
class InvalidQuantityColsError extends Error {}
class MissingColsError extends Error {}

function checkConnection() {
    let connected = socket.connected;
    if (!connected) {
        alert('Você ainda não está conectado ao servidor.');
    }
    return connected;
}

function alertBox(text, type, timeout) {
    if (timeout === undefined) {
        timeout = ALERT_DEFAULT_TIMEOUT;
    }

    let $alert = $('<div class="alert container" role="alert" />');
    $alert.addClass('alert-' + type);
    $alert.html(text);
    $alert.hide();
    $alert.prependTo($bodyContent);
    $('html, body').animate({
        scrollTop: $alert.offset().top
    }, 1000);
    $alert.slideDown();

    if (timeout > 0) {
        setTimeout(function () {
            $alert.slideUp(TRANSITION_EFFECT_DURATION, function () {
                $alert.remove();
            });
        }, timeout);
    }

    return $alert;
}

function setPDFSizeByPreset() {
    let value = $PDFSizePreset.val();
    if (value) {
        let size = value.split(', ');
        $PDFSizeWidth.val(size[0]);
        $PDFSizeHeight.val(size[1]);
    }
}

function setPresetByPSDSizeInput() {
    let width = $PDFSizeWidth.val();
    let height = $PDFSizeHeight.val();

    if (width && height) {
        let size = width + ', ' + height;
        let $option = $PDFSizePreset.find('option[value="' + size + '"]')
        if ($option.length == 1) {
            $option[0].selected = true;
            return;
        }
    }
    let customIndex = $PDFSizePreset.find('option[value=""]').index();
    $PDFSizePreset.prop('options')[customIndex].selected = true;
}

function loadingInputPSD(loadingState, callback) {
    if (callback === undefined) {
        callback = function() {};
    }
    if (loadingState) {
        $inputPSDContainer.fadeOut(TRANSITION_EFFECT_DURATION, function() {
            $inputPSDLoading.removeClass('d-none').hide();
            $inputPSDLoading.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    } else {
        $inputPSDLoading.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $inputPSDContainer.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    }
}

function setPSDImage(image_data, callback) {
    if (!callback) {
        callback = function() {};
    }
    if (image_data) {
        loadingInputPSD(false);
        $uploadContent.fadeOut(TRANSITION_EFFECT_DURATION, function() {
            $PSDImage.attr('src', image_data)
            $PSDImageContainer.removeClass('d-none').hide();
            $PSDImageContainer.fadeIn();
            callback();
        });
    } else {
        $PSDImageContainer.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $PSDImage.attr('src', '');
            $PSDImageContainer.addClass('d-none');
            $uploadContent.fadeIn();
            callback();
        });
    }
}

function loadingLayerImage($layerItem, loadingState, callback) {
    if (callback === undefined) {
        callback = function () { };
    }
    let $image = $layerItem.find('.psd-layer-image-data');
    let $loading = $layerItem.find('.psd-layer-image-data-loading');
    if (loadingState) {
        $layerItem.addClass('loading-image');
        $image.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $loading.removeClass('d-none').hide();
            $loading.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    } else {
        $layerItem.removeClass('loading-image');
        $loading.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $image.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    }
}

function setLayerImageSrc($layerItem, src) {
    $layerItem.find('.psd-layer-image-data').attr('src', src);
}

function loadingGeneratePDF(loadingState, percent, callback) {
    if (!callback) {
        callback = function() {};
    }
    if (!percent) {
        percent = 0;
    }
    if (loadingState) {
        $buttonGeneratePDFLoading[0].percent = percent;
        let percentString = percent + '%';
        $buttonGeneratePDFLoading.css('width', percentString);
        $buttonGeneratePDFLoading.text(percentString);
        if (!$buttonGeneratePDFLoadingContainer.hasClass('loading')) {
            $buttonGeneratePDFLoadingContainer.addClass('loading');
            $buttonGeneratePDF.fadeOut(TRANSITION_EFFECT_DURATION, function () {
                $buttonGeneratePDFLoadingContainer.removeClass('d-none').hide();
                $buttonGeneratePDFLoadingContainer.fadeIn(TRANSITION_EFFECT_DURATION, callback);
            });
            $buttonGeneratePDFLoading[0].loadingFunction = function() {
                $buttonGeneratePDFLoading[0].percent += 0.1;
                $buttonGeneratePDFLoading[0].percentString = $buttonGeneratePDFLoading[0].percent + '%';
                $buttonGeneratePDFLoading[0].percentInt = parseInt($buttonGeneratePDFLoading[0].percent);
                $buttonGeneratePDFLoading.css('width', $buttonGeneratePDFLoading[0].percentString);
                $buttonGeneratePDFLoading.text($buttonGeneratePDFLoading[0].percentInt + '%');
            }
            $buttonGeneratePDFLoading[0].loadingInterval = setInterval(
                $buttonGeneratePDFLoading[0].loadingFunction, INTERVAL_LOADING_GENERATE_PDF
            );
        }
    } else {
        if ($buttonGeneratePDFLoadingContainer.hasClass('loading')) {
            $buttonGeneratePDFLoadingContainer.removeClass('loading');
            $buttonGeneratePDFLoadingContainer.fadeOut(TRANSITION_EFFECT_DURATION, function () {
                $buttonGeneratePDF.fadeIn(TRANSITION_EFFECT_DURATION, callback);
                $buttonGeneratePDFLoadingContainer.addClass('d-none');
            });
            if ($buttonGeneratePDFLoading[0].loadingInterval) {
                clearInterval($buttonGeneratePDFLoading[0].loadingInterval);
            }
        }
    }
}

function setListPSDLayers(layers) {
    if (layers) {
        let htmlContent = '';

        for (let i = 0; i < layers.length; i++) {
            let layer = layers[i];
            let id = layer['id'];
            let name = layer['name'].toUpperCase();
            let $item = $('<a href="javascript:void(0);" class="psd-layer-list-item list-group-item '
                + 'list-group-item-action" data-layer-id="' + id + '">'
                + '<div class= "d-flex align-items-center justify-content-between">'
                + '<div class="col-6 p-0">'
                + '<div class="psd-layer-image-data-container mr-3 d-inline-block align-middle">'
                + '<div class="psd-layer-image-data-loading spinner-border text-primary d-none"></div>'
                + '<img class="psd-layer-image-data" style="width: 50px;" src="' + layer['image_data'] +'">'
                + '</div>'
                + '<input type="text" class="form-control d-inline-block w-auto" '
                + 'id="psd-layer-' + id + '-tag" value="' + name + '" required>'
                + '</div>'
                + '<div class="list-psd-layer-input col-5"></div></div></a>');
            if (layer['type'] == 'pixel') {
                let $imageInputGroup = $('<div class="input-group">'
                    + '<div class= "custom-file">'
                    + '<input id="psd-layer-'+ id + '-value" type="file" class="psd-layer-pixel-input-file custom-file-input">'
                    + '<label class="custom-file-label" for="psd-layer-' + id + '">'
                    + 'Escolha uma imagem para ser a padrão'
                    + '</label>'
                    + '</div></div>');
                $imageInputGroup.appendTo($item.find('.list-psd-layer-input'));
            } else if (layer['type'] == 'type') {
                let $textInput = $('<input type="text" class="form-control" id="psd-layer-' + id + '-value" '
                    + 'placeholder="Valor padrão do campo">');
                $textInput.appendTo($item.find('.list-psd-layer-input'));
            }
            htmlContent += $item.prop('outerHTML');
        }
        $noLayersYet.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $listPSDLayers.html(htmlContent);
            bsCustomFileInput.init();
            $('.psd-layer-list-item').click(function () {
                $(this).toggleClass('active');
            });
            $('.psd-layer-list-item input').click(function(event) {
                event.stopPropagation();
            });
            $('.psd-layer-pixel-input-file').change(function() {
                let $layerItem = $(this).parents('.psd-layer-list-item');
                let reader = new FileReader();
                reader.onload = function () {
                    loadingLayerImage($layerItem, false)
                    setLayerImageSrc($layerItem, reader.result);
                    $layerItem.addClass('image-loaded');
                }
                let fileURL = $(this).prop('files')[0];
                if (fileURL) {
                    loadingLayerImage($layerItem, true, function() {
                        reader.readAsDataURL(fileURL, 'utf-8');
                    });
                } else {
                    alertBox('Não foi possível carregar a imagem escolhida!', ALERT_DANGER);
                }
            });
        });
    } else {
        $listPSDLayers.fadeOut(TRANSITION_EFFECT_DURATION, function() {
            $listPSDLayers.html('');
            $noLayersYet.fadeIn();
        });
    }

}

function excelTextToObject(text) {
    let result = [];
    let rows = text.split('\n');
    let columnNames = rows[0].split('\t');
    for (let i = 1; i < rows.length; i++) {
        if (rows[i].length != 0) {
            let data = rows[i].split('\t');
            if (data.length != columnNames.length) {
                throw new InvalidQuantityColsError(
                    'all rows must have ' + columnNames.length
                );
            }
            let row = {};
            for (let j = 0; j < data.length; j++) {
                row[columnNames[j]] = data[j];
            }
            result.push(row);
        }
    }
    return result;
}

function getClientInputLayers() {
    let inputs = {};
    $listPSDLayers.children('.active').each(function() {
        let id = parseInt($(this).data('layer-id'));
        let tagSelector = '#psd-layer-' + id + '-tag';
        let tag = $(this).find(tagSelector).val();
        let defaultValueSelector = '#psd-layer-' + id + '-value';
        let $defaultValue = $(this).find(defaultValueSelector);
        let defaultValueType = $defaultValue.attr('type');
        let defaultValue = null;
        if (defaultValueType == 'file') {
            defaultValue = $(this).find('.psd-layer-image-data').attr('src');
        } else {
            defaultValue = $defaultValue.val();
        }
        defaultValue = (defaultValue) ? defaultValue : null;
        inputs[id] = {
            tag: tag,
            defaultValue: defaultValue,
            defaultValueType: defaultValueType
        };
    });
    return inputs;
}

function validateToGeneratePDF() {
    //A PSD file must be chosen
    if (!$PSDImage.attr('src')) {
        alertBox('Um modelo PSD deve ser definido!', ALERT_DANGER);
        return false;
    }

    //A size must be chosen
    if (!($PDFSizeWidth.val() && $PDFSizeHeight.val())) {
        alertBox('O tamanho para o PDF deve ser definido!', ALERT_DANGER);
        return false;
    }


    //Have at least one layer selected
    if ($listPSDLayers.children('.active').length == 0) {
        alertBox('Pelo menos um campo deve ser selecionado para gerar!', ALERT_DANGER);
        return false;
    }

    //All pixel fields must be loaded if chosen a image as default
    if ($listPSDLayers.children('.loading-image').length > 0) {
        alertBox('Ainda há imagens carregando. Aguarde o carregamento antes proceder.', ALERT_DANGER);
        return false;
    }

    let inputLayers = getClientInputLayers();
    let dataString = $templateContentValues.val();

    let data = [];
    try {
        data = excelTextToObject(dataString);
    } catch (InvalidQuantityColsError) {
        alertBox(
            'O campo de <strong>Importar Participantes</strong> deve conter a mesma '
            + 'quantidade de campos escolhida!', ALERT_DANGER
        );
        return false;
    }

    if (data.length == 0) {
        alertBox('O campo de <strong>ImportImportar Participantes</strong> '
            + 'não foi preenchido!', ALERT_DANGER);
        return false;
    }

    let missingColumns = [];
    for (let layerID in inputLayers) {
        let tag = inputLayers[layerID].tag;
        let defaultvalue = inputLayers[layerID].defaultValue;
        for (let i = 0; i < data.length; i++) {
            let row = data[i];
            if (!(tag in row) && missingColumns.indexOf(tag) == -1
                && defaultvalue == null) {
                missingColumns.push(tag);
            }
        }
    }

    if (missingColumns.length > 0) {
        let columns = missingColumns.join(', ');
        alertBox(
            'Está faltando na seção Importar Participantes, a(s) coluna(s): <strong>'
            + columns + '</strong>!', ALERT_DANGER
        );
        return false;
    }

    return true;
}

function setPDFLinkButton(loadedState, pdf_link) {
    if (loadedState) {
        $buttonGeneratePDFLoadingContainer.fadeOut(TRANSITION_EFFECT_DURATION, function(){
            $PDFFileLink.removeClass('d-none').hide();
            $PDFFileLink.attr('href', pdf_link);
            $PDFFileLink.fadeIn();
        });
    } else {
        $PDFFileLink.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $PDFFileLink.attr('href', '#');
            $PDFFileLink.addClass('d-none');
            $buttonGeneratePDFLoadingContainer.fadeOut(TRANSITION_EFFECT_DURATION, function() {
                $buttonGeneratePDFLoadingContainer.addClass('d-none');
                $buttonGeneratePDF.fadeIn(TRANSITION_EFFECT_DURATION);
                if ($buttonGeneratePDFLoading[0].loadingInterval) {
                    clearInterval($buttonGeneratePDFLoading[0].loadingInterval);
                }
            });
        });
    }
}

function getPDFSize() {
    let width = parseInt($PDFSizeWidth.val());
    let height = parseInt($PDFSizeHeight.val());
    return [width, height];
}

function getInputLayersAndData() {
    let result = {};
    let clientInputLayers = getClientInputLayers();
    let inputLayers = {};
    for (let layerID in clientInputLayers) {
        inputLayers[layerID] = clientInputLayers[layerID].tag;
    }
    let dataString = $templateContentValues.val();
    let dataFromExcel = excelTextToObject(dataString);
    let data = [];

    for (let i = 0; i < dataFromExcel.length; i++) {
        let item = dataFromExcel[i];
        let dataItem = {};

        for (let layerID in clientInputLayers) {
            let tag = clientInputLayers[layerID].tag;
            let defaultValue = clientInputLayers[layerID].defaultValue;
            if (tag in item) {
                dataItem[tag] = item[tag];
            } else {
                dataItem[tag] = defaultValue;
            }
        }
        data.push(dataItem);
    }

    result['input_layers'] = inputLayers;
    result['data'] = data;
    result['size'] = getPDFSize();
    return result;
}

function generatePDFFromImages(images) {
    let size = getPDFSize();
    let pdf = new jsPDF();
    for (let i = 0; i < images.length; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        pdf.internal.pageSize.setWidth(size[0]);
        pdf.internal.pageSize.setHeight(size[1]);
        let imageData = images[i];
        pdf.addImage(imageData, 0, 0, size[0], size[1]);
    }

    return pdf.output('bloburl');
}

function resetApplication() {
    $('.alert').fadeOut(function() {
        $(this).remove();
    });
    setPSDImage(false, function() {
        loadingInputPSD(false);
    });
    setListPSDLayers(null);
    $templateContentValues.val('');
    setPDFLinkButton(false);
}
