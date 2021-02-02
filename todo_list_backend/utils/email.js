const nodemailer = require('nodemailer')

const sendMail = async options => {
	// creating transporter
	const transporter = nodemailer.createTransport({
		host: process.env.EMAIL_HOST,
		port: process.env.EMAIL_PORT,
		auth: {
			user: process.env.EMAIL_USERNAME,
			pass: process.env.EMAIL_PASSWORD
		}
	})

	// email options declaration
	const mailOptions = {
		from: 'Sasi <test@sasi.io>',
		to: options.email,
		subject: options.subject,
		text: options.message
		// html
	}

	// send the mail
	await transporter.sendMail(mailOptions)
}

module.exports = sendMail