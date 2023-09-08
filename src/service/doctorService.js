import db from '../models/index';

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
    return new Promise(async (res, rej) => {
        try {
            if (!inputData.doctorId || !inputData.contentHTML || !inputData.contentMarkdown || !inputData.action) {
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
module.exports = {
    getTopDoctorHomeService,
    getAllDoctors,
    saveInfoDoctorService,
    getDetailDoctorByIdService,
};
