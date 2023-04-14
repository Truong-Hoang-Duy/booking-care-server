import db from "../models";
import { Response } from "../utils/Response";

const getAllClinic = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Clinic.findAll();
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

const getOneClinic = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!id) {
        const response = new Response(400, "Missing parameter");
        resolve(response);
      } else {
        let data = await db.Clinic.findOne({
          where: { id },
          attributes: ["name", "address", "descriptionHTML", "descriptionMarkdown"],
        });
        if (data) {
          const doctorClinic = await db.Doctor_Infor.findAll({
            where: { clinicId: id },
            attributes: ["doctorId", "provinceId"],
          });
          data.doctorClinic = doctorClinic;
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

const createClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { name, address, imageBase64, contentHTML, contentMarkdown } = data;
      if (!name || !address || !imageBase64 || !contentHTML || !contentMarkdown) {
        const response = new Response(400, "Missing parameters");
        resolve(response);
      } else {
        await db.Clinic.create({
          name,
          address,
          image: imageBase64,
          descriptionHTML: contentHTML,
          descriptionMarkdown: contentMarkdown,
        });
        const response = new Response(200, "Create a successful clinic");
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { createClinic, getAllClinic, getOneClinic };
