import userServices from "../services/userServices";

const handleLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email || !password) {
    return res.status(500).json({
      code: 500,
      message: "Missing email or password",
    });
  }

  const userData = await userServices.handleUserLogin(email, password);
  if (userData.code === 500) {
    return res.status(500).json({
      ...userData,
    });
  } else {
    return res.status(200).json({
      ...userData,
    });
  }
};

const handleGetAllUsers = async (req, res) => {
  const id = req.query.id; //ALL, id
  const users = await userServices.getAllUsers(id);
  if (users) {
    return res.status(200).json({
      code: 200,
      message: "success",
      data: users,
    });
  } else {
    return res.status(500).json({
      code: 500,
      message: "not found user",
      data: [],
    });
  }
};

const handleCreateNewUser = async (req, res) => {
  const response = await userServices.createNewUser(req.body);
  if (response.code === 500) return res.status(500).json(response);
  else return res.status(200).json(response);
};

const handleEditUser = async (req, res) => {
  const data = req.body;
  const response = await userServices.editUser(data);
  if (response.code === 500) return res.status(500).json(response);
  else return res.status(200).json(response);
};

const handleDeleteUser = async (req, res) => {
  const response = await userServices.deleteUser(req.body.id);
  if (response.code === 500) return res.status(500).json(response);
  else return res.status(200).json(response);
};

export default {
  handleLogin,
  handleGetAllUsers,
  handleCreateNewUser,
  handleEditUser,
  handleDeleteUser,
};
