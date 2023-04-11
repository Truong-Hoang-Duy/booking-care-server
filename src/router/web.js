import express from "express";
import {
  getHomePage,
  getCRUD,
  postCRUD,
  displayGetCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
} from "../controllers/homeController";
import userController from "../controllers/userController";
import allcodeController from "../controllers/allcodeController";
import doctorController from "../controllers/doctorController";

const router = express.Router();

const initWebRouter = (app) => {
  router.get("/", getHomePage);
  router.get("/crud", getCRUD);

  router.post("/post-crud", postCRUD);
  router.get("/get-crud", displayGetCRUD);
  router.get("/edit-crud", getEditCRUD);
  router.post("/put-crud", putCRUD);
  router.get("/delete-crud", deleteCRUD);

  // api login
  router.post("/api/v1/login", userController.handleLogin);

  // api user
  router.get("/api/v1/user/get-all", userController.handleGetAllUsers);
  router.post("/api/v1/user/create", userController.handleCreateNewUser);
  router.put("/api/v1/user/edit", userController.handleEditUser);
  router.delete("/api/v1/user/delete", userController.handleDeleteUser);

  router.get("/api/v1/allcode/get-all", allcodeController.getAllCode);

  router.get("/api/v1/doctor/get-all", doctorController.getDoctor);
  router.post("/api/v1/doctor-info/create", doctorController.createInfoDoctor);
  router.get("/api/v1/doctor/get-detail-by-id", doctorController.getDetailDoctorById);

  router.post("/api/v1/schedule/create", doctorController.createSchedule);
  router.get("/api/v1/schedule-by-date/get-all", doctorController.getScheduleByDate);

  return app.use("/", router);
};

export default initWebRouter;
