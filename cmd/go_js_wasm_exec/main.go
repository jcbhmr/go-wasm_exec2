package main

import (
	"errors"
	"log"
	"os"
	"os/exec"

	"github.com/google/shlex"
)

func main() {
	log.SetFlags(0)

	goJSRuntimeArgs, err := shlex.Split(os.Getenv("GOJSRUNTIMEARGS"))
	if err != nil {
		log.Fatalf("shlex.Split() %v: %v", os.Getenv("GOJSRUNTIMEARGS"), err)
	}

	var cmd *exec.Cmd
	switch os.Getenv("GOJSRUNTIME") {
	case "node":
		args := []string{}
		args = append(args, "--experimental-default-type=module")
		args = append(args, goJSRuntimeArgs...)
		args = append(args, os.Args[1:]...)
		cmd = exec.Command("node", args...)
	case "deno":
		args := []string{}
		args = append(args, "run", "--allow-all")
		args = append(args, goJSRuntimeArgs...)
		args = append(args, os.Args[1:]...)
		cmd = exec.Command("deno", args...)
	case "bun":
		args := []string{}
		args = append(args, "run")
		args = append(args, goJSRuntimeArgs...)
		args = append(args, os.Args[1:]...)
		cmd = exec.Command("bun", args...)
	default:
		log.Fatalf("Unknown Go JavaScript runtime specified: %v", os.Getenv("GOJSRUNTIME"))
	}
	cmd.Stdin = os.Stdin
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	err = cmd.Run()
	var exitErr *exec.ExitError
	if errors.As(err, &exitErr) {
		os.Exit(exitErr.ExitCode())
	} else if err != nil {
		log.Fatalf("cmd.Run() %v: %v", cmd, err)
	}
}
