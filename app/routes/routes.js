const subcategory = require("../controllers/subcategory.controller.js");
const category = require("../controllers/category.controller.js");
const crew = require("../controllers/crew.controller.js");
const movie = require("../controllers/movie.controller.js");
const movieschedule = require("../controllers/movieschedule.controller.js");
const shootingSpot = require("../controllers/shootingspot.controller.js");
const expense = require("../controllers/expense.controller.js");

const router = require("express").Router();

// Category
router.post("/createCategory", category.create);

router.get("/getDetailsCategory", category.getUserDetails);

router.get("/getUserByIdCategory/:id", category.findOne);

router.put("/updateCategory/:id", category.update);

router.delete("/deleteCategory/:id", category.delete);

// subcategory
router.post("/createSubCategory", subcategory.create);

router.get("/getDetailsSubCategory", subcategory.getUserDetails);

router.get("/getUserByIdSubCategory/:sub_category_id", subcategory.findOne);

router.put("/updateSubCategory/:id", subcategory.update);

router.delete("/deleteSubCategory/:id", subcategory.delete);

router.post("/dropdownCategory", subcategory.getCategoryDropdown);

//crew
router.post("/createCrew", crew.createcrew);

router.get("/getCrewDetails", crew.getuserDetails);

router.get("/getCrewUserById/:crew_id", crew.findOne);

router.post("/getSubCategoryDropdown", crew.getSubcategoryDropdown);

router.post("/getCrewshootingDetails", crew.getshootingspotDropdown);

router.put("/updateCrew/:id", crew.update);

router.delete("/deleteCrew/:id", crew.delete);

//movie

router.post("/createMovie", movie.create);

router.get("/getmovieDetails", movie.getUserDetails);

router.get("/getmovieById/:id", movie.findOne);

router.get("/getmovieDropdown", movie.getmovieDropdown);

router.put("/updateMovie/:id", movie.update);

router.delete("/deleteMovie/:id", movie.delete);

// movieSchedule
router.post("/createschedule", movieschedule.createSchedule);

router.get("/getscheduleDetails", movieschedule.getscheduleDetails);

router.get("/getscheduleById/:schedule_id", movieschedule.findOneschedule);

router.put("/updateschedule/:id", movieschedule.updateschedule);

router.delete("/deleteschedule/:id", movieschedule.deleteschedule);

// shootingSpot
router.post("/createSpot", shootingSpot.createSpot);

router.get("/getspotDetails", shootingSpot.getspotDetails);

router.get("/getspotById/:spot_id", shootingSpot.findOnespot);

router.put("/updatespot/:id", shootingSpot.updatespot);

router.delete("/deletespot/:id", shootingSpot.deletespot);

//expense
router.post("/createExpense", expense.createExpense);

router.get("/getExpense", expense.getExpenseDetails);

router.get("/getExpenseById/:expense_id", expense.getExpenseById);

router.put("/updateExpense/:expense_id", expense.updateExpense);

router.delete("/deleteExpense/:expense_id/:schedule_id", expense.deleteExpenseAndSchedule);

router.post("/getCrewDropDown", expense.getCrewDropDown);

module.exports = router;
