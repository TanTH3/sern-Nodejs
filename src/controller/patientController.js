import patientService from '../service/patientService';

let postBookAppointment = async (req, res) => {
    console.log('789', req.body);
    try {
        let info = await patientService.postBookAppointmentService(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server ...',
        });
    }
};

let postVerifyBookAppointment = async (req, res) => {
    try {
        let info = await patientService.postVerifyBookAppointmentService(req.body);
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
    postBookAppointment,
    postVerifyBookAppointment,
};
