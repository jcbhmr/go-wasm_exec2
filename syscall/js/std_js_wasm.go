package js

import (
	"unsafe"
)

// ref is used to identify a JavaScript value, since the value itself can not be passed to WebAssembly.
//
// The JavaScript value "undefined" is represented by the value 0.
// A JavaScript number (64-bit float, except 0 and NaN) is represented by its IEEE 754 binary representation.
// All other values are represented as an IEEE 754 binary representation of NaN with bits 0-31 used as
// an ID and bits 32-34 used to differentiate between string, symbol, function and object.
type ref uint64

// nanHead are the upper 32 bits of a ref which are set if the value is not encoded as an IEEE 754 number (see above).
const nanHead = 0x7FF80000

// Value represents a JavaScript value. The zero value is the JavaScript value "undefined".
// Values can be checked for equality with the Equal method.
type _Value struct {
	_     [0]func() // uncomparable; to make == not compile
	ref   ref       // identifies a JavaScript value, see ref type
	gcPtr *ref      // used to trigger the finalizer when the Value is not referenced any more
}

func (v _Value) Value() Value {
	return *(*Value)(unsafe.Pointer(&v))
}

const (
	// the type flags need to be in sync with wasm_exec.js
	typeFlagNone = iota
	typeFlagObject
	typeFlagString
	typeFlagSymbol
	typeFlagFunction
)

func predefValue(id uint32, typeFlag byte) Value {
	return _Value{ref: (nanHead|ref(typeFlag))<<32 | ref(id)}.Value()
}

var (
	jsGo = predefValue(6, typeFlagObject) // instance of the Go class in JavaScript
)
