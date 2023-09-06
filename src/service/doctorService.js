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
module.exports = {
    getTopDoctorHomeService,
    getAllDoctors,
};
