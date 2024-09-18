package js

import "syscall/js"

var jsGlobalThis Value

// Global returns the JavaScript global object, usually "window" or "global".
func Global() Value {
	if jsGlobalThis.IsUndefined() {
		jsGlobalThis = js.Global().Get("globalThis")
	}
	return jsGlobalThis
}

func Sys() Value {
	return jsGo
}

func Import(specifier any, options any) Value {
	return Sys().Call("_import", specifier, options)
}

// Get the wasm_exec2 module's import.meta object. Panics if not running in an ESM environment.
func ImportMeta() Value {
	jsImportMeta := Sys().Get("_importMeta")
	if jsImportMeta.IsUndefined() {
		panic(ValueError{
			Method: "get _importMeta",
			Type:  TypeObject,
		})
	}
	return jsImportMeta
}

// Waits for a JavaScript Promise or thenable to resolve. Panics on rejection.
func Await(v Value) Value {
	// This code doesn't quite follow the Promises/A+ specification.
	// https://promisesaplus.com/#the-promise-resolution-procedure
	if v.Type() == TypeObject || v.Type() == TypeFunction {
		if v.Get("then").Type() == TypeFunction {
			channel := make(chan Value)
			jsHandleResolve := FuncOf(func(this Value, args []Value) any {
				channel <- args[0]
				close(channel)
				return Value{}
			})
			defer jsHandleResolve.Release()
			jsHandleReject := FuncOf(func(this Value, args []Value) any {
				close(channel)
				panic(Error{Value: args[0]})
			})
			defer jsHandleReject.Release()
			v.Call("then", jsHandleResolve, jsHandleReject)
			return <-channel
		} else {
			return v
		}
	} else {
		return v
	}
}
