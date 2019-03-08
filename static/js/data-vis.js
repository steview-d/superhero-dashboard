queue()
    .defer(d3.csv, 'static/data/superheroData.csv')
    .await(createDataVis);

function createDataVis(error, superheroData) {
    var ndx = crossfilter(superheroData);

    //Tidy 
    superheroData.forEach(function(d) {
        d.skin_color = d["Skin color"];
    });

    //superheroData.Alignment.filter(clean_alignment_data)

    gender_selector(ndx);
    test_graph_one(ndx);
    test_graph_two(ndx);
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

function test_graph_one(ndx) {

    var alignmentDim = ndx.dimension(function(d) { return d.Alignment; });
    var alignmentGroup = remove_blanks(alignmentDim.group());
    //var alignment_group = remove_blanks(alignment_group);

    dc.pieChart('#graph-one')
        .height(350)
        .radius(130)
        .transitionDuration(500)
        .dimension(alignmentDim)
        .group(alignmentGroup);
}

function test_graph_two(ndx) {

    var skinColorDim = ndx.dimension(function(d) { return d.skin_color; });
    var skinColorGroup = remove_blanks(skinColorDim.group());

    dc.rowChart('#graph-two')
        .width(800)
        .height(800)
        .dimension(skinColorDim)
        .group(skinColorGroup);
}
