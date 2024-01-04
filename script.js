// Get the required elements from the doc
var submitButton = document.getElementById('submit');
var errorElement = document.getElementById('error');

function validateName(event) {
    event = event || window.event;
    var charCode = (typeof event.which == "undefined") ? event.keyCode : event.which;
    var charStr = String.fromCharCode(charCode);
    
    return /^[a-zA-Z\s]$/.test(charStr)
}


// Add a click event listener to the submit button
submitButton.addEventListener('click', function() {
    // Get the name entered by the user
    var name = document.getElementById('name').value;

    // Make a GET request to the API
    fetch('https://api.genderize.io/?name=' + name)
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Error: ' + response.status);
            }
        })
        .then(function(data) {
            // Get the elements of the gender and probability fields
            var genderElement = document.getElementById('gender');
            var probabilityElement = document.getElementById('probability');

            // Check if the API knows the answer
            if (data.gender === null) {
                // Show the error to the user
                errorElement.style.display = 'block';
                errorElement.textContent = 'Error: The API could not determine gender of the given name!';
                
                // Clear the gender and probability elements
                genderElement.textContent = '-';
                probabilityElement.textContent = '-';
            } else {
                // Update the paragraphs with the response data
                genderElement.textContent = data.gender;
                probabilityElement.textContent = data.probability;

                // Hide the error field
                errorElement.style.display = 'none';
            }
        })
        .catch(function(error) {
            // Log the error to the console
            console.error(error);

            // Show the error to the user
            errorElement.style.display = 'block';
            errorElement.textContent = 'Error: An error encountered while communicating with the API...'
        });
});