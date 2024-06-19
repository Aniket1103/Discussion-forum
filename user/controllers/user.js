import { sendToken } from "../utils/sendToken.js";
import { User } from "../models/user.js";
import ErrorHandler from "../middleware/error.js";

export const register = async (req, res) => {
  try{
    // console.log(req.body);
    // return res.json(req.body);
    const { name, email, phone, password } = req.body;
    // const { avatar } = req.files;

    let user = await User.findOne({email});

    if(user){
      return res
        .status(400)
        .json({success : false, message : "User already exists"});
    }

    user = await User.create({
      name,
      email,
      phone,
      password
    })

    sendToken(
      res,
      user,
      201,
      "User LoggedIn successfully"
    );

  }
  catch(error) {
    console.log(error);
    res.send(error);
  }
}

export const currentUser = async (req, res) => {
  try {
    console.log("req.user", req.user);
    return res.json(req.user);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body)

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "Please enter all fields" });
    }

    const user = await User.findOne({ email }).select("+password");
    console.log(user);

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Email or Password" });
    }

    sendToken(res, user, 200, "Login Successful");
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res
      .status(200)
      .cookie("token", "", {
        expires: new Date(Date.now()),
        sameSite: process.env.NODE_ENV === "Develpoment" ? "lax" : "none",
        secure: process.env.NODE_ENV === "Develpoment" ? false : true,
      })
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
      const users = await User.find();

      res.status(200).json({
          success: true,
          users,
      });
  } catch (error) {
      next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
      const { name, email, phone, password } = req.body;
      const id = req.user?._id;
      const user = await User.findById(id);
      console.log(id)

      if (!user) return next(new ErrorHandler("User not found", 404));

      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.password = password || user.password;
      await user.save();

      res.status(200).json({
          success: true,
          message: "User details Updated!",
      });
  } catch (error) {
      next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
      const user = await User.findById(req.user._id);
      console.log(user)

      if (!user) return next(new ErrorHandler("User not found", 404));
      await user.deleteOne();

      res.status(200).json({
          message: "User Deleted!",
          success: true,
      });
  } catch (error) {
      next(error);
  }
};

export const followUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { followId } = req.body;

    if (!userId || !followId) {
      return res.status(400).json({ error: 'User ID and Follow ID are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const followUser = await User.findById(followId);
    if (!followUser) {
      return res.status(404).json({ error: 'User to follow not found.' });
    }

    if (user.following.includes(followId)) {
      return res.status(400).json({ error: 'User is already following this user.' });
    }

    user.following.push(followId);
    await user.save();

    followUser.followers.push(userId);
    await followUser.save();

    return res.status(200).json({ message: 'User followed successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { unfollowId } = req.body;

    if (!userId || !unfollowId) {
      return res.status(400).json({ error: 'User ID and Unfollow ID are required.' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const unfollowUser = await User.findById(unfollowId);
    if (!unfollowUser) {
      return res.status(404).json({ error: 'User to unfollow not found.' });
    }

    if (!user.following.includes(unfollowId)) {
      return res.status(400).json({ error: 'User is not following this user.' });
    }

    user.following = user.following.filter(id => id.toString() !== unfollowId);
    await user.save();

    unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== userId);
    await unfollowUser.save();

    return res.status(200).json({ message: 'User unfollowed successfully.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};

export const searchUsers = async (req, res) => {
  try {
    const { searchText } = req.query;

    if (!searchText) {
      return res.status(400).json({ error: 'Search text is required.' });
    }

    const users = await User.find({ 
      name: { $regex: searchText, $options: 'i' } 
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found.' });
    }

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
};