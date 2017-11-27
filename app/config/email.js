const email_conf = module.exports = {
    from: '"Energiegids 👻" <energiegids2017@gmail.com>',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
      user: 'snow930123@gmail.com',
      pass: 'ZXCVasdf!@#$'
    }
}