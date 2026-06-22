export interface Message {
  id: string;
  content: string;
  timestamp: number;
  sender: 'user' | 'ai' | 'error';
  editable: boolean;
  stats?: string;
}

export interface FileAttachment {
  id: string;
  path: string;
  name: string;
}

export interface AppState {
  appOnline: boolean;
  modelLoadProgress: number;
  messageList: Message[];
  isLoading: boolean;
  isPinned: boolean;
  attachedFiles: FileAttachment[];
  modelName: string | null;
}

type Listener = (state: AppState) => void;

let nextId = 1;
function uid(): string { return 'm' + (nextId++); }

const defaultState: AppState = {
  appOnline: false,
  modelLoadProgress: 0,
  messageList: [],
  isLoading: false,
  isPinned: false,
  attachedFiles: [],
  modelName: null,
};

class Store {
  private state: AppState;
  private listeners = new Set<Listener>();

  constructor(initial?: Partial<AppState>) {
    this.state = { ...defaultState, ...initial };
  }

  getState(): AppState {
    return this.state;
  }

  subscribe(fn: Listener): () => void {
    this.listeners.add(fn);
    fn(this.state);
    return () => this.listeners.delete(fn);
  }

  private emit() {
    this.listeners.forEach(fn => fn(this.state));
  }

  setOnline(online: boolean, modelName?: string) {
    this.state = {
      ...this.state,
      appOnline: online,
      modelName: online ? (modelName || 'Model loaded') : null,
    };
    this.emit();
  }

  setProgress(pct: number) {
    this.state = { ...this.state, modelLoadProgress: pct };
    this.emit();
  }

  setLoading(v: boolean) {
    this.state = { ...this.state, isLoading: v };
    this.emit();
  }

  togglePin() {
    this.state = { ...this.state, isPinned: !this.state.isPinned };
    this.emit();
  }

  addMessage(sender: Message['sender'], content: string, stats?: string) {
    const msg: Message = {
      id: uid(),
      content,
      timestamp: Date.now(),
      sender,
      editable: sender === 'user',
      stats,
    };
    this.state = { ...this.state, messageList: [...this.state.messageList, msg] };
    this.emit();
  }

  editMessage(id: string, content: string) {
    this.state = {
      ...this.state,
      messageList: this.state.messageList.map(m =>
        m.id === id ? { ...m, content } : m
      ),
    };
    this.emit();
  }

  deleteMessage(id: string) {
    this.state = {
      ...this.state,
      messageList: this.state.messageList.filter(m => m.id !== id),
    };
    this.emit();
  }

  addFile(path: string) {
    const name = path.split('/').pop() || path;
    const file: FileAttachment = { id: uid(), path, name };
    this.state = {
      ...this.state,
      attachedFiles: [...this.state.attachedFiles, file],
    };
    this.emit();
  }

  removeFile(id: string) {
    this.state = {
      ...this.state,
      attachedFiles: this.state.attachedFiles.filter(f => f.id !== id),
    };
    this.emit();
  }

  clearMessages() {
    this.state = { ...this.state, messageList: [] };
    this.emit();
  }
}

export const store = new Store();
