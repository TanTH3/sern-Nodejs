import bcrypt from 'bcryptjs';
import db from '../models/index';

const salt = bcrypt.genSaltSync(10);

let createNewUser = async (data) => {
    return new Promise(async (res, rej) => {
        try {
            let hashPasswordFromBcrypt = await hashUserPassword(data.password);
            await db.User.create({
                email: data.email,
                password: hashPasswordFromBcrypt,
                firstName: data.firstName,
                lastName: data.lastName,
                address: data.address,
                gender: data.gender,
                roleId: data.role,
                phoneNumber: data.phoneNumber,
            });
            res('Ok');
        } catch (e) {
            rej(e);
        }
    });
};

let hashUserPassword = (password) => {
    return new Promise(async (res, rej) => {
        try {
            var hashPassword = await bcrypt.hashSync(password, salt);
            res(hashPassword);
        } catch (e) {
            rej(e);
        }
    });
};

let getAllUser = () => {
    return new Promise(async (res, rej) => {
        try {
            let users = db.User.findAll({
                raw: true,
            });
            res(users);
        } catch (e) {
            rej(e);
        }
    });
};

let getUserInfoById = (userId) => {
    return new Promise(async (res, rej) => {
        try {
            let user = await db.User.findOne({
                where: { id: userId },
            });

            if (user) {
                res(user);
            } else {
                res([]);
            }
        } catch (e) {
            rej(e);
        }
    });
};

let updateUserData = (data) => {
    return new Promise(async (res, rej) => {
        try {
            if (!data.id || !data.roleId || !data.positionId || !data.gender) {
                res({
                    errCode: 2,
                    errMessage: 'Missing ',
                });
            }
            let user = await db.User.findOne({
                where: { id: data.id },
            });
            if (user) {
                user.firstName = data.firstName;
                user.lastName = data.lastName;
                user.address = data.address;
                user.roleId = data.roleId;
                user.positionId = data.positionId;
                user.gender = data.gender;
                user.phoneNumber = data.phoneNumber;
                if (data.avatar) {
                    user.image = data.avatar;
                }

                await user.save();

                let allUsers = await db.User.findAll();
                res(allUsers);
            } else {
                res();
            }
        } catch (e) {
            console.log(e);
        }
    });
};

let deleteUserById = (id) => {
    return new Promise(async (res, rej) => {
        try {
            let user = await db.User.findOne({
                where: { id },
            });
            console.log(user);
            if (user) {
                await user.destroy();
            }
            res();
        } catch (e) {
            rej(e);
        }
    });
};
module.exports = {
    createNewUser,
    getAllUser,
    getUserInfoById,
    updateUserData,
    deleteUserById,
};
