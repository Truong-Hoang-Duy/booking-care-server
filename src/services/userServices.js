import db from "../models";
import bcrypt from "bcryptjs";
import { Response } from "../utils/Response";
import _ from "lodash";
const salt = bcrypt.genSaltSync(10);

const checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { email } });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
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

const handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const isExist = await checkUserEmail(email);
      if (isExist) {
        // if user already exist, compare password
        const user = await db.User.findOne({
          where: { email },
          attributes: ["email", "password", "roleId", "firstName"],
        });
        if (user) {
          // compare password
          const checkPassword = bcrypt.compareSync(password, user.password);
          if (checkPassword) {
            delete user.password;
            const response = new Response(200, "Login success", user);
            resolve(response);
          } else {
            const response = new Response(500, "Invalid Password");
            resolve(response);
          }
        } else {
          const response = new Response(500, "User's not found");
          resolve(response);
        }
      } else {
        // return error while invalid email
        const response = new Response(500, "Invalid Email");
        resolve(response);
      }
    } catch (e) {
      reject(e);
    }
  });
};

const handleSignUp = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (_.isEmpty(data)) {
        const response = new Response(400, "Missing parameters");
        resolve(response);
      } else {
        const { email, password } = data;
        const isEmailExist = await checkUserEmail(email);
        if (isEmailExist) {
          const response = new Response(500, "Email already exists");
          resolve(response);
        } else {
          const hassPW = await hashUserPassword(password);
          await db.User.create({ email, password: hassPW, roleId: "R3" });
          const response = new Response(200, "Successful account registration");
          resolve(response);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getAllUsers = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (id && id !== "All") {
        users = await db.User.findOne({
          where: { id },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      if (id === "ALL") {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (error) {
      reject(error);
    }
  });
};

// create new user

const createNewUser = (data) => {
  const {
    email,
    password,
    firstName,
    lastName,
    address,
    phoneNumber,
    gender,
    role,
    position,
    avatar,
  } = data;
  return new Promise(async (resolve, reject) => {
    try {
      // check email is exist ?
      const checkEmail = await checkUserEmail(email);
      if (checkEmail) {
        const response = new Response(500, "Email already exists. Please try another email");
        resolve(response);
      } else {
        const hassPW = await hashUserPassword(password);
        await db.User.create({
          email,
          password: hassPW,
          firstName,
          lastName,
          address,
          phonenumber: phoneNumber,
          gender,
          roleId: role,
          positionId: position,
          image: avatar,
        });
        const response = new Response(200, "Create a new user success");
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const deleteUser = async (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      await db.User.destroy({
        where: { id },
      });
      const response = new Response(200, "Delete user successfully");
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

const editUser = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await db.User.findOne({ where: { id: data.id }, raw: false });
      if (user) {
        user.firstName = data.firstName;
        user.lastName = data.lastName;
        user.address = data.address;
        user.phonenumber = data.phoneNumber;
        user.gender = data.gender;
        user.roleId = data.role;
        user.positionId = data.position;
        if (data.avatar) {
          user.image = data.avatar;
        }
        await user.save();
        const response = new Response(200, "Update success");
        resolve(response);
      } else {
        const response = new Response(500, "User not found");
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { handleUserLogin, handleSignUp, getAllUsers, createNewUser, deleteUser, editUser };
