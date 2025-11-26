function getBathValue() {
  var uiBathrooms = document.getElementsByName("uiBathrooms");
  for (var i = 0; i < uiBathrooms.length; i++) {
    if (uiBathrooms[i].checked) {
      return parseInt(uiBathrooms[i].value);
    }
  }  
  return -1; // Invalid Value
}

function getBHKValue() {
  var uiBHK = document.getElementsByName("uiBHK");
  for (var i = 0; i < uiBHK.length; i++) {
    if (uiBHK[i].checked) {
      return parseInt(uiBHK[i].value);
    }
  }
  return -1; // Invalid Value
}

function onClickedEstimatePrice() {
  console.log("Estimate price button clicked ✅");

  var sqft = document.getElementById("uiSqft").value;
  var bhk = getBHKValue();
  var bathrooms = getBathValue();
  var location = document.getElementById("uiLocations").value;
  var estPrice = document.getElementById("uiEstimatedPrice");

  if (!sqft || bhk == -1 || bathrooms == -1 || !location) {
    estPrice.innerHTML = "<h4 style='color:red;'>⚠️ Please fill all fields!</h4>";
    return;
  }

  var url = "http://127.0.0.1:5000/predict_home_price"; // ✅ direct Flask route

  $.post(
    url,
    {
      total_sqft: parseFloat(sqft),
      bhk: bhk,
      bath: bathrooms,
      location: location,
    },
    function (data, status) {
      console.log("Prediction response:", data);
      if (data && data.estimated_price) {
        estPrice.innerHTML =
          "<h2 style='color:green;'>" +
          data.estimated_price.toString() +
          " Lakh</h2>";
      } else {
        estPrice.innerHTML =
          "<h4 style='color:red;'>❌ Could not get price.</h4>";
      }
    }
  ).fail(function (xhr, status, error) {
    console.error("Error in prediction:", error);
    estPrice.innerHTML =
      "<h4 style='color:red;'>Server error: " + error + "</h4>";
  });
}

function onPageLoad() {
  console.log("Document loaded ✅");
  var url = "http://127.0.0.1:5000/get_location_names";

  $.get(url, function (data, status) {
    console.log("Got response for get_location_names request:", data);
    if (data && data.locations) {     // ✅ fixed key name
      var locations = data.locations;
      var uiLocations = document.getElementById("uiLocations");
      $("#uiLocations").empty();
      locations.forEach(function (loc) {
        var opt = new Option(loc);
        $("#uiLocations").append(opt);
      });
    }
  }).fail(function (xhr, status, error) {
    console.error("Error loading locations:", error);
  });
}

window.onload = onPageLoad;
