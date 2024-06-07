//go:build ignore

package main

import (
	"log"
	"os"
	"os/exec"
	"path/filepath"
)

func main() {
	log.SetFlags(log.Lshortfile)

	cmd := exec.Command("npm", "run", "build")
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	log.Printf("$ %s", cmd)
	err := cmd.Run()
	if err != nil {
		log.Fatalf("cmd.Run() %s: %v", cmd, err)
	}

	cmd = exec.Command("go", "env", "GOMOD")
	gomod, err := cmd.Output()
	if err != nil {
		log.Fatalf("cmd.Output() %s: %v", cmd, err)
	}
	root := filepath.Dir(string(gomod))
	path := filepath.Join(root, "packages/gort0-js-wasm/dist/gort0-js-wasm.js")
	gort0_js_wasm_js, err := os.ReadFile(path)
	if err != nil {
		log.Fatalf("os.ReadFile() %s: %v", path, err)
	}
	path = "gort0-js-wasm.js"
	err = os.WriteFile(path, gort0_js_wasm_js, 0644)
	if err != nil {
		log.Fatalf("os.WriteFile() %s: %v", path, err)
	}
	log.Printf("Created %s", path)
}
