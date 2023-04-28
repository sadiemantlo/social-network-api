const { User, Thought } = require("../models");

module.exports = {
  // create a user
  async createUser(req, res) {
    try {
      const userDataDB = await User.create(req.body);
      res.json(userDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // get all users
  async getUsers(req, res) {
    try {
      const userDataDB = await User.find().select("-__v");
      res.json(userDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // get a single user
  async getSingleUser(req, res) {
    try {
      const userDataDB = await User.findOne({ _id: req.params.userId })
        .select("__v")
        .populate("friends")
        .populate("thought");

      if (!userDataDB) {
        return res.status(404).json({ message: "No user with that ID :/" });
      }
      res.json(userDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // update a user
  async updateUser(req, res) {
    try {
      const userDataDB = await User.findByIdAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!userDataDB) {
        return res.status(404).json({ message: "No user with that ID :/" });
      }
      res.json(userDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // delete a user and and associated thoughts
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });
      if (!user) {
        return res.status(404).json({ message: "No user with that ID :/" });
      }
      await Thought.deleteMany({ _id: { $in: user.thought } });
      res.json({ message: "User and associated thoughts deleted :)" });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // add friend
  async addFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that ID :/" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // delete friend
  async deleteFriend(req, res) {
    try {
      const user = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "No user with that ID :/" });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
};
