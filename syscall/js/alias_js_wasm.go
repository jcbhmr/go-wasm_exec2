/*
Package js gives access to the WebAssembly host environment when using the
js/wasm architecture. Its API is based on JavaScript semantics.

This package is EXPERIMENTAL. Its current scope is only to allow tests to run,
but not yet to provide a comprehensive API for users. It is exempt from the Go
compatibility promise.
*/
package js

import "syscall/js"

// CopyBytesToGo copies bytes from src to dst. It panics if src is not a
// Uint8Array or Uint8ClampedArray. It returns the number of bytes copied, which
// will be the minimum of the lengths of src and dst.
func CopyBytesToGo(dst []byte, src Value) int {
	return js.CopyBytesToGo(dst, src)
}

// CopyBytesToJS copies bytes from src to dst. It panics if dst is not a
// Uint8Array or Uint8ClampedArray. It returns the number of bytes copied, which
// will be the minimum of the lengths of src and dst.
func CopyBytesToJS(dst Value, src []byte) int {
	return js.CopyBytesToJS(dst, src)
}

// Error wraps a JavaScript error.
type Error = js.Error

// Func is a wrapped Go function to be called by JavaScript.
type Func = js.Func

// FuncOf returns a function to be used by JavaScript.
//
// The Go function fn is called with the value of JavaScript's "this" keyword
// and the arguments of the invocation. The return value of the invocation is
// the result of the Go function mapped back to JavaScript according to ValueOf.
//
// Invoking the wrapped Go function from JavaScript will pause the event loop
// and spawn a new goroutine. Other wrapped functions which are triggered during
// a call from Go to JavaScript get executed on the same goroutine.
//
// As a consequence, if one wrapped function blocks, JavaScript's event loop is
// blocked until that function returns. Hence, calling any async JavaScript API,
// which requires the event loop, like fetch (http.Client), will cause an
// immediate deadlock. Therefore a blocking function should explicitly start a
// new goroutine.
//
// Func.Release must be called to free up resources when the function will not
// be invoked any more.
func FuncOf(fn func(this Value, args []Value) any) Func {
	return js.FuncOf(fn)
}

// Type represents the JavaScript type of a Value.
type Type = js.Type

const TypeUndefined = js.TypeUndefined
const TypeNull = js.TypeNull
const TypeBoolean = js.TypeBoolean
const TypeNumber = js.TypeNumber
const TypeString = js.TypeString
const TypeSymbol = js.TypeSymbol
const TypeObject = js.TypeObject
const TypeFunction = js.TypeFunction

// Value represents a JavaScript value. The zero value is the JavaScript value
// "undefined". Values can be checked for equality with the Equal method.
type Value = js.Value

// // Global returns the JavaScript global object, usually "window" or "global".
// func Global() Value {
// 	return js.Global()
// }

// Null returns the JavaScript value "null".
func Null() Value {
	return js.Null()
}

// Undefined returns the JavaScript value "undefined".
func Undefined() Value {
	return js.Undefined()
}

// ValueOf returns x as a JavaScript value:
//
//     | Go                     | JavaScript             |
//     | ---------------------- | ---------------------- |
//     | js.Value               | [its value]            |
//     | js.Func                | function               |
//     | nil                    | null                   |
//     | bool                   | boolean                |
//     | integers and floats    | number                 |
//     | string                 | string                 |
//     | []interface{}          | new array              |
//     | map[string]interface{} | new object             |
//
// Panics if x is not one of the expected types.
func ValueOf(x any) Value {
	return js.ValueOf(x)
}

// A ValueError occurs when a Value method is invoked on a Value that does not
// support it. Such cases are documented in the description of each method.
type ValueError = js.ValueError