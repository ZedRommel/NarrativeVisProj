
var scenebrand = d3.select("#scenebrand")
var scenefuel = d3.select("#scenefuel")
const width = 900
const height = 1200

var tooltip = d3.select("body")
    .append("div")
    .append("div")
    .style("opacity", 0)
    .style("background", "Green")
    .style("text-align", "center")
    .style("position", "absolute")
    .style("border", "0px")
    .style("width", "50px")
    .style("height", "40px")

var x = d3.scaleBand()
    .domain([10, 20, 30, 40, 50])
    .range([0, width]);

var y = d3.scaleLinear()
    .domain([0, 120])
    .range([height, 0]);

var xAxis = d3.axisBottom()
    .scale(x)
    .ticks(5);

var yAxis = d3.axisLeft()
    .scale(y)
    .ticks(10);

// axis appends
scenebrand.append("g")
    .attr("transform", "translate(150,115)")
    .attr("class", "axis")
    .call(yAxis);


// Brand
var brand_highwayMPG = new Map()
var brand_cityMPG = new Map()
var brand_num = new Map()
var brands = []
var value = []
async function loadbrand() {
    d3.csv("https://flunky.github.io/cars2017.csv").then(function (d) {
        
        var makeScale = d3.scaleBand()
            .range([0, width])
            .domain(d.map(function(d) {return d.Make}));
        
        var makeAxis = d3.axisBottom().scale(makeScale).ticks(40);
        
        scenebrand.append("g")
            .attr("transform", "translate(150,1315)")
            .attr("class", "axis")
            .call(makeAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-60)")
            .style("text-anchor", "end");
        // console.log(d)
        
        scenebrand.append("g")
            .append("text")
            .style("font-size","20px")
            .attr("y", 70)
            .attr("x", 70 )
            .attr("dx", ".47em")                        
            .style("text-anchor", "start")
            .style("fill", "#004669")
            .style("font-weight", "bold")
            .text("Average MPG");

        for (let i = 0; i < d.length; i++) {
            if (!brand_highwayMPG.has(d[i].Make)) {
                brand_highwayMPG.set(d[i].Make, +d[i].AverageHighwayMPG)
            } else {
                brand_highwayMPG.set(d[i].Make, +d[i].AverageHighwayMPG + +brand_highwayMPG.get(d[i].Make))
                // brand_highwayMPG.(d[i].Make) = d[i].AverageHighwayMPG + brand_highwayMPG.(d[i].Make)
            }

            if (!brand_cityMPG.has(d[i].Make)) {
                brand_cityMPG.set(d[i].Make, +d[i].AverageCityMPG)
            } else {
                // brand_cityMPG.(d[i].Make) = d[i].AverageCityMPG + brand_cityMPG.(d[i].Make)
                brand_cityMPG.set(d[i].Make, +d[i].AverageCityMPG + +brand_cityMPG.get(d[i].Make))
            }
            
            if (!brand_num.has(d[i].Make)) {
                brand_num.set(d[i].Make, 1)
                // brand_num.(d[i].Make) = 1
            } else {
                // brand_num.(d[i].Make) = 1 + brand_num.(d[i].Make)
                brand_num.set(d[i].Make, +1 + +brand_num.get(d[i].Make))
            }
        }

        brand_highwayMPG.forEach((_value, key) => {
            brand_highwayMPG.set(key, +brand_highwayMPG.get(key) / +brand_num.get(key))
        })
        brand_cityMPG.forEach((_value, key) => {
            brand_cityMPG.set(key, +brand_cityMPG.get(key) / +brand_num.get(key))
        })

        update_by_brand(true)

        scenebrand.selectAll("rect")
            .data(value)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {return 157.5 + makeScale(brands[i]); })
            .attr("y", function(d, i) {return y(value[i]) + 110; })
            .attr("width", 10)
            .attr("height", function (d, i) { return height - y(value[i]); })
            .attr("fill", "SkyBlue")
            .on("mouseover", function(d, i) {
                tooltip.style("opacity", 1)
                // .transition().duration(200)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .html(
                    value[i]
                );
            })
            .on("mouseout", function() {tooltip.style("opacity", 0).transition().duration(200) }); 
    })
}
function update_by_brand(highway) {
    console.log(highway)
    brands = []
    value = []
    var color = "SkyBlue"
    if (highway) {
        brand_highwayMPG.forEach((_value, key) => {
            brands.push(key)
            value.push(_value)
        })
    } else {
        brand_cityMPG.forEach((_value, key) => {
            brands.push(key)
            value.push(_value)
        })
    }
    var color = "Orange"
    if (highway) {
        color = "SkyBlue"
    }

    scenebrand.selectAll("rect")
            .transition().duration(1000)
            .attr("y", function(d, i) {return y(value[i]) + 110; })
            .attr("height", function (d, i) { return height - y(value[i]); })
            .attr("fill", color);
}

var fuel_highway = new Map()
var fuel_city = new Map()
var fuel_num = new Map()
var fuel_highway_val = new Map()
var fuel_city_val = new Map()
var yScale = d3.scaleLinear().range([0, 600]).domain([150, 0])
var curr = ""
async function loadfuel() {
    d3.csv("https://flunky.github.io/cars2017.csv").then(function (d) {

        // var makeScale = d3.scaleBand()
        //     .range([0, 900])
        //     .domain(d.map(function(d) {return d.Fuel}));
        
        var fuelScale = d3.scaleBand().range([0, 900]).domain(d.map(function (d) { return d.Fuel; }))
        
        var fuelAxis = d3.axisBottom()
            .scale(fuelScale)
            .ticks(10);
        
        var yAxis = d3.axisLeft().scale(yScale)

        scenefuel.append("g")
            .append("text")
            .style("font-size","20px")
            .attr("y", 30)
            .attr("x", 50 )
            .attr("dx", ".47em")                        
            .style("text-anchor", "start")
            .style("fill", "#004669")
            .style("font-weight", "bold")
            .text("Average MPG");

        scenefuel.append("g")
            .attr("transform", "translate(100,650)")
            .attr("class", "axis")
            .call(fuelAxis)
            // .selectAll("text");
        
        scenefuel.append("g")
            .attr("transform", "translate(100,50)")
            .attr("class", "axis")
            .call(yAxis)
            // .selectAll("text");  

        for (let i = 0; i < d.length; i++) {
            if (fuel_highway.has(d[i].Fuel)) {
                fuel_highway.set(d[i].Fuel, +d[i].AverageHighwayMPG + +fuel_highway.get(d[i].Fuel))
            } else {
                fuel_highway.set(d[i].Fuel, +d[i].AverageHighwayMPG)
            }
            if (fuel_city.has(d[i].Fuel)) {
                fuel_city.set(d[i].Fuel, +d[i].AverageCityMPG + +fuel_city.get(d[i].Fuel))
            } else {
                fuel_city.set(d[i].Fuel, +d[i].AverageCityMPG)
            }
            if (fuel_num.has(d[i].Fuel)) {
                fuel_num.set(d[i].Fuel, +1 + +fuel_num.get(d[i].Fuel))
            } else {
                fuel_num.set(d[i].Fuel, +1)
            }
        }
        // console.log(fuel_highway)
        // console.log(fuel_city)


        fuel_highway.forEach((_value, key) => {
            fuel_highway_val.set(key, +fuel_highway.get(key) / +fuel_num.get(key))
        })
        fuel_city.forEach((_value, key) => {
            fuel_city_val.set(key, +fuel_city.get(key) / +fuel_num.get(key))
        })
        // console.log(fuel_highway_val)
        console.log(fuel_city_val)
        console.log(yScale(19))
        fuels = ["Gasoline", "Diesel", "Electricity"]
        curr = fuel_highway_val

        scenefuel.selectAll("rect")
            .data(fuels)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {return 200 + i*300} )
            .attr("y", function(d, i) {return 650 - yScale(150 - fuel_highway_val.get(fuels[i]))})
            .attr("width", 100)
            .attr("height", function(d, i) {return yScale(150 - fuel_highway_val.get(fuels[i]))} )
            .attr("fill", "SkyBlue")
            .on("mouseover", function(d, i) {
                tooltip.style("opacity", 1)
                // .transition().duration(200)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY) + "px")
                .html(
                    curr.get(fuels[i])
                );
            })
            .on("mouseout", function() {tooltip.style("opacity", 0).transition().duration(200) }); 
    })
}
function update_by_fuel(highway) {
    // console.log(highway)

    var color = "Orange"
    if (highway) {
        color = "SkyBlue"
    }
    if (highway) {
        scenefuel.selectAll("rect")
            .transition().duration(1000)
            .attr("y", function(d, i) {return 650 - yScale(150 - fuel_highway_val.get(fuels[i]))})
            .attr("height", function(d, i) {return yScale(150 - fuel_highway_val.get(fuels[i]))} )
            .attr("fill", color);
    } else {
        scenefuel.selectAll("rect")
            .transition().duration(1000)
            .attr("y", function(d, i) {return 650 - yScale(150 - fuel_city_val.get(fuels[i]))})
            .attr("height", function(d, i) {return yScale(150 - fuel_city_val.get(fuels[i]))} )
            .attr("fill", color);
    }
    if (highway) {
        curr = fuel_highway_val
    } else {
        curr = fuel_city_val
    }
}


