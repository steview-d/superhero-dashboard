queue()
    .defer(d3.csv, 'static/data/superheroData.csv')
    .await(createDataVis);

function createDataVis(error, superheroData) {
    var ndx = crossfilter(superheroData);

    // MIGHT NOT BE REQUIRED - TBC
    // Allow script to read data with blanks in headers
    // superheroData.forEach(function(d) {
    //     d.skin_color = d["Skin color"];
    //     d.hair_color = d["Hair color"];
    //     d.alter_ego = d["Alter Egos"];
    // });

    // Graphs & Charts & Pies, etc
    gender_selector(ndx);
    alignment(ndx);
    alter_ego(ndx);
    skin_color(ndx);
    hair_color(ndx);
    eye_color(ndx);


    dc.renderAll();
}

function remove_blanks(group, string_to_remove = "") {
    // From within passed group, filter out all blank entries
    return {
        all: function() {
            return group.all().filter(function(d) {
                return d.key !== string_to_remove;
            });
        }
    };
}

function gender_selector(ndx) {
    dim = ndx.dimension(dc.pluck('Gender'));
    group = dim.group()

    dc.selectMenu('#gender-selector')
        .dimension(dim)
        .group(group);
}

function alignment(ndx) {

    var alignmentDim = ndx.dimension(dc.pluck('Alignment'));
    var alignmentGroup = remove_blanks(alignmentDim.group());
    //var alignment_group = remove_blanks(alignment_group);

    dc.pieChart('#alignment')
        .height(350)
        .radius(130)
        .transitionDuration(500)
        .dimension(alignmentDim)
        .group(alignmentGroup);
}

function alter_ego(ndx) {

    var alterEgoDim = ndx.dimension(dc.pluck('Alter Egos'));
    var alterEgoGroup = remove_blanks(alterEgoDim.group());

    dc.pieChart('#alter-ego')
        .height(350)
        .radius(130)
        .transitionDuration(500)
        .dimension(alterEgoDim)
        .group(alterEgoGroup);
}

function skin_color(ndx) {

    var skinColorDim = ndx.dimension(dc.pluck('Skin color'));
    var skinColorGroup = remove_blanks(skinColorDim.group());

    dc.pieChart('#skin-color')
        .height(350)
        .radius(130)
        .dimension(skinColorDim)
        .group(skinColorGroup);
}

function hair_color(ndx) {

    var hairColorDim = ndx.dimension(dc.pluck('Hair color'));
    var hairColorGroup = remove_blanks(hairColorDim.group());

    dc.pieChart('#hair-color')
        .height(350)
        .radius(130)
        .dimension(hairColorDim)
        .group(hairColorGroup);
}

function eye_color(ndx) {

    var eyeColorDim = ndx.dimension(dc.pluck('Eye color'));
    var eyeColorGroup = remove_blanks(eyeColorDim.group());

    dc.pieChart('#eye-color')
        .height(350)
        .radius(130)
        .dimension(eyeColorDim)
        .group(eyeColorGroup);
}