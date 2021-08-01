import {
  DocumentDefinition,
  FilterQuery,
  UpdateQuery,
  QueryOptions,
} from "mongoose";
import {Post, PostDocument } from "../model";

const nodemailer = require("nodemailer");
const config = require("../config/auth.config");

const user = config.user;
const pass = config.pass;


const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: user,
    pass: pass,
  },
});