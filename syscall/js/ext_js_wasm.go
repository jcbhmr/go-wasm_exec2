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

func Import(specifier any, args ...any) Value {
	if len(args) > 1 {
		panic("syscall/js.Import: too many spread arguments. expected <=1.")
	}
	args2 := append([]any{specifier}, args...)
	return jsGo.Call("_import", args2...)
}

func ImportMeta() Value {
	jsImportMeta := jsGo.Get("_importMeta")
	if jsImportMeta.IsUndefined() {
		panic(ValueError{
			Method: "get _importMeta",
			Type:  TypeObject,
		})
	}
	return jsImportMeta
}

var jsPromise Value

func Await(v Value) Value {
	if jsPromise.IsUndefined() {
		jsPromise = Global().Get("Promise")
	}
	jsP := jsPromise.Call("resolve", v)
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
	jsP.Call("then", jsHandleResolve, jsHandleReject)
	return  <-channel
}
