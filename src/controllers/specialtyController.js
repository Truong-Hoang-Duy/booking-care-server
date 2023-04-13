import specialtyServices from "../services/specialtyServices";

const getAllSpecialty = async (req, res) => {
  const response = await specialtyServices.getAllSpecialty();
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const createSpecialty = async (req, res) => {
  const response = await specialtyServices.createSpecialty(req.body);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

export default { getAllSpecialty, createSpecialty };
