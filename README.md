# Video Multiplier

Script that makes a lot of videos from one template and CSV-dataset


### Installing

Move .jsx file to After Effects script directory.

Location for example on macOS: /Applications/Adobe After Effects 2020/Scripts

Restart After Effects then go to File > Script to access.


## Getting Started

1. Fill data-set file, where 1st string for variables names (use dataSetExampleTemplate.csv as a reference).
Each subsequent line corresponds to a separate video.
It is very important to pass the values to the variables in the order that corresponds to the order of their names in the first line, separated by comma.
If rational numbers are used, use dot symbol as a separator (e.g. $ 47.54);

2. Make a new project and a new composition in Ae;

3. Name text layer(-s) that you want to change starting with '^' symbol;

3. Name image layer(-s) that you want to change starting with '#' symbol;

4. Create directory called 'img' in your project and place all images inside;

5. Select all layers you want to change and start script.


## Authors

* Leo Nardo

See also the list of [contributors](http://192.168.88.240:3000/leonardo/scripts.ae.multiplier) who participated in this project.

