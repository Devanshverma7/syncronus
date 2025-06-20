import mongoose from "mongoose";
import Message from "../models/MessageModel.js";
import User from "../models/UserModel.js";

export const searchContacts = async (req, res) => {
  try {
    const { searchTerm } = req.body;

    if (!searchTerm || searchTerm.trim() === "") {
      return res.status(400).send("searchTerm is required.");
    }

    const trimmedSearchTerm = searchTerm.trim();

    // Approach 1: Prefix matching (starts with)
    const prefixRegex = new RegExp(
      `^${trimmedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "i"
    );

    // Approach 2: Word boundary matching (matches whole words)
    const wordBoundaryRegex = new RegExp(
      `\\b${trimmedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      "i"
    );

    // Approach 3: Exact match for email, prefix for names
    const exactEmailRegex = new RegExp(
      `^${trimmedSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
      "i"
    );

    let searchQuery;

    // Check if search term looks like an email
    const isEmailSearch = trimmedSearchTerm.includes("@");

    if (isEmailSearch) {
      // For email searches, use exact or prefix matching
      searchQuery = {
        $and: [
          { _id: { $ne: req.userId } },
          {
            $or: [
              { email: exactEmailRegex }, // Exact email match
              { email: prefixRegex }, // Email prefix match
            ],
          },
        ],
      };
    } else {
      // For name searches, use multiple strategies
      searchQuery = {
        $and: [
          { _id: { $ne: req.userId } },
          {
            $or: [
              // Prefix matching for first and last names
              { firstName: prefixRegex },
              { lastName: prefixRegex },
              // Word boundary matching for full names
              { firstName: wordBoundaryRegex },
              { lastName: wordBoundaryRegex },
              // Full name search (firstName + lastName)
              {
                $expr: {
                  $regexMatch: {
                    input: { $concat: ["$firstName", " ", "$lastName"] },
                    regex: prefixRegex,
                  },
                },
              },
            ],
          },
        ],
      };
    }

    const contacts = await User.find(searchQuery)
      .select("firstName lastName email profilePicture") // Only select needed fields
      .limit(20) // Limit results for performance
      .sort({ firstName: 1, lastName: 1 }); // Sort results

    return res.status(200).json({ contacts });
  } catch (err) {
    console.error("Search contacts error:", err);
    return res.status(500).send("Internal Server Error");
  }
};

export const getContactsForDMList = async (req, res) => {
  try {
    let userId = req.userId;
    userId = new mongoose.Types.ObjectId(userId);

    const contacts = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: userId }, { recipient: userId }],
        },
      },
      {
        $sort: { timestamp: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ["$sender", userId] },
              then: "$recipient",
              else: "$sender",
            },
          },
          lastMessageTime: { $first: "$timestamp" },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "contactInfo",
        },
      },
      {
        $unwind: "$contactInfo",
      },
      {
        $project: {
          _id: 1,
          lastMessageTime: 1,
          email: "$contactInfo.email",
          firstName: "$contactInfo.firstName",
          lastName: "$contactInfo.lastName",
          image: "$contactInfo.image",
          color: "$contactInfo.color",
        },
      },
      {
        $sort: { lastMessageTime: -1 },
      },
    ]);
    return res.status(200).json({ contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};

export const getAllContacts = async (request, res) => {
  try {
    const users = await User.find(
      { _id: { $ne: request.userId } },
      "firstName lastName _id"
    );

    const contacts = users.map((user) => ({
      label: user.firstName
        ? `${user.firstName} ${user.lastName}`
        : `${user.email}`,
      value: user._id,
    }));

    return res.status(200).json({ contacts });
  } catch (err) {
    console.error(err);
    return res.status(500).send("Internal Serve Error");
  }
};
