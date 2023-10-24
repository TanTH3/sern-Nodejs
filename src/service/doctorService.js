import db from '../models/index';
require('dotenv').config();
import _ from 'lodash';
import emailService from '../service/emailService';

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
                    {
                        model: db.Doctor_Info,
                        attributes: ['specialtyId', 'clinicId'],
                        include: [
                            { model: db.Specialty, attributes: ['name'] },
                            { model: db.Clinic, attributes: ['name'] },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
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
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] },
                    {
                        model: db.Doctor_Info,
                        attributes: ['specialtyId', 'clinicId'],
                        include: [
                            { model: db.Specialty, attributes: ['name'] },
                            { model: db.Clinic, attributes: ['name'] },
                        ],
                    },
                ],
                raw: true,
                nest: true,
            });
            res({
                errCode: 0,
                data: doctors,
            });
        } catch (e) {
            rej(e);
        }
    });
};

let checkRequiredFields = (inputData) => {
    let arrFields = [
        'doctorId',
        'contentHTML',
        'contentMarkdown',
        'action',
        'selectedPrice',
        'selectedPayment',
        'selectedProvince',
        'nameClinic',
        'addressClinic',
        'note',
        'specialtyId',
    ];

    let isValid = true;
    let element = '';
    for (let i = 0; i < arrFields.length; i++) {
        if (!inputData[arrFields[i]]) {
            isValid = false;
            element = arrFields[i];
            break;
        }
    }

    return {
        isValid,
        element,
    };
};

let saveInfoDoctorService = (inputData) => {
    console.log(inputData);
    return new Promise(async (res, rej) => {
        try {
            let checkObj = checkRequiredFields(inputData);
            if (checkObj.isValid === false) {
                res({
                    errCode: 1,
                    errMessage: `Missing parameter: ${checkObj.element} `,
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
                let Doctor_Clinic_Specialty = await db.Doctor_Clinic_Specialty.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                });
                if (Doctor_Clinic_Specialty) {
                    Doctor_Clinic_Specialty.doctorId = inputData.doctorId;
                    Doctor_Clinic_Specialty.specialtyId = inputData.specialtyId;
                    Doctor_Clinic_Specialty.clinicId = inputData.clinicId;

                    await Doctor_Clinic_Specialty.save();
                } else {
                    await db.Doctor_Clinic_Specialty.create({
                        doctorId: inputData.doctorId,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
                    });
                }
                //upset to doctor_info
                let doctorInfo = await db.Doctor_Info.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                    },
                    raw: false,
                });
                if (doctorInfo) {
                    doctorInfo.doctorId = inputData.doctorId;
                    doctorInfo.priceId = inputData.selectedPrice;
                    doctorInfo.paymentId = inputData.selectedPayment;
                    doctorInfo.provinceId = inputData.selectedProvince;
                    doctorInfo.nameClinic = inputData.nameClinic;
                    doctorInfo.addressClinic = inputData.addressClinic;
                    doctorInfo.note = inputData.note;
                    doctorInfo.specialtyId = inputData.specialtyId;
                    doctorInfo.clinicId = inputData.clinicId;

                    await doctorInfo.save();
                } else {
                    await db.Doctor_Info.create({
                        doctorId: inputData.doctorId,
                        priceId: inputData.selectedPrice,
                        provinceId: inputData.selectedProvince,
                        paymentId: inputData.selectedPayment,
                        nameClinic: inputData.nameClinic,
                        addressClinic: inputData.addressClinic,
                        note: inputData.note,
                        specialtyId: inputData.specialtyId,
                        clinicId: inputData.clinicId,
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
                            model: db.Doctor_Info,
                            attributes: [
                                'priceId',
                                'paymentId',
                                'provinceId',
                                'addressClinic',
                                'nameClinic',
                                'note',
                                'count',
                                'specialtyId',
                                'clinicId',
                            ],
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Specialty, attributes: ['name'] },
                                { model: db.Clinic, attributes: ['name'] },
                            ],
                        },
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
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
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
                    include: [
                        { model: db.Allcode, as: 'timeTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.User, as: 'doctorData', attributes: ['firstName', 'lastName'] },
                    ],
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

let getExtraInfoDoctorByIdService = (doctorId) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId) {
                res({
                    errCode: 1,
                    errMessage: 'Missing required param !',
                });
            } else {
                let data = await db.Doctor_Info.findOne({
                    where: {
                        doctorId,
                    },
                    attributes: {
                        exclude: ['id', 'doctorId'],
                    },
                    include: [
                        { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                        { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                    ],
                    raw: false,
                    nest: true,
                });
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
let getProfileDoctorByIdService = (doctorId) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId) {
                res({
                    errCode: 1,
                    errMessage: 'Missing required param !',
                });
            } else {
                let data = await db.User.findOne({
                    where: {
                        id: doctorId,
                    },
                    attributes: {
                        exclude: ['password'],
                    },
                    include: [
                        {
                            model: db.Markdown,
                            attributes: ['description', 'contentHTML', 'contentMarkdown'],
                        },
                        { model: db.Allcode, as: 'positionData', attributes: ['valueEn', 'valueVi'] },
                        {
                            model: db.Doctor_Info,
                            attributes: {
                                exclude: ['id', 'doctorId'],
                            },
                            include: [
                                { model: db.Allcode, as: 'priceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'provinceTypeData', attributes: ['valueEn', 'valueVi'] },
                                { model: db.Allcode, as: 'paymentTypeData', attributes: ['valueEn', 'valueVi'] },
                            ],
                        },
                    ],
                    raw: false,
                    nest: true,
                });
                if (data && data.image) {
                    data.image = Buffer.from(data.image, 'base64').toString('binary');
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

let getListPatientForDoctorService = (doctorId, date) => {
    return new Promise(async (res, rej) => {
        try {
            if (!doctorId || !date) {
                res({
                    errCode: 1,
                    errMessage: 'Missing required param !',
                });
            } else {
                let data = await db.Booking.findAll({
                    where: {
                        doctorId,
                        date,
                        statusId: 'S2',
                    },
                    include: [
                        {
                            model: db.User,
                            as: 'patientData',
                            attributes: ['email', 'firstName', 'address', 'gender'],
                            include: [{ model: db.Allcode, as: 'genderData', attributes: ['valueEn', 'valueVi'] }],
                        },
                        {
                            model: db.Allcode,
                            as: 'timeTypeDataPatient',
                            attributes: ['valueVi', 'valueEn'],
                        },
                    ],
                    raw: false,
                    nest: true,
                });

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
let sendRemedyService = (inputData) => {
    return new Promise(async (res, rej) => {
        try {
            if (!inputData.doctorId || !inputData.email || !inputData.timeType || !inputData.patientId) {
                res({
                    errCode: 1,
                    errMessage: 'Missing parameter',
                });
            } else {
                let appointment = await db.Booking.findOne({
                    where: {
                        doctorId: inputData.doctorId,
                        patientId: inputData.patientId,
                        timeType: inputData.timeType,
                        date: inputData.date,
                    },
                    raw: false,
                });
                if (appointment) {
                    appointment.statusId = 'S3';
                    await appointment.save();
                }

                await emailService.sendBillEmail(inputData);

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
module.exports = {
    getTopDoctorHomeService,
    getAllDoctors,
    saveInfoDoctorService,
    getDetailDoctorByIdService,
    bulkCreateScheduleService,
    getScheduleByDateService,
    getExtraInfoDoctorByIdService,
    getProfileDoctorByIdService,
    getListPatientForDoctorService,
    sendRemedyService,
};
