/* ------------------------------------------------ Reset Filters -*/

$('.reset-jq').click(function() {
    dc.filterAll();
    dc.renderAll();
});


/* ------------------------------------------------ Hide Content -*/

$('.hide-content').click(function() {
    $(this).parent().parent().nextAll('#hide-content-toggle').slideToggle();
    $(this).parent().parent().parent().parent().toggleClass('eq-column-height');
    $(this).toggleClass('fa-eye');
    $(this).toggleClass('fa-eye-slash');
});
