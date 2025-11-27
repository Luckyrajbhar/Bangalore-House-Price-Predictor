// Get form values
function getBathValue() {
    const bathrooms = document.getElementsByName("uiBathrooms");
    for (let i = 0; i < bathrooms.length; i++) {
        if (bathrooms[i].checked) {
            return parseInt(bathrooms[i].value);
        }
    }
    return -1;
}

function getBHKValue() {
    const bhk = document.getElementsByName("uiBHK");
    for (let i = 0; i < bhk.length; i++) {
        if (bhk[i].checked) {
            return parseInt(bhk[i].value);
        }
    }
    return -1;
}

// Load locations on page load
function onPageLoad() {
    console.log("Loading locations...");
    const url = "/get_location_names";

    $.get(url, function (data, status) {
        console.log("Locations loaded:", data);
        if (data && data.locations) {
            const locations = data.locations;
            const uiLocations = document.getElementById("uiLocations");
            
            // Sort locations alphabetically
            const sortedLocations = locations.sort();
            
            sortedLocations.forEach(function (loc) {
                const opt = new Option(loc, loc);
                uiLocations.appendChild(opt);
            });
        }
    }).fail(function (xhr, status, error) {
        console.error("Error loading locations:", error);
        showError("Failed to load locations. Please refresh the page.");
    });
}

// Handle form submission
function handleEstimatePrice(event) {
    event.preventDefault();
    
    const sqft = document.getElementById("uiSqft").value;
    const bhk = getBHKValue();
    const bathrooms = getBathValue();
    const location = document.getElementById("uiLocations").value;
    const resultContainer = document.getElementById("uiEstimatedPrice");
    const resultValue = document.getElementById("resultValue");
    const estimateBtn = document.getElementById("estimateBtn");
    const btnText = estimateBtn.querySelector(".btn-text");
    const btnLoader = estimateBtn.querySelector(".btn-loader");

    // Validation
    if (!sqft || bhk === -1 || bathrooms === -1 || !location) {
        showError("Please fill all fields!");
        return;
    }

    if (parseFloat(sqft) < 100) {
        showError("Area must be at least 100 square feet!");
        return;
    }

    // Show loading state
    estimateBtn.disabled = true;
    btnText.style.display = "none";
    btnLoader.style.display = "inline-block";
    resultContainer.style.display = "none";

    // Remove any existing error messages
    const existingError = document.querySelector(".error-message");
    if (existingError) {
        existingError.remove();
    }

    const url = "/predict_home_price";

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
            
            // Reset button state
            estimateBtn.disabled = false;
            btnText.style.display = "inline";
            btnLoader.style.display = "none";

            if (data && data.estimated_price !== undefined) {
                const price = data.estimated_price;
                resultValue.textContent = `₹ ${price.toLocaleString('en-IN')} Lakh`;
                resultContainer.style.display = "block";
            } else {
                showError("Could not get price estimate. Please try again.");
            }
        }
    ).fail(function (xhr, status, error) {
        console.error("Error in prediction:", error);
        
        // Reset button state
        estimateBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoader.style.display = "none";

        let errorMsg = "Server error. Please try again.";
        if (xhr.responseJSON && xhr.responseJSON.error) {
            errorMsg = xhr.responseJSON.error;
        }
        showError(errorMsg);
    });
}

// Show error message
function showError(message) {
    const resultContainer = document.getElementById("uiEstimatedPrice");
    resultContainer.style.display = "block";
    resultContainer.innerHTML = `<div class="error-message">⚠️ ${message}</div>`;
}

// Initialize on page load
$(document).ready(function () {
    onPageLoad();
    
    // Attach form submit handler
    const form = document.getElementById("predictionForm");
    form.addEventListener("submit", handleEstimatePrice);
});

