package main

import (
	"errors"
	"log"
	"os"
	"os/exec"
)

func main() {
	log.SetFlags(0)

	go_, ok := os.LookupEnv("GO")
	if !ok {
		go_ = "go"
	}

	cmd := exec.Command(go_, os.Args[1:]...)
	cmd.Env = os.Environ()
	cmd.Env = append(cmd.Env, "GOOS=js", "GOARCH=wasm")
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr

	if len(os.Args) >= 2 {
		if os.Args[1] == "build" {
			err := cmd.Run()
			var exitErr *exec.ExitError
			if errors.As(err, &exitErr) {
				os.Exit(exitErr.ExitCode())
			} else if err != nil {
				log.Fatalf("cmd.Run() %v: %v", cmd, err)
			}

		} else if os.Args[1] == "run" {
		} else {
			err := cmd.Run()
			var exitErr *exec.ExitError
			if errors.As(err, &exitErr) {
				os.Exit(exitErr.ExitCode())
			} else if err != nil {
				log.Fatalf("cmd.Run() %v: %v", cmd, err)
			}
		}
	} else {
		err := cmd.Run()
		var exitErr *exec.ExitError
		if errors.As(err, &exitErr) {
			os.Exit(exitErr.ExitCode())
		} else if err != nil {
			log.Fatalf("cmd.Run() %v: %v", cmd, err)
		}
	}
}
