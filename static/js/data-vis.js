queue()
    .defer(d3.csv, 'static/data/superheroData.csv')
    .await(createDataVis);

function createDataVis(error, superheroData) {
    var ndx = crossfilter(superheroData);

    superheroData.forEach(function(d) {
        d.skin_color = d["Skin color"];
    });

    gender_selector(ndx);
    test_graph_one(ndx);
    test_graph_two(ndx);

    dc.renderAll();

}

function gender_selector(ndx) {

}


function test_graph_one(ndx) {

}

function test_graph_two(ndx) {

}
