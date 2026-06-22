import { store } from "./state";

// ── Tauri vs Browser detection ──
let invoke: (cmd: string, args?: any) => Promise<any>;
let openDialog: (opts?: any) => Promise<string | null>;
let getCurrentWindow: () => any;

async function initBackend() {
  if (typeof window !== 'undefined' && '__TAURI__' in window) {
    const m = await import("@tauri-apps/api/core");
    const d = await import("@tauri-apps/plugin-dialog");
    const w = await import("@tauri-apps/api/window");
    invoke = m.invoke as any;
    openDialog = d.open as any;
    getCurrentWindow = w.getCurrentWindow as any;
  } else {
    // Browser stubs
    let fileInputEl: HTMLInputElement | null = null;

    openDialog = async (opts?: any): Promise<string | null> => {
      return new Promise(resolve => {
        if (!fileInputEl) {
          fileInputEl = document.createElement('input');
          fileInputEl.type = 'file';
          document.body.appendChild(fileInputEl);
        }
        if (opts?.filters?.[0]?.extensions) {
          fileInputEl.accept = opts.filters[0].extensions.map((e: string) => '.' + e).join(',');
        }
        fileInputEl.onchange = () => {
          const file = fileInputEl!.files?.[0];
          resolve(file ? '/browser/' + file.name : null);
          fileInputEl!.value = '';
        };
        fileInputEl.click();
      });
    };

    invoke = async (cmd: string, args?: any): Promise<any> => {
      if (cmd === 'load_model') {
        const steps = [15, 30, 50, 70, 85, 100];
        for (const pct of steps) {
          await new Promise(r => setTimeout(r, 300 + Math.random() * 400));
          store.setProgress(pct);
        }
        return 'Browser Demo Model v0.1 (mock)';
      }
      if (cmd === 'chat_inference') {
        const prompt = args?.prompt || '';
        await new Promise(r => setTimeout(r, 800 + Math.random() * 1200));
        const responses = [
          `Here's a thought on "${prompt.slice(0, 40)}…"\n\nThis is a browser demo response. For real inference, build and run the Tauri desktop app.`,
          `Interesting question about "${prompt.slice(0, 40)}…"\n\nI'd say… *browser mode* means no actual weights loaded. This is a canned response.\n\n> Run \`npx tauri dev\` for the real thing.`,
        ];
        return {
          text: responses[Math.floor(Math.random() * responses.length)],
          stats: 'browser demo | ~0 tok/s',
        };
      }
      throw new Error(`Unknown command: ${cmd}`);
    };

    getCurrentWindow = () => ({ setAlwaysOnTop: async () => {} });
  }
}

let abortController: AbortController | null = null;

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── DOM refs ──
let logoRing: HTMLElement;
let progressTrack: HTMLElement;
let progressBar: HTMLElement;
let loadStatusText: HTMLElement;
let footDot: HTMLElement;
let footerStatus: HTMLElement;
let input: HTMLTextAreaElement;
let sendBtn: HTMLElement;
let stopBtn: HTMLElement;
let thread: HTMLElement;
let chatScroll: HTMLElement;

function paintGhosts(online: boolean) {
  document.querySelectorAll<HTMLElement>('[data-ghost]').forEach(el => {
    const tpl = document.getElementById('ghost-template') as HTMLTemplateElement;
    el.innerHTML = tpl.innerHTML;
    const body = el.querySelector('.ghost-body');
    const eyeL = el.querySelector('.ghost-eye-l');
    const eyeR = el.querySelector('.ghost-eye-r');
    const browL = el.querySelector('.ghost-brow-l');
    const browR = el.querySelector('.ghost-brow-r');
    const smirk = el.querySelector('.ghost-smirk');
    const flameEl = el.querySelector('.ghost-flame-el');
    const fireGlow = el.querySelector('.ghost-fire-glow');
    if (online) {
      if (body) { body.setAttribute('stroke', '#F97316'); body.setAttribute('fill', 'rgba(249,115,22,0.06)'); }
      if (eyeL) eyeL.setAttribute('fill', '#F97316');
      if (eyeR) eyeR.setAttribute('fill', '#F97316');
      if (browL) browL.setAttribute('stroke', '#F97316');
      if (browR) browR.setAttribute('stroke', '#F97316');
      if (smirk) smirk.setAttribute('stroke', '#F97316');
      if (flameEl) { flameEl.setAttribute('fill', '#FBBF24'); flameEl.setAttribute('opacity', '1'); flameEl.classList.add('ghost-flame'); }
      if (fireGlow) { fireGlow.setAttribute('fill', '#F97316'); fireGlow.setAttribute('opacity', '0.2'); fireGlow.classList.add('ghost-fire-ring'); }
      el.classList.add('ghost-fire-online');
    } else {
      if (body) { body.setAttribute('stroke', '#5B21B6'); body.setAttribute('fill', 'rgba(91,33,182,0.04)'); }
      if (eyeL) eyeL.setAttribute('fill', '#5B21B6');
      if (eyeR) eyeR.setAttribute('fill', '#5B21B6');
      if (browL) browL.setAttribute('stroke', '#5B21B6');
      if (browR) browR.setAttribute('stroke', '#5B21B6');
      if (smirk) smirk.setAttribute('stroke', '#5B21B6');
      if (flameEl) { flameEl.setAttribute('opacity', '0'); flameEl.classList.remove('ghost-flame'); }
      if (fireGlow) { fireGlow.setAttribute('opacity', '0'); fireGlow.classList.remove('ghost-fire-ring'); }
      el.classList.remove('ghost-fire-online');
    }
  });
}

function renderMessage(msg: ReturnType<typeof store.getState>['messageList'][0]): HTMLElement {
  const wrap = document.createElement('div');
  wrap.className = 'msg-enter';
  const ts = formatTime(msg.timestamp);

  if (msg.sender === 'user') {
    wrap.innerHTML = `<div class="flex flex-col items-end gap-0.5 group">
      <div class="max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tr-none" style="background:#FBCFE8;">
        <p class="text-sm font-medium text-white msg-text"></p>
      </div>
      <div class="flex items-center gap-2 px-1">
        <span class="font-mono text-[10px]" style="color:#9CA3AF;">${ts}</span>
        <button class="edit-btn text-[10px] transition-all opacity-0 group-hover:opacity-100" style="color:#FBBF24;">
          <span class="material-symbols-outlined text-[12px]">edit</span>
        </button>
        <button class="del-btn text-[10px] transition-all opacity-0 group-hover:opacity-100" style="color:#FCA5A5;">
          <span class="material-symbols-outlined text-[12px]">close</span>
        </button>
      </div>
    </div>`;
    wrap.querySelector('.msg-text')!.textContent = msg.content;

    wrap.querySelector('.edit-btn')!.addEventListener('click', () => {
      const bubble = wrap.querySelector('.rounded-2xl') as HTMLElement;
      const p = wrap.querySelector('.msg-text') as HTMLElement;
      if (!bubble || !p) return;
      const current = p.textContent || '';
      const ew = document.createElement('div');
      ew.className = 'flex flex-col gap-1';
      const ta = document.createElement('textarea');
      ta.value = current;
      ta.className = 'w-full bg-white/80 border border-purple-200 rounded-xl px-3 py-2 text-sm text-gray-800 font-medium resize-none focus:outline-none focus:border-purple-400';
      ta.rows = 2;
      const br = document.createElement('div');
      br.className = 'flex gap-2 justify-end';
      const sb = document.createElement('button');
      sb.textContent = 'save';
      sb.className = 'px-3 py-0.5 rounded-full text-xs font-semibold text-white';
      sb.style.background = '#22C55E';
      const cb = document.createElement('button');
      cb.textContent = 'cancel';
      cb.className = 'px-3 py-0.5 rounded-full text-xs text-gray-500 hover:bg-gray-100 transition-all';
      br.appendChild(cb); br.appendChild(sb);
      ew.appendChild(ta); ew.appendChild(br);
      p.style.display = 'none';
      bubble.innerHTML = '';
      bubble.appendChild(ew);
      ta.focus();
      cb.addEventListener('click', () => { p.style.display = ''; bubble.innerHTML = ''; bubble.appendChild(p); });
      sb.addEventListener('click', () => {
        const val = ta.value.trim();
        if (val) store.editMessage(msg.id, val);
        p.style.display = ''; bubble.innerHTML = ''; bubble.appendChild(p);
      });
      ta.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sb.click(); }
        if (e.key === 'Escape') cb.click();
      });
    });

    wrap.querySelector('.del-btn')!.addEventListener('click', () => store.deleteMessage(msg.id));

  } else if (msg.sender === 'error') {
    wrap.innerHTML = `<div class="flex flex-col items-start gap-0.5">
      <div class="max-w-[80%] px-4 py-2.5 rounded-2xl" style="background:#FEE2E2;">
        <p class="text-sm text-red-600">${msg.content}</p>
      </div>
      <span class="font-mono text-[10px] pl-1" style="color:#9CA3AF;">${ts}</span>
    </div>`;
  } else {
    const statsHtml = msg.stats ? `<span class="font-mono text-[10px]" style="color:#9CA3AF;"> · ${msg.stats}</span>` : '';
    wrap.innerHTML = `<div class="flex flex-col items-start gap-0.5">
      <div class="max-w-[80%] px-4 py-2.5 rounded-2xl" style="background:#E9D5FF;">
        <p class="text-sm font-medium msg-text" style="color:#374151;"></p>
      </div>
      <div class="flex items-center gap-2 pl-1">
        <span class="font-mono text-[10px]" style="color:#9CA3AF;">${ts}</span>
        ${statsHtml || ''}
      </div>
    </div>`;
    wrap.querySelector('.msg-text')!.textContent = msg.content;
  }
  return wrap;
}

function renderThread() {
  const s = store.getState();
  thread.innerHTML = '';
  if (s.messageList.length === 0) {
    const hint = document.createElement('p');
    hint.className = 'text-center text-sm italic mt-12';
    hint.style.color = '#9CA3AF';
    hint.textContent = s.modelName ? 'Model loaded. Say something.' : 'No model loaded.';
    thread.appendChild(hint);
  } else {
    s.messageList.forEach(m => thread.appendChild(renderMessage(m)));
  }
  chatScroll.scrollTop = chatScroll.scrollHeight;
}

function onStateChange(s: ReturnType<typeof store.getState>) {
  // Logo ring glow (Green→Orange when online)
  if (s.appOnline) {
    logoRing.classList.add('online-glow');
    logoRing.style.borderColor = '#22C55E';
  } else {
    logoRing.classList.remove('online-glow');
    logoRing.style.borderColor = '#E5E7EB';
  }

  // Progress bar
  if (s.modelLoadProgress > 0 && s.modelLoadProgress < 100) {
    progressTrack.classList.remove('hidden');
    progressBar.style.width = s.modelLoadProgress + '%';
    loadStatusText.style.display = 'block';
    loadStatusText.textContent = `Model Loaded: ${s.modelLoadProgress}%`;
  } else if (s.modelLoadProgress >= 100) {
    progressBar.style.width = '100%';
    loadStatusText.textContent = 'Model Loaded: 100%';
    setTimeout(() => {
      loadStatusText.classList.add('fade-out-text');
      setTimeout(() => { loadStatusText.style.display = 'none'; loadStatusText.classList.remove('fade-out-text'); }, 400);
      progressBar.style.width = '0%';
      progressTrack.classList.add('hidden');
    }, 600);
  } else {
    progressBar.style.width = '0%';
    progressTrack.classList.add('hidden');
    loadStatusText.style.display = 'none';
  }

  // Footer
  if (s.appOnline) {
    footDot.style.background = '#22C55E';
    footerStatus.textContent = 'Online';
  } else {
    footDot.style.background = '#9CA3AF';
    footerStatus.textContent = 'Offline';
  }

  // Buttons
  (sendBtn as HTMLButtonElement).disabled = s.isLoading;
  (sendBtn as HTMLElement).style.background = s.isLoading ? '#D1D5DB' : '#22C55E';
  (input as HTMLTextAreaElement).disabled = s.isLoading;
  stopBtn.classList.toggle('hidden', !s.isLoading);
}

async function pickAndLoadModel() {
  const modelPath = await openDialog({
    multiple: false,
    filters: [{ name: 'GGUF model', extensions: ['gguf'] }]
  });
  if (!modelPath) return;

  const log = document.getElementById('load-log');
  if (log) {
    log.innerHTML = '';
    const addLine = (t: string) => { const d = document.createElement('div'); d.textContent = t; log.appendChild(d); };
    addLine('$ zc load ' + modelPath);
    addLine('[Loader] mapping model into memory…');
  }

  store.setProgress(15);
  store.setLoading(true);

  try {
    const modelName = await invoke('load_model', { modelPath });
    store.setProgress(70);
    if (log) { const d = document.createElement('div'); d.textContent = '[Loader] done. Heap for weights: 0 bytes.'; log.appendChild(d); }
    store.setProgress(100);

    const info = document.getElementById('model-info');
    if (info) info.innerHTML = '<p style="color:#5B21B6">' + modelName + '</p>';

    const tlog = document.getElementById('terminal-log');
    if (tlog) { const d = document.createElement('div'); d.textContent = '$ model loaded: ' + modelName; tlog.appendChild(d); tlog.scrollTop = tlog.scrollHeight; }

    setTimeout(() => {
      store.setOnline(true, modelName);
      store.setLoading(false);
      showScreen('screen-chat');
      store.setProgress(0);
    }, 300);
  } catch (err) {
    if (log) { const d = document.createElement('div'); d.textContent = '[Error] ' + err; log.appendChild(d); }
    store.setProgress(0);
    store.setLoading(false);
    setTimeout(() => showScreen('screen-empty'), 2000);
  }
}

async function sendMessage(text: string) {
  store.setLoading(true);
  store.addMessage('user', text);

  const thinking = document.createElement('div');
  thinking.className = 'msg-enter flex flex-col items-start';
  thinking.innerHTML = '<div class="max-w-[80%] px-4 py-2.5 rounded-2xl" style="background:#E9D5FF;"><div class="flex items-center gap-2"><span class="w-1.5 h-1.5 rounded-full animate-pulse" style="background:#5B21B6;"></span><span class="text-sm font-medium italic" style="color:#6B7280;">Thinking</span></div></div>';
  thread.appendChild(thinking);
  chatScroll.scrollTop = chatScroll.scrollHeight;

  abortController = new AbortController();
  let result: { text: string; stats: string };
  try {
    result = await invoke('chat_inference', { prompt: text });
  } catch (err) {
    const e = String(err);
    if (e.includes('cancel') || e.includes('abort')) {
      result = { text: '[Stopped]', stats: '' };
    } else {
      store.setOnline(false);
      result = { text: '[Error] ' + e, stats: '' };
    }
  }

  thinking.remove();
  abortController = null;
  store.setLoading(false);

  if (result.text.startsWith('[Error]')) {
    store.addMessage('error', result.text);
  } else if (result.text !== '[Stopped]') {
    store.addMessage('ai', result.text, result.stats);
  }
}

function showScreen(id: string) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id)?.classList.add('active');
}

async function init() {
  await initBackend();

  logoRing = document.getElementById('logo-ring')!;
  progressTrack = document.getElementById('load-progress-track')!;
  progressBar = document.getElementById('load-progress-bar')!;
  loadStatusText = document.getElementById('load-status-text')!;
  footDot = document.getElementById('footer-dot')!;
  footerStatus = document.getElementById('footer-status')!;
  input = document.getElementById('chat-input') as HTMLTextAreaElement;
  sendBtn = document.getElementById('send-btn')!;
  stopBtn = document.getElementById('btn-stop')!;
  thread = document.getElementById('chat-thread')!;
  chatScroll = document.getElementById('chat-scroll')!;

  paintGhosts(false);

  store.subscribe(onStateChange);
  store.subscribe(() => renderThread());

  // Load model
  const loadBtns = [document.getElementById('load-model-btn-empty')!, document.getElementById('load-model-btn-models')!];
  loadBtns.forEach(b => b?.addEventListener('click', pickAndLoadModel));

  // Nav
  document.getElementById('btn-terminal')?.addEventListener('click', () => showScreen('screen-terminal'));
  document.getElementById('btn-settings')?.addEventListener('click', () => showScreen('screen-settings'));

  // Pin toggle with yellow flash
  document.getElementById('ghost-status-btn')?.addEventListener('click', async () => {
    try {
      const win = getCurrentWindow();
      store.togglePin();
      await win.setAlwaysOnTop(store.getState().isPinned);
      logoRing.classList.remove('pin-flash');
      void logoRing.offsetWidth;
      logoRing.classList.add('pin-flash');
    } catch {}
  });

  // Attach
  document.getElementById('btn-attach')?.addEventListener('click', async () => {
    try {
      const file = await openDialog({ multiple: false, filters: [{ name: 'All files', extensions: ['*'] }] });
      if (file) {
        store.addFile(file);
        input.value += (input.value ? '\n' : '') + '[file:' + file.split('/').pop() + ']';
        input.dispatchEvent(new Event('input'));
      }
    } catch {}
  });

  // Input
  input.addEventListener('input', function () { this.style.height = 'auto'; this.style.height = Math.min(this.scrollHeight, 80) + 'px'; });
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendBtn.click(); } });

  // Stop
  stopBtn.addEventListener('click', () => { abortController?.abort(); abortController = null; });

  // Send
  sendBtn.addEventListener('click', async () => {
    if (store.getState().isLoading) return;
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.style.height = 'auto';
    await sendMessage(text);
    input.focus();
  });

  showScreen('screen-empty');
}

document.addEventListener('DOMContentLoaded', () => { init().catch(console.error); });
