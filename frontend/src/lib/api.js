import axiosInstance from "./axios";

export const getUser = async () => {
  try {
    const response = await axiosInstance.get("/user");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get user");
  }
};

export const logout = async () => {
  try {
    await axiosInstance.get("/auth/logout");
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
};

export const login = async ({ email, password }) => {
  try {
    const response = await axiosInstance.post("/auth/login", {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Login failed");
  }
};

export const register = async (data) => {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Registration failed");
  }
};

export const verifyEmail = async (code) => {
  try {
    const response = await axiosInstance.get(`/auth/verify-email/${code}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Verification failed");
  }
};

export const resendVerificationEmail = async () => {
  try {
    const response = await axiosInstance.post(`/auth/send-verification-email`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to resend verification email"
    );
  }
};

export const sendResetPasswordEmail = async (email) => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", {
      email,
    });

    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to send reset password email"
    );
  }
};

export const resetPassword = async ({ verificationCode, password }) => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", {
      verificationCode,
      password,
    });
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to reset password"
    );
  }
};

export const getSessions = async () => {
  try {
    const response = await axiosInstance.get("/sessions");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get sessions");
  }
};

export const deleteSession = async (sessionId) => {
  try {
    const response = await axiosInstance.delete(`/sessions/${sessionId}`);
    return response;
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to delete session"
    );
  }
};

export const getNotesWithFolder = async (folderId) => {
  try {
    const response = await axiosInstance.get(`/notes/folder/${folderId}`);
    console.log("FUCK", response);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get notes");
  }
};

export const getNotesWithoutFolder = async () => {
  try {
    const response = await axiosInstance.get("/notes/no-folder");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get notes");
  }
};

export const getNote = async (noteId) => {
  try {
    const response = await axiosInstance.get(`/notes/${noteId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get note");
  }
};

export const getNoteFolders = async () => {
  try {
    const response = await axiosInstance.get("/folders/note");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get folders");
  }
};

export const createNote = async (data) => {
  try {
    const response = await axiosInstance.post("/notes", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create note");
  }
};

export const updateNote = async ({ id, content, title }) => {
  try {
    const response = await axiosInstance.put(`/notes/${id}`, {
      content,
      title,
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update note");
  }
};

export const addNoteToFolder = async ({ folderId, name, type, note }) => {
  try {
    const response = await axiosInstance.put(`/folders/add-note/${folderId}`, {
      name,
      type,
      note,
    });

    const response2 = await axiosInstance.put(`/notes/add-folder`, {
      noteId: note[0],
      folderId: folderId,
    });

    return { response, response2 };
  } catch (error) {
    throw new Error(
      error.response?.data?.message || "Failed to update note folder"
    );
  }
};

export const createNoteFolder = async (data) => {
  try {
    const response = await axiosInstance.post("/folders", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create folder");
  }
};

export const getJournalMood = async () => {
  try {
    const response = await axiosInstance.get("/journals/mood");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get mood");
  }
};

export const getJournalFolder = async () => {
  try {
    const response = await axiosInstance.get("/folders/journal");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get folders");
  }
};

export const getAllMoods = async () => {
  try {
    const response = await axiosInstance.get("/moods");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get moods");
  }
};

export const createEntry = async (data) => {
  try {
    const response = await axiosInstance.post("/journals", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to add entry");
  }
};

export const updateEntry = async ({ entryId, data }) => {
  try {
    console.log(`/journals/${entryId}`);
    const response = await axiosInstance.put(`/journals/${entryId}`, data);
    return response;
  } catch (error) {
    console.log(error);
    throw new Error(error.response?.data?.message || "Failed to edit entry");
  }
};

export const getAllEntries = async () => {
  try {
    const response = await axiosInstance.get("/journals");
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get entries");
  }
};

export const getEntriesWithFolder = async (folderId) => {
  try {
    const response = await axiosInstance.get(`/journals/folder/${folderId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get entries");
  }
};

export const getEntry = async (entryId) => {
  try {
    const response = await axiosInstance.get(`/journals/${entryId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get entry");
  }
};

export const deleteEntry = async (entryId) => {
  try {
    const response = await axiosInstance.delete(`/journals/${entryId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete entry");
  }
};

export const createMood = async (data) => {
  try {
    const response = await axiosInstance.post("/moods", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create mood");
  }
};

export const updateMood = async ({ moodId, data }) => {
  try {
    const response = await axiosInstance.put(`/moods/${moodId}`, data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update mood");
  }
};

export const deleteMood = async (moodId) => {
  try {
    const response = await axiosInstance.delete(`/moods/${moodId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete mood");
  }
};

export const createFolder = async (data) => {
  try {
    const response = await axiosInstance.post("/folders", data);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create folder");
  }
};

export const getFolder = async (folderId) => {
  try {
    const response = await axiosInstance.get(`/folders/${folderId}`);
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to get folder");
  }
};

export const updateFolder = async ({ folderId, name, colour }) => {
  try {
    const response = await axiosInstance.put(`/folders/${folderId}`, {
      name,
      colour,
    });
    return response;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update folder");
  }
};

export const addJournalToFolder = async ({ folderId, journalId, journal }) => {
  console.log("API call params:", { folderId, journalId, journal });

  try {
    // First update folder
    const response = await axiosInstance.put(
      `/folders/add-journal/${folderId}`,
      { journal }
    );

    // Then update journal
    const response2 = await axiosInstance.put(
      `/journals/add-folder/${journalId}`,
      { folderId }
    );

    return { folder: response.data, journal: response2.data };
  } catch (error) {
    console.error("API error:", error);
    throw error;
  }
};
