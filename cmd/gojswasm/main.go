package main

import (
	"compress/gzip"
	_ "embed"
	"encoding/base64"
	"flag"
	"fmt"
	"io"
	"log"
	"os"
	"rsc.io/getopt"
)

//go:generate go run ./gen.go
//go:embed gort0-js-wasm.js
var gort0_js_wasm_js []byte

// dst <- (str + (gz <- b64 <- src) + str)
func DoIt(dst io.Writer, src io.Reader) error {
	_, err := dst.Write([]byte(`const __APP_WASM_GZ_BASE64__="`))
	if err != nil {
		return err
	}

	b64W := base64.NewEncoder(base64.StdEncoding, dst)
	defer b64W.Close()
	gzW := gzip.NewWriter(b64W)
	defer gzW.Close()

	_, err = io.Copy(gzW, src)
	if err != nil {
		return err
	}
	err = gzW.Close()
	if err != nil {
		return err
	}
	err = b64W.Close()
	if err != nil {
		return err
	}

	_, err = dst.Write([]byte(`";` + "\n" + string(gort0_js_wasm_js)))
	if err != nil {
		return err
	}

	return nil
}

var inPlace = flag.Bool("i", false, "edit file in-place")
var inFilePath string
var inFile *os.File
var outFilePath = flag.String("o", "", "output file")
var outFile *os.File

func flagParse() {
	flag.Parse()
	inFilePath = flag.Arg(0)
	if inFilePath == "" {
		if *inPlace {
			log.Fatal("-i can't be used with stdin")
		}
		inFile = os.Stdin
	} else {
		var err error
		inFile, err = os.Open(inFilePath)
		if err != nil {
			log.Fatalf("os.Open() %s: %v", inFilePath, err)
		}
	}
	if *outFilePath == "" {
		outFile = os.Stdout
	} else {
		if *inPlace {
			log.Fatalf("-i can't be used with -o")
		}
		var err error
		outFile, err = os.Create(*outFilePath)
		if err != nil {
			log.Fatalf("os.Create() %s: %v", *outFilePath, err)
		}
	}
}

func main() {
	log.SetFlags(0)

	flagParse()
	defer inFile.Close()
	defer outFile.Close()

	outFile.WriteString(`const __APP_WASM_GZ_BASE64__="`)

	base64Writer := base64.NewEncoder(base64.StdEncoding, outFile)
	defer base64Writer.Close()
	gzipWriter := gzip.NewWriter(base64Writer)
	defer gzipWriter.Close()

	_, err := io.Copy(gzipWriter, inFile)
	if err != nil {
		log.Fatalf("io.Copy() gzipWriter <- %s: %v", inFile.Name(), err)
	}
	inFile.Close()
	err = gzipWriter.Close()
	if err != nil {
		log.Fatalf("gzipWriter.Close(): %v", err)
	}
	err = base64Writer.Close()
	if err != nil {
		log.Fatalf("base64Writer.Close(): %v", err)
	}

	_, err = outFile.WriteString(`";` + "\n")
	if err != nil {
		log.Fatalf("outFile.WriteString() %s: %v", outFile.Name(), err)
	}
	_, err = outFile.Write(gort0_js_wasm_js)
	if err != nil {
		log.Fatalf("outFile.Write() %s: %v", outFile.Name(), err)
	}
}
