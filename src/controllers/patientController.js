import patientServices from "../services/patientServices";

const postBookDoctor = async (req, res) => {
  const response = await patientServices.postBookDoctor(req.body);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const getPatientByEmail = async (req, res) => {
  const response = await patientServices.getPatientByEmail(req.query.email);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

export default { postBookDoctor, getPatientByEmail };
