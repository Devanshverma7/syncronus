import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/UserModel.js";
import { renameSync, unlinkSync } from "fs";

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (email, userId) => {
  return jwt.sign({ email, userId }, process.env.JWT_KEY, {
    expiresIn: maxAge,
  });
};
export const signup = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required");
    }
    const user = await User.create({ email, password });
    
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
      //You need sameSite: "None" because your frontend and backend are on different origins.
      // This setting allows authentication cookies (like JWTs) to be sent even in cross-origin API calls, ensuring users stay logged in.
    });
    return res.status(201).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).send("Email and Password is required!");
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send("User does not exists with given email!");
    }
    const auth = await compare(password, user.password); // returns true/false
    // console.log(auth);
    if (!auth) {
      return res.status(400).send("Incorrect password!");
    }
    res.cookie("jwt", createToken(email, user.id), {
      maxAge,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        profileSetup: user.profileSetup,
        firstName: user.firstName,
        lastName: user.lastName,
        image: user.image,
        color: user.color,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
export const getUserInfo = async (req, res) => {
  try {
    const userData = await User.findById(req.userId);
    if (!userData) {
      return res.status(404).send("User with the given Id not found!");
    }
    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
export const updateProfile = async (req, res) => {
  try {
    const { userId } = req;
    const { firstName, lastName, color } = req.body;

    if (!firstName || !lastName || color === undefined) {
      return res
        .status(404)
        .send("firstName, lastName, and color is required!");
    }

    const userData = await User.findByIdAndUpdate(
      userId,
      { firstName, lastName, color, profileSetup: true },
      { new: true, runValidators: true }
    ); // new:true means monogdb please return me the new (updated) user data, runValidators runs a validation on the data we are sending now

    return res.status(200).json({
      id: userData.id,
      email: userData.email,
      profileSetup: userData.profileSetup,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image,
      color: userData.color,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
export const addProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("File is required.");
    }
    const date = Date.now();
    let fileName = "uploads/profiles/" + date + req.file.originalname;
    renameSync(req.file.path, fileName);

    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      { image: fileName },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      image: updatedUser.image,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
export const removeProfileImage = async (req, res) => {
  try {
    const { userId } = req;
    // find user in db
    const user = await User.findById(userId);
    // user not found
    if (!user) {
      return res.status(404).send("User not found!");
    }
    // unlinkSync with user image file
    if (user.image) {
      unlinkSync(user.image);
    }
    // remove image from user obj
    user.image = null;
    // save this updated user obj in db for user
    await user.save();
    return res.status(200).send("Profile image removed successfully.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 1, secure: true, sameSite: "None" });
    return res.status(200).send("Logged you out successfully.");
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
