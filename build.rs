/// Z.1 build.rs
///
/// Compiles the ggml (b3534) C sources and links them into the binary.
/// Z.1's forward pass (graph.rs) is a hand-rolled ggml compute graph — it
/// does NOT use llama.cpp's C++ API (llama_decode, llama_tokenize, etc.),
/// so only the ggml C layer is compiled. This keeps the build fast, the
/// binary lean, and avoids a long list of unused-function warnings from
/// llama.cpp's C++ sources (unicode.cpp, common.cpp, grammar-parser.cpp, ...).
///
/// b3534 directory layout (only what we need):
///   ggml/src/     — C sources (ggml.c, ggml-alloc.c, ggml-backend.c, ggml-quants.c, ggml-aarch64.c)
///   ggml/include/ — ggml headers
///   include/      — llama.h (included transitively by some ggml headers)
///
/// Setup (run once):
///   git clone --depth 1 --branch b3534 https://github.com/ggerganov/llama.cpp vendor/llama.cpp
fn main() {
    let llama_dir = std::path::PathBuf::from("vendor/llama.cpp");
    let ggml_src  = llama_dir.join("ggml/src");
    let ggml_inc  = llama_dir.join("ggml/include");
    let llama_inc = llama_dir.join("include");

    if !ggml_src.exists() {
        panic!(
            "[Z.1] vendor/llama.cpp/ggml/src not found!\n\
             Make sure the checkout exists:\n\
             git clone --depth 1 --branch b3534 https://github.com/ggerganov/llama.cpp vendor/llama.cpp"
        );
    }

    // ── GGML C sources ────────────────────────────────────────────────────────
    let c_sources = [
        "ggml.c",
        "ggml-alloc.c",
        "ggml-backend.c",
        "ggml-quants.c",
        "ggml-aarch64.c",
    ];

    let mut c_build = cc::Build::new();
    c_build
        .include(&ggml_src)
        .include(&ggml_inc)
        .include(&llama_inc)
        .flag_if_supported("-O3")
        .flag_if_supported("-march=native")   // AVX2 + FMA on X240 Haswell and similar
        .flag_if_supported("-DNDEBUG")
        .flag_if_supported("-D_GNU_SOURCE")    // required for NUMA affinity macros
        .flag_if_supported("-Wno-unused-function"); // quiet unused statics in ggml internals

    for src in &c_sources {
        let file = ggml_src.join(src);
        if file.exists() {
            c_build.file(&file);
        } else {
            eprintln!("[Z.1] WARNING: missing ggml source {}", src);
        }
    }

    c_build.compile("ggml_c");

    println!("cargo:rustc-link-lib=static=ggml_c");
    println!("cargo:rerun-if-changed=vendor/llama.cpp");
    println!("cargo:rerun-if-changed=build.rs");
}
