const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Member = require("../models/member");

exports.register = async (req, res) => {
  const { membername, password, name, YOB } = req.body;
  try {
    const existingMember = await Member.findOne({ membername });
    if (existingMember) {
      return res.status(400).json({ error: "Membername already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newMember = new Member({
      membername,
      password: hashedPassword,
      name,
      YOB,
    });

    await newMember.save();
    const token = createToken(res, newMember._id);

    res.status(201).json({
      _id: newMember._id,
      membername: newMember.membername,
      name: newMember.name,
      YOB: newMember.YOB,
      isAdmin: newMember.isAdmin,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { membername, password } = req.body;
  try {
    const existingMember = await Member.findOne({ membername });
    if (!existingMember) {
      return res.status(400).json({ error: "Wrong membername or pasword" });
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingMember.password
    );
    if (!isPasswordValid) {
      return res.status(400).json({ error: "Wrong password" });
    }

    const token = createToken(res, existingMember._id);

    res.status(200).json({
      _id: existingMember._id,
      membername: existingMember.membername,
      name: existingMember.name,
      YOB: existingMember.YOB,
      isAdmin: existingMember.isAdmin,
      token,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createToken = (res, memberId) => {
  const token = jwt.sign({ memberId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    sameSite: "strict",
    maxAge: 60 * 60 * 1000,
  });
  return token;
};

exports.logout = async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successfully" });
};

exports.getProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.member._id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    res.json({
      _id: member._id,
      membername: member.membername,
      name: member.name,
      YOB: member.YOB,
      isAdmin: member.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const member = await Member.findById(req.member._id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    member.name = req.body.name || member.name;
    member.YOB = req.body.YOB || member.YOB;

    const updatedMember = await member.save();
    res.json({
      _id: updatedMember._id,
      membername: updatedMember.membername,
      name: updatedMember.name,
      YOB: updatedMember.YOB,
      isAdmin: updatedMember.isAdmin,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: "New passwords do not match" });
  }

  try {
    const member = await Member.findById(req.member._id);
    if (!member) {
      return res.status(404).json({ error: "Member not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, member.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Old password is incorrect" });
    }

    if (newPassword === oldPassword) {
      return res.status(400).json({ error: "Please choose a new password " });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    member.password = hashedPassword;
    await member.save();

    res.json({ message: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const members = await Member.find({});
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
