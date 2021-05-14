function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// D1.1. Create the buildCharts function.
function buildCharts(sample) {
  // D1.2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // D1.3. Create a variable that holds the samples array. 
    let sampleData = data.samples;
    let metaData = data.metadata;

    // D1.4. Create a variable that filters the samples for the object with the desired sample number.
    // D1.5. Create a variable that holds the first sample in the array.
    let sampleFiltered = sampleData.filter(sampleItem => sampleItem.id === sample)[0];
    let metaFiltered = metaData.filter(metaItem => metaItem.id === parseInt(sample))[0];

    // D1.6. & D3.3. Create variables that hold the otu_ids, otu_labels, sample_values and wash frequency.
    let sampleOtuIds = sampleFiltered.otu_ids;
    let sampleOtuLabels = sampleFiltered.otu_labels;
    let sampleValues = sampleFiltered.sample_values;
    let metaWfreq = metaFiltered.wfreq;

  //BAR CHART
    // D1.7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 
    let topTenOtuIds = sampleOtuIds.slice(0,10).reverse();
    let topTenOtuLabels = sampleOtuLabels.slice(0,10).reverse();
    let topTenValues = sampleValues.slice(0,10).reverse();
    
    let yticks = topTenOtuIds.map(otuId => "OTU " + otuId);
    
    // D1.8. Create the trace for the bar chart. 
    var barData = [{
      x: topTenValues,
      y: yticks,
      type: 'bar',
      orientation: 'h',
      text: topTenOtuLabels
    }];
    // D1.9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };

    // D1.10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("barPlot", barData, barLayout);

  // BUBBLE CHART
    // D2.1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: sampleOtuIds,
      y: sampleValues,
      text: sampleOtuLabels,
      type: 'scatter',
      mode: 'markers',
      marker: {
        color: sampleOtuIds,
        size: sampleValues.map(markerSize => markerSize * .75),
        colorscale: 'Earth'
      },
      showlegend: false,
    }];

    // D2.2. Create the layout for the bubble chart.
    var bubbleLayout = {
      hovermode: 'closest',
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"}
    };

    // D2.3. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

  // GAUGE CHART
    // D3.4. Create the trace for the gauge chart.
    var gaugeData = [{
      domain: {x: [0, 1], y: [0, 1]},
      value: metaWfreq,
      title: {text: "<b>Belly Button Washing Frequency</b><br> Scrubs per Week"},
      type: 'indicator',
      mode: 'gauge+number',
      gauge: {
        axis: { range: [null, 10] },
        bar: { color: "black" },
        steps: [
          { range: [0, 2], color: "red" },
          { range: [2, 4], color: "orange" },
          { range: [4, 6], color: "yellow" },
          { range: [6, 8], color: "lime" },
          { range: [8, 10], color: "green" }
        ]
      }
    }];
    
    // D3.5. Create the layout for the gauge chart.
    var gaugeLayout = { 
    };

    // D3.6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout)
  });
}
