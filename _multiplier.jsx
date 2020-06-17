// Get text line by line from text file to array
function readText() {

    var textFile = File.openDialog('Choose Dataset');
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

    return textLines;

}

// Get the active composition
var activeComp = app.project.activeItem;

// Check if we really have a composition
if (activeComp != null && (activeComp instanceof CompItem)){

    // Change output location
    var outputFolder = Folder.selectDialog('Choose Save Location', '');

    // Get all the selected layers
    var selectedLayers = activeComp.selectedLayers;

    // Manipulate with source text by cycle through textLines array
    textLines = readText();
    for (var i = 0; i < textLines.length; i++) {
        for (var j = 0; j < selectedLayers.length; j++) {

            selectedLayers[j].sourceText.setValue(textLines[i]);

            var saveFolder = new Folder(outputFolder);
                if (! saveFolder.exist) {
                    saveFolder.create();
                }

            // Add composition to render queue
            var item = app.project.renderQueue.items.add(activeComp);
            var outputModule = item.outputModule(1);
            outputModule.applyTemplate('Lossless'); // TODO Get possibility to choose it
            outputModule.file = File(String(saveFolder) + '/' + activeComp.name + '#' + (i + 1));

            // Render
            app.project.renderQueue.render();

            // Sending to AME instead
            // app.project.renderQueue.queueInAME(true);
        }
    }
}
