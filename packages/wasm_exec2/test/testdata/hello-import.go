//go:build ignore

package main

import (
	"fmt"

	"github.com/jcbhmr/gojswasm/syscall/js"
)

func main() {
	jsNodeUtil := js.Await(js.Import("node:util"))
	fmt.Println("node:util", jsNodeUtil)

	jsNodeHTTP := js.Await(js.Import("node:http"))
	fmt.Println("node:http", jsNodeHTTP)

	jsImportMeta := js.ImportMeta()
	fmt.Println("import.meta", jsImportMeta)
}
