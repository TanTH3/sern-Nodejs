import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHomeService = (limitInput) => {
    return new Promise(async (res, rej) => {
        try {
            let users = await db.User.findAll({
                limit: limitInput,
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],

                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                ],
                raw: true,
                nest: true,
            });
            console.log(users);
            res({
                errCode: 0,
                data: users,
            });
        } catch (e) {
            rej(e);
        }
    });
};

let getAllDoctors = () => {
    return new Promise(async (res, rej) => {
        try {
            let doctors = await db.User.findAll({
                where: { roleId: 'R2' },
                order: [['createdAt', 'DESC']],

                attributes: {
                    exclude: ['password', 'image'],
                },
            });
            console.log(doctors);
            res({
                errCode: 0,
                data: doctors,
            });
        } catch (e) {
            rej(e);
        }
    });
};
let saveInfoDoctorService = (inputData) => {
    console.log('1231232123', inputData);
    return new Promise(async (res, rej) => {
        try {
            if (
                !inputData.doctorId ||
                !inputData.contentHTML ||
                !inputData.contentMarkdown ||
                !inputData.action ||
                !inputData.selectedPrice ||
                !inputData.selectedPayment ||
                !inputData.selectedProvince ||
                !inputData.nameClinic ||
                !inputData.addressClinic
            ) {
                res({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                });
            } else {
                if (inputData.action === 'CREATE') {
                    await db.Markdown.create({
                        contentHTML: inputData.contentHTML,
                        contentMarkdown: inputData.contentMarkdown,
                        description: inputData.description,
                        doctorId: inputData.doctorId,
                    });
                } else if (inputData.action === 'EDIT') {
                    let doctorMarkdown = await db.Markdown.findOne({
                        where: { doctorId: inputData.doctorId },
                        raw: false,
                    });
                    if (doctorMarkdown) {
                        (doctorMarkdown.contentHTML = inputData.contentHTML),
                            (doctorMarkdown.contentMarkdown = inputData.contentMarkdown),
                            (doctorMarkdown.description = inputData.description),
                            (doctorMarkdown.updateAt = new Date());

                        await doctorMarkdown.save();
                    }
                }

                //upset to doctor_info
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                });
                if (doctorInfo) {
                    (doctorInfo.doctorId = inputData.doctorId),
                        (doctorInfo.priceId = inputData.selectedPrice),
                        (doctorInfo.province = inputData.selectedProvince),
                        (doctorInfo.payment = inputData.selectedPayment),
                        (doctorInfo.nameClinic = inputData.nameClinic),
                        (doctorInfo.addressClinic = inputData.addressClinic),
                        (doctorInfo.note = inputData.note);

                    await doctorInfo.save();
                } else {
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        province: inputData.selectedProvince,
                        payment: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                    });
                }
            }

            res({
                errCode: 0,
                errMessage: 'Save info Doctor',
            });
        } catch (e) {
            rej(e);
        }
    });
};
let getDetailDoctorByIdService = (id) => {
    return new Promise(async (res, rej) => {
        let data = [];
        try {
            if (!id) {
                res({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                });
            } else {
                data = await db.User.findOne({
                    where: { id },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });

                if (data && data.image) {
                    data.image = new Buffer(data.image, 'base64').toString('binary');
                }
                if (!data) data = {};
                res({
                    errCode: 0,
                    data,
                });
            }
        } catch (e) {
            rej(e);
        }
    });
};
let bulkCreateScheduleService = (data) => {
    return new Promise(async (res, rej) => {
        try {
            if (!data.arrSchedule || !data.doctorId || !data.formatDate) {
                res({
                    errCode: 1,
                    errMessage: 'Missing required param !',
                });
            } else {
                let schedule = data.arrSchedule;
                if (schedule && schedule.length > 0) {
                    schedule = schedule.map((item) => {
                        item.maxNumber = MAX_NUMBER_SCHEDULE;
                        return item;
                    });
                }

                let existing = await db.Schedule.findAll({
                    where: { doctorId: data.doctorId, date: data.formatDate },
                    attributes: ['timeType', 'doctorId', 'date', 'maxNumber'],
                    raw: true,
                });

                console.log(schedule);
                console.log('========================');
                console.log(existing);

                let toCreate = _.differenceWith(schedule, existing, (a, b) => {
                    return a.timeType === b.timeType && a.date == b.date;
                });

                if (toCreate && toCreate.length > 0) {
                    await db.Schedule.bulkCreate(toCreate);
                }

                res({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch (e) {
            rej(e);
        }
    });
};
let getScheduleByDateService = (doctorId, date) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId || !date) {
                res({
                    errCode: 1,
                    errMessage: 'Missing required param !',
                });
            } else {
                let dataSchedule = await db.Schedule.findAll({
                    where: {
                        doctorId,
                        date,
                    },
                    include: [{ model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] }],
                    raw: false,
                    nest: true,
                });
                if (!dataSchedule) dataSchedule = [];

                res({
                    errCode: 0,
                    data: dataSchedule,
                });
            }
        } catch (e) {
            rej(e);
        }
    });
};
module.exports = {
    getTopDoctorHomeService,
    getAllDoctors,
    saveInfoDoctorService,
    getDetailDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleByDateService,
};
