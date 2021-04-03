// Stub from: https://gist.github.com/jfreels/6814721

d3.text("dataset.csv", function(data) {
    var parsedCSV = d3.csv.parseRows(data);
    console.log("Dupa");
    
    var container = d3.select("body")
        .append("table").selectAll("tr")
        .data(parsedCSV).enter()
        .append("tr").selectAll("td")
        .data(function(d) {
            console.log(d);
            return d;
        }).enter()
        .append("td")
        .text(function(d) {
            return d;
        });
});
