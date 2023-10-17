import db from '../models/index';

let createClinicService = (data) => {
    return new Promise(async (res, rej) => {
        try {
            if (
                !data.name ||
                !data.descriptionHTML ||
                !data.descriptionMarkdown ||
                !data.address ||
                !data.imageBase64
            ) {
                res({
                    errCode: 1,
                    errMessage: 'Missing Parameter',
                });
            } else {
                await db.Clinic.create({
                    name: data.name,
                    image: data.imageBase64,
                    descriptionHTML: data.descriptionHTML,
                    descriptionMarkdown: data.descriptionMarkdown,
                    address: data.address,
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

let getAllClinicService = () => {
    return new Promise(async (res, rej) => {
        try {
            let data = await db.Clinic.findAll({});
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
let getDetailClinicByIdService = (id, location) => {
    return new Promise(async (res, rej) => {
        try {
            if (!id || !location) {
                res({
                    errCode: 1,
                    errMessage: 'Missing Parameter',
                });
            } else {
                let data = {};
                data.data = await db.Clinic.findOne({
                    where: {
                        id,
                    },
                    attributes: ['name', 'address', 'descriptionHTML', 'descriptionMarkdown'],
                });

                if (data.data) {
                    let doctorClinic = [];

                    doctorClinic = await db.Doctor_Info.findAll({
                        where: {
                            clinicId: id,
                        },
                        attributes: ['doctorId', 'provinceId'],
                    });

                    data.doctorClinic = doctorClinic;
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
    createClinicService,
    getAllClinicService,
    getDetailClinicByIdService,
};
