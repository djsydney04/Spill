const express = require('express');
const router = express.Router();
const multer = require('multer');
const AWS = require('aws-sdk');
const auth = require('../middleware/auth');
const { Post, User, Venue } = require('../models');

// Configure AWS
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

// Configure multer for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Create a new post
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    const { venueId, caption, vibeRating } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    // Upload image to S3
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `posts/${Date.now()}-${req.file.originalname}`,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
      ACL: 'public-read',
    };

    const uploadResult = await s3.upload(params).promise();

    // Create post in database
    const post = await Post.create({
      userId: req.user.id,
      venueId,
      imageUrl: uploadResult.Location,
      caption,
      vibeRating,
    });

    // Fetch complete post data with associations
    const completePost = await Post.findByPk(post.id, {
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profileImageUrl'],
        },
        {
          model: Venue,
          attributes: ['id', 'name', 'address'],
        },
      ],
    });

    // Emit real-time update
    req.app.get('io').to(`venue-${venueId}`).emit('new-post', completePost);

    res.status(201).json(completePost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get posts for a venue
router.get('/venue/:venueId', auth, async (req, res) => {
  try {
    const { venueId } = req.params;
    const posts = await Post.findAll({
      where: { venueId },
      include: [
        {
          model: User,
          attributes: ['id', 'username', 'profileImageUrl'],
        },
        {
          model: Venue,
          attributes: ['id', 'name', 'address'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a post
router.delete('/:postId', auth, async (req, res) => {
  try {
    const post = await Post.findOne({
      where: { id: req.params.postId, userId: req.user.id },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Delete image from S3
    const key = post.imageUrl.split('/').pop();
    await s3.deleteObject({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `posts/${key}`,
    }).promise();

    await post.destroy();

    // Emit real-time update
    req.app.get('io').to(`venue-${post.venueId}`).emit('delete-post', post.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
