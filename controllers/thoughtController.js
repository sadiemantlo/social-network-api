const { Thought, User } = require("../models");

const thoughtController = {
  // create a thought
  async createThought(req, res) {
    try {
      const thoughtDataDB = await Thought.create(req.body);
      res.json(thoughtDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughtDataDB = await Thought.find().sort({ createdAt: -1 });

      res.json(thoughtDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },
  // get a single thought
  async getSingleThought(req, res) {
    try {
      const thoughtDataDB = await Thought.findOne({
        _id: req.params.thoughtId,
      });
      if (!thoughtDataDB) {
        return res.status(404).json({ message: "No thought with that ID :/" });
      }
      res.json(thoughtDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  // update a thought
  async updateThought(req, res) {
    try {
      const thoughtDataDB = await Thought.findByIdAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!thoughtDataDB) {
        return res.status(404).json({ message: "No thought with that ID :/" });
      }
      res.json(thoughtDataDB);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

    // delete a thought
    async deleteThought(req, res) {
        try {
            const thoughtDataDB = await Thought.findByIdAndDelete({ _id: req.params.thoughtId });
            if (!thoughtDataDB) {
                return res.status(404).json({ message: "No thought with that ID :/" });
            }
            const userDataDB = User.findOneAndUpdate(
                { thoughts: req.params.thoughtId },
                { $pull: {thoughts: req.params.thoughtId} },
                { new: true }
            );
            if (!userDataDB) {
                return res.status(404).json({ message: "No user with that ID :/" });
            }
            res.json({ message: "Thought deleted :)" });
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // add a reaction
    async addReaction(req, res) {
      try {
        const thoughtDataDB = await Thought.findByIdAndUpdate(
          { _id: req.params.thoughtId },
          { $addToSet: { reactions: req.body } },
          { runValidators: true, new: true }
        );
        if (!thoughtDataDB) {
          return res.status(404).json({ message: "No thought with that ID :/" });
        }
        res.json(thoughtDataDB);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },

    // delete a reaction
    async deleteReaction(req, res) {
      try {
        const thoughtDataDB = await Thought.findByIdAndUpdate(
          { _id: req.params.thoughtId },
          { $pull: { reactions: { reactionId: req.params.reactionId } } },
          { runValidators: true, new: true }
        );
        if (!thoughtDataDB) {
          return res.status(404).json({ message: "No thought with that ID :/" });
        }
        res.json(thoughtDataDB);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    }
};

module.exports = thoughtController;