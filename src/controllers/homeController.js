import db from "../models/index";
import * as CRUDServices from "../services/CRUDServices";

const getHomePage = async (req, res) => {
  try {
    const data = await db.User.findAll();
    return res.render("homepage.ejs", {
      data: JSON.stringify(data),
    });
  } catch (error) {
    console.log(error);
  }
};

const getCRUD = (req, res) => {
  return res.render("crud.ejs");
};

const postCRUD = async (req, res) => {
  const message = await CRUDServices.createNewUser(req.body);
  return res.send(message);
};

const displayGetCRUD = async (req, res) => {
  const data = await CRUDServices.getAllUser();
  return res.render("displayCRUD.ejs", { data });
};

const getEditCRUD = async (req, res) => {
  const userId = req.query.id;
  if (userId) {
    const userData = await CRUDServices.getUserInfoById(userId);

    return res.render("editCRUD.ejs", { userData });
  } else {
    return res.send("User not found");
  }
};

const putCRUD = async (req, res) => {
  const data = req.body;
  await CRUDServices.updateUserData(data);
  return res.redirect("/get-crud");
};

const deleteCRUD = async (req, res) => {
  const id = req.query.id;
  if (id) {
    await CRUDServices.deleteUserById(id);
    return res.redirect("/get-crud");
  } else {
    return res.send("User not found");
  }
};

export { getHomePage, getCRUD, postCRUD, displayGetCRUD, getEditCRUD, putCRUD, deleteCRUD };
