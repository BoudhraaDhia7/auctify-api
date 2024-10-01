import mongoose from "mongoose";
import bcrypt from 'bcrypt';
import { CompanyModel } from "./models/Companies.js";
import { NoteModel } from "./models/Notes.js";
import { CartPackModel } from "./models/CartPacks.js";
import { BetsModel } from "./models/Bets.js";
import { UserModel } from "./models/Users.js";
import { dbString } from "./index.js";
import { ProductModel } from "./models/Products.js";
import { ParticipantModel } from "./models/Participants.js";

// Hashed passwords for users and companies
const hashedPassword = bcrypt.hashSync("password", 10);
const hashedPasswordAdmin = bcrypt.hashSync("admin", 10);
const hashedUserPassword = bcrypt.hashSync("testest", 10);

// Users seeders
export const users = [
  {
    userName: "mahdi",
    firstName: "mahdi",
    lastName: "belgacem",
    password: hashedUserPassword,
    address: "123 Main St",
    city: "New York",
    email: "mahdi@gmail.com",
    phone: 12345678,
    amountRecieved: 500,
    amountSent: 100,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'M'}+${'B'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 2,
    solde: 400,
    wallet_code: 987654,
    pushToken: "pushTokenMahdi",
  }
];

// Bet seeders
const createBetSeeders = async () => {
  const betSeeders = [
    {
      idUser: new mongoose.Types.ObjectId(),
      idProduct: new mongoose.Types.ObjectId(),
      amount: 50,
      duration: 60,
    },

    {
      idUser: new mongoose.Types.ObjectId(),
      idProduct: new mongoose.Types.ObjectId(),
      amount: 100,
      duration: 120,
    },

    {
      idUser: new mongoose.Types.ObjectId(),
      idProduct: new mongoose.Types.ObjectId(),
      amount: 200,
      duration: 180,
    },
  ];

  await BetsModel.insertMany(betSeeders);
};

// CartPack seeders
const createCartPackSeeders = async () => {
  const cartPackSeeders = [
    {
      title: "Basic Pack",
      soldeValue: 100,
      realValue: 120,
    },

    {
      title: "Standard Pack",
      soldeValue: 200,
      realValue: 240,
    },

    {
      title: "Premium Pack",
      soldeValue: 300,
      realValue: 360,
    },
  ];

  await CartPackModel.insertMany(cartPackSeeders);
};

// Companies seeders
const createCompanySeeders = async () => {
  const companySeeders = [
    {
      userName: 'compUser1',
      companyName: 'Company One',
      responsable: 'John Doe',
      matricule_fiscale: 'MF12345',
      address: '1234 Business Rd',
      city: 'Business City',
      country: 'USA',
      password: hashedPassword,
      email: 'contact@companyone.com',
      phone: '123-456-7890',
      role: 1,
      logo: `https://ui-avatars.com/api/?name=${'C'}+${'O'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12345',
      status: 1,
    },

    {
      userName: 'compUser2',
      companyName: 'Company Two',
      responsable: 'Jane Doe',
      matricule_fiscale: 'MF12346',
      address: '1234 Market St',
      city: 'Commerce Town',
      country: 'Canada',
      password: hashedPassword,
      email: 'contact@companytwo.com',
      phone: '234-567-8901',
      role: 1,
      logo: `https://ui-avatars.com/api/?name=${'C'}+${'T'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12346',
      status: 1,
    },

    {
      userName: 'compUser3',
      companyName: 'Company Three',
      responsable: 'Jim Beam',
      matricule_fiscale: 'MF12347',
      address: '1234 Trade Ave',
      city: 'Trade City',
      country: 'UK',
      password: hashedPassword,
      email: 'contact@companythree.com',
      phone: '345-678-9012',
      role: 1,
      logo: `https://ui-avatars.com/api/?name=${'C'}+${'U'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12347',
      status: 1,
    },

    {
      userName: 'admin',
      companyName: 'Company Five',
      responsable: 'Jack Ripper',
      matricule_fiscale: 'MF12349',
      address: '1234 Enterprise Ln',
      city: 'Enterprise City',
      country: 'New Zealand',
      password: hashedPasswordAdmin,
      email: 'contact@companyfive.com',
      phone: '567-890-1234',
      role: 2,
      logo: `https://ui-avatars.com/api/?name=${'A'}+${'D'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12349',
      status: 1
    },
  ];

  return await CompanyModel.insertMany(companySeeders);
};

// Notes seeders
const createNoteSeeders = async () => {
  const noteSeeders = [
    {
      user: new mongoose.Types.ObjectId(),
      title: "Meeting Notes",
      content: "Discussed project progress and timelines.",
      noteDate: new Date("2024-09-30T09:00:00Z"),
    },

    {
      user: new mongoose.Types.ObjectId(),
      title: "Research Notes",
      content: "Collected data for new market trends.",
      noteDate: new Date("2024-09-30T10:00:00Z"),
    },

    {
      user: new mongoose.Types.ObjectId(),
      title: "Development Notes",
      content: "Implemented user authentication module.",
      noteDate: new Date("2024-09-30T11:00:00Z"),
    },
  ];

  await NoteModel.insertMany(noteSeeders);
};

// Products seeders
const createProductSeeders = async (companies) => {
  // Using company ids from created companies
  const productSeeders = [
    {
      name: "Smartphone X",
      files: [{ filename: "iphone-x.jpg", filePath: "https://images-cdn.ubuy.com.sa/64c4a6c86751b005950567d9-apple-iphone-x-64gb-unlocked-gsm-phone.jpg", url: "https://images-cdn.ubuy.com.sa/64c4a6c86751b005950567d9-apple-iphone-x-64gb-unlocked-gsm-phone.jpg" }],
      company: companies[0]._id, 
      price: 699,
      benefit: 10,
      description: "Latest generation smartphone with all features.",
      status: 1,
      openDate: new Date("2024-10-01T10:00:00Z"),
    },
    {
      name: "Laptop Y",
      files: [{ filename: "laptop-hp.jpg", filePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS39CiTRtuC05a0oBGaoDQJZ-XQzeZqBs_LlA&s", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS39CiTRtuC05a0oBGaoDQJZ-XQzeZqBs_LlA&s" }],

      company: companies[1]._id,
      price: 999,
      benefit: 15,
      description: "High-performance laptop suitable for gaming and work.",
      status: 1,
      openDate: new Date("2024-10-01T11:00:00Z"),
    },
    {
      name: "Headphones Z",
      files: [{ filename: "headphones-sony.jpg", filePath: "https://www.soundstore.ie/media/catalog/product/cache/cf1713be10bbab7bca952ccf4bc3ef51/s/o/sonwhch520lce7_main.png", url: "https://www.soundstore.ie/media/catalog/product/cache/cf1713be10bbab7bca952ccf4bc3ef51/s/o/sonwhch520lce7_main.png" }],
      company: companies[2]._id, 
      price: 199,
      benefit: 5,
      description: "Noise-canceling headphones with superior sound quality.",
      status: 1,
      openDate: new Date("2024-10-01T12:00:00Z"),
    },
  ];

  return await ProductModel.insertMany(productSeeders);
};

// Participants seeders
const createParticipantSeeders = async (products, users) => {
  const participantSeeders = [
    {
      product: products[0]._id, 
      player: users._id,     
      amountGiven: 100,
      date: new Date("2024-10-01T14:00:00Z"),
    },
    {
      product: products[1]._id,  
      player: users._id,      
      amountGiven: 200,
      date: new Date("2024-10-01T15:00:00Z"),
    },
    {
      product: products[2]._id,  
      player: users._id,     
      amountGiven: 300,
      date: new Date("2024-10-01T16:00:00Z"),
    },
  ];

  await ParticipantModel.insertMany(participantSeeders);
  console.log("Participant seeding completed!");
};

// Function to connect to the database
const connectDB = async () => {
  try {
    await mongoose.connect(dbString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error("Database connection failed!", err);
    process.exit(1);
  }
};

// Function to clear the database (delete all documents from collections)
const clearDatabase = async () => {
  try {
    await BetsModel.deleteMany({});
    await CartPackModel.deleteMany({});
    await NoteModel.deleteMany({});
    await CompanyModel.deleteMany({});
    await ProductModel.deleteMany({});
    await UserModel.deleteMany({});
  } catch (err) {
    console.error("Error clearing database!", err);
  }
};

// Complete Seeder Execution
const runSeeders = async () => {
  try {
    await connectDB();
    console.log("Database connected!");

    await clearDatabase();
    console.log("Database cleared!");

    await createBetSeeders();
    console.log("Bet seeding completed!");

    await createCartPackSeeders();
    console.log("Pack seeding completed!");

    await createNoteSeeders();
    console.log("Note seeding completed!");

    const addUsers = await UserModel.insertMany(users);
    console.log("User seeding completed!");
    
    const companies = await createCompanySeeders();
    console.log("Company seeding completed!");

    const products = await createProductSeeders(companies);
    console.log("Product seeding completed!");

    await createParticipantSeeders(products, addUsers[0]);
    console.log("Participant seeding completed!");

    console.log("Database seeding completed!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding failed!", err);
    mongoose.connection.close();
  }
};

runSeeders();
