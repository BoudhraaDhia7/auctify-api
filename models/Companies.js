import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { ObjectId } = mongoose.Schema;
export const CompanySchema = new mongoose.Schema(
  {
    userName: { type: String, unique: true },
    companyName: { type: String },
    responsable: { type: String },
    matricule_fiscale: { type: String },
    address: { type: String },
    city: { type: String },
    country: { type: String },
    password: { type: String },
    email: { type: String },
    phone: { type: String },
    role: { type: Number, default: 1 },
    logo: { type: String },
    commerceRegister: { type: String },
    status: { type: Number },
  },
  { toJSON: { virtuals: true } },
  { timestamps: { createdAt: "created_at" } }
);

CompanySchema.virtual("CompaniesProducts", {
  ref: "products",
  localField: "_id",
  foreignField: "company",
  justOne: false,
});


const hashedPassword = bcrypt.hashSync("password", 10);
const hashedPasswordAdmin = bcrypt.hashSync("admin", 10);
export const companies = [
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
    logo: 'logo1.png',
    commerceRegister: 'CR12345',
    status: 1
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
    logo: 'logo2.png',
    commerceRegister: 'CR12346',
    status: 1
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
    logo: 'logo3.png',
    commerceRegister: 'CR12347',
    status: 1
  },
  {
    userName: 'compUser4',
    companyName: 'Company Four',
    responsable: 'Jill Stein',
    matricule_fiscale: 'MF12348',
    address: '1234 Exchange Blvd',
    city: 'Finance Ville',
    country: 'Australia',
    password: hashedPassword,
    email: 'contact@companyfour.com',
    phone: '456-789-0123',
    role: 1,
    logo: 'logo4.png',
    commerceRegister: 'CR12348',
    status: 1
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
    logo: 'logo5.png',
    commerceRegister: 'CR12349',
    status: 1
  }
];


export const CompanyModel = mongoose.model("companies", CompanySchema);
