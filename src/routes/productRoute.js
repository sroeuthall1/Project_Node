const { getAll, create, update, remove } = require("../controllers/productController");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

const Product = (app) => {
    app.get("/api/products", auth, getAll);
    app.post("/api/products", auth, upload.single("Photo"), create);
    app.put("/api/products/:id", auth, upload.single("Photo"), update);
    app.delete("/api/products/:id", auth, remove);
};

module.exports = Product;