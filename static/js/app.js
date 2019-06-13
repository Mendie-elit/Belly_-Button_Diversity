function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  var metaDataUrl = "/metadata/" +sample;
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(metaDataUrl).then((data) => {

    // Use d3 to select the panel with id of `#sample-metadata`
    metadatapanel = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
  metadatapanel.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      metadatapanel.append("p").text(`${key}: ${value}`);

  });

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });

}
 
  
   
  
  // Step 1- create a pie chart that uses data from your samples route (/samples/<sample>)
  // to display the top 10 samples

   

function buildCharts(sample) {
//  link URL to app.py route
  var sampleUrl = "/samples/" +sample;
// send data retrived from my url to two plotting functions
// pie chart and bubble plot
  

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(sampleUrl).then((data)=> {

    

    results = [];

    for (var i = 0; i < data.otu_ids.length; i++)
    {results.push({"otu_ids":data.otu_ids[i], 
      "otu_labels": data.otu_labels[i], 
      "sample_values":data.sample_values[i]})

    };
    
    results.sort((a,b) => b.sample_values - a.sample_values);
    results =results.slice(0,10);

    console.log(results);
    

    // Create a trace for the data
    var trace1 ={
      values:results.map(row => row.sample_values),
      labels:results.map(row => row.otu_ids),
      hovertext: results.map(row => row.otu_labels),
      hoverinfo: "hovertext",
      type:"pie"
    };
     
    // convert trace into an array
    var pieChartData = [trace1];

    // @TODO: Build a Pie Chart
    Plotly.newPlot("pie", pieChartData);

    var trace2 = {
      x:data.otu_ids,
      y:data.sample_values,
      type: "scatter",
      mode: "markers",
      marker:{
        size:data.sample_values,
        color: data.otu_ids
      },
      text: data.otu_labels
    };
    var bubbleChart = [trace2];

    var layout = {
        xaxis: {
        title: "OTU ID"
      }      
    };

    // @TODO: Build a Pie Chart
    Plotly.newPlot("bubble", bubbleChart, layout);
    
  });

  }

  buildCharts();

    
   
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
  // }

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
