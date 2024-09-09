const questionAnswersController = require("../controllers/question_answer.controller.js");
const publishController = require("../controllers/publish.controller.js");
const imageController = require("../controllers/upload_image.controller.js");
const videoController = require("../controllers/upload_video.controller.js");
const audioController = require("../controllers/upload_audio.controller.js");
const users = require("../controllers/user.controller.js");
const router = require("express").Router();

// questionAnswers rouer api
router.post(
  "/questionAnswersCreate",
  questionAnswersController.QuestionAnswerscreate
);
router.get(
  "/getAllQuestionAnswersByPublishId/:publish_id",
  questionAnswersController.getAllQuestionAnswersByPublishId
);
router.get(
  "/getQuestionAnswersById/:id",
  questionAnswersController.getQuestionAnswersById
);
router.put(
  "/updateQuestionAnswersById/:id",
  questionAnswersController.updateQuestionAnswersById
);
router.delete(
  "/deleteQuestionById/:id",
  questionAnswersController.deleteQuestionById
);

router.get(
  "/getQuestionsWithoutPublishByUserId/user/:user_id",
  questionAnswersController.getQuestionsWithoutPublishByUserId
);

router.delete(
  "/deleteQuestionsWithoutPublishByUserId/user/:user_id",
  questionAnswersController.deleteQuestionsWithoutPublishByUserId
);

// publish router api

router.post("/publishCreate", publishController.PublishTableCreate);
router.get("/getAllPublish", publishController.getAllPublish);
router.get("/getPublishById/:publish_id", publishController.getPublishById);
router.get(
  "/getPublishByUserId/user/:user_id",
  publishController.getPublishByUserId
);
router.put("/updatePublishById/:id", publishController.updatepublishById);
router.delete("/deletePublishId/:id", publishController.deletepublishById);

// image uploadImage

router.post("/uploadImage", imageController.uploadImage);
router.post("/uploadVideo", videoController.uploadVideo);
router.post("/uploadAudio", audioController.uploadAudio);

// user login
router.post("/userSignup", users.create);
router.post("/userLogin", users.login);

module.exports = router;
