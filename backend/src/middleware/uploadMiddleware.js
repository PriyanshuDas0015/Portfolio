import multer from 'multer';

const allowedImages = new Set(['image/png', 'image/jpeg', 'image/webp']);
const allowedVideos = new Set(['video/mp4', 'video/webm']);
const storage = multer.memoryStorage();
const imageFilter = (req, file, callback) =>
  callback(
    allowedImages.has(file.mimetype) ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE'),
    allowedImages.has(file.mimetype),
  );
const pdfFilter = (req, file, callback) =>
  callback(
    file.mimetype === 'application/pdf' ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE'),
    file.mimetype === 'application/pdf',
  );

export const projectUpload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowed =
      file.fieldname === 'demoVideo'
        ? allowedVideos.has(file.mimetype)
        : allowedImages.has(file.mimetype);
    callback(allowed ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE'), allowed);
  },
  limits: { fileSize: 50e6, files: 11 },
});
export const resumeUpload = multer({ storage, fileFilter: pdfFilter, limits: { fileSize: 10e6 } });
export const educationUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5e6 },
});
export const profileUpload = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5e6 },
});
export const certificateUpload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowed =
      file.fieldname === 'certificatePdf'
        ? file.mimetype === 'application/pdf'
        : allowedImages.has(file.mimetype);
    callback(allowed ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE'), allowed);
  },
  limits: { fileSize: 10e6, files: 2 },
});

export const mediaUpload = multer({
  storage,
  fileFilter: (req, file, callback) => {
    const allowed =
      allowedImages.has(file.mimetype) ||
      allowedVideos.has(file.mimetype) ||
      file.mimetype === 'application/pdf';
    callback(allowed ? null : new multer.MulterError('LIMIT_UNEXPECTED_FILE'), allowed);
  },
  limits: { fileSize: 50e6 },
});
