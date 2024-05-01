const express = require("express");
const app = express();

const authRoutes = require("./routes/authRoute.js");
const resetPasswordRoutes=require('./routes/resetPasswordRoute.js');
const profileRoutes=require('./routes/profileRoute.js');
const courseRoutes=require('./routes/Course.js');
const categoryRoutes=require('./routes/CategoryRoute.js');
const paymentRoutes=require('./routes/PaymentRoute.js');
const contactRoutes=require("./routes/ContactRoute.js");
const database = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const {cloudinaryConnect } = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");

dotenv.config();

const PORT=process.env.PORT || 4000;
database.connectToDb();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: "*",
		credentials: true,
	})
);

app.use(
	fileUpload({
		useTempFiles:true,
		tempFileDir:"/tmp",
	})
)
cloudinaryConnect();
app.use("/api/v1/auth", authRoutes);
app.use('/api/v1/passwordreset',resetPasswordRoutes);
app.use('/api/v1/profile',profileRoutes);
app.use('/api/v1/course',courseRoutes);
app.use('/api/v1/category',categoryRoutes);
app.use('/api/v1/payment',paymentRoutes);
app.use('/api/v1/reach',contactRoutes)

app.get("/", (req, res) => {
	return res.json({
		success:true,
		message:'Your server is up and running....'
	});
});

app.listen(PORT, () => {
	console.log(`App is running at ${PORT}`)
})