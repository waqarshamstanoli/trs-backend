const express = require("express");
const router = express.Router();
const Event = require("../models/Events");


router.post("/add", async (req, res) => {
    try {
      const { eventName, eventDescription, eventDate } = req.body;
      const newEvent = new Event({ eventName, eventDescription, eventDate });
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

  router.delete("/delete/:id", async (req, res) => {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
  
      if (!deletedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      res.json({ message: "Event deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting event" });
    }
  });


  router.put("/edit/:id", async (req, res) => {
    try {
      const { eventName, eventDescription, eventDate } = req.body;
      const updatedEvent = await Event.findByIdAndUpdate(
        req.params.id,
        { eventName, eventDescription, eventDate },
        { new: true } 
      );
  
      if (!updatedEvent) {
        return res.status(404).json({ error: "Event not found" });
      }
  
      res.json(updatedEvent);
    } catch (error) {
      res.status(500).json({ error: "Error updating event" });
    }
  });
  
  





module.exports = router;
