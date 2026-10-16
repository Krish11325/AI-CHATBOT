import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from './firebase';

export class StorageService {
  /**
   * Upload user profile picture
   */
  static async uploadProfilePicture(uid: string, file: File | Blob): Promise<string> {
    const filename = `avatar_${Date.now()}.jpg`;
    const storageRef = ref(storage, `users/${uid}/profile/${filename}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.warn('Firebase Storage upload failed, generating Data URL fallback:', error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  /**
   * Upload Maths or Physics question image for AI solver
   */
  static async uploadQuestionImage(uid: string, file: File | Blob): Promise<string> {
    const filename = `question_${Date.now()}.jpg`;
    const storageRef = ref(storage, `users/${uid}/questions/${filename}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.warn('Firebase Storage question upload fallback to Data URL:', error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }

  /**
   * Upload educational study material asset
   */
  static async uploadStudyMaterial(uid: string, file: File | Blob, originalName: string): Promise<string> {
    const filename = `${Date.now()}_${originalName}`;
    const storageRef = ref(storage, `users/${uid}/study-material/${filename}`);
    try {
      const snapshot = await uploadBytes(storageRef, file);
      return await getDownloadURL(snapshot.ref);
    } catch (error) {
      console.warn('Firebase Storage study-material upload fallback:', error);
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
    }
  }
}
