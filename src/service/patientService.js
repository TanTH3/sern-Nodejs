import db from '../models/index';
require('dotenv').config();
import emailService from './emailService';
import { v4 as uuidv4 } from 'uuid';

let buildUrlEmail = (doctorId, token) => {
    let result = `http://${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;

    console.log('asdasd', result);
    return result;
};

let postBookAppointmentService = (inputData) => {
    console.log('1231232123', inputData);
    return new Promise(async (res, rej) => {
        try {
            if (!inputData.doctorId || !inputData.email || !inputData.timeType || !inputData.date) {
                res({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                });
            } else {
                let token = uuidv4(); // ⇨ '9b1deb4d-3b7d-4bad-9bdd-2b0d7b3dcb6d'
                await emailService.sendSimpleEmail({
                    receiverEmail: inputData.email,
                    patientName: inputData.fullName,
                    time: inputData.timeString,
                    doctorName: inputData.doctorName,
                    language: inputData.language,
                    link: buildUrlEmail(inputData.doctorId, token),
                });

                let user = await db.User.findOrCreate({
                    where: { email: inputData.email },
                    defaults: {
                        email: inputData.email,
                        roleId: 'R3',
                    },
                });
                console.log(user, user[0]);
                if (user && user[0]) {
                    await db.Booking.findOrCreate({
                        where: { token },
                        defaults: {
                            statusId: 'S1',
                            doctorId: inputData.doctorId,
                            patientId: user[0].id,
                            date: inputData.date,
                            timeType: inputData.timeType,
                            token,
                        },
                    });
                }
                res({
                    errCode: 0,
                    errMessage: 'Save info Doctor',
                });
            }
        } catch (e) {
            rej(e);
        }
    });
};

let postVerifyBookAppointmentService = (inputData) => {
    return new Promise(async (res, rej) => {
        try {
            if (!inputData.doctorId || !inputData.token) {
                res({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                        token: inputData.token,
                        statusId: 'S1',
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S2';
                    await appointment.save();
                    res({
                        errCode: 0,
                        errMessage: 'Update the appointment succeed',
                    });
                } else {
                    res({
                        errCode: 2,
                        errMessage: 'appoint has been activated or does not exist',
                    });
                }
            }
        } catch (e) {
            rej(e);
        }
    });
};

module.exports = {
    postBookAppointmentService,
    postVerifyBookAppointmentService,
};
