// Get the required elements from the doc
var formElement = document.getElementById('form');
var saveButton = document.getElementById('save');
var clearButton = document.getElementById('clear');
var errorElement = document.getElementById('error');
var saveInfoElement = document.getElementById('save-info');
var nameElement = document.getElementById('name');
var genderElement = document.getElementById('gender');
var probabilityElement = document.getElementById('probability');


// Prevent the user from typing anything other than letters and space in the name field
function validateName(event) {
    event = event || window.event;
    var charCode = (typeof event.which == "undefined") ? event.keyCode : event.which;
    var charStr = String.fromCharCode(charCode);
    
    return /^[a-zA-Z\s]$/.test(charStr)
}


// Add a click event listener to the submit button
formElement.addEventListener('submit', function(event) {
    event.preventDefault();

    // Hide the error field
    errorElement.style.display = 'none';

    // Get the name entered by the user
    var name = nameElement.value;

    // Make a GET request to the API
    fetch('https://api.genderize.io/?name=' + name)
        .then(function(response) {
            // Check the response status
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(response.status);
            }
        })
        .then(function(data) {
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
                genderElement.textContent = 'Gender: ' + data.gender;
                probabilityElement.textContent = 'Probability: ' + data.probability;
            }
        })
        .catch(function(error) {
            // Log the error to the console
            console.error(error);

            // Show the error to the user
            errorElement.style.display = 'block';
            errorElement.textContent = 'Error: An error encountered while communicating with the API...'
        });

        // Show the saved answer to the user (if exists)
        savedGender = localStorage.getItem(name.toLowerCase());
        var savedElement = document.getElementsByClassName('saved-section')[0];
        if (savedGender) {
            savedElement.style.display = 'block';

            var savedAnswerElement = document.getElementById('saved-answer');
            savedAnswerElement.textContent = 'Gender: ' + savedGender;
        } else {
            savedElement.style.display = 'none';
        }
});


// Show a message about the saving process
function showSavingMessage(message) {
    saveInfoElement.style.display = 'inline-block'
    saveInfoElement.textContent = message
    setTimeout(function() { 
        saveInfoElement.style.display = 'none';
    }, 2000);
}


// Add a click event listener to the save button
saveButton.addEventListener('click', function() {
    // Get the name entered by the user
    var name = nameElement.value;

    // Check if the name is empty or not
    if (!name) {
        showSavingMessage('Nothing to save!')
        return
    }

    // Get the gender selected by the user
    gender = document.querySelector('input[name="gender"]:checked')?.value;

    // Check if the user has chonsen an option
    if (gender) {
        // Set the value to the local storage
        localStorage.setItem(name.toLowerCase(), gender.toLowerCase());

        // Show a message to the user
        showSavingMessage('Saved your answer!')
        return
    }

    // Check if there is a prediction for the name
    predicedGender = genderElement.textContent?.split(" ")[1]
    if (predicedGender) {
        // Set the value to the local storage
        localStorage.setItem(name.toLowerCase(), predicedGender.toLowerCase());

        // Show a message to the user
        showSavingMessage('Saved predicted answer!')
        return
    }

    // No gender selected manually and no prediction was made
    showSavingMessage('Nothing to save!')
});


// Add a click event listener to the clear button
clearButton.addEventListener('click', function() {
    // Get the name entered by the user
    var name = nameElement.value.toLowerCase();

    // Clear the value from the local storage
    localStorage.removeItem(name);

    // Clear the saved answer text
    var savedAnswerElement = document.getElementById('saved-answer');
    savedAnswerElement.textContent = '-';
});