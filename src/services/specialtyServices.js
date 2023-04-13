import db from "../models";
import { Response } from "../utils/Response";

const getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await db.Specialty.findAll();
      if (data && data.length > 0) {
        data.map((item) => (item.image = Buffer.from(item.image, "base64").toString("binary")));
        const response = new Response(200, "Create a successful specialty", data);
        return resolve(response);
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
        return resolve(response);
      } else {
        await db.Specialty.create({
          name,
          image: imageBase64,
          descriptionHTML: contentHTML,
          descriptionMarkdown: contentMarkdown,
        });
        const response = new Response(200, "Create a successful specialty");
        return resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { getAllSpecialty, createSpecialty };
