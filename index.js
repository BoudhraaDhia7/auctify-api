import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import morgan from "morgan";
import { companyRouter } from "./routes/companies.js";
import { userRouter } from "./routes/users.js";
import { productRouter } from "./routes/products.js";
import { transanctionRouter } from "./routes/transcations.js";
import { participantRouter } from "./routes/participants.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { productMobileRouter } from "./routes/productMobile.js";
import { mobTransanctionRouter } from "./routes/mobtranscations.js";
import { adminRouter } from "./routes/adminRoutes.js";
import {SettingRouter} from "./routes/settingRoutes.js"

import { createServer } from "http";
import { Server } from "socket.io";
import { JoinAuction, MiseAndUpdateSolde, unJoinAuction } from "./utils/Auctions.js";
import { winnerRouter } from "./routes/winner.js";
import { MobAuctionRouter } from "./routes/mobAuctions.js";
import { notificationsRouter } from "./routes/notifications.js";

const app = express();

const httpServer = createServer(app);

app.use(express.json());
app.use(cors());
app.use(morgan("common"));
app.use("/uploads", express.static("uploads"));
app.use("/auth", userRouter);
app.use("/winner", winnerRouter);
app.use("/product", productRouter);
app.use("/transaction", transanctionRouter);
app.use("/company", companyRouter);
app.use("/participant", participantRouter);
app.use("/admin", adminRouter);
app.use("/api/product", productMobileRouter);
app.use("/api/wallet", mobTransanctionRouter);
app.use("/api/auctions", MobAuctionRouter);
app.use("/setting", SettingRouter);
app.use("/notifications", notificationsRouter);

//error handler
app.use(errorHandler);

export const io = new Server(httpServer, {
  cors: {
    origin: "*", // or your front-end URL
    methods: ["GET", "POST", "PATCH", "DELETE"],
  },
}); // Create a new instance of socket.io and pass your http server as argument

const connectedUsers = {};

io.on("connection", (socket) => {
  console.log(`New client connected with socket ID ${socket.id}`);

  socket.on("joinAuction", async (data) => {
    //socket.join(data);
    console.log(`user with id: ${socket.id} joined room :${data.nickname}`);
    await JoinAuction({ idSocket: socket.id, ...data });
    io.emit("joinAuction", { idSocket: socket.id, ...data });
  });

  socket.on("AuctifyBet", async (data) => {
    await MiseAndUpdateSolde(data);
    console.log("azeazeaz",data);
    io.emit("resetMise", data);
  });


  socket.on("disconnect", () => {
    console.log(`user disconnected ${socket.id}`);
    const userId = Object.keys(connectedUsers).find(
      (key) => connectedUsers[key] === socket.id
    );

    if (userId) {
      console.log(
        `User ${userId} disconnected from the socket id ${socket.id}`
      );
      delete connectedUsers[userId];
    }
    unJoinAuction(socket.id);
    io.emit("UnjoinAuction", socket.id);
  });
});


 var password = encodeURIComponent("try93024");

 // MongoDB connection string
 export const dbString = "mongodb+srv://try93024:"+password+"@cluster0.lg69q.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
 mongoose
   .connect(
    dbString,
     {
       useNewUrlParser: true,
       useUnifiedTopology: true,
     }
  )
   .then(async () => {

    httpServer.listen(3001, "0.0.0.0", () => console.log("Server started !"));
  });

