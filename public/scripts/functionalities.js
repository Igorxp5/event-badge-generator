//Exceptions
class InvalidQuantityColsError extends Error {}
class MissingColsError extends Error {}


/**
 * Check the connection to the server and if it does not, it shows an alert on the screen.
 * @return {boolean} If it's connected or not.
 */
function checkConnection() {
    let connected = socket.connected;
    if (!connected) {
        alert('Você ainda não está conectado ao servidor.');
    }
    return connected;
}

/**
 * Show an alert box on the screen.
 * @param  {string} text Text to be displayed.
 * @param {string} type Alert Category ['primary', danger ',' warning ',' success'].
 * @param {int} timeout Alert duration time. In case 0 the alert will be
 * undetermined time. Standard: 5000.
 * @return {jQuerySelector} Alert element.
 */
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

/**
 * Set the width and height field values based on
 * the value of the preset field.
 */
function setPDFSizeByPreset() {
    let value = $PDFSizePreset.val();
    if (value) {
        let size = value.split(', ');
        $PDFSizeWidth.val(size[0]);
        $PDFSizeHeight.val(size[1]);
    }
}

/**
 * Set the preset field based on the values written
 * in the fields width and height.
 */
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

/**
 * Switch between the Upload Template button and the upload animation.
 * @param {boolean} loadingState True to apply the upload and False to return
 * to the Upload Template button.
 * @param {function} callback Function that will be called
 * when the animation is finished.
 */
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

/**
 * Switch between PSD loading and image display.
 * @param {string base64} image_data Imagem do PSD.
 * @param {function} callback Function that will be called
 * when the animation is finished.
 */
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

/**
 * Toggle between loading the layer preview image.
 * @param {jQuerySelector} $layerItem Element layer item.
 * @param {boolean} loadingState True to show loading animation.
 * False to show the image again.
 * @param {function} callback Function that will be called
 * when the animation is finished.
 */
function loadingLayerImage($layerItem, loadingState, callback) {
    if (callback === undefined) {
        callback = function () { };
    }
    let $image = $layerItem.find(PSDLayerImageDataSelector);
    let $loading = $layerItem.find(PSDLayerImageDataLoadingSelector);
    if (loadingState) {
        $layerItem.addClass(layerImageLoading);
        $image.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $loading.removeClass('d-none').hide();
            $loading.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    } else {
        $layerItem.removeClass(layerImageLoading);
        $loading.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $image.fadeIn(TRANSITION_EFFECT_DURATION, callback);
        });
    }
}

/**
 * Set the preview image of the layer.
 * @param {jQuerySelector} $layerItem Element layer item.
 * @param {string} src URL of the image.
 */
function setLayerImageSrc($layerItem, src) {
    $layerItem.find(PSDLayerImageDataSelector).attr('src', src);
}

/**
 * Toggle between loading PDF and Generate PDF button.
 * @param {boolean} loadingState True to show loading.
 * False to show the Generate PDF button again.
 * @param {number} percent Percentage of loading.
 * @param {function} callback Function that will be called
 * when the animation is finished.
 */
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
        if (!$buttonGeneratePDFLoadingContainer.hasClass(loadingClass)) {
            $buttonGeneratePDFLoadingContainer.addClass(loadingClass);
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
                if ($buttonGeneratePDFLoading[0].percent > 100) {
                    clearInterval($buttonGeneratePDFLoading[0].loadingInterval);
                }
            }
            $buttonGeneratePDFLoading[0].loadingInterval = setInterval(
                $buttonGeneratePDFLoading[0].loadingFunction, INTERVAL_LOADING_GENERATE_PDF
            );
        }
    } else {
        if ($buttonGeneratePDFLoadingContainer.hasClass(loadingClass)) {
            $buttonGeneratePDFLoadingContainer.removeClass(loadingClass);
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

/**
 * Put the PSD layers on screen.
 * @param {array} layers Layers.
 */
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
                $imageInputGroup.appendTo($item.find(listPSDLayerInputSelector));
            } else if (layer['type'] == 'type') {
                let $textInput = $('<input type="text" class="form-control" id="psd-layer-' + id + '-value" '
                    + 'placeholder="Valor padrão do campo">');
                $textInput.appendTo($item.find(listPSDLayerInputSelector));
            }
            htmlContent += $item.prop('outerHTML');
        }
        $noLayersYet.fadeOut(TRANSITION_EFFECT_DURATION, function () {
            $listPSDLayers.html(htmlContent);
            bsCustomFileInput.init();
            $(PSDLayerListItemSelector).click(function () {
                $(this).toggleClass('active');
            });
            $(PSDLayerListItemSelector + ' input').click(function(event) {
                event.stopPropagation();
            });
            $(PSDLayerPixelInputFileSelector).change(function() {
                let $layerItem = $(this).parents(PSDLayerListItemSelector);
                let reader = new FileReader();
                reader.onload = function () {
                    loadingLayerImage($layerItem, false)
                    setLayerImageSrc($layerItem, reader.result);
                    $layerItem.addClass(layerImageLoaded);
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
            $listPSDLayers.fadeIn();
            $noLayersYet.fadeIn();
        });
    }

}

/**
 * Convert text from Excel into a list of objects,
 * each containing the column as the key and the value of the row.
 * @param {string} text Excel text.
 * @return {}
 */
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

/**
 * Returns to the input layers formatted from the choices made.
 */
function getClientInputLayers() {
    let inputs = {};
    $listPSDLayers.children('.active').each(function() {
        let id = parseInt($(this).data(layerIDAttr));
        let tagSelector = PSDLayerIDSelector + id + '-tag';
        let tag = $(this).find(tagSelector).val();
        let defaultValueSelector = PSDLayerIDSelector + id + '-value';
        let $defaultValue = $(this).find(defaultValueSelector);
        let defaultValueType = $defaultValue.attr('type');
        let defaultValue = null;
        if (defaultValueType == 'file') {
            defaultValue = $(this).find(PSDLayerImageDataSelector).attr('src');
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

/**
 * Perform validation of all form fields,
 * if something is invalid an error message is issued as an alert.
 */
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
    if ($listPSDLayers.children('.' + layerImageLoading).length > 0) {
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

/**
 * Toggle between link to PDF and loading of PDF / Generate PDF button.
 * @param {boolean} loadedState True to hide loading and show the button link.
 * False to show the Generate PDF button again.
 * @param {string} pdf_link Link to PDF file.
 */
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
                loadingGeneratePDF(false);
            });
        });
    }
}

/**
 * Return the size of the PDF chosen by the user.
 * @return {array} [Width, Height]
 */
function getPDFSize() {
    let width = parseInt($PDFSizeWidth.val());
    let height = parseInt($PDFSizeHeight.val());
    return [width, height];
}

/**
 * Get the values of the Input Layers and the data of the
 * Import Participants field, in an understandable format for the server.
 */
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

/**
 * Generates the PDF from the images generated by the server.
 * @param {array} images Array of images in base64.
 */
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

/**
 * Completely reset the application.
 */
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
