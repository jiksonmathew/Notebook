import mongoose from "mongoose";

const detailSchema = new mongoose.Schema(
  {
    text: String,
  },
  { timestamps: true }
);

const subCategorySchema = new mongoose.Schema({
  name: String,
  details: [detailSchema],
});

const categorySchema = new mongoose.Schema({
  name: String,
  details: [detailSchema],
  subCategories: [subCategorySchema],
});

const topicSchema = new mongoose.Schema({
  title: String,
  categories: [categorySchema],
});

const subjectSchema = new mongoose.Schema({
  name: String,
  topics: [topicSchema],
});

const Subject = mongoose.model("Subject", subjectSchema);

export default Subject;
