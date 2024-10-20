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
const hashedUserPassword = bcrypt.hashSync("password", 10);

// Users seeders
export const users = [
  {
    userName: "mehdi",
    firstName: "mehdi",
    lastName: "belgacem",
    password: hashedUserPassword,
    address: "123 Main St",
    city: "New York",
    email: "mahdi@gmail.com",
    phone: 12345678,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'M'}+${'B'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 2,
    solde: 0,
    wallet_code: 987654,
    pushToken: "pushTokenMahdi",
  },
  {
    userName: "ahmed",
    firstName: "Ahmed",
    lastName: "Ben Salah",
    password: hashedUserPassword,
    address: "456 Elm St",
    city: "Tunis",
    email: "ahmed.bensalah@gmail.com",
    phone: 98765432,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'A'}+${'B'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 1,
    solde: 0,
    wallet_code: 123456,
    pushToken: "pushTokenAhmed",
  },
  {
    userName: "sara",
    firstName: "Sara",
    lastName: "Mansour",
    password: hashedUserPassword,
    address: "789 Pine St",
    city: "Sousse",
    email: "sara.mansour@gmail.com",
    phone: 11223344,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'S'}+${'M'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 1,
    solde: 0,
    wallet_code: 654321,
    pushToken: "pushTokenSara",
  },
  {
    userName: "khaled",
    firstName: "Khaled",
    lastName: "Bouazizi",
    password: hashedUserPassword,
    address: "101 Cedar St",
    city: "Tunis",
    email: "khaled.bouazizi@gmail.com",
    phone: 22334455,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'K'}+${'B'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 1,
    solde: 0,
    wallet_code: 111222,
    pushToken: "pushTokenKhaled",
  },
  {
    userName: "fatma",
    firstName: "Fatma",
    lastName: "Jaziri",
    password: hashedUserPassword,
    address: "202 Birch St",
    city: "Sfax",
    email: "fatma.jaziri@gmail.com",
    phone: 33445566,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'F'}+${'J'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 1,
    solde: 0,
    wallet_code: 333444,
    pushToken: "pushTokenFatma",
  },
  {
    userName: "mohamed",
    firstName: "Mohamed",
    lastName: "Trabelsi",
    password: hashedUserPassword,
    address: "303 Maple St",
    city: "Monastir",
    email: "mohamed.trabelsi@gmail.com",
    phone: 44556677,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'M'}+${'T'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 1,
    solde: 0,
    wallet_code: 555666,
    pushToken: "pushTokenMohamed",
  },
  {
    userName: "rim",
    firstName: "Rim",
    lastName: "Ben Ali",
    password: hashedUserPassword,
    address: "404 Oak St",
    city: "Gabes",
    email: "rim.benali@gmail.com",
    phone: 55667788,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'R'}+${'B'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 1,
    solde: 0,
    wallet_code: 777888,
    pushToken: "pushTokenRim",
  },
  {
    userName: "nour",
    firstName: "Nour",
    lastName: "Haddad",
    password: hashedUserPassword,
    address: "505 Pine St",
    city: "Bizerte",
    email: "nour.haddad@gmail.com",
    phone: 66778899,
    amountRecieved: 0,
    amountSent: 0,
    status: 1,
    avatar: `https://ui-avatars.com/api/?name=${'N'}+${'H'}&background=6FA1FF&size=256&rounded=true&color=fff`,
    role: 1,
    solde: 0,
    wallet_code: 999000,
    pushToken: "pushTokenNour",
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
      title: "Pack Basic",
      soldeValue: 100,
      realValue: 120,
    },

    {
      title: "Pack Standard",
      soldeValue: 200,
      realValue: 240,
    },

    {
      title: "Pack Premium",
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
      userName: 'orange',
      companyName: 'Orange Tunisie',
      responsable: 'Ali missaoui',
      matricule_fiscale: 'MF12345',
      address: 'Lac 2, Tunis',
      city: 'Tunis',
      country: 'Tunisie',
      password: hashedPassword,
      email: 'contact@orange.com',
      phone: '22 111 333',
      role: 1,
      status: 1,
      logo: `https://ui-avatars.com/api/?name=${'O'}+${'T'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12345',
      created_at: new Date("2024-09-30T09:00:00Z"),
    },

    {
      userName: 'T-T',
      companyName: 'Tunisie Telecom',
      responsable: 'Mohamed Fadhel Kraiem',
      matricule_fiscale: 'MF12346',
      address: '13, Rue Jughurta, 1002 Tunis',
      city: 'Tunis',
      country: 'Tunisie',
      password: hashedPassword,
      email: 'contact@tunisie-telecome.tn',
      phone: '33 000 222',
      role: 1,
      logo: `https://ui-avatars.com/api/?name=${'T'}+${'T'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12346',
      status: 1,
      created_at: new Date("2024-09-30T09:00:00Z"),
    },

    {
      userName: 'Monoprix Tunisia',
      companyName: 'Monoprix Tunisia',
      responsable: 'Mohamed Bouzguenda',
      matricule_fiscale: 'MF12347',
      address: '14, Rue de Marseille, 1000 Tunis',
      city: 'Tunis',
      country: 'Tunisie',
      password: hashedPassword,
      email: 'contact@monoprix.com',
      phone: '345-678-9012',
      role: 1,
      logo: `https://ui-avatars.com/api/?name=${'M'}+${'T'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12347',
      status: 1,
      created_at: new Date("2024-09-30T09:00:00Z"),
    },

    {
      userName: 'carrefour',
      companyName: 'Carrefour Tunisia',
      responsable: 'Ahmed Ben Salah',
      matricule_fiscale: 'MF12348',
      address: '15, Rue de Paris, 1000 Tunis',
      city: 'Tunis',
      country: 'Tunisie',
      password: hashedPassword,
      email: 'contact@carrefour.com',
      phone: '44 555 666',
      role: 1,
      logo: `https://ui-avatars.com/api/?name=${'C'}+${'T'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12348',
      status: 1,
      created_at: new Date("2024-09-30T09:00:00Z"),
    },

    {
      userName: 'admin',
      companyName: 'admin',
      responsable: 'Jack Ripper',
      matricule_fiscale: 'MF12349',
      address: '1234 Enterprise Ln',
      city: 'Tunis',
      country: 'Tunisie',
      password: hashedPasswordAdmin,
      email: 'contact@auctify.com',
      phone: '20 103 080',
      role: 2,
      logo: `https://ui-avatars.com/api/?name=${'A'}+${'D'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12349',
      status: 1,
      created_at: new Date("2024-09-30T09:00:00Z"),
    },

    {
      userName: 'delice',
      companyName: 'Délice Danone',
      responsable: 'Sami Bouzid',
      matricule_fiscale: 'MF12350',
      address: '16, Rue de la Liberté, 1000 Tunis',
      city: 'Tunis',
      country: 'Tunisie',
      password: hashedPassword,
      email: 'contact@delice.com',
      phone: '55 666 777',
      role: 1,
      logo: `https://ui-avatars.com/api/?name=${'D'}+${'D'}&background=6FA1FF&size=256&rounded=true&color=fff`,
      commerceRegister: 'CR12350',
      status: 1,
      created_at: new Date("2024-09-30T09:00:00Z"),
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
      name: "Iphone 15 PRO MAX",
      files: [{ filename: "iphone-x.jpg", filePath: "https://images-cdn.ubuy.com.sa/64c4a6c86751b005950567d9-apple-iphone-x-64gb-unlocked-gsm-phone.jpg", url: "https://images-cdn.ubuy.com.sa/64c4a6c86751b005950567d9-apple-iphone-x-64gb-unlocked-gsm-phone.jpg" }],
      company: companies[0]._id, 
      price: 100,
      benefit: 1,
      description: "Latest generation smartphone with all features.",
      status: 1,
      openDate: new Date("2024-10-01T10:00:00Z"),
    },
    {
      name: "Asus ROG Laptop",
      files: [{ filename: "laptop-hp.jpg", filePath: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS39CiTRtuC05a0oBGaoDQJZ-XQzeZqBs_LlA&s", url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS39CiTRtuC05a0oBGaoDQJZ-XQzeZqBs_LlA&s" }],

      company: companies[1]._id,
      price: 150,
      benefit: 1,
      description: "High-performance laptop suitable for gaming and work.",
      status: 1,
      openDate: new Date("2024-10-01T11:00:00Z"),
    },
    {
      name: "Casque Sony Bluetooth Pro Max",
      files: [{ filename: "headphones-sony.jpg", filePath: "https://tn.jumia.is/unsafe/fit-in/500x500/filters:fill(white)/product/60/0477/1.jpg?1258" }],
      company: companies[2]._id, 
      price: 100,
      benefit: 1,
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
    await ParticipantModel.deleteMany({});
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

    // await createBetSeeders();
    // console.log("Bet seeding completed!");

    await createCartPackSeeders();
    console.log("Pack seeding completed!");

    // await createNoteSeeders();
    // console.log("Note seeding completed!");

    const addUsers = await UserModel.insertMany(users);
    console.log("User seeding completed!");
    
    const companies = await createCompanySeeders();
    console.log("Company seeding completed!");

    const products = await createProductSeeders(companies);
    console.log("Product seeding completed!");

    // await createParticipantSeeders(products, addUsers[0]);
    // console.log("Participant seeding completed!");

    console.log("Database seeding completed!");
    mongoose.connection.close();
  } catch (err) {
    console.error("Seeding failed!", err);
    mongoose.connection.close();
  }
};

runSeeders();
