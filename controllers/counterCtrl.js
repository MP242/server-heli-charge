const Counter = require("../models/counter.model");

exports.getAllCounters = async function (req, res) {
  try {
    const counters = await Counter.find();
    res.status(200).json(counters);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error retrieving counter from database" });
  }
};

exports.getCountersByUserId = async function (req, res) {
  try {
    const counters = await Counter.find({userID: req.params.userID});
    res.status(200).json(counters);
  } catch (err) {
    console.error(err);  
    res.status(500).json({ message: "Error retrieving counter from database" });
  }
};

exports.getOneCounter = async function (req, res) {
  try {
    const counter = await Counter.findById(req.params.id);
    res.status(200).json(counter);
  } catch (err) {
    console.error(err);    
    res.status(500).json({ message: "Error retrieving counter from database" });
    
  }
};

exports.createCounter = async function (req, res) {
  try {
    const { userID, counterSession } = req.body;
    if (!userID || !counterSession) {      
      res.status(400).json({ message: "Both userID and counterSession are required" });
      return;
    }

    const newCounter = new Counter({
      userID,
      counterSession,
    });

    console.log(newCounter)

    await newCounter.save();
    res.status(201).json(newCounter);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error inserting counter into database" });
  }
};

exports.updateCounter = async function (req, res) {
  try {
    const counter = await Counter.findById(req.params.id);

    if (!counter) {
      return res
        .status(404)
        .json({ message: `Counter with id ${req.params.id} not found` });
    }

    if (req.body.counterSession) {
      counter.counterSession = req.body.counterSession;
    }

    counter.updated_at = new Date();
    const updatedCounter = await counter.save();
    res
      .status(200)
      .json({ message: `Counter with id ${updatedCounter._id} updated` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating counter" });
  }
};

exports.deleteCounter = async function (req, res) {
  try {
    const deletedCounter = await Counter.findByIdAndDelete(req.params.id);
    if (!deletedCounter) {
      return res.status(404).send("Counter not found");
    }
    console.log(`Deleted counter with id ${req.params.id}`);
    res.status(200).json({ message: `Counter with id ${req.params.id} deleted` });
  } catch (err) {
    console.error(err);    
    res.status(500).json({ message: "Error deleting counter from database" });
  }
};
