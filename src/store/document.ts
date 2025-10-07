import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./index.ts";
import type { DocumentInfo } from "@/api/document.ts";

interface DocumentState {
    documents: DocumentInfo[];
    currentFolderId: string | null;
    selectedDocuments: string[];
    loading: boolean;
}

const initialState: DocumentState = {
    documents: [],
    currentFolderId: null,
    selectedDocuments: [],
    loading: false,
};

export const documentSlice = createSlice({
    name: "document",
    initialState,
    reducers: {
        setDocuments: (state, action: PayloadAction<DocumentInfo[]>) => {
            state.documents = action.payload;
        },
        addDocument: (state, action: PayloadAction<DocumentInfo>) => {
            state.documents.push(action.payload);
        },
        updateDocument: (state, action: PayloadAction<DocumentInfo>) => {
            const index = state.documents.findIndex(doc => doc.id === action.payload.id);
            if (index !== -1) {
                state.documents[index] = action.payload;
            }
        },
        removeDocument: (state, action: PayloadAction<string>) => {
            state.documents = state.documents.filter(doc => doc.id !== action.payload);
        },
        setCurrentFolder: (state, action: PayloadAction<string | null>) => {
            state.currentFolderId = action.payload;
        },
        setSelectedDocuments: (state, action: PayloadAction<string[]>) => {
            state.selectedDocuments = action.payload;
        },
        toggleSelectDocument: (state, action: PayloadAction<string>) => {
            const index = state.selectedDocuments.indexOf(action.payload);
            if (index === -1) {
                state.selectedDocuments.push(action.payload);
            } else {
                state.selectedDocuments.splice(index, 1);
            }
        },
        clearSelectedDocuments: (state) => {
            state.selectedDocuments = [];
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

// Selectors
export const selectDocuments = (state: RootState) => state.document.documents;
export const selectCurrentFolderId = (state: RootState) => state.document.currentFolderId;
export const selectSelectedDocuments = (state: RootState) => state.document.selectedDocuments;
export const selectLoading = (state: RootState) => state.document.loading;

// 选择当前文件夹下的文档
export const selectCurrentFolderDocuments = (state: RootState) => {
    const currentFolderId = state.document.currentFolderId;
    return state.document.documents.filter(
        doc => doc.parentId === currentFolderId
    );
};

// 选择文件夹
export const selectFolders = (state: RootState) => {
    return state.document.documents.filter(doc => doc.type === "folder");
};

// 选择文件
export const selectFiles = (state: RootState) => {
    return state.document.documents.filter(doc => doc.type === "file");
};

export const {
    setDocuments,
    addDocument,
    updateDocument,
    removeDocument,
    setCurrentFolder,
    setSelectedDocuments,
    toggleSelectDocument,
    clearSelectedDocuments,
    setLoading,
} = documentSlice.actions;

export default documentSlice.reducer;
