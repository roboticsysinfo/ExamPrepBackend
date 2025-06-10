const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();
const path = require('path');


const studentRoutes = require("./routes/studentRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const topicRoutes = require("./routes/topicRoutes");
const examRoutes = require("./routes/examRoutes");
const mockTestRoutes = require("./routes/mockTestRoutes");
const questionRoutes = require("./routes/questionRoutes");
const userRoutes = require("./routes/userRoutes");
const examCategoryRoutes = require("./routes/examCategoryRoutes");
const admissionQueryRoutes = require("./routes/admissionQueryRoutes");
const instituteRoutes = require("./routes/instituteRoutes")
const previousQuestionPaperRoutes = require("./routes/previousQuestionPaperRoutes");
const practiceTestRoutes = require("./routes/practiceTestRoutes");
const doubtRoutes = require("./routes/doubtRoutes");
const notificationRoutes = require("./routes/notificationRoutes")

const app = express();

const corsOptions = {
  origin: "*", // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed HTTP methods
  credentials: true, // Allow credentials (cookies, auth headers)
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // URL parameters parsing
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


connectDB();


// ========= Routes=============

app.use("/api/auth", userRoutes);

app.use("/api", studentRoutes);

app.use("/api", subjectRoutes);

app.use("/api", topicRoutes);

app.use("/api", examRoutes);

app.use("/api", mockTestRoutes);

app.use("/api", questionRoutes);

app.use("/api", examCategoryRoutes);

app.use("/api", admissionQueryRoutes);

app.use("/api", instituteRoutes)

app.use("/api", previousQuestionPaperRoutes)

app.use("/api", practiceTestRoutes)

app.use("/api", doubtRoutes)

app.use("/api", notificationRoutes)
// ========= Routes end=============


app.get('/', (req, res) => {
  res.send('Hello Exam Prep')
});


app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  next();
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running successfully on ${port}`);
});