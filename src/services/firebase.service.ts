import path from 'path';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID
} from '../config';
import { FirebaseConfig } from '../interfaces/firebase.interface';


interface FileWithBuffer extends Express.Multer.File {
  buffer: Buffer;
  originalname: string;
  fieldname: string;
  encoding: string;
  mimetype: string;
  size: number;
}

// Firebase config
const firebaseConfig: FirebaseConfig = {
  apiKey: FIREBASE_API_KEY ?? (() => { throw new Error('FIREBASE_API_KEY is not defined'); })(),
  authDomain: FIREBASE_AUTH_DOMAIN ?? (() => { throw new Error('FIREBASE_AUTH_DOMAIN is not defined'); })(),
  projectId: FIREBASE_PROJECT_ID ?? (() => { throw new Error('FIREBASE_PROJECT_ID is not defined'); })(),
  storageBucket: FIREBASE_STORAGE_BUCKET ?? (() => { throw new Error('FIREBASE_STORAGE_BUCKET is not defined'); })(),
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID ?? (() => { throw new Error('FIREBASE_MESSAGING_SENDER_ID is not defined'); })(),
  appId: FIREBASE_APP_ID ?? (() => { throw new Error('FIREBASE_APP_ID is not defined'); })(),
  measurementId: FIREBASE_MEASUREMENT_ID ?? (() => { throw new Error('FIREBASE_MEASUREMENT_ID is not defined'); })(),
};

const firebaseApp = initializeApp(firebaseConfig);
const storage = getStorage(firebaseApp);

/**
 * Upload a single file to Firebase storage
 * @param file - The file to upload
 * @param fileName - The name to save the file as
 * @param folder - The folder path to save the file in
 * @returns Promise with the download URL
 */
const uploadToFirebase = async (file: FileWithBuffer, fileName: string, folder: string): Promise<string> => {
  const storageRef = ref(storage, `${folder}/${fileName}`);
  await uploadBytes(storageRef, file.buffer);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};
/**
 * Upload multiple files to Firebase storage
 * @param file - The file to upload
 * @param fileName - The name to save the file as
 * @param folder - The folder path to save the file in
 * @returns Promise with the download URL
 */
const uploadMultiToFirebase = async (file: FileWithBuffer, fileName: string, folder: string): Promise<string> => {
  const storageRef = ref(storage, `${folder}/${fileName}`);
  await uploadBytes(storageRef, file.buffer);
  const downloadURL = await getDownloadURL(storageRef);
  return downloadURL;
};

export const uploadUserProfileImage = async (image: FileWithBuffer): Promise<string> => {
  try {
    const originalFileName = image.originalname;
    const fileExtension = path.extname(originalFileName);
    const timestamp = Date.now();
    const fileName = `${path.parse(originalFileName).name}_${timestamp}${fileExtension}`;
    
    const imageUrl = await uploadToFirebase(image, fileName, "profileImages");
    return imageUrl;
  } catch (error) {
    console.error(error);
    throw new Error('Failed to upload profile image');
}
};

export const uploadCategoryImage = async (image: FileWithBuffer): Promise<string> => {
    try {
      const originalFileName = image.originalname;
      const fileExtension = path.extname(originalFileName);
      const timestamp = Date.now();
      const fileName = `${path.parse(originalFileName).name}_${timestamp}${fileExtension}`;
      
      const imageUrl = await uploadToFirebase(image, fileName, "categoryImages");
      return imageUrl;
    } catch (error) {
      console.error(error);
      throw new Error('Failed to upload  category image');
    }
};


export const uploadPromotionImages = async (image: FileWithBuffer): Promise<string> => {
try {
    const originalFileName = image.originalname;
    const fileExtension = path.extname(originalFileName);
    const timestamp = Date.now();
    const fileName = `${path.parse(originalFileName).name}_${timestamp}${fileExtension}`;
    
    const imageUrl = await uploadToFirebase(image, fileName, "promotionImages");
    return imageUrl;
} catch (error) {
    console.error(error);
    throw new Error('Failed to upload promotion image');
}
};

export const uploadProductImages = async (image: FileWithBuffer): Promise<string> => {
    try {
        const originalFileName = image.originalname;
        const fileExtension = path.extname(originalFileName);
        const timestamp = Date.now();
        const fileName = `${path.parse(originalFileName).name}_${timestamp}${fileExtension}`;
        
        const imageUrl = await uploadToFirebase(image, fileName, "productImages");
        return imageUrl;
    } catch (error) {
        console.error(error);
        throw new Error('Failed to upload product image');
    }
};