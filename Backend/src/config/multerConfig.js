import multer from 'multer';

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "D:\\Year2_CADT\\Term3\\Back_end\\Project\\Event_Managment_Admin_portal\\backend\\src\\uploads");
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

// Create upload middleware
export const upload = multer({ storage });
