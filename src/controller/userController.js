import userService from '../service/userService';

let handleLogin = async (req, res) => {
    let email = req.body.email;
    let password = req.body.password;

    if (!email || !password) {
        return res.status(500).json({
            errCode: 1,
            message: 'Missing inputs parameter!',
        });
    }

    let userData = await userService.handleUserLogin(email, password);

    return res.status(200).json({
        errCode: userData.errCode,
        message: userData.errMessage,
        user: userData.user ? userData.user : {},
    });
};

let handleGetAllUser = async (req, res) => {
    let id = req.query.id; //ALL, id

    if (!id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'Missing require',
            user: [],
        });
    }
    let user = await userService.getAllUsers(id);

    return res.status(200).json({
        errCode: 0,
        errMessage: 'OK',
        user,
    });
};

let handleCreateNewUser = async (req, res) => {
    console.log(123, req.body);
    let message = await userService.createNewUser(req.body);
    console.log(message);
    return res.status(200).json(message);
};

let handleDeleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(200).json({
            errCode: 1,
            errMessage: 'missing required !',
        });
    }
    let message = await userService.deleteUser(req.body.id);
    return res.status(200).json(message);
};
let handleEditUser = async (req, res) => {
    await console.log(req.body);
    let message = await userService.editUser(req.body);
    return res.status(200).json(message);
};
let getAllCode = async (req, res) => {
    console.log('1223', req.query.type);
    try {
        let data = await userService.getAllCodeService(req.query.type);
        return res.status(200).json(data);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server',
        });
    }
};
module.exports = {
    handleLogin,
    handleGetAllUser,
    handleCreateNewUser,
    handleDeleteUser,
    handleEditUser,
    getAllCode,
};
