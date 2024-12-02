import express from "express";
// import cors from "cors";
import dotenv from "dotenv";
import prisma from "./utils/prisma.js";
import jwt from "jsonwebtoken";
import { sendToken } from "./utils/sendToken.js";
import {isAuthenticated} from "./middleware/auth.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 6000;
// app.use(cors());
//Middleware to parse JSON request bodies
app.use(express.json({ limit: "100mb" }));

// user login
app.post("/login", async (req, res) => {
  try {
    console.log("req", req)
    console.log("res", res)
    const { signedToken } = req.body;
    const data = jwt.verify(signedToken, process.env.JWT_SECRET_KEY);
    console.log("data", data)
    if (data) {
      const isUserExist = await prisma.user.findUnique({
        where: {
          email: data.email,
        },
      });
      console.log("isUserExist", isUserExist)
      if (isUserExist) {
        await sendToken(isUserExist, res);
      } else {
        const user = await prisma.user.create({
          data: {
            name: data.name,
            email: data.email,
            avatar: data.avatar,
          },
        });
        await sendToken(user, res);
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Your request is not authorized!",
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// get logged in user
app.get("/me", isAuthenticated, async (req, res, next) => {
  try {
    const user = req.user;
    res.status(201).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log(error);
  }
});


// Generate token endpoint
app.post('/generate-token', (req, res) => {
  // Example payload
  const payload = {
    name: "Test User",
    email: "test@example.com",
    avatar: "https://placeholder.com/avatar.jpg"
  };

  console.log("generating the token")
  const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h' // Token expires in 1 hour
  });

  res.json({ token });
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

export default app;