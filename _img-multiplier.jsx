// Get text line by line from text file to array
function readText() {

    var textFile = File.openDialog('Choose Text File');
    var textLines = [];

    if (textFile != null) {
        textFile.open('r');
        while(!textFile.eof) {
            textLines[textLines.length] = textFile.readln();
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
if (activeComp != null && (activeComp instanceof CompItem)) {

    // Change output location
    var outputFolder = Folder.selectDialog('Choose Save Location', '');

    // Get all the selected layers
    var selectedLayers = activeComp.selectedLayers;

    // Manipulate with source images by cycle through textLines array
    textLines = readText();
    for (var i = 0; i < textLines.length; i++) {
        for (var j = 0; j < selectedLayers.length; j++) {

            var sourceImg = new ImportOptions(File(textLines[i])); // FIX - doesn't work because of type of import
            selectedLayers[j].replaceSource(sourceImg, true);

            var saveFolder = new Folder(outputFolder);
                if (! saveFolder.exist) {
                    saveFolder.create();
                }

            // Add composition to render queue
            var item = app.project.renderQueue.items.add(activeComp);
            var outputModule = item.outputModule(1);
            outputModule.applyTemplate('Lossless'); // Get possibility to choose it
            outputModule.file = File(String(saveFolder) + '/' + activeComp.name + '#' + (i + 1));

            // Render
            app.project.renderQueue.render();

            // Sending to AME instead
            // app.project.renderQueue.queueInAME(true);
        }
    }
}
