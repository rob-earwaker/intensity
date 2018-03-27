function refreshChart(data) {
    var svg = d3.select('svg');

    svg.selectAll('*').remove();

    var xScale = d3.scaleTime()
        .range([0, svg.attr('width')])
        .domain(d3.extent(data, function(d) { return d3.isoParse(d.from); }));

    var yScale = d3.scaleLinear()
        .range([svg.attr('height'), 0])
        .domain(d3.extent(data, function(d) { return d.intensity.actual; }));

    svg.append('g')
        .call(d3.axisBottom(xScale))

    svg.append('g')
        .call(d3.axisRight(yScale))

    svg.append('g')
        .append('path')
        .datum(data)
        .attr('d', d3.line()
            .x(function(d) { return xScale(d3.isoParse(d.from)); })
            .y(function(d) { return yScale(d.intensity.actual); }))
        .attr('fill', 'none')
        .attr('stroke', 'black');
};

$(document).ready(function() {
    $('#chart-load-button').click(function() {
        var date = $('#chart-text-input').val();

        $.ajax({
            url: 'https://api.carbonintensity.org.uk/intensity/date/' + date,
            method: 'get',
            headers: {
                'Accept':'application/json'
            },
            success: function(json) {
                refreshChart(json.data);
            }
        });
    }); 
});