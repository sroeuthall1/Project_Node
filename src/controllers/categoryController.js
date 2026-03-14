const { Category } = require("../models");
const Sequelize = require("sequelize");
const logError = require("../utils/logger");

// Generate Id
const generateCateId = async () => {
  const last = await Category.findOne({
    attributes: ["Cate_Id"],
    order: [
      [Sequelize.literal("CAST(SUBSTRING(Cate_Id, 2) AS UNSIGNED)"), "DESC"],
    ],
  });

  if (!last) return "C001";

  const num = parseInt(last.Cate_Id.substring(1), 10) + 1;
  return "C" + num.toString().padStart(3, "0");
};

// GET /category
const getAll = async (req, res) => {
  try {
    const { Cate_Id } = req.query;
    if (Cate_Id) {

      // Get by id
      const data = await Category.findByPk(Cate_Id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Category not found"
        });
      }
      return res.json({
        success: true,
        data: data
      });
    }

    // Get all
    const data = await Category.findAll();
    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    logError("Category", err, res);
  }
};

// Search by name
const search = async (req, res) => {
  try {
    const { keyword } = req.query;
    if (!keyword) {
      return res.status(400).json({
        success: false,
        message: "Keyword is required"
      });
    }
    const { Op} = require("sequelize");
    const data = await Category.findAll({
      where: {
        [Op.or]: [
          { Cate_Name: { [Op.like]: `%${keyword}%` } },
          { Description: { [Op.like]: `%${keyword}%` } }
        ]
      }
    });
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (err) {
    logError("Category", err, res);
  }
}

// POST /category/create
const create = async (req, res) => {
  try {
    const { Cate_Name, Description } = req.body;

    if (!Cate_Name) {
      return res.status(400).json({ message: "Cate_Name is required" });
    }

    const Cate_Id = await generateCateId();

    if (!Cate_Id) {
      return res.status(500).json({ message: "Failed to generate Cate_Id" });
    }

    const data = await Category.create({
      Cate_Id,
      Cate_Name,
      Description: Description || null,
    });

    res.status(201).json({
      message: "Created successfully",
      data,
    });
  } catch (err) {
    logError("Category", err, res);
  }
};

// PUT /category/update/:id
const update = async (req, res) => {
  try {
    const id = req.params.id; // Cate_Id
    const { Cate_Name, Description } = req.body;

    const item = await Category.findByPk(id);
    if (!item) return res.status(404).json({ message: "Category not found" });

    // update only fields provided
    if (Cate_Name !== undefined) item.Cate_Name = Cate_Name;
    if (Description !== undefined) item.Description = Description;

    await item.save();

    res.json({ message: "Updated", data: item });
  } catch (err) {
    logError("Category", err, res);
  }
};


// DELETE /category/delete/:id
const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await Category.findByPk(id);
    if (!item) return res.status(404).json({ message: "Category not found" });

    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    logError("Category", err, res);
  }
};


module.exports = {
  getAll,
  create,
  search,
  generateCateId,
  update,
  remove,
};
