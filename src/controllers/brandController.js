const { Brand } = require("../models");
const Sequelize = require("sequelize");
const logError = require("../utils/logger");

// Generate Id
const generateId = async () => {
  const last = await Brand.findOne({
    attributes: ["Brand_Id"],
    order: [
      [Sequelize.literal("CAST(SUBSTRING(Brand_Id, 2) AS UNSIGNED)"), "DESC"],
    ],
  });

  if (!last) return "B001";

  const num = parseInt(last.Brand_Id.substring(1), 10) + 1;
  return "B" + num.toString().padStart(3, "0");
};

// GET /brand
const getAll = async (req, res) => {
  try {
    const { Brand_Id } = req.query;
    if (Brand_Id) {

      // Get by id
      const data = await Brand.findByPk(Brand_Id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Brand not found"
        });
      }
      return res.json({
        success: true,
        data: data
      });
    }

    // Get all
    const data = await Brand.findAll();
    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    logError("Brand", err, res);
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
    const data = await Brand.findAll({
      where: {
        [Op.or]: [
          { Brand_Name: { [Op.like]: `%${keyword}%` } },
          { Cate_Id: { [Op.like]: `%${keyword}%` } },
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
    logError("Brand", err, res);
  }
}

// POST /brand/create
const create = async (req, res) => {
  try {
    const { Brand_Name, Cate_Id, Description } = req.body;

    if (!Brand_Name) {
      return res.status(400).json({ message: "Brand_Name is required" });
    }

    const Brand_Id = await generateId();

    if (!Brand_Id) {
      return res.status(500).json({ message: "Failed to generate Brand_Id" });
    }

    const data = await Brand.create({
      Brand_Id,
      Brand_Name,
      Cate_Id,
      Description: Description || null,
    });

    res.status(201).json({
      message: "Created successfully",
      data,
    });
  } catch (err) {
    logError("Brand", err, res);
  }
};


// PUT /brand/update/:id
const update = async (req, res) => {
  try {
    const id = req.params.id; // Brand_Id
    const { Brand_Name, Cate_Id, Description } = req.body;

    const item = await Brand.findByPk(id);
    if (!item) return res.status(404).json({ message: "Brand not found" });

    // update only fields provided
    if (Brand_Name !== undefined) item.Brand_Name = Brand_Name;
    if (Cate_Id !== undefined) item.Cate_Id = Cate_Id;
    if (Description !== undefined) item.Description = Description;

    await item.save();

    res.json({ message: "Updated", data: item });
  } catch (err) {
    logError("Brand", err, res);
  }
};

// DELETE /brand/delete/:id
const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await Brand.findByPk(id);
    if (!item) return res.status(404).json({ message: "Brand not found" });

    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    logError("Brand", err, res);
  }
};

module.exports = {
  getAll,
  search,
  create,
  generateId,
  update,
  remove
};