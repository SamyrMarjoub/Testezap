import { useEffect, useState } from "react";
import { auth, db } from "../../services/firebaseClient";
import { addDoc, collection, deleteDoc, doc, DocumentData, getDocs, onSnapshot, orderBy, query, QuerySnapshot, runTransaction, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";

// Função para ouvir as últimas mensagens de amigos
export const subscribeToLastMessages = (uid: string, friendsList: any[], callback: (data: any) => void) => {
  if (!uid || friendsList.length === 0) return () => { };

  const unsubscribeFunctions: (() => void)[] = [];

  for (const friend of friendsList) {
    const chatId = [uid, friend.uid].sort().join("_");
    const chatRef = doc(db, `chats/${chatId}`);

    const unsubscribe = onSnapshot(chatRef, (docSnap) => {
      const newLastMessages: Record<string, { lastMessage: string; time: string }> = {};

      if (docSnap.exists()) {
        const data = docSnap.data();
        newLastMessages[friend.uid] = {
          lastMessage: data.lastMessage || "",
          time: data.lastMessageTimestamp ? new Date(data.lastMessageTimestamp.toDate()).toLocaleTimeString() : "",
        };
      } else {
        newLastMessages[friend.uid] = { lastMessage: "", time: "" };
      }

      callback((prev: any) => ({ ...prev, ...newLastMessages }));
    });

    unsubscribeFunctions.push(unsubscribe);
  }

  // Retorna uma função para limpar os listeners ao desmontar
  return () => unsubscribeFunctions.forEach((unsubscribe) => unsubscribe());
};

export const subscribeToFriendships = (uid: string, callback: (data: any) => void) => {
  if (!uid) return () => { };

  // Processa os dados das amizades
  const processFriendships = async (snapshot1: any[] | QuerySnapshot<DocumentData, DocumentData>, snapshot2: any[] | QuerySnapshot<DocumentData, DocumentData>) => {
    const friendIds = new Set();

    snapshot1.forEach((doc) => friendIds.add(doc.data().user2));
    snapshot2.forEach((doc) => friendIds.add(doc.data().user1));

    if (friendIds.size === 0) return;

    // Observar mudanças na coleção "users"
    const usersQuery = query(collection(db, "users"), where("uid", "in", Array.from(friendIds)));

    const unsubscribeUsers = onSnapshot(usersQuery, (usersSnapshot) => {
      const friendsData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(friendsData);
    });

    return unsubscribeUsers;
  };

  // Observar mudanças nas amizades
  const friendshipsQuery1 = query(collection(db, "friendships"), where("status", "==", "accepted"), where("user1", "==", uid));
  const friendshipsQuery2 = query(collection(db, "friendships"), where("status", "==", "accepted"), where("user2", "==", uid));

  const unsubscribe1 = onSnapshot(friendshipsQuery1, (snapshot1) => {
    const unsubscribe2 = onSnapshot(friendshipsQuery2, (snapshot2) => {
      processFriendships(snapshot1, snapshot2);
    });

    return () => unsubscribe2();
  });

  return () => unsubscribe1();
};

export const sendMessage = async (chatId: string, senderId: any, receiverId: string | number, content: string, type = "text") => {
  if (!chatId || !senderId || !receiverId || !content) return;

  try {
    const messagesRef = collection(db, `chats/${chatId}/messages`);

    const newMessage = {
      sender: senderId,
      receiver: receiverId,
      content,
      timestamp: serverTimestamp(),
      status: "sent",
      type,
    };

    await addDoc(messagesRef, newMessage);

    // Referência para o chat
    const chatRef = doc(db, `chats/${chatId}`);

    // Atualiza lastMessage e unreadMessages no chat
    await runTransaction(db, async (transaction) => {
      const chatDoc = await transaction.get(chatRef);

      if (!chatDoc.exists()) {
        transaction.set(chatRef, {
          lastMessage: content,
          lastMessageTimestamp: serverTimestamp(),
          lastSender: senderId,
          unreadMessages: { [receiverId]: 1 },
        });
      } else {
        const chatData = chatDoc.data();
        const currentUnread = chatData.unreadMessages?.[receiverId] || 0;

        transaction.update(chatRef, {
          lastMessage: content,
          lastMessageTimestamp: serverTimestamp(),
          lastSender: senderId,
          [`unreadMessages.${receiverId}`]: currentUnread + 1,
        });
      }
    });
  } catch (error) {
    console.error("Erro ao enviar mensagem:", error);
  }
};

export const useChatMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    if (!chatId) return;

    const messagesQuery = query(collection(db, `chats/${chatId}/messages`), orderBy("timestamp", "asc"));

    const unsubscribe = onSnapshot(messagesQuery, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setMessages(newMessages);
    });

    return () => unsubscribe(); // Remove listener ao desmontar
  }, [chatId]);

  return messages;
};

export const fetchFriendRequests = (setRequests) => {
  const uid = auth.currentUser?.uid;
  if (!uid) return;

  try {
    const q = query(collection(db, "friendships"), where("user2", "==", uid), where("status", "==", "pending"));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const requests = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setRequests(requests);
    });

    return unsubscribe; // Retorne a função de cleanup para parar a escuta quando necessário
  } catch (error) {
    console.error("Erro ao buscar solicitações de amizade:", error);
  }
};

// 📌 Buscar usuário por username
export const handleSearch = async (search: string, uid: string, setUserFound: (user: any) => void, setLoading: (loading: boolean) => void) => {
  if (!search) return;
  setLoading(true);

  const q = query(collection(db, "users"), where("username", "==", search));
  const querySnapshot = await getDocs(q);

  if (!querySnapshot.empty) {
    const userData = querySnapshot.docs[0].data();
    setUserFound(userData);

    // Verifica se já são amigos
    const friendId = userData.uid;
    const friendshipQuery = query(
      collection(db, "friendships"),
      where("status", "==", "accepted"),
      where("user1", "in", [uid, friendId]),
      where("user2", "in", [uid, friendId])
    );

    const friendshipSnapshot = await getDocs(friendshipQuery);

    if (!friendshipSnapshot.empty) {
      alert("Este usuário já está na sua lista de amigos!");
      setUserFound(null);
    }
  } else {
    setUserFound(null);
  }

  setLoading(false);
};

// 📌 Enviar pedido de amizade
export const handleAddFriend = async (uid: string, userData: any, userFound: any) => {
  if (!uid || !userFound) return;

  const friendId = userFound.uid;

  try {
    await setDoc(doc(db, "friendships", `${uid}_${friendId}`), {
      user1: uid,
      user1Name: userData.username,
      user1Avatar: userData.profilePicture || "",
      user2: friendId,
      user2Name: userFound.username,
      user2Avatar: userFound.profilePicture || "",
      status: "pending",
    });
    alert("Pedido de amizade enviado!");
  } catch (error) {
    console.error("Erro ao adicionar amigo:", error);
  }
};

// 📌 Aceitar pedido de amizade
export const handleAcceptRequest = async (requestId: string, setFriendRequests: (requests: any[]) => void, friendRequests: any[]) => {
  try {
    await updateDoc(doc(db, "friendships", requestId), { status: "accepted" });
    setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
    alert("Pedido de amizade aceito!");
  } catch (error) {
    console.error("Erro ao aceitar pedido de amizade:", error);
  }
};

// 📌 Rejeitar pedido de amizade
export const handleRejectRequest = async (requestId: string, setFriendRequests: (requests: any[]) => void, friendRequests: any[]) => {
  try {
    await deleteDoc(doc(db, "friendships", requestId));
    setFriendRequests(friendRequests.filter((req) => req.id !== requestId));
    alert("Pedido de amizade rejeitado!");
  } catch (error) {
    console.error("Erro ao rejeitar pedido de amizade:", error);
  }
};

