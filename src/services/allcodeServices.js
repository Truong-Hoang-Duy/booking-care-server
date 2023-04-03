import db from "../models";
import { Response } from "../utils/Response";

const getAllCodeService = (type) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!type) {
        const response = new Response(400, "Missing required parameters");
        resolve(response);
      } else {
        const allcode = await db.Allcode.findAll({
          where: { type },
        });
        const response = new Response(200, "Get allcode successfully", allcode);
        resolve(response);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export default { getAllCodeService };
