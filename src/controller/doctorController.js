import doctorService from '../service/doctorService';

let getTopDoctorHome = async (req, res) => {
    let limit = req.query.limit;
    if (!limit) limit = 10;
    try {
        let response = await doctorService.getTopDoctorHomeService(+limit);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let getAllDoctors = async (req, res) => {
    try {
        let doctors = await doctorService.getAllDoctors();
        return res.status(200).json(doctors);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let postInfoDoctor = async (req, res) => {
    try {
        let response = await doctorService.saveInfoDoctorService(req.body);
        return res.status(200).json(response);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let getDetailDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getDetailDoctorByIdService(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let bulkCreateSchedule = async (req, res) => {
    try {
        let info = await doctorService.bulkCreateScheduleService(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let getScheduleByDate = async (req, res) => {
    try {
        let info = await doctorService.getScheduleByDateService(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};

let getExtraInfoDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getExtraInfoDoctorByIdService(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let getProfileDoctorById = async (req, res) => {
    try {
        let info = await doctorService.getProfileDoctorByIdService(req.query.doctorId);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let getListPatientForDoctor = async (req, res) => {
    try {
        let info = await doctorService.getListPatientForDoctorService(req.query.doctorId, req.query.date);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};
let sendRemedy = async (req, res) => {
    try {
        let info = await doctorService.sendRemedyService(req.body);
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
    getTopDoctorHome,
    getAllDoctors,
    postInfoDoctor,
    getDetailDoctorById,
    bulkCreateSchedule,
    getScheduleByDate,
    getExtraInfoDoctorById,
    getProfileDoctorById,
    getListPatientForDoctor,
    sendRemedy,
};
