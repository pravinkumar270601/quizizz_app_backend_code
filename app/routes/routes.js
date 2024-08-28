const questionAnswersController = require("../controllers/question_answer.controller.js");
const publishController = require("../controllers/publish.controller.js");
const imageController = require("../controllers/upload.controller.js");
const users = require("../controllers/user.controller.js");
const router = require("express").Router();

// questionAnswers rouer api
router.post(
  "/questionAnswersCreate",
  questionAnswersController.QuestionAnswerscreate
);
router.get(
  "/getAllQuestionAnswers",
  questionAnswersController.getAllQuestionAnswers
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

// publish router api

router.post("/publishCreate", publishController.PublishTableCreate);
router.get("/getAllPublish", publishController.getAllPublish);
router.get("/getPublishById/:id", publishController.getPublishById);
router.put("/updatePublishById/:id", publishController.updatepublishById);
router.delete("/deletePublishId/:id", publishController.deletepublishById);

// image uploadImage

router.post("/uploadImage", imageController.uploadImage);

// user login
router.post("/userLogin", users.create);

module.exports = router;
