// Stub from: https://gist.github.com/jfreels/6814721

d3.text("https://mbien-public.s3.eu-central-1.amazonaws.com/com-480/dataset.csv", function(data) {
    var parsedCSV = d3.csv.parseRows(data);

    var container = d3.select("body")
        .append("table")

    .selectAll("tr")
        .data(parsedCSV).enter()
        .append("tr")

    .selectAll("td")
        .data(function(d) {
            return d;
        }).enter()
        .append("td")
        .text(function(d) {
            return d;
        });
});
