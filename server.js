const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { createCanvas, loadImage } = require('canvas');
const rateLimit = require('express-rate-limit');
const session = require('express-session');

const app = express();
const port = process.env.PORT || 3000;

// Ensure required directories exist
['uploads', 'public', 'public/output', 'template'].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Session configuration with environment variable
app.use(session({
    secret: process.env.SESSION_SECRET || 'dev-secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Trust proxy for Railway deployment
app.set('trust proxy', 1);

// Rate limiter configuration
const generateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: process.env.RATE_LIMIT_MAX || 10,
    message: { error: 'Too many generate requests, please try again later.' },
    standardHeaders: true,
    legacyHeaders: false
});

app.post('/generate', generateLimiter);

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const fileFilter = (req, file, cb) => {
  
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
        return cb(new Error('Only image files are allowed!'), false);
    }
    

    if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Invalid file type!'), false);
    }
    
    cb(null, true);
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = 'uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, 
        files: 1 
    }
});

const userCooldowns = new Map();
const COOLDOWN_PERIOD = 30 * 1000; 

function checkCooldown(req, res, next) {
    const ip = req.ip;
    const now = Date.now();
    const lastGenerate = userCooldowns.get(ip);

    if (lastGenerate && (now - lastGenerate) < COOLDOWN_PERIOD) {
        const timeLeft = Math.ceil((COOLDOWN_PERIOD - (now - lastGenerate)) / 1000);
        return res.status(429).json({
            error: `Please wait ${timeLeft} seconds before generating another image.`
        });
    }

    next();
}

function cleanupOldFiles() {
    const directories = ['uploads', 'public/output'];
    const maxAge = 30 * 60 * 1000; 

    directories.forEach(dir => {
        if (fs.existsSync(dir)) {
            fs.readdir(dir, (err, files) => {
                if (err) {
                    console.error(`Error reading directory ${dir}:`, err);
                    return;
                }

                files.forEach(file => {
                    const filePath = path.join(dir, file);
                    fs.stat(filePath, (err, stats) => {
                        if (err) {
                            console.error(`Error getting stats for ${filePath}:`, err);
                            return;
                        }

                        const fileAge = Date.now() - stats.mtime.getTime();
                        if (fileAge > maxAge) {
                            fs.unlink(filePath, err => {
                                if (err) {
                                    console.error(`Error deleting file ${filePath}:`, err);
                                } else {
                                    console.log(`Deleted old file: ${filePath}`);
                                }
                            });
                        }
                    });
                });
            });
        }
    });
}

setInterval(cleanupOldFiles, 5 * 60 * 1000);

cleanupOldFiles();

app.get('/', (req, res) => {
    res.render('index');
});

const downloadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 30,
    message: { error: 'Too many download requests, please try again later.' }
});

app.get('/download/:filename', downloadLimiter, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'public', 'output', filename);
    
    
    if (fs.existsSync(filePath)) {
        res.download(filePath, filename, (err) => {
            if (err) {
                console.error('Error downloading file:', err);
                res.status(500).send('Error downloading file');
            }
        });
    } else {
        res.status(404).send('File not found');
    }
});

app.post('/generate', checkCooldown, upload.single('image'), async (req, res) => {
    try {
        const ip = req.ip;
        const { template, title, subtitle, subtitle2, subtitle3 } = req.body;
        const uploadedImage = req.file;

        if (!uploadedImage) {
            return res.status(400).send('No image uploaded');
        }

      
        if (!['phub.png', 'xnxx.png'].includes(template)) {
            return res.status(400).json({ error: 'Invalid template selected' });
        }

       
        const templateImage = await loadImage(path.join(__dirname, 'template', template));
        const uploadedImg = await loadImage(uploadedImage.path);


        const canvas = createCanvas(templateImage.width, templateImage.height);
        const ctx = canvas.getContext('2d');

     
        ctx.drawImage(templateImage, 0, 0);

       
        if (template === 'phub.png') {
          
            ctx.drawImage(uploadedImg, 1, 110, 500, 315);
            
         
            ctx.font = ' 25px Arial';
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(title, 20, 460);

         
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;

       
            ctx.font = '18px Arial';
            ctx.fillStyle = '#E0E0E0';
            ctx.fillText(subtitle, 20, 485);
        } else if (template === 'xnxx.png') {
    
            ctx.drawImage(uploadedImg, 1, 120, 498, 300);
            
     
            ctx.font = ' 28px Arial';
            ctx.fillStyle = 'white';
            ctx.shadowColor = 'rgba(0, 0, 0, 0.7)';
            ctx.shadowBlur = 5;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.fillText(title, 20, 460);

         
            ctx.shadowColor = 'transparent';
            ctx.shadowBlur = 0;
            ctx.shadowOffsetX = 0;
            ctx.shadowOffsetY = 0;


            ctx.font = ' 18px Arial';
            ctx.fillStyle = 'white';
            ctx.fillText(subtitle, 20, 482);


            ctx.font = '17px Arial';
            ctx.fillStyle = '#CCCCCC';
            ctx.fillText(subtitle2, 343, 478);

            ctx.font = '17px Arial';
            ctx.fillStyle = '#CCCCCC';
            ctx.fillText(subtitle3, 435, 478);
        }

        const outputPath = path.join(__dirname, 'public', 'output', `${Date.now()}.png`);
        if (!fs.existsSync(path.join(__dirname, 'public', 'output'))) {
            fs.mkdirSync(path.join(__dirname, 'public', 'output'), { recursive: true });
        }

        const out = fs.createWriteStream(outputPath);
        const stream = canvas.createPNGStream();
        stream.pipe(out);

        out.on('finish', () => {
            const filename = path.basename(outputPath);
            

            userCooldowns.set(ip, Date.now());
            
 
            setTimeout(() => {
                userCooldowns.delete(ip);
            }, COOLDOWN_PERIOD);

            res.json({
                success: true,
                imageUrl: `/output/${filename}`,
                downloadUrl: `/download/${filename}`
            });


            fs.unlink(uploadedImage.path, (err) => {
                if (err) {
                    console.error('Error deleting uploaded file:', err);
                }
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error generating image');
    }
});

function findAvailablePort(startPort) {
    return new Promise((resolve, reject) => {
        const server = require('net').createServer();
        server.unref();
        server.on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                resolve(findAvailablePort(startPort + 1));
            } else {
                reject(err);
            }
        });
        server.listen(startPort, () => {
            server.close(() => {
                resolve(startPort);
            });
        });
    });
}

async function startServer() {
    try {
        const availablePort = await findAvailablePort(port);
        app.listen(availablePort, () => {
            console.log(`Server running at http://localhost:${availablePort}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
}

startServer(); 