const express = require("express");
const router = express.Router();
const Event = require("../models/Events");


router.post("/add", async (req, res) => {
    try {
      const { title, description, date } = req.body;
      const newEvent = new Event({ title, description, date });
      await newEvent.save();
      res.status(201).json(newEvent);
    } catch (error) {
      res.status(500).json({ error: "Error creating event" });
    }
  });

router.get("/get", async (req, res) => {
    try {
      const events = await Event.find();
      res.json(events);
    } catch (error) {
      res.status(500).json({ error: "Error fetching events" });
    }
  })





module.exports = router;
