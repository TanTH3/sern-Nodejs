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

module.exports = {
    createSpecialty,
};
