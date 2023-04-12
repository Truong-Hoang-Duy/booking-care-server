import _ from "lodash";
import db from "../models";
import { Response } from "../utils/Response";

const postBookDoctor = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { doctorId, date, timeType, email, firstName, lastName, gender, address, phonenumber } =
        data;
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

          const [user, created] = await db.Booking.findOrCreate({
            where: { date },
            defaults: {
              statusId: "S1",
              doctorId,
              patientId: patient.id,
              date,
              timeType,
            },
          });
          if (created) {
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

export default { postBookDoctor, getPatientByEmail };
