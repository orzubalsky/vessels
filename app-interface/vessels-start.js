import 'dotenv/config';
import { promises as fs } from 'fs';
import path from 'path';
import express from 'express';
import open from 'open';
import serveIndex from 'serve-index';
import multer from 'multer'
import { TAGS } from './constants.js';
import { findFolder, findNetworkInterfaceWithIPv4 } from './utils.js';
// import { addContributionRecord, addQuestionRecord, getRandomPathForAllTags, getQuestionRecords } from '../app-filesystem/src/index.js';

const rootFolder = process.env.OUTPUT_FOLDER;

const installType = process.env.INSTALL_TYPE;

const appFilesystemFolder = process.env.NODE_ENV === 'development' ? '../app-filesystem' : findFolder(rootFolder, process.env.NAME_APP_FILESYSTEM);

if (!appFilesystemFolder) {
  console.error(`${process.env.NAME_APP_FILESYSTEM} folder not found in the build directory.`);
  process.exit(1);
}

import(`${appFilesystemFolder}/src/index.js`)
  .then((appFilesystemFolder) => {
    const { addQuestionRecord, addContributionRecord, getRandomPathForAllTags, getQuestionRecords } = appFilesystemFolder;

    const app = express();

    const port = process.env.PORT;

    const upload = multer({ dest: rootFolder })

    // Serve the root folder of /Volumes/Vessels
    const appRoot = process.env.VESSELS_ROOT;

    // Set the view engine to EJS
    app.set('view engine', 'ejs');
    app.set('views', './views');

    // Middleware to parse JSON request bodies
    app.use(express.json());

    app.use(express.static('./static'));

    app.use('/', express.static(appRoot));

    // Parse URL-encoded data (forms)
    app.use(express.urlencoded({ extended: false }));

    app.use('/api/directory', express.static(appRoot), serveIndex(appRoot, {
      icons: true,
      view: 'details',
      template: './views/directory-listing/directory-listing-template.html',
      stylesheet: './views/directory-listing/directory-listing-style.css',
    }));

    const indexRoute = async (req, res) => {
      let localIp

      try {
        // Check if the "host" query parameter is set to "true"
        const isHostParameterTrue = req.query.host === 'true';

        if (isHostParameterTrue) {
          // If "host=true" is present, fetch the private IP address
          const networkInterface = findNetworkInterfaceWithIPv4();

          localIp = networkInterface && networkInterface.address;
        }

        const tagRecords = await getRandomPathForAllTags(rootFolder, TAGS)

        const questionRecords = await getQuestionRecords(rootFolder);

        res.render('index', {
          installType,
          tags: TAGS,
          questions: questionRecords,
          tagRecords,
          appRoot,
          localIp,
          port
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error');
      }
    }

    app.get('/', indexRoute);

    app.get('/directory', indexRoute);

    app.get('/directory/:subfolders*', indexRoute);

    app.get('/setup', async (req, res) => {
      try {
        const questionRecords = await getQuestionRecords(rootFolder);

        const groupedQuestions = questionRecords.reduce((acc, { question, tag }) => {
          if (!acc[tag]) {
            acc[tag] = [];
          }
          acc[tag].push(question);
          return acc;
        }, {});

        res.render('setup', {
          tags: TAGS,
          questions: groupedQuestions,
          appRoot,
        });
      } catch (error) {
        console.error(error);
        res.status(500).send('Error');
      }
    })

    app.post('/api/speak', upload.single('file'), async (req, res) => {
      if (installType === 'demo') {
        res.redirect(`/`);
      }

      try {
        const { tag } = req.body;

        const result = await addContributionRecord(rootFolder, tag);

        if (result.success) {
          const uploadedFilePath = req.file.path;

          const newDestinationPath = path.join(result.recordPathFull, result.recordFolderName);

          // Move the file to the new destination
          await fs.rename(uploadedFilePath, path.join(newDestinationPath, req.file.originalname));

          res.redirect(`/directory/${result.recordPath}`);
        }
      } catch (err) {
        console.error(err);
      }
    });

    app.post('/api/question', async (req, res) => {
      const { tag, question } = req.body

      const result = await addQuestionRecord(rootFolder, tag, question);

      res.json(result);
    });

    const server = app.listen(port, '127.0.0.1', () => {
      console.log(`Server is running on port ${port}`);
      process.env.NODE_ENV === 'production' && open(`http://127.0.0.1:${port}?host=true`);
    });

    process.on('SIGTERM', () => {
      server.close(() => {})
    })
  })




