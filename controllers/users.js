const { BadRequest, Conflict, Unauthorized } = require('http-errors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User } = require('../model');
const { joiRegisterSchema, joiLoginSchema } = require('../model/user');
const gravatar = require('gravatar');
const fs = require('fs/promises');
const path = require('path');

const avatarsDir = path.join(__dirname, '../', 'public', 'avatars');

const { SECRET_KEY } = process.env;

const signup = async (req, res, next) => {
  try {
    const { error } = joiRegisterSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw new Conflict('User already exist');
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const avatarURL = gravatar.url(email);
    const newUser = await User.create({
      email,
      password: hashPassword,
      avatarURL,
    });
    res.status(201).json({
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { error } = joiLoginSchema.validate(req.body);
    if (error) {
      throw new BadRequest(error.message);
    }
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Unauthorized('Email or password is wrong');
    }
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw new Unauthorized('Email or password is wrong');
    }

    const { _id } = user;
    const payload = {
      id: _id,
    };
    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' });
    await User.findByIdAndUpdate(_id, { token });
    res.json({
      token,
      user: {
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).send('No Content');
};
const currentUser = async (req, res) => {
  const { email } = req.user;
  res.json({
    user: {
      email,
    },
  });
};

const updateSubscription = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { subscription } = req.body;

    if (!subscription) {
      return res.status(400).json({ message: 'missing field subscription' });
    }

    const contact = await User.findOneAndUpdate(
      _id,
      { subscription },
      {
        new: true,
      },
    );

    if (!contact) {
      return res.status(404).json({ message: 'Not found' });
    }
    res.json(contact);
  } catch (error) {
    next(error);
  }
};
const updateAvatar = async (req, res, next) => {
  try {
    const uniqName = req.user.email.split('@mail.').splice(0, 1).join('');
    const { path: tempUpload, filename } = req.file;
    const [extension] = filename.split('.').reverse();
    const newFileName = `${uniqName}.${extension}`;
    const fileUpload = path.join(avatarsDir, newFileName);
    await fs.rename(tempUpload, fileUpload);
    const avatarURL = path.join('avatars', newFileName);
    await User.findByIdAndUpdate(req.user._id, { avatarURL }, { new: true });
    res.json({ avatarURL });
  } catch (error) {
    await fs.unlink(req.file.path);
    next(error);
  }
};
module.exports = {
  signup,
  login,
  logout,
  currentUser,
  updateSubscription,
  updateAvatar,
};
