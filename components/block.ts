// Centralized BlockKind type for documents and editor widgets
export type BlockKind = 'text' | 'code' | 'image';

export interface UIBlock {
  documentId: string;
  content: string;
  kind: BlockKind;
  title: string;
  status: 'idle' | 'loading' | 'error' | 'ready';
  isVisible: boolean;
  boundingBox: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
}

