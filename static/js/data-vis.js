/* --------------------------------------------------------- Main -*/

queue()
    .defer(d3.csv, 'static/data/superheroData.csv')
    .await(createDataVis);

function createDataVis(error, superheroData) {
    var ndx = crossfilter(superheroData);

    /* ---------- Data Preparation -------*/

    var heroAttributes = [
        "Intelligence",
        "Strength",
        "Speed",
        "Durability",
        "Power",
        "Combat"
    ];

    function hero_attr_to_integer(hero_attr) {
        // Convert all hero attributes to integers. Store as a
        // lowercased variable of the same name.
        hero_attr.forEach(function(ha) {
            superheroData.forEach(function(d) {
                var ha_lower = ha.toLowerCase();
                d[ha_lower] = parseInt(d[ha], 10);
            });
        });
    }
    hero_attr_to_integer(heroAttributes);

    function height_weight_conversion(key, firstIndex, lastIndex) {
        // Iterate through the given key to remove unwanted chars from the
        // values and store an integer as a lowercased variable of same name.
        superheroData.forEach(function(d) {
            var keyLower = key.toLowerCase();
            d[keyLower] = parseInt(
                d[key].substring(
                    d[key].lastIndexOf(firstIndex) + firstIndex.length,
                    d[key].lastIndexOf(lastIndex)), 10);
        });
    }
    height_weight_conversion("Height", "// ", " c");
    height_weight_conversion("Weight", "// ", " k");


    /* ---------- Gender -----------------*/
    gender_selector(ndx);
    display_gender_percent(ndx, 'Male', '#percent-male');
    display_gender_percent(ndx, 'Female', '#percent-female');
    display_gender_percent(ndx, 'Other', '#percent-other');

    /* ---------- Pie Charts -------------*/
    alignment(ndx);
    alter_ego(ndx);
    hair_color(ndx);
    eye_color(ndx);

    /* ---------- Bar Charts -------------*/
    height(ndx);
    weight(ndx);

    /* ---------- Row Chart --------------*/
    publisher(ndx);

    /* ---------- Line Chart -------------*/
    stats(ndx);

    dc.renderAll();

}


/* --------------------------------------------- Helper Functions -*/

function remove_blanks(group, value_to_remove) {
    // Filter out specified values from passed group
    return {
        all: function() {
            return group.all().filter(function(d) {
                return d.key !== value_to_remove;
            });
        }
    };
}


/* --------------------------------------------- Gender Functions -*/

function gender_selector(ndx) {
    var genderDim = ndx.dimension(dc.pluck('Gender'));
    var genderGroup = genderDim.group();


    dc.selectMenu('#gender-selector')
        .dimension(genderDim)
        .group(genderGroup);
}

function display_gender_percent(ndx, gender, element) {
    var genderPercent = ndx.groupAll().reduce(
        function(p, v) {
            p.total++;
            if (v.Gender === gender) {
                p.gender_count++;
            }
            return p;
        },
        function(p, v) {
            p.total--;
            if (v.Gender === gender) {
                p.gender_count--;
            }
            return p;
        },
        function() {
            return { total: 0, gender_count: 0 };
        }
    );

    dc.numberDisplay(element)
        .formatNumber(d3.format('.2%'))
        .valueAccessor(function(d) {
            if (d.gender_count == 0) {
                return 0;
            }
            else {
                return (d.gender_count / d.total);
            }
        })
        .group(genderPercent);
}


/* --------------------------------------------------- Pie Charts -*/

function alignment(ndx) {

    var alignmentColors = d3.scale.ordinal()
        .range(['#6c6cff', '#ff6c6c', '#ffda6c']);

    var alignmentDim = ndx.dimension(dc.pluck('Alignment'));
    var alignmentGroup = remove_blanks(alignmentDim.group(), "");

    dc.pieChart('#alignment')
        .width(500)
        .height(350)
        .radius(170)
        .transitionDuration(500)
        .cx(210)
        .legend(dc.legend().x(420).y(10).itemHeight(35).gap(8))
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                var percent = dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                if (percent > 9) {
                    var key_upper = d.data.key.charAt(0).toUpperCase() + d.data.key.slice(1);
                    return key_upper + ' | ' + Math.round(percent) + '%';
                }
                else if (percent > 0) {
                    return Math.round(percent) + '%';
                }
            });
        })
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(alignmentColors)
        .title(function(d) {
            if (d.value === 1) {
                return d.value + " Superhero is " + d.key;
            }
            else {
                return d.value + " Superheroes are " + d.key;
            }
        })
        .useViewBoxResizing(true)
        .dimension(alignmentDim)
        .group(alignmentGroup);
}

function alter_ego(ndx) {

    var alterEgoColors = d3.scale.ordinal()
        .range(['darkorchid', '#ccb232']);

    var alterEgoDim = ndx.dimension(dc.pluck('Alter Egos'));
    var alterEgoGroup = remove_blanks(alterEgoDim.group(), "");

    dc.pieChart('#alter-ego')
        .width(500)
        .height(350)
        .radius(170)
        .transitionDuration(500)
        .cx(210)
        .legend(dc.legend().x(420).y(10).itemHeight(35).gap(8))
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                var percent = dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                if (percent > 9) {
                    var key_upper = d.data.key.charAt(0).toUpperCase() + d.data.key.slice(1);
                    return key_upper + ' | ' + Math.round(percent) + '%';
                }
                else if (percent > 0) {
                    return Math.round(percent) + '%';
                }
            });
        })
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(alterEgoColors)
        .title(function(d) {
            var grammar = "";
            if (d.key === "No") {
                grammar = " do not";
            }
            return d.value + " Superheroes" + grammar + " have an alter ego ";
        })
        .useViewBoxResizing(true)
        .dimension(alterEgoDim)
        .group(alterEgoGroup);
}

function hair_color(ndx) {

    var alignmentColors = d3.scale.ordinal()
        .range(['black', '#e0d07e', 'saddlebrown', 'slategray', 'indianred', 'gray', 'lightsteelblue']);

    var hairColorDim = ndx.dimension(dc.pluck('Hair color'));
    var hairColorGroup = remove_blanks(hairColorDim.group(), "");

    dc.pieChart('#hair-color')
        .width(500)
        .height(350)
        .radius(170)
        .transitionDuration(500)
        .cx(210)
        .slicesCap(6)
        .legend(dc.legend().x(420).y(10).itemHeight(35).gap(8))
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                var percent = dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                if (percent > 9) {
                    var key_upper = d.data.key.charAt(0).toUpperCase() + d.data.key.slice(1);
                    return key_upper + ' | ' + Math.round(percent) + '%';
                }
                else if (percent > 0) {
                    return Math.round(percent) + '%';
                }
            });
        })
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(alignmentColors)
        .title(function(d) {
            if (d.key === "No Hair") {
                return d.value + " Superhero(es) with " + d.key;
            }
            else if (d.key === "Others") {
                return d.value + " Superhero(es) with a different color hair";
            }
            else {
                return d.value + " Superhero(es) with " + d.key + " hair";
            }
        })
        .useViewBoxResizing(true)
        .dimension(hairColorDim)
        .group(hairColorGroup);

}

function eye_color(ndx) {

    var alignmentColors = d3.scale.ordinal()
        .range(['cornflowerblue', 'saddlebrown', 'mediumseagreen', 'indianred', '#e0d07e', 'black', 'gray', 'lightsteelblue', ]);

    var eyeColorDim = ndx.dimension(dc.pluck('Eye color'));
    var eyeColorGroup = remove_blanks(eyeColorDim.group(), "");

    dc.pieChart('#eye-color')
        .width(500)
        .height(350)
        .radius(170)
        .transitionDuration(500)
        .cx(210)
        .slicesCap(7)
        .legend(dc.legend().x(420).y(10).itemHeight(35).gap(8))
        .on('pretransition', function(chart) {
            chart.selectAll('text.pie-slice').text(function(d) {
                var percent = dc.utils.printSingleValue((d.endAngle - d.startAngle) / (2 * Math.PI) * 100);
                if (percent > 9) {
                    var key_upper = d.data.key.charAt(0).toUpperCase() + d.data.key.slice(1);
                    return key_upper + ' | ' + Math.round(percent) + '%';
                }
                else if (percent > 0) {
                    return Math.round(percent) + '%';
                }
            });
        })
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(alignmentColors)
        .title(function(d) {
            if (d.key === "Others") {
                return d.value + " Superhero(es) with a different color eyes";
            }
            else {
                return d.value + " Superhero(es) with " + d.key + " eyes";
            }
        })
        .useViewBoxResizing(true)
        .dimension(eyeColorDim)
        .group(eyeColorGroup);
}


/* --------------------------------------------------- Bar Charts -*/

function height(ndx) {

    var heightColors = d3.scale.ordinal()
        .range(['mediumseagreen', 'indianred']);
        
    var heightCount;

    var heightDim = ndx.dimension(function(d) {
        switch (true) {
            case (d.height == 0):
                return "0m";
            case (d.height < 100):
                return "0m to 1m";
            case (d.height < 200):
                return "1m to 2m";
            case (d.height < 300):
                return "2m to 3m";
            case (d.height >= 300):
                return "Over 3m";
        }
    });

    var heightGroup = remove_blanks(heightDim.group(), "0m");

    dc.barChart('#height')
        .width(500)
        .height(350)
        .useViewBoxResizing(true)
        .margins({ top: 15, right: 40, bottom: 40, left: 40 })
        .clipPadding(15)
        .dimension(heightDim)
        .group(heightGroup)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(heightColors)
        .renderLabel(true)
        .title(function(d) {
            return d.value + " Superheroes are " + d.key + " in height";
        })
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('Height')
        .yAxis().ticks(4);

}

function weight(ndx) {

    var weightColors = d3.scale.ordinal()
        .range(['mediumseagreen', 'indianred']);

    var weightDim = ndx.dimension(function(d) {
        switch (true) {
            case (d.weight == 0):
                return "0kg";
            case (d.weight < 60):
                return "0kg to 59kg";
            case (d.weight < 90):
                return "60kg to 89kg";
            case (d.weight < 120):
                return "90kg to 119kg";
            case (d.weight >= 120):
                return "Over 120kg";
        }
    });

    var weightGroup = remove_blanks(weightDim.group(), "0kg");

    dc.barChart('#weight')
        .width(500)
        .height(350)
        .useViewBoxResizing(true)
        .margins({ top: 15, right: 40, bottom: 40, left: 40 })
        .clipPadding(15)
        .dimension(weightDim)
        .colorAccessor(function(d) {
            return d.key;
        })
        .colors(weightColors)
        .renderLabel(true)
        .title(function(d) {
            return d.value + " Superheroes weigh " + d.key;
        })
        .group(weightGroup)
        .elasticY(true)
        .x(d3.scale.ordinal())
        .xUnits(dc.units.ordinal)
        .xAxisLabel('Weight')
        .yAxis().ticks(4);
}


/* --------------------------------------------------- Row Charts -*/

function publisher(ndx) {
    var publisherDim = ndx.dimension(dc.pluck('Publisher'));
    var publisherGroup = remove_blanks(publisherDim.group(), "");

    dc.rowChart('#publisher')
        .width(900)
        .height(400)
        .margins({ top: 10, right: 20, bottom: 40, left: 20 })
        //.xAxisLabel(' Super Heroes')
        .cap(10)
        .useViewBoxResizing(true)
        .title(function(d) {
            return d.value + " Superhero(es) created by " + d.key;
        })
        .label(function(d) {
            return d.key + " | " + d.value;
        })
        .transitionDuration(500)
        .dimension(publisherDim)
        .group(publisherGroup);
}


/* -------------------------------------------------- Line Charts -*/

function stats(ndx) {

    var intDim = ndx.dimension(dc.pluck('intelligence'));
    var intGroup = remove_blanks(intDim.group(), 0);
    var strDim = ndx.dimension(dc.pluck('strength'));
    var strGroup = remove_blanks(strDim.group(), 0);
    var speDim = ndx.dimension(dc.pluck('speed'));
    var speGroup = remove_blanks(speDim.group(), 0);
    var durDim = ndx.dimension(dc.pluck('durability'));
    var durGroup = remove_blanks(durDim.group(), 0);
    var powDim = ndx.dimension(dc.pluck('power'));
    var powGroup = remove_blanks(powDim.group(), 0);
    var comDim = ndx.dimension(dc.pluck('combat'));
    var comGroup = remove_blanks(comDim.group(), 0);

    var compositeChart = dc.compositeChart('#stats');

    compositeChart
        .width(900)
        .height(400)
        .margins({ top: 10, right: 30, bottom: 40, left: 40 })
        .x(d3.scale.linear().domain([0, 100]))
        .xAxisLabel('Attribute Value')
        .yAxisLabel('Frequency')
        .elasticY(true)
        .legend(dc.legend().x(80).y(20).itemHeight(18).gap(5).horizontal(true).autoItemWidth(true))
        .useViewBoxResizing(true)
        .brushOn(false)
        .title(function(d) {
            return d.value + " Superhero(es) with this attribute at " + d.key;
        })
        .compose([
            dc.lineChart(compositeChart)
            .colors('green')
            .group(intGroup, 'Intelligence'),
            dc.lineChart(compositeChart)
            .colors('red')
            .group(strGroup, 'Strength'),
            dc.lineChart(compositeChart)
            .colors('yellow')
            .group(speGroup, 'Speed'),
            dc.lineChart(compositeChart)
            .colors('orange')
            .group(durGroup, 'Durability'),
            dc.lineChart(compositeChart)
            .colors('blue')
            .group(powGroup, 'Power'),
            dc.lineChart(compositeChart)
            .colors('purple')
            .group(comGroup, 'Combat'),
        ]);
}
