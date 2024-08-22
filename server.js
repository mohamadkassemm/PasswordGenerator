const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Middleware to parse URL-encoded bodies (form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

// Password Generator Function
// Generates a random password of the specified length (default is 12 characters)
function generatePassword() { // Strong password: at least 2 special characters, 2 small letters, 2 capital letters, 2 numbers
    const sl = "abcdefghijklmnopqrstuvwxyz";
    const cl = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const num = "0123456789";
    const special = "!@#$%^&*()_+~"
    let password = "";
    for (let i = 0; i < 3; i++) {
        // Selects a random character from the small letters string and appends it to the password
        password += sl.charAt(Math.floor(Math.random() * sl.length));
    }
    for (let i = 0; i < 3; i++) {
        // Selects a random character from the capital letters string and appends it to the password
        password += cl.charAt(Math.floor(Math.random() * cl.length));
    }    
    for (let i = 0; i < 3; i++) {
        // Selects a random character from the numbers string and appends it to the password
        password += num.charAt(Math.floor(Math.random() * num.length));
    }
    for (let i = 0; i < 3; i++) {
        // Selects a random character from the special characters string and appends it to the password
        password += special.charAt(Math.floor(Math.random() * special.length));
    }
    for (let i = password.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [password[i], password[j]] = [password[j], password[i]]; // Swap elements
    }
    return password;
}
// Generate and Save Password
app.post('/generate-password', (req, res) => {
    const password = generatePassword(); // Generate a random password
    const platform = req.body.platform; // Get the platform name from the request body
    const createdAt = new Date().toLocaleString(); // Converts to a readable date and time

    
    // Validate that the platform name is provided
    if (!platform) {
        return res.status(400).send('Platform name is required.');
    }

    // Prepare the data to be saved in the file
    const data = `Platform: ${platform}, Password: ${password}, Created at: ${createdAt}\n`;
    
    // Append the generated password and platform name to passwords.txt file
    fs.appendFile('passwords.txt', data, (err) => {
        if (err) {
            console.error(`Error saving password: ${err.message}`);
            return res.status(500).send('Failed to save the password.');
        }

        res.json({
            message: 'Password generated and saved successfully.',
            platform: platform,
            password: password,
        });
    });
});


app.listen(port, () => {
    console.log(`Password generator app listening at http://localhost:${port}`);
});
