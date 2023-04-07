import db from "../models";
import { Response } from "../utils/Response";

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
        const respone = new Response(400, "Missing required parameter!");
        resolve(respone);
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
        const respone = new Response(200, "Success", data);
        resolve(respone);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { getDoctor, postInfoDoctor, getDetailDoctorById };
