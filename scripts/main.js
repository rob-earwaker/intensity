function refreshChart(data) {
    var svg = d3.select('svg');

    svg.selectAll('*').remove();

    var margin = {top: 10, right: 10, bottom: 30, left: 30};
    var width = svg.attr('width') - margin.left - margin.left;
    var height = svg.attr('height') - margin.top - margin.bottom;

    var g = svg.append('g')
        .attr('width', width)
        .attr('height', height)
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

    var xScale = d3.scaleTime()
        .range([0, width])
        .domain(d3.extent(data, function(d) { return d3.isoParse(d.from); }));

    var yScale = d3.scaleLinear()
        .range([height, 0])
        .domain([0, 1.05 * d3.max(data, function(d) { return d.intensity.actual; })]);

    g.append('g')
        .call(d3.axisBottom(xScale))
        .attr('transform', 'translate(0,' + height + ')')

    g.append('g')
        .call(d3.axisLeft(yScale))

    g.append('path')
        .datum(data)
        .attr('d', d3.line()
            .x(function(d) { return xScale(d3.isoParse(d.from)); })
            .y(function(d) { return yScale(d.intensity.actual); }))
        .attr('fill', 'none')
        .attr('stroke', 'black');

    var tooltipGroup = g.append('g')
        .attr('display', 'none');

    tooltipGroup.append('line')
        .attr('y1', 0)
        .attr('y2', height)
        .attr('transform', 'translate(50,0)')
        .attr('stroke', 'black');

    g.append('rect')
        .attr('width', width)
        .attr('height', height)
        .attr('fill', 'none')
        .attr('pointer-events', 'all')
        .on('mouseover', function() { tooltipGroup.attr('display', null); })
        .on('mouseout', function() { tooltipGroup.attr('display', 'none'); });
};

$(document).ready(function() {
    $('#chart-load-button').click(function() {
        var dateFrom = $('#date-from').val();
        var dateTo = $('#date-to').val();

        $.ajax({
            url: 'https://api.carbonintensity.org.uk/intensity/' + dateFrom + '/' + dateTo,
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