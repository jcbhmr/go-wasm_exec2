package js_test

import (
	"fmt"

	"github.com/jcbhmr/gojswasm/syscall/js"
)

func ExampleSys() {
	// This is the Go class instance that controls the Go runtime in JavaScript.
	// You are encouraged to attach custom properties to it when initializing
	// it. Prefer binding things to Go & js.Sys() instead of globals.
	//
	//     const go = new Go({ ... })
	//     go._helloWorld = () => console.log("Hello world!")
	//
	jsGo := js.Sys()
	jsGo.Call("_helloWorld")
	// Might output: Hello world!
}

func ExampleImport() {
	// The import specifier must be resolvable at runtime. When using
	// bundlers like Vite to run things in the browser you must supply your own
	// import handler or make sure import(<specifier>) works at runtime via
	// import maps or npm packages.
	//
	// HTML import map:
	//
	//     <script type="importmap">
	//       {
	//         "imports": {
	//           "prettier": "https://esm.run/prettier"
	//         }
	//       }
	//     </script>
	//
	// Node.js package.json:
	//
	//     {
	//       "dependencies": {
	//         "prettier": "latest"
	//       }
	//     }
	//
	// Custom import handler with Vite tree shaking:
	//
	//     const go = new Go({
	//       import: (specifier, options) => {
	//         if (specifier === "prettier") {
	//           // This string literal is statically analyzable by Vite.
	//           return import("prettier")
	//         }
	//         return import(specifier, options)
	//       },
	//     })
	//     const instance = await WebAssembly.instantiate(x, go.getImportObject())
	//     const exitCode = await go.start(instance)
	//
	jsPrettier := js.Await(js.Import("prettier"))
	code := "hello( ) ;; world  (  1+2)"
	formatted := js.Await(jsPrettier.Call("format", code, map[string]any{
		"parser": "typescript",
	})).String()
	fmt.Println(formatted)
	// Might output:
	// hello();
	// world(1 + 2);
}

func ExampleImportMeta() {
	// This will panic if import.meta is not available.
	fmt.Println(js.ImportMeta().Get("url"))
	fmt.Println(js.ImportMeta().Call("resolve", "prettier"))
	// Might output:
	// file:///path/to/file.js
	// file:///path/to/node_modules/prettier/index.js
}
