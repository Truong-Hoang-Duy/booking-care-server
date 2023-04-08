import _ from "lodash";
import db from "../models";
import { Response } from "../utils/Response";
import dotenv from "dotenv";
import dayjs from "dayjs";

dotenv.config();

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

const getDoctor = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      const users = await db.User.findAll({
        limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
          { model: db.Allcode, as: "genderData", attributes: ["valueEn", "valueVi"] },
        ],
        raw: true,
        nest: true,
      });
      const response = new Response(200, "Get all doctor success", users);
      resolve(response);
    } catch (error) {
      reject(error);
    }
  });
};

const postInfoDoctor = (data) => {
  const { doctorId, contentHTML, contentMarkdown, description, action } = data;
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !contentHTML || !contentMarkdown || !action) {
        const response = new Response(400, "Missing parameter");
        resolve(response);
      } else {
        if (action === "create") {
          await db.Markdown.create({
            contentHTML,
            contentMarkdown,
            description,
            doctorId,
          });
          const response = new Response(200, "Save info doctor succeed!");
          resolve(response);
        } else if (action === "edit") {
          const doctorMarkdown = await db.Markdown.findOne({
            where: { doctorId },
            raw: false,
          });
          if (doctorMarkdown) {
            doctorMarkdown.contentHTML = contentHTML;
            doctorMarkdown.contentMarkdown = contentMarkdown;
            doctorMarkdown.description = description;
            doctorMarkdown.updateAt = new Date();
            await doctorMarkdown.save();
            const response = new Response(200, "Edit info doctor succeed!");
            resolve(response);
          }
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getDetailDoctorById = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        const response = new Response(400, "Missing required parameter!");
        resolve(response);
      } else {
        const data = await db.User.findOne({
          where: { id },
          attributes: {
            exclude: ["password"],
          },
          include: [
            { model: db.Markdown, attributes: ["contentHTML", "contentMarkdown", "description"] },
            { model: db.Allcode, as: "positionData", attributes: ["valueEn", "valueVi"] },
          ],
          raw: false,
          nest: true,
        });
        if (data && data.image) {
          data.image = Buffer.from(data.image, "base64").toString("binary");
        }
        const response = new Response(200, "Success", data);
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const createSchedule = (data) => {
  const { arrSchedule, doctorId, date } = data;
  return new Promise(async (resolve, reject) => {
    try {
      if (arrSchedule && arrSchedule.length > 0) {
        const schedule = arrSchedule.map((item) => ({
          maxNumber: MAX_NUMBER_SCHEDULE,
          ...item,
        }));

        // get all existed data from database
        let existedSchedule = await db.Schedule.findAll({
          where: { doctorId, date },
          attributes: ["timeType", "date", "doctorId", "maxNumber"],
          raw: true,
        });

        // convert date => timestamp
        if (existedSchedule && existedSchedule.length > 0) {
          existedSchedule = existedSchedule.map((item) => {
            item.date = new Date(item.date).getTime();
            return item;
          });
        }

        // compare difference
        const checkExist = _.differenceWith(schedule, existedSchedule, (a, b) => {
          return a.timeType === b.timeType && a.date === b.date;
        });

        // if there is a difference then generate data
        if (checkExist && checkExist.length > 0) {
          await db.Schedule.bulkCreate(checkExist);
          const response = new Response(200, "The schedule has been created");
          resolve(response);
        } else {
          const response = new Response(400, "The schedule already exists");
          resolve(response);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        const response = new Response(400, "Missing required parameters");
        return resolve(response);
      } else {
        const data = await db.Schedule.findAll({
          where: { doctorId },
          include: [{ model: db.Allcode, as: "timeTypeData", attributes: ["valueEn", "valueVi"] }],
          raw: true,
          nest: true,
        });
        if (data) {
          const customData = data.map((item) => ({
            ...item,
            date: dayjs(item.date).startOf("day").valueOf(),
          }));
          const result = customData.filter((item) => item.date === Number(date));
          const response = new Response(200, "Get schedule success", result);
          resolve(response);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default {
  getDoctor,
  postInfoDoctor,
  getDetailDoctorById,
  createSchedule,
  getScheduleByDate,
};
