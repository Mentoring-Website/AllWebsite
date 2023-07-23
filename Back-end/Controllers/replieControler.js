const createError = require("../utils/createError");
const Comment = require("../Models/commentsModel");
const mentorApplication = require("../Models/opportunityModel");
const Replie = require("../Models/replieModel");
const addReplie = async (req, res, next) => {
  try {
    const id = req.params.mentorId;
    const newReplie = new Replie({ ...req.body, mentorId: id });
    const savedReplie = await newReplie.save();
    res.status(200).send(savedReplie);
  } catch (err) {
    next(err);
  }
};

const getReplie = async (req, res, next) => {
  try {
    const comments = await Replie.find({
      mentorId: req.params.mentorId,
    });
    res.status(200).send(comments);
  } catch (e) {
    next(e);
  }
};


module.exports = {
  addReplie,
  getReplie,
};
