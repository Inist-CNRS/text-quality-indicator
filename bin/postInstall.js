#!/usr/bin/env node

"use strict";

const https = require('https');
const tar = require('tar');
const fs = require('fs');
const path = require('path');

const dictDestFile = path.join(__dirname,'..','lib', 'dictionaries', 'libreoffice.tar.gz');
const dictDestDir = path.join(__dirname,'..','lib', 'dictionaries', 'libreoffice');
const redirectedUrl = 'https://codeload.github.com/LibreOffice/dictionaries/tar.gz/refs/heads/master';
const githubUrl = 'https://github.com/LibreOffice/dictionaries/archive/refs/heads/master.tar.gz';

// HTTP Download function
function downloadFile(url, destination) {
  return new Promise((resolve, reject) => {
      const file = fs.createWriteStream(destination);
      https.get(redirectedUrl, {
        followRedirect: true,
        headers: {
          'Accept-Encoding': 'gzip'
        }
      }, (response) => {
          if (response.statusCode !== 200) {
              return reject(new Error(`Erreur lors du téléchargement. Statut: ${response.statusCode}`));
          }
          response.pipe(file);
          file.on('finish', () => {
              file.close(resolve);
          });
      }).on('error', (err) => {
          fs.unlink(destination, () => {}); // remove file if error
          reject(err);
      });
  });
}

// tar.gz extract function
function extractTarGz(source, destination) {
  return new Promise((resolve, reject) => {
      fs.mkdir(destination, { recursive: true }, (err) => {
          if (err) return reject(err);
          fs.createReadStream(source)
              .pipe(tar.x({ 
                C: destination,
                strip: 1
              }))
              .on('end', resolve)
              .on('error', reject);
      });
  });
}


// Execute download & unzip
(async () => {
  try {
      console.log('Downloading libreoffice dictionaries...');
      // await downloadFile(dictionariesTgzUrl, dictDestFile);
      await downloadFile(githubUrl, dictDestFile);
      console.log('Done.');

      console.log('Extract dictionaries files...');
      await extractTarGz(dictDestFile, dictDestDir);
      console.log('Done.');

      // Remove tar.gz file after extraction
      fs.unlinkSync(dictDestFile);
      console.log('tar.gz file removed.');

  } catch (error) {
      console.error('Error:', error);
  }
})();