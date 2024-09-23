# wasm_exec2

🚚 A better WebAssembly runtime environment for JavaScript

<table align=center><td>

</table>

## Installation

```sh
npm install wasm_exec2
```

## Usage

```sh
GOOS=js GOARCH=wasm go build -o main.wasm main.go
wasm_exec2link -o main.js main.wasm
```

<div><code>task.go</code> (excerpt)</div>

```go
func Build() error {
    cmd := exec.Command("go", "build", "-o", "main.wasm", "main.go")
    cmd.Env = append(os.Environ(), "GOOS=js", "GOARCH=wasm")
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    log.Printf("$ %v", cmd)
    err := cmd.Run()
    if err != nil {
        return err
    }
    cmd = exec.Command("wasm_exec2link", "-o", "main.js", "main.wasm")
    cmd.Stdin = os.Stdin
    cmd.Stdout = os.Stdout
    cmd.Stderr = os.Stderr
    log.Printf("$ %v", cmd)
    err = cmd.Run()
    if err != nil {
        return err
    }
    return nil
}
```

📚 Read more: [Use task.go for your project scripts](https://jcbhmr.me/blog/task-go-project-scripts)

## Development
