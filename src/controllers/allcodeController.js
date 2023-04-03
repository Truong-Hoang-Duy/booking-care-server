import allcodeServices from "../services/allcodeServices";

const getAllCode = async (req, res) => {
  const response = await allcodeServices.getAllCodeService(req.query.type);
  if (response.code === 200) {
    return res.status(200).json(response);
  } else return res.status(response.code).json(response);
};

export default { getAllCode };
