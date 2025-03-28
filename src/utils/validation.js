//all the validation will be created in t his file
//season 2 episode 9
const validator = require('validator');

const validateSignUpData = (req) => {
    // Log the entire request body for debugging
    console.log("Validation input:", req.body);

    const { firstName, lastName, emailId, password } = req.body;

    const errors = [];

    // Validate firstName
    if (!firstName || typeof firstName !== 'string' || firstName.trim() === '') {
        errors.push('First name is required');
    }

    // Validate lastName
    if (!lastName || typeof lastName !== 'string' || lastName.trim() === '') {
        errors.push('Last name is required');
    }

    // Validate emailId
    if (!emailId || !validator.isEmail(emailId)) {
        errors.push('Valid email is required');
    }

    // Validate password
    if (!password || password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    // If any validation errors exist, throw them
    if (errors.length > 0) {
        throw new Error(errors.join(', '));
    }
};

module.exports = { validateSignUpData };