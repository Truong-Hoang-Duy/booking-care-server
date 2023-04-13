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
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";

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
  router.post("/api/v1/signup", userController.handleSignUp);

  // api user
  router.get("/api/v1/user/get-all", userController.handleGetAllUsers);
  router.post("/api/v1/user/create", userController.handleCreateNewUser);
  router.put("/api/v1/user/edit", userController.handleEditUser);
  router.delete("/api/v1/user/delete", userController.handleDeleteUser);

  router.get("/api/v1/allcode/get-all", allcodeController.getAllCode);

  router.get("/api/v1/doctor/get-all", doctorController.getDoctor);
  router.post("/api/v1/doctor-info/create", doctorController.createInfoDoctor);
  router.get("/api/v1/doctor/get-detail-by-id", doctorController.getDetailDoctorById);
  router.get("/api/v1/doctor-infor/get-id", doctorController.getDoctorInforById);

  router.post("/api/v1/schedule/create", doctorController.createSchedule);
  router.get("/api/v1/schedule-by-date/get-all", doctorController.getScheduleByDate);

  router.post("/api/v1/patient-book-doctor/create", patientController.postBookDoctor);
  router.get("/api/v1/patient-by-email/get", patientController.getPatientByEmail);
  router.post("/api/v1/verify-book-doctor/create", patientController.postVerifyBookDoctor);

  router.get("/api/v1/specialty/get-all", specialtyController.getAllSpecialty);
  router.post("/api/v1/specialty/create", specialtyController.createSpecialty);

  return app.use("/", router);
};

export default initWebRouter;
