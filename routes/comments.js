const { Comment, validate } = require('../models/comment');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error)
            return res.status(400).send(error);

        // Need to validate body before continuing
        const comment = new Comment({
            youtubeId: req.body.youtubeId,
            comment: req.body.comment,
            likes: req.body.likes,
            dislikes: req.body.dislikes
        });
        await comment.save();
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

router.put('/replyComment/:youtubeId', async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.youtubeId);
        if (!comment) return res.status(400).send(`The youtubeId with id "${req.params.youtubeId}" does not exist.`);
        console.log(comment)
        const replyComment = new Comment({
            youtubeId: req.body.youtubeId,
            comment: req.body.comment,
            likes: req.body.likes,
            dislikes: req.body.dislikes
        });

        comment.replies.push(res.body);
        await replyComment.save();
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});




router.put('/:id', async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error);
        const comment = await Comment.findByIdAndUpdate(
            req.params.id,
            {
                youtubeId: req.body.youtubeId,
                comment: req.body.comment,
                likes: req.body.likes,
                dislikes: req.body.dislikes,
            },
            { new: true }
        );
        if (!comment)
            return res.status(400).send(`The product with id "${req.params.id}" d
   oes not exist.`);
        await comment.save();
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});


router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find();
        return res.send(comments);
    } catch (ex) {
        return res.status(500).send(`Internawdl Server Error: ${ex}`);
    }
});

router.get('/:youtubeId', async (req, res) => {
    try {

        const comment = await Comment.find({ 'youtubeId': req.params.youtubeId });
        
        if (!comment)
            return res.status(400).send(`The comment with id "${req.params.id}" does not exist.`);
        return res.send(comment);
    } catch (ex) {
        return res.status(500).send(`Internal Server Error: ${ex}`);
    }
});

module.exports = router;
