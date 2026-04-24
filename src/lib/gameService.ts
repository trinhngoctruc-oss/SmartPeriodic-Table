import { useState, useEffect } from 'react';
import { 
  onSnapshot, 
  doc, 
  setDoc, 
  updateDoc, 
  getDoc, 
  serverTimestamp, 
  deleteDoc 
} from 'firebase/firestore';
import { db, auth } from './firebase';
import { signInAnonymously, onAuthStateChanged, User, Auth } from 'firebase/auth';
import { nanoid } from 'nanoid';

interface FirestoreErrorInfo {
  error: string;
  operationType: 'create' | 'update' | 'delete' | 'list' | 'get' | 'write';
  path: string | null;
  authInfo: {
    userId: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    providerInfo: { providerId: string; displayName: string; email: string; }[];
  }
}

const handleFirestoreError = (error: any, operationType: any, path: string | null = null) => {
  if (error.code === 'resource-exhausted') {
    throw new Error("Hạn mức (Quota) của dự án đã hết. Vui lòng quay lại sau ít giờ hoặc ngày mai khi hạn mức được đặt lại.");
  }
  
  if (error.code === 'permission-denied') {
    const currentUser = auth.currentUser;
    const errorInfo: FirestoreErrorInfo = {
      error: error.message,
      operationType,
      path,
      authInfo: {
        userId: currentUser?.uid || 'not-authenticated',
        email: currentUser?.email || 'no-email',
        emailVerified: currentUser?.emailVerified || false,
        isAnonymous: currentUser?.isAnonymous || false,
        providerInfo: currentUser?.providerData.map(p => ({
          providerId: p.providerId,
          displayName: p.displayName || '',
          email: p.email || ''
        })) || []
      }
    };
    throw new Error(JSON.stringify(errorInfo, null, 2));
  }
  throw error;
};

export interface Player {
  userId: string;
  name: string;
  score: number;
  ready: boolean;
  lastActive: any;
  hasFinished?: boolean;
  finishTime?: number;
}

export interface GameRoom {
  roomId: string;
  hostId?: string;
  status: 'waiting' | 'playing' | 'finished';
  players: Record<string, Player>;
  questions: any[];
  startTime: number | null;
  duration: number; // in seconds
  createdAt: any;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
        setAuthError(null);
      } else {
        signInAnonymously(auth).catch(err => {
          console.error("Firebase Auth Error:", err);
          if (err.code === 'auth/admin-restricted-operation') {
            setAuthError('Tính năng Đăng nhập ẩn danh chưa được bật trong Firebase Console.');
          } else {
            setAuthError(err.message);
          }
        });
      }
    });
    return unsub;
  }, []);

  return { user, authError };
};

export const registerUser = async (userId: string, displayName: string) => {
  try {
    await setDoc(doc(db, 'users', userId), {
      userId,
      displayName,
      createdAt: serverTimestamp()
    });
    localStorage.setItem('periodic_app_display_name', displayName);
  } catch (err) {
    handleFirestoreError(err, 'create', `users/${userId}`);
  }
};

export const createRoom = async (creatorId: string, creatorName: string, questions: any[]) => {
  const roomId = nanoid(5).toUpperCase();
  const roomData: GameRoom = {
    roomId,
    hostId: creatorId,
    status: 'waiting',
    players: {
      [creatorId]: {
        userId: creatorId,
        name: creatorName,
        score: 0,
        ready: true,
        hasFinished: false,
        lastActive: Date.now()
      }
    },
    questions,
    startTime: null,
    duration: 300, // 300 seconds (5 minutes)
    createdAt: serverTimestamp()
  };
  try {
    await setDoc(doc(db, 'rooms', roomId), roomData);
    return roomId;
  } catch (err) {
    handleFirestoreError(err, 'create', `rooms/${roomId}`);
    return roomId;
  }
};

export const joinRoom = async (roomId: string, userId: string, userName: string) => {
  const roomRef = doc(db, 'rooms', roomId);
  try {
    const snap = await getDoc(roomRef);
    if (!snap.exists()) throw new Error('Không tìm thấy phòng này!');
    
    const data = snap.data() as GameRoom;
    if (data.status !== 'waiting') throw new Error('Phòng đang chơi hoặc đã kết thúc!');
    if (Object.keys(data.players).length >= 2) throw new Error('Phòng đã đủ người!');

    await updateDoc(roomRef, {
      [`players.${userId}`]: {
        userId,
        name: userName,
        score: 0,
        ready: true,
        hasFinished: false,
        lastActive: Date.now()
      },
      status: 'playing', // Start immediately when 2nd joins
      startTime: serverTimestamp(),
      duration: 300 // Ensure consistent duration
    });
  } catch (err) {
    handleFirestoreError(err, 'update', `rooms/${roomId}`);
  }
};

export const updateScore = async (roomId: string, userId: string, newScore: number) => {
  const roomRef = doc(db, 'rooms', roomId);
  try {
    await updateDoc(roomRef, {
      [`players.${userId}.score`]: newScore,
      [`players.${userId}.lastActive`]: Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, 'update', `rooms/${roomId}`);
  }
};

export const setPlayerFinished = async (roomId: string, userId: string, finalScore: number) => {
  const roomRef = doc(db, 'rooms', roomId);
  try {
    await updateDoc(roomRef, {
      [`players.${userId}.hasFinished`]: true,
      [`players.${userId}.score`]: finalScore,
      [`players.${userId}.finishTime`]: Date.now(),
      [`players.${userId}.lastActive`]: Date.now()
    });
  } catch (err) {
    handleFirestoreError(err, 'update', `rooms/${roomId}`);
  }
};

export const startGame = async (roomId: string, players: Record<string, Player>) => {
  const roomRef = doc(db, 'rooms', roomId);
  const resetPlayers: Record<string, any> = {};
  
  Object.keys(players).forEach(uid => {
    resetPlayers[`players.${uid}.score`] = 0;
    resetPlayers[`players.${uid}.hasFinished`] = false;
    resetPlayers[`players.${uid}.finishTime`] = 0;
  });

  try {
    await updateDoc(roomRef, { 
      status: 'playing',
      startTime: serverTimestamp(),
      ...resetPlayers
    });
  } catch (err) {
    handleFirestoreError(err, 'update', `rooms/${roomId}`);
  }
};

export const finishGame = async (roomId: string) => {
  const roomRef = doc(db, 'rooms', roomId);
  try {
    await updateDoc(roomRef, { status: 'finished' });
  } catch (err) {
    handleFirestoreError(err, 'update', `rooms/${roomId}`);
  }
};
