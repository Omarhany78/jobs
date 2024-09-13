const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");

const getAllJobs = async (req, res) => {
  const id = req.user.userId;
  const jobs = await Job.find({ createdBy: id });
  res.status(StatusCodes.OK).json({ length: jobs.length, jobs });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  req.body.person = req.user.name;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

const getJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const job = await Job.findOne({ _id: jobId, createdBy: userId });
  if (!job) {
    throw new NotFoundError(`The is no job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;
  const newData = req.body;
  const job = await Job.findOneAndUpdate(
    { createdBy: userId, _id: jobId },
    newData,
    { new: true, runValidators: true }
  );
  if (!job) {
    throw new NotFoundError(`The is no job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const userId = req.user.userId;
  const jobId = req.params.id;

  const job = await Job.findOneAndDelete({ createdBy: userId, _id: jobId });
  if (!job) {
    throw new NotFoundError(`The is no job with id ${jobId}`);
  }
  res.status(StatusCodes.OK).send("Deleted successfully");
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
