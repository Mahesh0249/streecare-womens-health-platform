const musicData = {
    'Happy': [
        { title: "Walking on Sunshine", artist: "Katrina & The Waves" },
        { title: "Happy", artist: "Pharrell Williams" },
        { title: "Don't Stop Me Now", artist: "Queen" },
    ],
    'Sad': [
        { title: "Someone Like You", artist: "Adele" },
        { title: "Hallelujah", artist: "Jeff Buckley" },
        { title: "Fix You", artist: "Coldplay" },
    ],
    'Anxious': [
        { title: "Weightless", artist: "Marconi Union" },
        { title: "Clair de Lune", artist: "Claude Debussy" },
        { title: "Breathe Me", artist: "Sia" },
    ],
    'Energetic': [
        { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars" },
        { title: "Shake It Off", artist: "Taylor Swift" },
        { title: "Can't Stop the Feeling!", artist: "Justin Timberlake" },
    ],
    'Calm': [
        { title: "Orinoco Flow", artist: "Enya" },
        { title: "Clocks", artist: "Coldplay" },
        { title: "Here Comes The Sun", artist: "The Beatles" },
    ],
};

exports.getMusic = (req, res) => {
    const { mood } = req.query;
    if (mood && musicData[mood]) {
        res.json(musicData[mood]);
    } else {
        res.status(404).json({ message: 'No music found for this mood' });
    }
};
