/*
    This whole nodemailer routine which I use can be found at....
                   www.nodemailer.com/about
    Comments will indicate where I have personally altered the code from the web
*/

'use strict';
const nodemailer = require('nodemailer');

//Initalise a variable which will be the argument of our email function
var message = '';
//encapsulate the nodemailer routine and make it a function of our message
function sendemail(message){
nodemailer.createTestAccount((err, account) => {
    //Here we use a test email but this can be modified for Gmail Hotmail etc..
    let transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
            user: account.user,
            pass: account.pass
        }
    });
    //Here we set up contact details, of course these are dummy addresses
    let mailOptions = {
        from: '"Edmund Cherry" <edmundcherry@example.com>',
        to: 'convergeClient@example.com, convergeClient@example.com',
        subject: 'Sensor Update',
        //We enter in the message which corresponds to the data through the routes
        text: message
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        // Allows us to find the link to view email from the console
    });
});
}

//Export this function to be called upon elsewhere
module.exports = sendemail;
