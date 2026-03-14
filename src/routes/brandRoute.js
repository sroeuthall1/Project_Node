const { getAll, create, update, remove } = require("../controllers/brandController");
const auth = require("../middleware/auth");

const Brand = (app) => {
    app.get("/api/brands", auth, getAll);
    app.post("/api/brands", auth, create);
    app.put("/api/brands/:id", auth, update);
    app.delete("/api/brands/:id", auth, remove);
};

module.exports = Brand;