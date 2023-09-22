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

module.exports = {
    createSpecialtyService,
};
