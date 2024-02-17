import Job from "../models/jobModel.js";
import { StatusCodes } from "http-status-codes";
import { NotFoundError } from "../errors/customErrors.js";
import mongoose from "mongoose";
import day from "dayjs";

export const getAllJobs = async (req, res) => {
  const { search, jobStatus, jobType, sort } = req.query;
  const queryObject = {
    createdBy: req.user.userId,
  };
  if (search) {
    queryObject.$or = [
      { position: { $regex: search, $options: "i" } },
      { company: { $regex: search, $options: "i" } },
    ];
  }

  if (jobStatus && jobStatus != "all") {
    queryObject.jobStatus = jobStatus;
  }

  if (jobType && jobType != "all") {
    queryObject.jobType = jobType;
  }
  const sortOption = {
    newest: "-createdAt",
    oldest: "createdAt",
    "a-z": "position",
    "z-a": "-position",
  };

  // set pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit; //after first 10 pages loads second page it will skip the first 10 items

  const sortKey = sortOption[sort] || sortOption.newest;
  const jobs = await Job.find(queryObject)
    .sort(sortKey)
    .skip(skip)
    .limit(limit);
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);
  res
    .status(StatusCodes.OK)
    .json({ totalJobs, numOfPages, currentPage: page, jobs });
};

export const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

export const getJob = async (req, res) => {
  const job = await Job.findById(req.params.id);

  res.status(StatusCodes.OK).json({ job });
};

export const updateJob = async (req, res) => {
  const updateJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(StatusCodes.CREATED).json({ msg: `Job modified`, job: updateJob });
};
export const deleteJob = async (req, res) => {
  const removeJob = await Job.findByIdAndDelete(req.params.id);

  res.status(StatusCodes.CREATED).json({ msg: `Job deleted`, job: removeJob });
};

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, //get stats for a user
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } }, //group the stats data by jobStatus
  ]);
  stats = stats.reduce((accumulator, current) => {
    // basically what we doing here is converting stats array, and loop into an obj
    /** [
   { _id: 'declined', count: 33 },
   { _id: 'interview', count: 41 },
   { _id: 'pending', count: 26 }
 ] */
    const { _id: title, count } = current;
    accumulator[title] = count;
    return accumulator;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };

  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } }, //get stats for a user
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } }, //get the latest month for the latest year
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications.map((item) => {
    let {
      _id: { year, month },
      count,
    } = item;
    let newObj = {
      date: day()
        .month(month - 1) //dayJs they start with 0 but mangoDB start with 1
        .year(year)
        .format("MMM YY"),
      count: count,
    };
    console.log(newObj);
    return newObj;
  });

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};

// import { nanoid } from "nanoid";

// let jobs = [
//   { id: nanoid(), company: "apple", position: "front-end developer" },
//   { id: nanoid(), company: "google", position: "back-end developer" },
// ];

// export const getAllJobs = async (req, res) => {
//   res.status(200).json({ jobs });
// };

// export const createJob = async (req, res) => {
//   const { company, position } = req.body;

//   if (!company || !position) {
//     return res.status(400).json({ msg: "please provide company and position" });
//   }
//   const id = nanoid(10);
//   const job = { id, company, position };
//   jobs.push(job);
//   res.status(200).json({ job });
// };

// export const getJob = async (req, res) => {
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     // throw new Error('no job with that id');
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }
//   res.status(200).json({ job });
// };

// export const updateJob = async (req, res) => {
//   const { company, position } = req.body;
//   if (!company || !position) {
//     return res.status(400).json({ msg: "please provide company and position" });
//   }
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }

//   job.company = company;
//   job.position = position;
//   res.status(200).json({ msg: "job modified", job });
// };

// export const deleteJob = async (req, res) => {
//   const { id } = req.params;
//   const job = jobs.find((job) => job.id === id);
//   if (!job) {
//     return res.status(404).json({ msg: `no job with id ${id}` });
//   }
//   const newJobs = jobs.filter((job) => job.id !== id);
//   jobs = newJobs;

//   res.status(200).json({ msg: "job deleted" });
// };
