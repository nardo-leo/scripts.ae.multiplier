function readDatasetColumns(textFile) {

    var textLines = [];

    if (textFile != null) {
        textFile.open('r');
        while(!textFile.eof) {
            textLines[textLines.length] = textFile.readln(); // lines
        }

        // separate lines to columns
        var columns = [];
        for (var i = 0; i < textLines.length; i++) {
            var cells = textLines[i].split(','); // cells
            for (var j = 0; j < cells.length; j++){
                if (i == 0) {
                    columns.push([cells[j]]); // fill column's header
                } else {
                    columns[j].push(cells[j]); // fill columns
               }
            }
        }
        textFile.close();
    }

    if (!textLines) {
        alert('ERROR Reading file');
        return null;
    }

    return columns;

}

function readDatasetLines(textFile) {

    var textLines = [];

    if (textFile != null) {
        textFile.open('r');
        while(!textFile.eof) {
            textLines[textLines.length] = textFile.readln(); // lines
        }

    }

    return textLines;
}


function main() {
    // Get the active composition
    var activeComp = app.project.activeItem;

    // Choose dataset file
    var textFile = File.openDialog('Choose Dataset');

    // Check if we really have a composition
    if (activeComp != null && (activeComp instanceof CompItem)) {

        // Change output location
        var outputFolder = Folder.selectDialog('Choose Save Location', '');

        // Draw menu to choose render template
        var item = app.project.renderQueue.items.add(activeComp);
        var outputModule = item.outputModule(1);
        var dlg = new Window('dialog', 'Choose Render Template');
        var tempList = outputModule.templates;
        var template = dlg.add('dropdownlist', undefined, tempList);
        var btnOk = dlg.add('button', [10, 10, 100, 30], 'OK');
        dlg.show();
        var renderTemp = template.selection.text;

        // Get all the selected layers
        var selectedLayers = activeComp.selectedLayers;

        // Manipulate with source text by cycle through columns array
        var columns = readDatasetColumns(textFile);
        var lines = readDatasetLines(textFile);

        // Get img folder
        var imgFolder = '';
        for (var i = 1; i < app.project.numItems; i++) {
            if (app.project.item(i).name == 'img' && app.project.item(i) instanceof FolderItem) {
                imgFolder = app.project.item(i);
            }
        }

        // Check if don't find img folder
        if (imgFolder == '') {
            alert("Can't find folder 'img'");
            return;
        }

        // Change content
        var textColumn;
        var imgColumn;
        for (var l = 0; l < lines.length; l++) {
            for (var c = 0; c < columns.length; c++) {
                if (l == 0 && c == 0) { // choose column type
                    for (var f = 0; f < columns.length; f++) {
                        if (columns[f][0].charAt(0) == '^') {
                            textColumn = columns[f]; // text column
                        } else if (columns[f][0].charAt(0) == '#') {
                            imgColumn = columns[f]; // img column
                        }
                    }
                    l++; // switch to next line
                }
                for (var s = 0; s < selectedLayers.length; s++) {

                    var layerName = selectedLayers[s].name;
                    var layerStartsWith = layerName.charAt(0);

                    if (layerStartsWith == '^') { // change text
                        selectedLayers[s].sourceText.setValue(textColumn[l]);
                    }
                    else if (layerStartsWith == '#') { // change image
                        for (var i = 1; i <= imgFolder.numItems; i++) {
                            if (imgFolder.item(i).name == imgColumn[l]) {
                                selectedLayers[s].replaceSource(imgFolder.item(i), true);
                            }
                        }
                    } else {
                        alert('You need to mark layer type (^ - text, # - image)');
                        return;
                    }

                    var saveFolder = new Folder(outputFolder);
                        if (! saveFolder.exist) {
                            saveFolder.create();
                        }
                }
            }

            // Push composition to render queue
            outputModule.applyTemplate(renderTemp); // FIXME can't call func when RenderQueueItem status is RENDERING, STOPPED or DONE
            outputModule.file = File(String(saveFolder) + '/' + activeComp.name + '#' + l);

            // Render
            app.project.renderQueue.render();

            // TODO Sending to AME instead
            // app.project.renderQueue.queueInAME(true);
        }
    }
}


main();
