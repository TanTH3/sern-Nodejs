import db from '../models/index';

let createSpecialtyService = (data) => {
    return new Promise(async (res, rej) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionMarkdown) {
                res({
                    errCode: 1,
                    errMessage: 'Missing Parameter',
                });
            } else {
                await db.Specialty.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                });
                res({
                    errCode: 0,
                    errMessage: 'OK',
                });
            }
        } catch (e) {
            rej(e);
            console.log(e);
        }
    });
};

let getAllSpecialtyService = () => {
    return new Promise(async (res, rej) => {
        try {
            let data = await db.Specialty.findAll({});
            if (data && data.length > 0) {
                data.map((item) => {
                    item.image = new Buffer(item.image, 'base64').toString('binary');
                    return item;
                });
            }
            res({
                errCode: 0,
                data,
            });
        } catch (e) {
            rej(e);
            console.log(e);
        }
    });
};
let getDetailDoctorByIdService = (id, location) => {
    return new Promise(async (res, rej) => {
        try {
            if (!id || !location) {
                res({
                    errCode: 1,
                    errMessage: 'Missing Parameter',
                });
            } else {
                let data = await db.Specialty.findOne({
                    where: {
                        id,
                    },
                    attributes: ['descriptionHTML', 'descriptionMarkdown'],
                });
                if (data) {
                    let doctorSpecialty = [];
                    if (location === 'ALL') {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: id,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    } else {
                        doctorSpecialty = await db.Doctor_Info.findAll({
                            where: {
                                specialtyId: id,
                                provinceId: location,
                            },
                            attributes: ['doctorId', 'provinceId'],
                        });
                    }

                    data.doctorSpecialty = doctorSpecialty;
                } else data = {};
                res({
                    errCode: 0,
                    data,
                });
            }
        } catch (e) {
            rej(e);
            console.log(e);
        }
    });
};
module.exports = {
    createSpecialtyService,
    getAllSpecialtyService,
    getDetailDoctorByIdService,
};
