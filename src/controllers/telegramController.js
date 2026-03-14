const Telegram = require("../models/telegramModel");

exports.getAll = async (req, res) => {
  try {
    const rows = await Telegram.getAll();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const row = await Telegram.getById(req.params.id);
    if (!row) return res.status(404).json({ message: "Not found" });
    res.json(row);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { Tel_Id, Token } = req.body;
    if (!Tel_Id || !Token)
      return res.status(400).json({ message: "Tel_Id and Token required" });

    await Telegram.create(req.body);
    res.status(201).json({ message: "Created" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const result = await Telegram.update(req.params.id, req.body);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not found" });
    res.json({ message: "Updated" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await Telegram.remove(req.params.id);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
