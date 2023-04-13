import _ from "lodash";
import db from "../models";
import { Response } from "../utils/Response";
import emailServices from "./emailServices";
import dotenv from "dotenv";
dotenv.config();
import { v4 as uuidv4 } from "uuid";

const buildUrl = (doctorId, confirmTime) => {
  const result = `${process.env.URL_REACT}/verify-booking/${confirmTime}/${doctorId}`;
  return result;
};

const postBookDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {
        doctorId,
        date,
        timeType,
        email,
        firstName,
        lastName,
        gender,
        address,
        phonenumber,
        timeString,
        doctorName,
        language,
      } = data;
      if (_.isEmpty(email)) {
        const response = new Response(400, "Missing email");
        return resolve(response);
      } else {
        const patient = await db.User.findOne({
          where: { email },
          raw: false,
        });
        if (patient) {
          patient.firstName = firstName;
          patient.lastName = lastName;
          patient.address = address;
          patient.gender = gender;
          patient.phonenumber = phonenumber;
          await patient.save();

          const confirmTime = uuidv4();
          const [user, created] = await db.Booking.findOrCreate({
            where: { patientId: patient.id, date },
            defaults: {
              statusId: "S1",
              doctorId,
              patientId: patient.id,
              date,
              timeType,
              confirmTime,
            },
          });
          if (created) {
            await emailServices.sendSimpleEmail({
              reciverEmail: email,
              patientName: `${lastName} ${firstName}`,
              time: timeString,
              doctorName,
              language,
              redirectLink: buildUrl(doctorId, confirmTime),
            });
            const response = new Response(200, "Booking a new appointment succeed!");
            return resolve(response);
          } else {
            const response = new Response(400, "Bạn đã đặt cuộc hẹn trong ngày");
            return resolve(response);
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getPatientByEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const patient = await db.User.findOne({
        where: { email },
        attributes: {
          exclude: ["id", "roleId", "password", "image", "positionId", "createdAt", "updatedAt"],
        },
      });
      const response = new Response(200, "Success", patient);
      return resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

const postVerifyBookDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { doctorId, confirmTime } = data;
      if (!confirmTime || !doctorId) {
        const response = new Response(400, "Missing parameters");
        return resolve(response);
      } else {
        const appointment = await db.Booking.findOne({
          where: { doctorId, confirmTime, statusId: "S1" },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          const response = new Response(200, "Bạn đã xác thực lịch hẹn thành công");
          return resolve(response);
        } else {
          const response = new Response(400, "Lịch hẹn đã được kích hoạt hoặc không tồn tại");
          return resolve(response);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { postBookDoctor, getPatientByEmail, postVerifyBookDoctor };
