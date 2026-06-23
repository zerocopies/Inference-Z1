Z3 Quantum-Flow

A literally zero-copy local LLM inference engine — built from scratch in Rust.

Z3 Quantum-Flow is a custom inference engine for running quantized large language models locally, with no dependency on llama.cpp's high-level API. It implements its own compute graph, KV cache management, batched prefill, and autoregressive decode loop directly on top of ggml primitives.

Built and maintained by [Zero Copies](https://github.com/zerocopies) — engineered for resource-constrained hardware without compromising on correctness.

What makes it different

Most local inference tools are wrappers around llama.cpp. Z3 Quantum-Flow is not. It owns its entire forward pass — from GGUF weight loading through memory-mapped tensors, to the compute graph, KV cache, and token sampling. Every component was designed, reviewed, and hardened through multiple iterations.

Key design decisions:

- **Zero-copy weight loading** — model weights are memory-mapped directly from disk. No heap allocation for weights, ever. The engine wraps the mmap base pointer in a ggml backend buffer.
- **Quantum-KV cache** — a single contiguous backend-allocated buffer for all layers. K and V tensors for each layer are views into this buffer at fixed offsets. Zero-copy writes via `ggml_cpy` into view slices — no round-trip through host memory during decode.
- **Batched prefill** — all prompt tokens processed in a single graph pass with a causal mask. One gallocr plan regardless of prompt length.
- **Per-token decode** — single-token autoregressive decode with graph rebuild per step. View offsets for KV writes are baked in at build time.
- **Sliding window session manager** — when context fills, drops oldest turns and re-prefills from the system prompt, seamlessly.

---

## Architecture

```
GGUF file (mmap)
     │
     ▼
MappedModel (zero-copy weight tensors)
     │
     ▼
ForwardPass (Z3 Quantum-Flow Engine)
  ├── ModelDNA        — hyperparameters from GGUF metadata
  ├── QuantumKV       — contiguous KV cache, view-based writes
  ├── build_prefill_graph()  — batched N-token graph
  ├── build_graph()          — single-token decode graph
  └── cleanup_graph_resources() — single-point teardown
     │
     ▼
generate.rs (sliding window session + sampling)
     │
     ▼
qflow binary / qflow-server HTTP API
```

---

## Performance

Tested on a ThinkPad X240 (Intel Core i5-4300U, 8GB RAM, SSD) — 12-year-old hardware.

| Model | Prefill | Decode | Context |
|-------|---------|--------|---------|
| Llama 3.1 8B Q4_K_M | ~11s / 28 tokens | **1.49 tok/s** | 512 |

> Metrics table will be expanded with Phi-3-mini and Qwen2.5-Coder results.

**Improvement over initial Z1 baseline:**
- Prefill: 32,911ms → 11,309ms (**3x faster**) after batched prefill
- Decode: 0.83 → 1.49 tok/s (**1.8x faster**) after graph correctness fixes

---

## Models supported

| Model | Status |
|-------|--------|
| Llama 3.1 8B (Q4_K_M) | ✅ Working |
| Qwen2.5-Coder 1.5B / 3B | 🔧 In progress (QKV bias + GQA fix needed) |
| Phi-3-mini | 🔧 In progress (fused QKV split needed) |

---

## Getting started

**Requirements:**
- Rust 1.75+
- Linux (tested on Linux Mint)
- A GGUF model file

**Build:**
```bash
git clone https://github.com/zerocopies/Z3-Quantum-Flow
cd Z3-Quantum-Flow/z1-core
cargo build --release --bin qflow
```

**Run:**
```bash
# Default 512 context
./target/release/qflow /path/to/model.gguf

# Custom context size
Z1_CTX_SIZE=2048 ./target/release/qflow /path/to/model.gguf
```

**Commands inside the chat:**
```
/reset   — clear conversation memory and KV cache
/exit    — quit
```

---

## HTTP server

Z3 Quantum-Flow also ships a standalone HTTP inference server:

```bash
cargo build --release --bin qflow-server
./target/release/qflow-server
```

Endpoints:
```
GET  /health          — liveness check
POST /load_model      — load a GGUF file
POST /chat            — run inference, returns text + stats
```

Compatible with the included `z1-web.html` browser UI.

---

## Project structure

```
Z3-Quantum-Flow/
├── z1-core/
│   ├── src/
│   │   ├── graph.rs       — Z3 Quantum-Flow engine (ForwardPass)
│   │   ├── generate.rs    — autoregressive loop + sliding window session
│   │   ├── loader.rs      — GGUF loader + zero-copy mmap
│   │   ├── mapper.rs      — memory mapper
│   │   ├── tokenizer.rs   — BPE tokenizer from GGUF metadata
│   │   ├── logits.rs      — sampling (temperature, top-p, repetition penalty)
│   │   ├── gguf.rs        — GGUF format parser
│   │   ├── ggml_ffi.rs    — raw ggml bindings
│   │   └── bin/
│   │       └── z1-server.rs  — HTTP inference server
│   └── Cargo.toml
├── ZeroCopies/            — Tauri desktop UI (in development)
├── z1-web.html            — browser chat UI
└── README.md
```

---

## Roadmap

- [ ] Phi-3 fused QKV support
- [ ] Qwen2.5 QKV bias + GQA broadcasting
- [ ] Buzz Router — governance and multi-model routing layer
- [ ] NEXUS — multi-agent coordination system
- [ ] Batched decode (multiple sequences)
- [ ] Used-context attention optimization (attend to head, not full n_ctx)
- [ ] Context size CLI argument

---

## License

Apache 2.0 — see [LICENSE](LICENSE)

---

*Part of the Zero Copies product family — building AI infrastructure for the real world.*
