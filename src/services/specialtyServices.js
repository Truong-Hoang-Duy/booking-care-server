import db from "../models";
import { Response } from "../utils/Response";

const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => (item.image = Buffer.from(item.image, "base64").toString("binary")));
        const response = new Response(200, "Get successfully data", data);
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

const getOneSpecialty = (id, location) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id || !location) {
        const response = new Response(400, "Missing parameter");
        resolve(response);
      } else {
        const data = await db.Specialty.findOne({
          where: { id },
          attributes: ["descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          let doctorSpecialty = {};
          if (location === "ALL") {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: id },
              attributes: ["doctorId", "provinceId"],
            });
          } else {
            doctorSpecialty = await db.Doctor_Infor.findAll({
              where: { specialtyId: id, provinceId: location },
              attributes: ["doctorId", "provinceId"],
            });
          }
          data.doctorSpecialty = doctorSpecialty;
          const response = new Response(200, "Get successfully data", data);
          resolve(response);
        } else {
          const response = new Response(500, "Not found");
          resolve(response);
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const createSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, imageBase64, contentHTML, contentMarkdown } = data;
      if (!name || !imageBase64 || !contentHTML || !contentMarkdown) {
        const response = new Response(400, "Missing parameters");
        resolve(response);
      } else {
        await db.Specialty.create({
          name,
          image: imageBase64,
          descriptionHTML: contentHTML,
          descriptionMarkdown: contentMarkdown,
        });
        const response = new Response(200, "Create a successful specialty");
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { getAllSpecialty, createSpecialty, getOneSpecialty };
