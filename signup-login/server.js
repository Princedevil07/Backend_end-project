const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.static('public'));

// Endpoint to handle signup data
app.post('/save-data', (req, res) => {
    const userData = req.body;
    if (!userData.fname || !userData.email || !userData.password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            console.error('Error reading users.json:', err);
            return res.status(500).json({ message: 'There was an error saving your data.' });
        }

        const users = JSON.parse(data || '[]');
        if (users.some(user => user.email === userData.email)) {
            return res.status(409).json({ message: 'Email is already in use. Please use a different email.' });
        }

        users.push(userData);
        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), err => {
            if (err) {
                console.error('Error writing to users.json:', err);
                return res.status(500).json({ message: 'There was an error saving your data.' });
            }

            res.status(200).json({ message: 'User data saved successfully!' });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});



























// const express = require('express');
// const fs = require('fs');
// const path = require('path');
// const app = express();
// const PORT = 3000;

// app.use(express.json()); // Middleware to parse JSON requests

// // Handle the POST request from signup form
// app.post('/save-data', (req, res) => {
//     const userData = req.body; // Get the user data from the request body

//     // Check if the required fields are present
//     if (!userData.fname || !userData.email || !userData.password) {
//         return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Read the existing users data from users.json
//     fs.readFile(path.join(__dirname, 'users.json'), 'utf8', (err, data) => {
//         if (err) {
//             console.error('Error reading users.json:', err);
//             return res.status(500).json({ message: 'There was an error saving your data.' });
//         }

//         let users = JSON.parse(data || '[]'); // Parse JSON or initialize an empty array

//         // Check if the email already exists
//         const emailExists = users.some(user => user.email === userData.email);
//         if (emailExists) {
//             return res.status(409).json({ message: 'Email is already in use. Please use a different email.' });
//         }

//         // Add the new user data
//         users.push(userData);

//         // Write the updated users data to users.json
//         fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(users, null, 2), (err) => {
//             if (err) {
//                 console.error('Error writing to users.json:', err);
//                 return res.status(500).json({ message: 'There was an error saving your data.' });
//             }

//             // Respond with success message
//             res.status(200).json({ message: 'User data saved successfully!' });
//         });
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
