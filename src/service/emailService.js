require('dotenv').config();
import nodemailer from 'nodemailer';

let sendSimpleEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Tân TH 👻" <tanphamm1023@gmail.com>', // sender address
        to: dataSend.receiverEmail, // list of receivers
        subject: getSubject(dataSend), // Subject line
        text: 'Hello world?', // plain text body
        html: getBodyHTMLEmail(dataSend), // html body
    });
};
let sendBillEmail = async (dataSend) => {
    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL_APP,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: '"Tân TH 👻" <tanphamm1023@gmail.com>', // sender address
        to: dataSend.email, // list of receivers
        subject: 'Kết quả đặt lịch khám bệnh', // Subject line
        text: 'Hello world?', // plain text body
        html: getBodyHTMLEmailRemedy(dataSend), // html body
        attachments: [
            {
                filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
                content: dataSend.imgBase64.split('base64,')[1],
                encoding: 'base64',
            },
        ],
    });
};

let getSubject = (dataSend) => {
    let subject = '';
    if (dataSend.language === 'vi') {
        subject = 'Thông tin đặt lịch khám bệnh';
    } else {
        subject = 'Information on scheduling medical examinations';
    }
    return subject;
};

let getBodyHTMLEmail = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trực tuyến</p>
        <p>Thông tin đặt lịch khám bệnh</p>
        <div><b>Thời gian: ${dataSend.time}</b></div>
        <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
        <p>Nếu thông tin trên là đúng xin vui lòng click vào đường link để xác nhận</p>
        <div>
        <a href=${dataSend.link} target="_blank">Click here</a>
        </div>
        <p>Xin chân thành cảm ơn!</p>
        `;
    } else {
        result = `
        <h3>Hello ${dataSend.patientName} </h3>
        <p>You received this email because you scheduled your medical appointment online</p>
        <p>Information on scheduling medical examinations</p>
        <div><b>Time: ${dataSend.time}</b></div>
        <div><b>Doctor: ${dataSend.doctorName}</b></div>
        <p>If the above information is correct, please click on the link to confirm</p>
        <div>
        <a href=${dataSend.link} target="_blank">Click here</a>
        </div>
        <p>Sincerely thank!</p>
        `;
    }
    return result;
};
let getBodyHTMLEmailRemedy = (dataSend) => {
    let result = '';
    if (dataSend.language === 'vi') {
        result = `
        <h3>Xin chào ${dataSend.patientName} </h3>
        <p>Bạn nhận được email này vì đã đặt lịch khám bệnh trực tuyến thành công</p>
        <p>Thông tin đơn thuốc/hóa đơn được gửi trong file đính kèm</p>
        <p>Xin chân thành cảm ơn!</p>
        `;
    } else {
        result = `
        <h3>Hello ${dataSend.patientName} </h3>
        <p>You received this email because you scheduled your medical appointment online</p>
        <p>Information on scheduling medical examinations</p>
        <p>Sincerely thank!</p>
        `;
    }
    return result;
};

module.exports = {
    sendSimpleEmail,
    sendBillEmail,
};
