const express = require("express");
const router = express.Router();
const Quiz = require("../models/Quiz");

// Create Quiz
router.post("/", async (req, res) => {
    try {
        const quiz = new Quiz(req.body);
        const savedQuiz = await quiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Quizzes
router.get("/", async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;

router.delete("/:id", async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndDelete(req.params.id);

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json({
            message: "Quiz deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const quiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!quiz) {
            return res.status(404).json({
                message: "Quiz not found"
            });
        }

        res.json(quiz);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});