const ExcelJs = require("exceljs");
const moment = require("moment");
const User = require("./models/user");
const express = require("express");
const mongoose = require("mongoose");
const url =
  "mongodb+srv://Abhishek:yashi2609@newcluster.xj39o.mongodb.net/?retryWrites=true&w=majority";
const sgMail = require("@sendgrid/mail");
const API_KEY =
  "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";

const app = express();

mongoose.connect(url, { useNewUrlParser: true });
const con = mongoose.connection;

con.on("open", () => {
  console.log("connected...");
});

app.use(express.json());

const userRouter = require("./routes/users");

app.use("/users", userRouter);

app.listen(9000, () => {
  console.log("Server started");
});

// Sending emails using sendGrid API

sgMail.setApiKey(API_KEY);

const message = {
  to: "abhishek.garg@Geminisolutions.com",
  from: {
    name: "ABHI",
    email: "abhishekbsr2001@gmail.com",
  },
  subject: "Hello from sendgrid",
  text: "Hello from sendgrid",
  html: "<h1>Hello from sendgrid</h1>",
};

sgMail
  .send(message)
  .then((response) => console.log("Email sent"))
  .catch((error) => console.log());

// Getting data of database into an excel file and downloadaing it

app.get("/sheet", async (req, res, next) => {
  const startDate = moment(new Date()).startOf("month").toDate();
  const endDate = moment(new Date()).endOf("month").toDate();
  try {
    const users = await Users.find({
      created_at: { $gte: startDate, $lte: endDate },
    });
    const workbook = new ExcelJs.Workbook();
    const worksheet = workbook.addWorksheet("My Users");
    worksheet.columns = [
      { header: "S.no", key: "s_no", width: 10 },
      { header: "Name", key: "name", width: 10 },
      { header: "tech", ket: "tech", width: 10 },
      { header: "sub", key: "sub", width: 10 },
      { header: "password", key: "password", width: 10 },
    ];
    let count = 1;
    users.forEach((user) => {
      user.s_no = count;
      worksheet.addRow(user);
      count += 1;
    });
    worksheet.getRow(1).eachCell((cell) => {
      cell.font = { bold: true };
    });
    const data = await workbook.xlsx.writeFile("user.xlsx");
    res.send("done");
  } catch (e) {
    res.status(500).send(e);
  }

});
