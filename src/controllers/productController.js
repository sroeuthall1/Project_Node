const fs = require("fs");
const path = require("path");
const { MasterProduct } = require("../models");
const Sequelize = require("sequelize");
const logError = require("../utils/logger");

// Generate Id
const generateId = async () => {
  const last = await MasterProduct.findOne({
    attributes: ["Pro_Id"],
    order: [
      [Sequelize.literal("CAST(SUBSTRING(Pro_Id, 2) AS UNSIGNED)"), "DESC"],
    ],
  });

  if (!last) return "P001";

  const num = parseInt(last.Pro_Id.substring(1), 10) + 1;
  return "P" + num.toString().padStart(3, "0");
};

// GET /product
const getAll = async (req, res) => {
  try {
    const { Pro_Id } = req.query;
    if (Pro_Id) {

      // Get by id
      const data = await MasterProduct.findByPk(Pro_Id);
      if (!data) {
        return res.status(404).json({
          success: false,
          message: "Product not found"
        });
      }
      return res.json({
        success: true,
        data: data
      });
    }

    // Get all
    const data = await MasterProduct.findAll();
    res.json({
      success: true,
      data: data
    });
  } catch (err) {
    logError("Product", err, res);
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
    const data = await MasterProduct.findAll({
      where: {
        [Op.or]: [
          { Pro_Name: { [Op.like]: `%${keyword}%` } },
          { Brand_Id: { [Op.like]: `%${keyword}%` } },
          { Cate_Id: { [Op.like]: `%${keyword}%` } },
        ]
      }
    });
    res.json({
      success: true,
      data: data,
      count: data.length
    });
  } catch (err) {
    logError("Product", err, res);
  }
}

// POST /product/create
const create = async (req, res) => {
  try {
    const { Pro_Name, Brand_Id, Cate_Id, Stock_Date, Exp_Date, Qty, Unit_Cost, Tel_Id, Status, Remark } = req.body;
    const Photo = req.file ? `/uploads/${req.file.filename}` : null;

    if (!Pro_Name) {
      return res.status(400).json({ message: "Pro_Name is required" });
    }

    const Pro_Id = await generateId();

    if (!Pro_Id) {
      return res.status(500).json({ message: "Failed to generate Pro_Id" });
    }

    const data = await MasterProduct.create({
      Pro_Id,
      Pro_Name,
      Brand_Id,
      Cate_Id,
      Stock_Date,
      Exp_Date,
      Qty,
      Unit_Cost,
      Tel_Id,
      Status,
      Remark,
      Photo
    });

    res.status(201).json({
      message: "Created successfully",
      data,
    });
  } catch (err) {
    logError("Product", err, res);
  }
};


// PUT /api/products/:id
const update = async (req, res) => {
  try {
    const id = req.params.id;

    const {
      Pro_Name,
      Brand_Id,
      Cate_Id,
      Stock_Date,
      Exp_Date,
      Qty,
      Unit_Cost,
      Tel_Id,
      Status,
      Remark,
    } = req.body;

    const item = await MasterProduct.findByPk(id);
    if (!item) return res.status(404).json({ message: "Product not found" });

    // ✅ old photo from DB
    const oldPhoto = item.Photo; // e.g. "/uploads/xxx.jpg" or null

    // ✅ new photo if upload, else keep old
    const Photo = req.file ? `/uploads/${req.file.filename}` : oldPhoto;

    // update only fields provided
    if (Pro_Name !== undefined) item.Pro_Name = Pro_Name;
    if (Brand_Id !== undefined) item.Brand_Id = Brand_Id;
    if (Cate_Id !== undefined) item.Cate_Id = Cate_Id;
    if (Stock_Date !== undefined) item.Stock_Date = Stock_Date;
    if (Exp_Date !== undefined) item.Exp_Date = Exp_Date;
    if (Qty !== undefined) item.Qty = Qty;
    if (Unit_Cost !== undefined) item.Unit_Cost = Unit_Cost;
    if (Tel_Id !== undefined) item.Tel_Id = Tel_Id;
    if (Status !== undefined) item.Status = Status;
    if (Remark !== undefined) item.Remark = Remark;

    // ✅ always set photo result
    item.Photo = Photo;

    await item.save();

    // ✅ delete old file when new file uploaded
    if (req.file && oldPhoto) {
      // oldPhoto = "/uploads/xxx.jpg" => "uploads/xxx.jpg"
      const relativePath = oldPhoto.startsWith("/")
        ? oldPhoto.slice(1)
        : oldPhoto;

      const fullOldPath = path.join(process.cwd(), relativePath);
      if (fs.existsSync(fullOldPath)) {
        fs.unlinkSync(fullOldPath);
      }
    }

    res.json({ message: "Updated", data: item });
  } catch (err) {
    logError("Product", err, res);
  }
};

// DELETE /product/delete/:id
const remove = async (req, res) => {
  try {
    const id = req.params.id;

    const item = await MasterProduct.findByPk(id);
    if (!item) return res.status(404).json({ message: "Product not found" });

    await item.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    logError("Product", err, res);
  }
};

module.exports = {
  getAll,
  search,
  create,
  update,
  remove
};