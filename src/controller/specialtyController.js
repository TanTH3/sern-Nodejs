import specialtyService from '../service/specialtyService';

let createSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.createSpecialtyService(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};

let getAllSpecialty = async (req, res) => {
    try {
        let info = await specialtyService.getAllSpecialtyService();
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let getDetailSpecialtyById = async (req, res) => {
    try {
        let info = await specialtyService.getDetailSpecialtyByIdService(req.query.id, req.query.location);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};

module.exports = {
    createSpecialty,
    getAllSpecialty,
    getDetailSpecialtyById,
};
