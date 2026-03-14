const { getAll, create, update, remove } = require("../controllers/categoryController");
const auth = require("../middleware/auth");

const Category = (app) => {
    app.get("/api/categories", getAll);
    app.post("/api/categories", auth, create);
    app.put("/api/categories/:id", auth, update);
    app.delete("/api/categories/:id", auth, remove);
};

module.exports = Category;