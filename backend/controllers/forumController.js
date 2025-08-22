const { db, admin } = require('../config/firebase');

exports.getPosts = async (req, res) => {
    try {
        const snapshot = await db.collection('forum_posts')
                                  .orderBy('created_at', 'desc')
                                  .get();

        const posts = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                content: data.content,
                // Convert Firestore Timestamp to ISO string for client consistency
                created_at: data.created_at.toDate().toISOString(),
            }
        });
        res.json(posts);
    } catch (error) {
        console.error('Error fetching forum posts:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.createPost = async (req, res) => {
    const { title, content } = req.body;
    const userId = req.user.id;

    if (!title || !content) {
        return res.status(400).json({ message: 'Title and content are required' });
    }

    try {
        const newPost = {
            user_id: userId,
            title,
            content,
            created_at: admin.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection('forum_posts').add(newPost);
        const doc = await docRef.get();
        const data = doc.data();

        res.status(201).json({
            id: doc.id,
            title: data.title,
            content: data.content,
            created_at: data.created_at.toDate().toISOString()
        });
    } catch (error) {
        console.error('Error creating forum post:', error);
        res.status(500).json({ message: 'Server error' });
    }
};