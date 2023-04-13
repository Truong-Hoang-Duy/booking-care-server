import doctorServices from "../services/doctorServices";

const getDoctor = async (req, res) => {
  let limit = req.query.limit;
  if (!limit) limit = 10;
  const response = await doctorServices.getDoctor(+limit);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const createInfoDoctor = async (req, res) => {
  const response = await doctorServices.postInfoDoctor(req.body);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const getDetailDoctorById = async (req, res) => {
  const response = await doctorServices.getDetailDoctorById(req.query.id);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const createSchedule = async (req, res) => {
  const response = await doctorServices.createSchedule(req.body);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const getScheduleByDate = async (req, res) => {
  const response = await doctorServices.getScheduleByDate(req.query.doctorId, req.query.date);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

const getDoctorInforById = async (req, res) => {
  const response = await doctorServices.getDoctorInforById(req.query.id);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

export default {
  getDoctor,
  createInfoDoctor,
  getDetailDoctorById,
  createSchedule,
  getScheduleByDate,
  getDoctorInforById,
};
