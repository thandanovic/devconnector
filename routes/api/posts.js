const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

const Post = require('../../models/Post');

const Profile = require('../../models/Profile');

const validatePostInput = require('../../validations/post');

// @route  GET api/posts/test
// @desc   Test post route
// @access Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));


// @route  GET api/posts
// @desc   Create posts
// @access Public

router.get('/', (req, res) => {

    Post.find().sort({ date: -1 }).then(posts => res.json(posts)).catch(err => res.status(404).json({ nopost: 'Posts not found' }));
})

// @route  GET api/posts/:id
// @desc   Get post by id
// @access Public

router.get('/:id', (req, res) => {

    Post.findById(req.params.id).then(post => res.json(post)).catch(err => res.status(404).json({ nopost: 'Post not found' }));
})

// @route  POST api/posts
// @desc   Create posts
// @access Private

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {
    const { errors, isValid } = validatePostInput(req.body);

    //Check Validation
    if (!isValid) {
        //Return any errors with 400 status
        return res.status(400).json(errors);
    }

    const newPost = new Post({
        text: req.body.text,
        name: req.body.name,
        avatar: req.body.avatar,
        user: req.user.id
    });

    newPost.save().then(post => res.json(post));
})

// @route  DELETE api/posts/:id
// @desc   Delete post 
// @access Private
router.delete(
    "/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({ notauth: 'User not authorized' });
                        }

                        //Deletze
                        post.remove().then(() => {
                            res.json({ success: true })
                        })
                    }).catch(err => res.status(404)).json({ postnotfound: 'Post not found' });
            })
    }
);


// @route  POST api/posts/like/:id
// @desc   Delete post 
// @access Private
router.post(
    "/like/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({ notauth: 'User not authorized' });
                        }

                        if (post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
                            return res.status(400).json({ alreadyliked: "User already liked this post" });
                        }

                        //Add user id to likes array
                        post.likes.unshift({ user: req.user.id });

                        post.save().then(post => res.json(post));


                    }).catch(err => res.status(404)).json({ postnotfound: 'Post not found' });
            })
    }
);


// @route  POST api/posts/like/:id
// @desc   Delete post 
// @access Private
router.post(
    "/unlike/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        Profile.findOne({ user: req.user.id })
            .then(profile => {
                Post.findById(req.params.id)
                    .then(post => {
                        if (post.user.toString() !== req.user.id) {
                            return res.status(401).json({ notauth: 'User not authorized' });
                        }

                        if (post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
                            return res.status(400).json({ notliked: "You have not yet liked this post." });
                        }

                        //Get remove index
                        const removeIndex = post.likes.map(item => item.user.toString()).indexOf(req.user.id);

                        post.likes.splice(removeIndex, 1);

                        post.save().then(post => res.json(post));


                    }).catch(err => res.status(404)).json({ postnotfound: 'Post not found' });
            })
    }
);


// @route  POST api/posts/comment/:id
// @desc   comment post 
// @access Private
router.post(
    "/comment/:id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        const { errors, isValid } = validatePostInput(req.body);

        //Check Validation
        if (!isValid) {
            //Return any errors with 400 status
            return res.status(400).json(errors);
        }
        Post.findById(req.params.id).then(post => {
            const newComment = {
                text: req.body.text,
                name: req.body.name,
                avatar: req.body.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment);

            post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json({ psotnotfound: "Post not found!" }));
    }
);

// @route  DELETE api/posts/comment/:id
// @desc   Delete comment of post 
// @access Private
router.delete(
    "/comment/:id/:comment_id",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {

        Post.findById(req.params.id).then(post => {

            if (post.comments.filter(comment => comment._id.toString() === req.params.comment_id).length === 0) {
                return res.status(404).json({ commentdoesntexist: "Comment doesn't exist" });
            }

            //Get remove index
            const removeIndex = post.comments.map(item => item._id.toString()).indexOf(req.params.comment_id);

            post.comments.splice(removeIndex, 1);

            post.save().then(post => res.json(post));

        }).catch(err => res.status(404).json({ psotnotfound: "Post not found!" }));
    }
);





module.exports = router;
