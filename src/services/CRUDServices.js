import bcrypt from "bcryptjs";
import db from "../models";
const salt = bcrypt.genSaltSync(10);

const createNewUser = (data) => {
  const { email, password, firstName, lastName, address, phonenumber, gender, roleId } = data;
  return new Promise(async (resolve, reject) => {
    try {
      const hassPW = await hashUserPassword(password);
      await db.User.create({
        email,
        password: hassPW,
        firstName,
        lastName,
        address,
        phonenumber,
        gender: gender === "1" ? true : false,
        roleId,
      });
      resolve("Create a new user success");
    } catch (error) {
      reject(error);
    }
  });
};

const hashUserPassword = (pw) => {
  return new Promise((resolve, reject) => {
    try {
      const hashPassword = bcrypt.hashSync(pw, salt);
      resolve(hashPassword);
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUser = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.findAll({ raw: true });
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

const getUserInfoById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = db.User.findOne({ where: { id }, raw: true });
      if (user) {
        resolve(user);
      } else {
        resolve({});
      }
    } catch (error) {
      reject(error);
    }
  });
};

const updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { id: data.id } });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        await user.save();
        resolve("Update success");
      } else {
        resolve("");
      }
    } catch (e) {
      reject(e);
    }
  });
};

const deleteUserById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { id } });
      if (user) {
        await user.destroy();
      }
      resolve();
    } catch (error) {
      reject(error);
    }
  });
};

export { createNewUser, getAllUser, getUserInfoById, updateUserData, deleteUserById };
