import multer from 'multer';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'D:\\CADT-Y2-TERM3\\Backend\\Event_management\\Event_Management_System\\Backend\\src\\uploads');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Create upload middleware
export const upload = multer({ storage });
