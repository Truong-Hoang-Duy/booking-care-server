import clinicServices from "../services/clinicServices";

const getAllClinic = async (req, res) => {
  const response = await clinicServices.getAllClinic();
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const getOneClinic = async (req, res) => {
  const response = await clinicServices.getOneClinic(req.query.id);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const createClinic = async (req, res) => {
  const response = await clinicServices.createClinic(req.body);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

export default { createClinic, getAllClinic, getOneClinic };
