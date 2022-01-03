require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"E0HPWI":[function(require,module,exports){
    (function (Buffer){
    !function(factory) {
        var global = this;
        module.exports = factory(global);
    }(function(global) {
        "use strict";
        function arrayFrom(arrayLike, forceCopy) {
            return !forceCopy && arrayLike instanceof Array ? arrayLike : Array.prototype.slice.call(arrayLike);
        }
        function defined(value, defaultValue) {
            return void 0 !== value ? value : defaultValue;
        }
        function jDataView(buffer, byteOffset, byteLength, littleEndian) {
            if (buffer instanceof jDataView) {
                var result = buffer.slice(byteOffset, byteOffset + byteLength);
                return result._littleEndian = defined(littleEndian, result._littleEndian), result;
            }
            if (!(this instanceof jDataView)) return new jDataView(buffer, byteOffset, byteLength, littleEndian);
            if (this.buffer = buffer = jDataView.wrapBuffer(buffer), this._isArrayBuffer = compatibility.ArrayBuffer && buffer instanceof ArrayBuffer, 
            this._isPixelData = !1, this._isDataView = compatibility.DataView && this._isArrayBuffer, 
            this._isNodeBuffer = !0 && compatibility.NodeBuffer && buffer instanceof Buffer, 
            !(this._isNodeBuffer || this._isArrayBuffer || buffer instanceof Array)) throw new TypeError("jDataView buffer has an incompatible type");
            this._littleEndian = !!littleEndian;
            var bufferLength = "byteLength" in buffer ? buffer.byteLength : buffer.length;
            this.byteOffset = byteOffset = defined(byteOffset, 0), this.byteLength = byteLength = defined(byteLength, bufferLength - byteOffset), 
            this._offset = this._bitOffset = 0, this._isDataView ? this._view = new DataView(buffer, byteOffset, byteLength) : this._checkBounds(byteOffset, byteLength, bufferLength), 
            this._engineAction = this._isDataView ? this._dataViewAction : this._isNodeBuffer ? this._nodeBufferAction : this._isArrayBuffer ? this._arrayBufferAction : this._arrayAction;
        }
        function getCharCodes(string) {
            if (compatibility.NodeBuffer) return new Buffer(string, "binary");
            for (var Type = compatibility.ArrayBuffer ? Uint8Array : Array, codes = new Type(string.length), i = 0, length = string.length; length > i; i++) codes[i] = 255 & string.charCodeAt(i);
            return codes;
        }
        function pow2(n) {
            return n >= 0 && 31 > n ? 1 << n : pow2[n] || (pow2[n] = Math.pow(2, n));
        }
        function Uint64(lo, hi) {
            this.lo = lo, this.hi = hi;
        }
        function Int64() {
            Uint64.apply(this, arguments);
        }
        var compatibility = {
            NodeBuffer: !0 && "Buffer" in global,
            DataView: "DataView" in global,
            ArrayBuffer: "ArrayBuffer" in global,
            PixelData: !1
        };
        compatibility.NodeBuffer && !function(buffer) {
            try {
                buffer.writeFloatLE(1/0, 0);
            } catch (e) {
                compatibility.NodeBuffer = !1;
            }
        }(new Buffer(4));
        var dataTypes = {
            Int8: 1,
            Int16: 2,
            Int32: 4,
            Uint8: 1,
            Uint16: 2,
            Uint32: 4,
            Float32: 4,
            Float64: 8
        };
        jDataView.wrapBuffer = function(buffer) {
            switch (typeof buffer) {
              case "number":
                if (compatibility.NodeBuffer) buffer = new Buffer(buffer), buffer.fill(0); else if (compatibility.ArrayBuffer) buffer = new Uint8Array(buffer).buffer; else {
                    buffer = new Array(buffer);
                    for (var i = 0; i < buffer.length; i++) buffer[i] = 0;
                }
                return buffer;
    
              case "string":
                buffer = getCharCodes(buffer);
    
              default:
                return "length" in buffer && !(compatibility.NodeBuffer && buffer instanceof Buffer || compatibility.ArrayBuffer && buffer instanceof ArrayBuffer) && (compatibility.NodeBuffer ? buffer = new Buffer(buffer) : compatibility.ArrayBuffer ? buffer instanceof ArrayBuffer || (buffer = new Uint8Array(buffer).buffer, 
                buffer instanceof ArrayBuffer || (buffer = new Uint8Array(arrayFrom(buffer, !0)).buffer)) : buffer = arrayFrom(buffer)), 
                buffer;
            }
        }, jDataView.createBuffer = function() {
            return jDataView.wrapBuffer(arguments);
        }, jDataView.Uint64 = Uint64, Uint64.prototype = {
            valueOf: function() {
                return this.lo + pow2(32) * this.hi;
            },
            toString: function() {
                return Number.prototype.toString.apply(this.valueOf(), arguments);
            }
        }, Uint64.fromNumber = function(number) {
            var hi = Math.floor(number / pow2(32)), lo = number - hi * pow2(32);
            return new Uint64(lo, hi);
        }, jDataView.Int64 = Int64, Int64.prototype = "create" in Object ? Object.create(Uint64.prototype) : new Uint64(), 
        Int64.prototype.valueOf = function() {
            return this.hi < pow2(31) ? Uint64.prototype.valueOf.apply(this, arguments) : -(pow2(32) - this.lo + pow2(32) * (pow2(32) - 1 - this.hi));
        }, Int64.fromNumber = function(number) {
            var lo, hi;
            if (number >= 0) {
                var unsigned = Uint64.fromNumber(number);
                lo = unsigned.lo, hi = unsigned.hi;
            } else hi = Math.floor(number / pow2(32)), lo = number - hi * pow2(32), hi += pow2(32);
            return new Int64(lo, hi);
        };
        var proto = jDataView.prototype = {
            compatibility: compatibility,
            _checkBounds: function(byteOffset, byteLength, maxLength) {
                if ("number" != typeof byteOffset) throw new TypeError("Offset is not a number.");
                if ("number" != typeof byteLength) throw new TypeError("Size is not a number.");
                if (0 > byteLength) throw new RangeError("Length is negative.");
                if (0 > byteOffset || byteOffset + byteLength > defined(maxLength, this.byteLength)) throw new RangeError("Offsets are out of bounds.");
            },
            _action: function(type, isReadAction, byteOffset, littleEndian, value) {
                return this._engineAction(type, isReadAction, defined(byteOffset, this._offset), defined(littleEndian, this._littleEndian), value);
            },
            _dataViewAction: function(type, isReadAction, byteOffset, littleEndian, value) {
                return this._offset = byteOffset + dataTypes[type], isReadAction ? this._view["get" + type](byteOffset, littleEndian) : this._view["set" + type](byteOffset, value, littleEndian);
            },
            _arrayBufferAction: function(type, isReadAction, byteOffset, littleEndian, value) {
                var typedArray, size = dataTypes[type], TypedArray = global[type + "Array"];
                if (littleEndian = defined(littleEndian, this._littleEndian), 1 === size || (this.byteOffset + byteOffset) % size === 0 && littleEndian) return typedArray = new TypedArray(this.buffer, this.byteOffset + byteOffset, 1), 
                this._offset = byteOffset + size, isReadAction ? typedArray[0] : typedArray[0] = value;
                var bytes = new Uint8Array(isReadAction ? this.getBytes(size, byteOffset, littleEndian, !0) : size);
                return typedArray = new TypedArray(bytes.buffer, 0, 1), isReadAction ? typedArray[0] : (typedArray[0] = value, 
                void this._setBytes(byteOffset, bytes, littleEndian));
            },
            _arrayAction: function(type, isReadAction, byteOffset, littleEndian, value) {
                return isReadAction ? this["_get" + type](byteOffset, littleEndian) : this["_set" + type](byteOffset, value, littleEndian);
            },
            _getBytes: function(length, byteOffset, littleEndian) {
                littleEndian = defined(littleEndian, this._littleEndian), byteOffset = defined(byteOffset, this._offset), 
                length = defined(length, this.byteLength - byteOffset), this._checkBounds(byteOffset, length), 
                byteOffset += this.byteOffset, this._offset = byteOffset - this.byteOffset + length;
                var result = this._isArrayBuffer ? new Uint8Array(this.buffer, byteOffset, length) : (this.buffer.slice || Array.prototype.slice).call(this.buffer, byteOffset, byteOffset + length);
                return littleEndian || 1 >= length ? result : arrayFrom(result).reverse();
            },
            getBytes: function(length, byteOffset, littleEndian, toArray) {
                var result = this._getBytes(length, byteOffset, defined(littleEndian, !0));
                return toArray ? arrayFrom(result) : result;
            },
            _setBytes: function(byteOffset, bytes, littleEndian) {
                var length = bytes.length;
                if (0 !== length) {
                    if (littleEndian = defined(littleEndian, this._littleEndian), byteOffset = defined(byteOffset, this._offset), 
                    this._checkBounds(byteOffset, length), !littleEndian && length > 1 && (bytes = arrayFrom(bytes, !0).reverse()), 
                    byteOffset += this.byteOffset, this._isArrayBuffer) new Uint8Array(this.buffer, byteOffset, length).set(bytes); else if (this._isNodeBuffer) new Buffer(bytes).copy(this.buffer, byteOffset); else for (var i = 0; length > i; i++) this.buffer[byteOffset + i] = bytes[i];
                    this._offset = byteOffset - this.byteOffset + length;
                }
            },
            setBytes: function(byteOffset, bytes, littleEndian) {
                this._setBytes(byteOffset, bytes, defined(littleEndian, !0));
            },
            getString: function(byteLength, byteOffset, encoding) {
                if (this._isNodeBuffer) return byteOffset = defined(byteOffset, this._offset), byteLength = defined(byteLength, this.byteLength - byteOffset), 
                this._checkBounds(byteOffset, byteLength), this._offset = byteOffset + byteLength, 
                this.buffer.toString(encoding || "binary", this.byteOffset + byteOffset, this.byteOffset + this._offset);
                var bytes = this._getBytes(byteLength, byteOffset, !0), string = "";
                byteLength = bytes.length;
                for (var i = 0; byteLength > i; i++) string += String.fromCharCode(bytes[i]);
                return "utf8" === encoding && (string = decodeURIComponent(escape(string))), string;
            },
            setString: function(byteOffset, subString, encoding) {
                return this._isNodeBuffer ? (byteOffset = defined(byteOffset, this._offset), this._checkBounds(byteOffset, subString.length), 
                void (this._offset = byteOffset + this.buffer.write(subString, this.byteOffset + byteOffset, encoding || "binary"))) : ("utf8" === encoding && (subString = unescape(encodeURIComponent(subString))), 
                void this._setBytes(byteOffset, getCharCodes(subString), !0));
            },
            getChar: function(byteOffset) {
                return this.getString(1, byteOffset);
            },
            setChar: function(byteOffset, character) {
                this.setString(byteOffset, character);
            },
            tell: function() {
                return this._offset;
            },
            seek: function(byteOffset) {
                return this._checkBounds(byteOffset, 0), this._offset = byteOffset;
            },
            skip: function(byteLength) {
                return this.seek(this._offset + byteLength);
            },
            slice: function(start, end, forceCopy) {
                function normalizeOffset(offset, byteLength) {
                    return 0 > offset ? offset + byteLength : offset;
                }
                return start = normalizeOffset(start, this.byteLength), end = normalizeOffset(defined(end, this.byteLength), this.byteLength), 
                forceCopy ? new jDataView(this.getBytes(end - start, start, !0, !0), void 0, void 0, this._littleEndian) : new jDataView(this.buffer, this.byteOffset + start, end - start, this._littleEndian);
            },
            alignBy: function(byteCount) {
                return this._bitOffset = 0, 1 !== defined(byteCount, 1) ? this.skip(byteCount - (this._offset % byteCount || byteCount)) : this._offset;
            },
            _getFloat64: function(byteOffset, littleEndian) {
                var b = this._getBytes(8, byteOffset, littleEndian), sign = 1 - 2 * (b[7] >> 7), exponent = ((b[7] << 1 & 255) << 3 | b[6] >> 4) - 1023, mantissa = (15 & b[6]) * pow2(48) + b[5] * pow2(40) + b[4] * pow2(32) + b[3] * pow2(24) + b[2] * pow2(16) + b[1] * pow2(8) + b[0];
                return 1024 === exponent ? 0 !== mantissa ? 0/0 : 1/0 * sign : -1023 === exponent ? sign * mantissa * pow2(-1074) : sign * (1 + mantissa * pow2(-52)) * pow2(exponent);
            },
            _getFloat32: function(byteOffset, littleEndian) {
                var b = this._getBytes(4, byteOffset, littleEndian), sign = 1 - 2 * (b[3] >> 7), exponent = (b[3] << 1 & 255 | b[2] >> 7) - 127, mantissa = (127 & b[2]) << 16 | b[1] << 8 | b[0];
                return 128 === exponent ? 0 !== mantissa ? 0/0 : 1/0 * sign : -127 === exponent ? sign * mantissa * pow2(-149) : sign * (1 + mantissa * pow2(-23)) * pow2(exponent);
            },
            _get64: function(Type, byteOffset, littleEndian) {
                littleEndian = defined(littleEndian, this._littleEndian), byteOffset = defined(byteOffset, this._offset);
                for (var parts = littleEndian ? [ 0, 4 ] : [ 4, 0 ], i = 0; 2 > i; i++) parts[i] = this.getUint32(byteOffset + parts[i], littleEndian);
                return this._offset = byteOffset + 8, new Type(parts[0], parts[1]);
            },
            getInt64: function(byteOffset, littleEndian) {
                return this._get64(Int64, byteOffset, littleEndian);
            },
            getUint64: function(byteOffset, littleEndian) {
                return this._get64(Uint64, byteOffset, littleEndian);
            },
            _getInt32: function(byteOffset, littleEndian) {
                var b = this._getBytes(4, byteOffset, littleEndian);
                return b[3] << 24 | b[2] << 16 | b[1] << 8 | b[0];
            },
            _getUint32: function(byteOffset, littleEndian) {
                return this._getInt32(byteOffset, littleEndian) >>> 0;
            },
            _getInt16: function(byteOffset, littleEndian) {
                return this._getUint16(byteOffset, littleEndian) << 16 >> 16;
            },
            _getUint16: function(byteOffset, littleEndian) {
                var b = this._getBytes(2, byteOffset, littleEndian);
                return b[1] << 8 | b[0];
            },
            _getInt8: function(byteOffset) {
                return this._getUint8(byteOffset) << 24 >> 24;
            },
            _getUint8: function(byteOffset) {
                return this._getBytes(1, byteOffset)[0];
            },
            _getBitRangeData: function(bitLength, byteOffset) {
                var startBit = (defined(byteOffset, this._offset) << 3) + this._bitOffset, endBit = startBit + bitLength, start = startBit >>> 3, end = endBit + 7 >>> 3, b = this._getBytes(end - start, start, !0), wideValue = 0;
                (this._bitOffset = 7 & endBit) && (this._bitOffset -= 8);
                for (var i = 0, length = b.length; length > i; i++) wideValue = wideValue << 8 | b[i];
                return {
                    start: start,
                    bytes: b,
                    wideValue: wideValue
                };
            },
            getSigned: function(bitLength, byteOffset) {
                var shift = 32 - bitLength;
                return this.getUnsigned(bitLength, byteOffset) << shift >> shift;
            },
            getUnsigned: function(bitLength, byteOffset) {
                var value = this._getBitRangeData(bitLength, byteOffset).wideValue >>> -this._bitOffset;
                return 32 > bitLength ? value & ~(-1 << bitLength) : value;
            },
            _setBinaryFloat: function(byteOffset, value, mantSize, expSize, littleEndian) {
                var exponent, mantissa, signBit = 0 > value ? 1 : 0, eMax = ~(-1 << expSize - 1), eMin = 1 - eMax;
                0 > value && (value = -value), 0 === value ? (exponent = 0, mantissa = 0) : isNaN(value) ? (exponent = 2 * eMax + 1, 
                mantissa = 1) : 1/0 === value ? (exponent = 2 * eMax + 1, mantissa = 0) : (exponent = Math.floor(Math.log(value) / Math.LN2), 
                exponent >= eMin && eMax >= exponent ? (mantissa = Math.floor((value * pow2(-exponent) - 1) * pow2(mantSize)), 
                exponent += eMax) : (mantissa = Math.floor(value / pow2(eMin - mantSize)), exponent = 0));
                for (var b = []; mantSize >= 8; ) b.push(mantissa % 256), mantissa = Math.floor(mantissa / 256), 
                mantSize -= 8;
                for (exponent = exponent << mantSize | mantissa, expSize += mantSize; expSize >= 8; ) b.push(255 & exponent), 
                exponent >>>= 8, expSize -= 8;
                b.push(signBit << expSize | exponent), this._setBytes(byteOffset, b, littleEndian);
            },
            _setFloat32: function(byteOffset, value, littleEndian) {
                this._setBinaryFloat(byteOffset, value, 23, 8, littleEndian);
            },
            _setFloat64: function(byteOffset, value, littleEndian) {
                this._setBinaryFloat(byteOffset, value, 52, 11, littleEndian);
            },
            _set64: function(Type, byteOffset, value, littleEndian) {
                value instanceof Type || (value = Type.fromNumber(value)), littleEndian = defined(littleEndian, this._littleEndian), 
                byteOffset = defined(byteOffset, this._offset);
                var parts = littleEndian ? {
                    lo: 0,
                    hi: 4
                } : {
                    lo: 4,
                    hi: 0
                };
                for (var partName in parts) this.setUint32(byteOffset + parts[partName], value[partName], littleEndian);
                this._offset = byteOffset + 8;
            },
            setInt64: function(byteOffset, value, littleEndian) {
                this._set64(Int64, byteOffset, value, littleEndian);
            },
            setUint64: function(byteOffset, value, littleEndian) {
                this._set64(Uint64, byteOffset, value, littleEndian);
            },
            _setUint32: function(byteOffset, value, littleEndian) {
                this._setBytes(byteOffset, [ 255 & value, value >>> 8 & 255, value >>> 16 & 255, value >>> 24 ], littleEndian);
            },
            _setUint16: function(byteOffset, value, littleEndian) {
                this._setBytes(byteOffset, [ 255 & value, value >>> 8 & 255 ], littleEndian);
            },
            _setUint8: function(byteOffset, value) {
                this._setBytes(byteOffset, [ 255 & value ]);
            },
            setUnsigned: function(byteOffset, value, bitLength) {
                var data = this._getBitRangeData(bitLength, byteOffset), wideValue = data.wideValue, b = data.bytes;
                wideValue &= ~(~(-1 << bitLength) << -this._bitOffset), wideValue |= (32 > bitLength ? value & ~(-1 << bitLength) : value) << -this._bitOffset;
                for (var i = b.length - 1; i >= 0; i--) b[i] = 255 & wideValue, wideValue >>>= 8;
                this._setBytes(data.start, b, !0);
            }
        }, nodeNaming = {
            Int8: "Int8",
            Int16: "Int16",
            Int32: "Int32",
            Uint8: "UInt8",
            Uint16: "UInt16",
            Uint32: "UInt32",
            Float32: "Float",
            Float64: "Double"
        };
        proto._nodeBufferAction = function(type, isReadAction, byteOffset, littleEndian, value) {
            this._offset = byteOffset + dataTypes[type];
            var nodeName = nodeNaming[type] + ("Int8" === type || "Uint8" === type ? "" : littleEndian ? "LE" : "BE");
            return byteOffset += this.byteOffset, isReadAction ? this.buffer["read" + nodeName](byteOffset) : this.buffer["write" + nodeName](value, byteOffset);
        };
        for (var type in dataTypes) !function(type) {
            proto["get" + type] = function(byteOffset, littleEndian) {
                return this._action(type, !0, byteOffset, littleEndian);
            }, proto["set" + type] = function(byteOffset, value, littleEndian) {
                this._action(type, !1, byteOffset, littleEndian, value);
            };
        }(type);
        proto._setInt32 = proto._setUint32, proto._setInt16 = proto._setUint16, proto._setInt8 = proto._setUint8, 
        proto.setSigned = proto.setUnsigned;
        for (var method in proto) "set" === method.slice(0, 3) && !function(type) {
            proto["write" + type] = function() {
                Array.prototype.unshift.call(arguments, void 0), this["set" + type].apply(this, arguments);
            };
        }(method.slice(3));
        return jDataView;
    });
    }).call(this,require("buffer").Buffer)
    },{"buffer":3}],"jdataview.js":[function(require,module,exports){
    module.exports=require('E0HPWI');
    },{}],3:[function(require,module,exports){
    /*!
     * The buffer module from node.js, for the browser.
     *
     * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
     * @license  MIT
     */
    
    var base64 = require('base64-js')
    var ieee754 = require('ieee754')
    
    exports.Buffer = Buffer
    exports.SlowBuffer = Buffer
    exports.INSPECT_MAX_BYTES = 50
    Buffer.poolSize = 8192
    
    /**
     * If `Buffer._useTypedArrays`:
     *   === true    Use Uint8Array implementation (fastest)
     *   === false   Use Object implementation (compatible down to IE6)
     */
    Buffer._useTypedArrays = (function () {
      // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
      // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
      // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
      // because we need to be able to add all the node Buffer API methods. This is an issue
      // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
      try {
        var buf = new ArrayBuffer(0)
        var arr = new Uint8Array(buf)
        arr.foo = function () { return 42 }
        return 42 === arr.foo() &&
            typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
      } catch (e) {
        return false
      }
    })()
    
    /**
     * Class: Buffer
     * =============
     *
     * The Buffer constructor returns instances of `Uint8Array` that are augmented
     * with function properties for all the node `Buffer` API functions. We use
     * `Uint8Array` so that square bracket notation works as expected -- it returns
     * a single octet.
     *
     * By augmenting the instances, we can avoid modifying the `Uint8Array`
     * prototype.
     */
    function Buffer (subject, encoding, noZero) {
      if (!(this instanceof Buffer))
        return new Buffer(subject, encoding, noZero)
    
      var type = typeof subject
    
      // Workaround: node's base64 implementation allows for non-padded strings
      // while base64-js does not.
      if (encoding === 'base64' && type === 'string') {
        subject = stringtrim(subject)
        while (subject.length % 4 !== 0) {
          subject = subject + '='
        }
      }
    
      // Find the length
      var length
      if (type === 'number')
        length = coerce(subject)
      else if (type === 'string')
        length = Buffer.byteLength(subject, encoding)
      else if (type === 'object')
        length = coerce(subject.length) // assume that object is array-like
      else
        throw new Error('First argument needs to be a number, array or string.')
    
      var buf
      if (Buffer._useTypedArrays) {
        // Preferred: Return an augmented `Uint8Array` instance for best performance
        buf = Buffer._augment(new Uint8Array(length))
      } else {
        // Fallback: Return THIS instance of Buffer (created by `new`)
        buf = this
        buf.length = length
        buf._isBuffer = true
      }
    
      var i
      if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
        // Speed optimization -- use set if we're copying from a typed array
        buf._set(subject)
      } else if (isArrayish(subject)) {
        // Treat array-ish objects as a byte array
        for (i = 0; i < length; i++) {
          if (Buffer.isBuffer(subject))
            buf[i] = subject.readUInt8(i)
          else
            buf[i] = subject[i]
        }
      } else if (type === 'string') {
        buf.write(subject, 0, encoding)
      } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
        for (i = 0; i < length; i++) {
          buf[i] = 0
        }
      }
    
      return buf
    }
    
    // STATIC METHODS
    // ==============
    
    Buffer.isEncoding = function (encoding) {
      switch (String(encoding).toLowerCase()) {
        case 'hex':
        case 'utf8':
        case 'utf-8':
        case 'ascii':
        case 'binary':
        case 'base64':
        case 'raw':
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          return true
        default:
          return false
      }
    }
    
    Buffer.isBuffer = function (b) {
      return !!(b !== null && b !== undefined && b._isBuffer)
    }
    
    Buffer.byteLength = function (str, encoding) {
      var ret
      str = str + ''
      switch (encoding || 'utf8') {
        case 'hex':
          ret = str.length / 2
          break
        case 'utf8':
        case 'utf-8':
          ret = utf8ToBytes(str).length
          break
        case 'ascii':
        case 'binary':
        case 'raw':
          ret = str.length
          break
        case 'base64':
          ret = base64ToBytes(str).length
          break
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          ret = str.length * 2
          break
        default:
          throw new Error('Unknown encoding')
      }
      return ret
    }
    
    Buffer.concat = function (list, totalLength) {
      assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
          'list should be an Array.')
    
      if (list.length === 0) {
        return new Buffer(0)
      } else if (list.length === 1) {
        return list[0]
      }
    
      var i
      if (typeof totalLength !== 'number') {
        totalLength = 0
        for (i = 0; i < list.length; i++) {
          totalLength += list[i].length
        }
      }
    
      var buf = new Buffer(totalLength)
      var pos = 0
      for (i = 0; i < list.length; i++) {
        var item = list[i]
        item.copy(buf, pos)
        pos += item.length
      }
      return buf
    }
    
    // BUFFER INSTANCE METHODS
    // =======================
    
    function _hexWrite (buf, string, offset, length) {
      offset = Number(offset) || 0
      var remaining = buf.length - offset
      if (!length) {
        length = remaining
      } else {
        length = Number(length)
        if (length > remaining) {
          length = remaining
        }
      }
    
      // must be an even number of digits
      var strLen = string.length
      assert(strLen % 2 === 0, 'Invalid hex string')
    
      if (length > strLen / 2) {
        length = strLen / 2
      }
      for (var i = 0; i < length; i++) {
        var byte = parseInt(string.substr(i * 2, 2), 16)
        assert(!isNaN(byte), 'Invalid hex string')
        buf[offset + i] = byte
      }
      Buffer._charsWritten = i * 2
      return i
    }
    
    function _utf8Write (buf, string, offset, length) {
      var charsWritten = Buffer._charsWritten =
        blitBuffer(utf8ToBytes(string), buf, offset, length)
      return charsWritten
    }
    
    function _asciiWrite (buf, string, offset, length) {
      var charsWritten = Buffer._charsWritten =
        blitBuffer(asciiToBytes(string), buf, offset, length)
      return charsWritten
    }
    
    function _binaryWrite (buf, string, offset, length) {
      return _asciiWrite(buf, string, offset, length)
    }
    
    function _base64Write (buf, string, offset, length) {
      var charsWritten = Buffer._charsWritten =
        blitBuffer(base64ToBytes(string), buf, offset, length)
      return charsWritten
    }
    
    function _utf16leWrite (buf, string, offset, length) {
      var charsWritten = Buffer._charsWritten =
        blitBuffer(utf16leToBytes(string), buf, offset, length)
      return charsWritten
    }
    
    Buffer.prototype.write = function (string, offset, length, encoding) {
      // Support both (string, offset, length, encoding)
      // and the legacy (string, encoding, offset, length)
      if (isFinite(offset)) {
        if (!isFinite(length)) {
          encoding = length
          length = undefined
        }
      } else {  // legacy
        var swap = encoding
        encoding = offset
        offset = length
        length = swap
      }
    
      offset = Number(offset) || 0
      var remaining = this.length - offset
      if (!length) {
        length = remaining
      } else {
        length = Number(length)
        if (length > remaining) {
          length = remaining
        }
      }
      encoding = String(encoding || 'utf8').toLowerCase()
    
      var ret
      switch (encoding) {
        case 'hex':
          ret = _hexWrite(this, string, offset, length)
          break
        case 'utf8':
        case 'utf-8':
          ret = _utf8Write(this, string, offset, length)
          break
        case 'ascii':
          ret = _asciiWrite(this, string, offset, length)
          break
        case 'binary':
          ret = _binaryWrite(this, string, offset, length)
          break
        case 'base64':
          ret = _base64Write(this, string, offset, length)
          break
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          ret = _utf16leWrite(this, string, offset, length)
          break
        default:
          throw new Error('Unknown encoding')
      }
      return ret
    }
    
    Buffer.prototype.toString = function (encoding, start, end) {
      var self = this
    
      encoding = String(encoding || 'utf8').toLowerCase()
      start = Number(start) || 0
      end = (end !== undefined)
        ? Number(end)
        : end = self.length
    
      // Fastpath empty strings
      if (end === start)
        return ''
    
      var ret
      switch (encoding) {
        case 'hex':
          ret = _hexSlice(self, start, end)
          break
        case 'utf8':
        case 'utf-8':
          ret = _utf8Slice(self, start, end)
          break
        case 'ascii':
          ret = _asciiSlice(self, start, end)
          break
        case 'binary':
          ret = _binarySlice(self, start, end)
          break
        case 'base64':
          ret = _base64Slice(self, start, end)
          break
        case 'ucs2':
        case 'ucs-2':
        case 'utf16le':
        case 'utf-16le':
          ret = _utf16leSlice(self, start, end)
          break
        default:
          throw new Error('Unknown encoding')
      }
      return ret
    }
    
    Buffer.prototype.toJSON = function () {
      return {
        type: 'Buffer',
        data: Array.prototype.slice.call(this._arr || this, 0)
      }
    }
    
    // copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
    Buffer.prototype.copy = function (target, target_start, start, end) {
      var source = this
    
      if (!start) start = 0
      if (!end && end !== 0) end = this.length
      if (!target_start) target_start = 0
    
      // Copy 0 bytes; we're done
      if (end === start) return
      if (target.length === 0 || source.length === 0) return
    
      // Fatal error conditions
      assert(end >= start, 'sourceEnd < sourceStart')
      assert(target_start >= 0 && target_start < target.length,
          'targetStart out of bounds')
      assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
      assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')
    
      // Are we oob?
      if (end > this.length)
        end = this.length
      if (target.length - target_start < end - start)
        end = target.length - target_start + start
    
      var len = end - start
    
      if (len < 100 || !Buffer._useTypedArrays) {
        for (var i = 0; i < len; i++)
          target[i + target_start] = this[i + start]
      } else {
        target._set(this.subarray(start, start + len), target_start)
      }
    }
    
    function _base64Slice (buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf)
      } else {
        return base64.fromByteArray(buf.slice(start, end))
      }
    }
    
    function _utf8Slice (buf, start, end) {
      var res = ''
      var tmp = ''
      end = Math.min(buf.length, end)
    
      for (var i = start; i < end; i++) {
        if (buf[i] <= 0x7F) {
          res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
          tmp = ''
        } else {
          tmp += '%' + buf[i].toString(16)
        }
      }
    
      return res + decodeUtf8Char(tmp)
    }
    
    function _asciiSlice (buf, start, end) {
      var ret = ''
      end = Math.min(buf.length, end)
    
      for (var i = start; i < end; i++)
        ret += String.fromCharCode(buf[i])
      return ret
    }
    
    function _binarySlice (buf, start, end) {
      return _asciiSlice(buf, start, end)
    }
    
    function _hexSlice (buf, start, end) {
      var len = buf.length
    
      if (!start || start < 0) start = 0
      if (!end || end < 0 || end > len) end = len
    
      var out = ''
      for (var i = start; i < end; i++) {
        out += toHex(buf[i])
      }
      return out
    }
    
    function _utf16leSlice (buf, start, end) {
      var bytes = buf.slice(start, end)
      var res = ''
      for (var i = 0; i < bytes.length; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
      }
      return res
    }
    
    Buffer.prototype.slice = function (start, end) {
      var len = this.length
      start = clamp(start, len, 0)
      end = clamp(end, len, len)
    
      if (Buffer._useTypedArrays) {
        return Buffer._augment(this.subarray(start, end))
      } else {
        var sliceLen = end - start
        var newBuf = new Buffer(sliceLen, undefined, true)
        for (var i = 0; i < sliceLen; i++) {
          newBuf[i] = this[i + start]
        }
        return newBuf
      }
    }
    
    // `get` will be removed in Node 0.13+
    Buffer.prototype.get = function (offset) {
      console.log('.get() is deprecated. Access using array indexes instead.')
      return this.readUInt8(offset)
    }
    
    // `set` will be removed in Node 0.13+
    Buffer.prototype.set = function (v, offset) {
      console.log('.set() is deprecated. Access using array indexes instead.')
      return this.writeUInt8(v, offset)
    }
    
    Buffer.prototype.readUInt8 = function (offset, noAssert) {
      if (!noAssert) {
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset < this.length, 'Trying to read beyond buffer length')
      }
    
      if (offset >= this.length)
        return
    
      return this[offset]
    }
    
    function _readUInt16 (buf, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      var val
      if (littleEndian) {
        val = buf[offset]
        if (offset + 1 < len)
          val |= buf[offset + 1] << 8
      } else {
        val = buf[offset] << 8
        if (offset + 1 < len)
          val |= buf[offset + 1]
      }
      return val
    }
    
    Buffer.prototype.readUInt16LE = function (offset, noAssert) {
      return _readUInt16(this, offset, true, noAssert)
    }
    
    Buffer.prototype.readUInt16BE = function (offset, noAssert) {
      return _readUInt16(this, offset, false, noAssert)
    }
    
    function _readUInt32 (buf, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      var val
      if (littleEndian) {
        if (offset + 2 < len)
          val = buf[offset + 2] << 16
        if (offset + 1 < len)
          val |= buf[offset + 1] << 8
        val |= buf[offset]
        if (offset + 3 < len)
          val = val + (buf[offset + 3] << 24 >>> 0)
      } else {
        if (offset + 1 < len)
          val = buf[offset + 1] << 16
        if (offset + 2 < len)
          val |= buf[offset + 2] << 8
        if (offset + 3 < len)
          val |= buf[offset + 3]
        val = val + (buf[offset] << 24 >>> 0)
      }
      return val
    }
    
    Buffer.prototype.readUInt32LE = function (offset, noAssert) {
      return _readUInt32(this, offset, true, noAssert)
    }
    
    Buffer.prototype.readUInt32BE = function (offset, noAssert) {
      return _readUInt32(this, offset, false, noAssert)
    }
    
    Buffer.prototype.readInt8 = function (offset, noAssert) {
      if (!noAssert) {
        assert(offset !== undefined && offset !== null,
            'missing offset')
        assert(offset < this.length, 'Trying to read beyond buffer length')
      }
    
      if (offset >= this.length)
        return
    
      var neg = this[offset] & 0x80
      if (neg)
        return (0xff - this[offset] + 1) * -1
      else
        return this[offset]
    }
    
    function _readInt16 (buf, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      var val = _readUInt16(buf, offset, littleEndian, true)
      var neg = val & 0x8000
      if (neg)
        return (0xffff - val + 1) * -1
      else
        return val
    }
    
    Buffer.prototype.readInt16LE = function (offset, noAssert) {
      return _readInt16(this, offset, true, noAssert)
    }
    
    Buffer.prototype.readInt16BE = function (offset, noAssert) {
      return _readInt16(this, offset, false, noAssert)
    }
    
    function _readInt32 (buf, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      var val = _readUInt32(buf, offset, littleEndian, true)
      var neg = val & 0x80000000
      if (neg)
        return (0xffffffff - val + 1) * -1
      else
        return val
    }
    
    Buffer.prototype.readInt32LE = function (offset, noAssert) {
      return _readInt32(this, offset, true, noAssert)
    }
    
    Buffer.prototype.readInt32BE = function (offset, noAssert) {
      return _readInt32(this, offset, false, noAssert)
    }
    
    function _readFloat (buf, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
      }
    
      return ieee754.read(buf, offset, littleEndian, 23, 4)
    }
    
    Buffer.prototype.readFloatLE = function (offset, noAssert) {
      return _readFloat(this, offset, true, noAssert)
    }
    
    Buffer.prototype.readFloatBE = function (offset, noAssert) {
      return _readFloat(this, offset, false, noAssert)
    }
    
    function _readDouble (buf, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
      }
    
      return ieee754.read(buf, offset, littleEndian, 52, 8)
    }
    
    Buffer.prototype.readDoubleLE = function (offset, noAssert) {
      return _readDouble(this, offset, true, noAssert)
    }
    
    Buffer.prototype.readDoubleBE = function (offset, noAssert) {
      return _readDouble(this, offset, false, noAssert)
    }
    
    Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset < this.length, 'trying to write beyond buffer length')
        verifuint(value, 0xff)
      }
    
      if (offset >= this.length) return
    
      this[offset] = value
    }
    
    function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
        verifuint(value, 0xffff)
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
        buf[offset + i] =
            (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
                (littleEndian ? i : 1 - i) * 8
      }
    }
    
    Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
      _writeUInt16(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
      _writeUInt16(this, value, offset, false, noAssert)
    }
    
    function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
        verifuint(value, 0xffffffff)
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
        buf[offset + i] =
            (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
      }
    }
    
    Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
      _writeUInt32(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
      _writeUInt32(this, value, offset, false, noAssert)
    }
    
    Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset < this.length, 'Trying to write beyond buffer length')
        verifsint(value, 0x7f, -0x80)
      }
    
      if (offset >= this.length)
        return
    
      if (value >= 0)
        this.writeUInt8(value, offset, noAssert)
      else
        this.writeUInt8(0xff + value + 1, offset, noAssert)
    }
    
    function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
        verifsint(value, 0x7fff, -0x8000)
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      if (value >= 0)
        _writeUInt16(buf, value, offset, littleEndian, noAssert)
      else
        _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
    }
    
    Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
      _writeInt16(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
      _writeInt16(this, value, offset, false, noAssert)
    }
    
    function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
        verifsint(value, 0x7fffffff, -0x80000000)
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      if (value >= 0)
        _writeUInt32(buf, value, offset, littleEndian, noAssert)
      else
        _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
    }
    
    Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
      _writeInt32(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
      _writeInt32(this, value, offset, false, noAssert)
    }
    
    function _writeFloat (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
        verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      ieee754.write(buf, value, offset, littleEndian, 23, 4)
    }
    
    Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
      _writeFloat(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
      _writeFloat(this, value, offset, false, noAssert)
    }
    
    function _writeDouble (buf, value, offset, littleEndian, noAssert) {
      if (!noAssert) {
        assert(value !== undefined && value !== null, 'missing value')
        assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
        assert(offset !== undefined && offset !== null, 'missing offset')
        assert(offset + 7 < buf.length,
            'Trying to write beyond buffer length')
        verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
      }
    
      var len = buf.length
      if (offset >= len)
        return
    
      ieee754.write(buf, value, offset, littleEndian, 52, 8)
    }
    
    Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
      _writeDouble(this, value, offset, true, noAssert)
    }
    
    Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
      _writeDouble(this, value, offset, false, noAssert)
    }
    
    // fill(value, start=0, end=buffer.length)
    Buffer.prototype.fill = function (value, start, end) {
      if (!value) value = 0
      if (!start) start = 0
      if (!end) end = this.length
    
      if (typeof value === 'string') {
        value = value.charCodeAt(0)
      }
    
      assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
      assert(end >= start, 'end < start')
    
      // Fill 0 bytes; we're done
      if (end === start) return
      if (this.length === 0) return
    
      assert(start >= 0 && start < this.length, 'start out of bounds')
      assert(end >= 0 && end <= this.length, 'end out of bounds')
    
      for (var i = start; i < end; i++) {
        this[i] = value
      }
    }
    
    Buffer.prototype.inspect = function () {
      var out = []
      var len = this.length
      for (var i = 0; i < len; i++) {
        out[i] = toHex(this[i])
        if (i === exports.INSPECT_MAX_BYTES) {
          out[i + 1] = '...'
          break
        }
      }
      return '<Buffer ' + out.join(' ') + '>'
    }
    
    /**
     * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
     * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
     */
    Buffer.prototype.toArrayBuffer = function () {
      if (typeof Uint8Array !== 'undefined') {
        if (Buffer._useTypedArrays) {
          return (new Buffer(this)).buffer
        } else {
          var buf = new Uint8Array(this.length)
          for (var i = 0, len = buf.length; i < len; i += 1)
            buf[i] = this[i]
          return buf.buffer
        }
      } else {
        throw new Error('Buffer.toArrayBuffer not supported in this browser')
      }
    }
    
    // HELPER FUNCTIONS
    // ================
    
    function stringtrim (str) {
      if (str.trim) return str.trim()
      return str.replace(/^\s+|\s+$/g, '')
    }
    
    var BP = Buffer.prototype
    
    /**
     * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
     */
    Buffer._augment = function (arr) {
      arr._isBuffer = true
    
      // save reference to original Uint8Array get/set methods before overwriting
      arr._get = arr.get
      arr._set = arr.set
    
      // deprecated, will be removed in node 0.13+
      arr.get = BP.get
      arr.set = BP.set
    
      arr.write = BP.write
      arr.toString = BP.toString
      arr.toLocaleString = BP.toString
      arr.toJSON = BP.toJSON
      arr.copy = BP.copy
      arr.slice = BP.slice
      arr.readUInt8 = BP.readUInt8
      arr.readUInt16LE = BP.readUInt16LE
      arr.readUInt16BE = BP.readUInt16BE
      arr.readUInt32LE = BP.readUInt32LE
      arr.readUInt32BE = BP.readUInt32BE
      arr.readInt8 = BP.readInt8
      arr.readInt16LE = BP.readInt16LE
      arr.readInt16BE = BP.readInt16BE
      arr.readInt32LE = BP.readInt32LE
      arr.readInt32BE = BP.readInt32BE
      arr.readFloatLE = BP.readFloatLE
      arr.readFloatBE = BP.readFloatBE
      arr.readDoubleLE = BP.readDoubleLE
      arr.readDoubleBE = BP.readDoubleBE
      arr.writeUInt8 = BP.writeUInt8
      arr.writeUInt16LE = BP.writeUInt16LE
      arr.writeUInt16BE = BP.writeUInt16BE
      arr.writeUInt32LE = BP.writeUInt32LE
      arr.writeUInt32BE = BP.writeUInt32BE
      arr.writeInt8 = BP.writeInt8
      arr.writeInt16LE = BP.writeInt16LE
      arr.writeInt16BE = BP.writeInt16BE
      arr.writeInt32LE = BP.writeInt32LE
      arr.writeInt32BE = BP.writeInt32BE
      arr.writeFloatLE = BP.writeFloatLE
      arr.writeFloatBE = BP.writeFloatBE
      arr.writeDoubleLE = BP.writeDoubleLE
      arr.writeDoubleBE = BP.writeDoubleBE
      arr.fill = BP.fill
      arr.inspect = BP.inspect
      arr.toArrayBuffer = BP.toArrayBuffer
    
      return arr
    }
    
    // slice(start, end)
    function clamp (index, len, defaultValue) {
      if (typeof index !== 'number') return defaultValue
      index = ~~index;  // Coerce to integer.
      if (index >= len) return len
      if (index >= 0) return index
      index += len
      if (index >= 0) return index
      return 0
    }
    
    function coerce (length) {
      // Coerce length to a number (possibly NaN), round up
      // in case it's fractional (e.g. 123.456) then do a
      // double negate to coerce a NaN to 0. Easy, right?
      length = ~~Math.ceil(+length)
      return length < 0 ? 0 : length
    }
    
    function isArray (subject) {
      return (Array.isArray || function (subject) {
        return Object.prototype.toString.call(subject) === '[object Array]'
      })(subject)
    }
    
    function isArrayish (subject) {
      return isArray(subject) || Buffer.isBuffer(subject) ||
          subject && typeof subject === 'object' &&
          typeof subject.length === 'number'
    }
    
    function toHex (n) {
      if (n < 16) return '0' + n.toString(16)
      return n.toString(16)
    }
    
    function utf8ToBytes (str) {
      var byteArray = []
      for (var i = 0; i < str.length; i++) {
        var b = str.charCodeAt(i)
        if (b <= 0x7F)
          byteArray.push(str.charCodeAt(i))
        else {
          var start = i
          if (b >= 0xD800 && b <= 0xDFFF) i++
          var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
          for (var j = 0; j < h.length; j++)
            byteArray.push(parseInt(h[j], 16))
        }
      }
      return byteArray
    }
    
    function asciiToBytes (str) {
      var byteArray = []
      for (var i = 0; i < str.length; i++) {
        // Node's code seems to be doing this and not & 0x7F..
        byteArray.push(str.charCodeAt(i) & 0xFF)
      }
      return byteArray
    }
    
    function utf16leToBytes (str) {
      var c, hi, lo
      var byteArray = []
      for (var i = 0; i < str.length; i++) {
        c = str.charCodeAt(i)
        hi = c >> 8
        lo = c % 256
        byteArray.push(lo)
        byteArray.push(hi)
      }
    
      return byteArray
    }
    
    function base64ToBytes (str) {
      return base64.toByteArray(str)
    }
    
    function blitBuffer (src, dst, offset, length) {
      var pos
      for (var i = 0; i < length; i++) {
        if ((i + offset >= dst.length) || (i >= src.length))
          break
        dst[i + offset] = src[i]
      }
      return i
    }
    
    function decodeUtf8Char (str) {
      try {
        return decodeURIComponent(str)
      } catch (err) {
        return String.fromCharCode(0xFFFD) // UTF 8 invalid char
      }
    }
    
    /*
     * We have to make sure that the value is a valid integer. This means that it
     * is non-negative. It has no fractional component and that it does not
     * exceed the maximum allowed value.
     */
    function verifuint (value, max) {
      assert(typeof value === 'number', 'cannot write a non-number as a number')
      assert(value >= 0, 'specified a negative value for writing an unsigned value')
      assert(value <= max, 'value is larger than maximum value for type')
      assert(Math.floor(value) === value, 'value has a fractional component')
    }
    
    function verifsint (value, max, min) {
      assert(typeof value === 'number', 'cannot write a non-number as a number')
      assert(value <= max, 'value larger than maximum allowed value')
      assert(value >= min, 'value smaller than minimum allowed value')
      assert(Math.floor(value) === value, 'value has a fractional component')
    }
    
    function verifIEEE754 (value, max, min) {
      assert(typeof value === 'number', 'cannot write a non-number as a number')
      assert(value <= max, 'value larger than maximum allowed value')
      assert(value >= min, 'value smaller than minimum allowed value')
    }
    
    function assert (test, message) {
      if (!test) throw new Error(message || 'Failed assertion')
    }
    
    },{"base64-js":4,"ieee754":5}],4:[function(require,module,exports){
    var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    ;(function (exports) {
        'use strict';
    
      var Arr = (typeof Uint8Array !== 'undefined')
        ? Uint8Array
        : Array
    
        var ZERO   = '0'.charCodeAt(0)
        var PLUS   = '+'.charCodeAt(0)
        var SLASH  = '/'.charCodeAt(0)
        var NUMBER = '0'.charCodeAt(0)
        var LOWER  = 'a'.charCodeAt(0)
        var UPPER  = 'A'.charCodeAt(0)
    
        function decode (elt) {
            var code = elt.charCodeAt(0)
            if (code === PLUS)
                return 62 // '+'
            if (code === SLASH)
                return 63 // '/'
            if (code < NUMBER)
                return -1 //no match
            if (code < NUMBER + 10)
                return code - NUMBER + 26 + 26
            if (code < UPPER + 26)
                return code - UPPER
            if (code < LOWER + 26)
                return code - LOWER + 26
        }
    
        function b64ToByteArray (b64) {
            var i, j, l, tmp, placeHolders, arr
    
            if (b64.length % 4 > 0) {
                throw new Error('Invalid string. Length must be a multiple of 4')
            }
    
            // the number of equal signs (place holders)
            // if there are two placeholders, than the two characters before it
            // represent one byte
            // if there is only one, then the three characters before it represent 2 bytes
            // this is just a cheap hack to not do indexOf twice
            var len = b64.length
            placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0
    
            // base64 is 4/3 + up to two characters of the original data
            arr = new Arr(b64.length * 3 / 4 - placeHolders)
    
            // if there are placeholders, only get up to the last complete 4 chars
            l = placeHolders > 0 ? b64.length - 4 : b64.length
    
            var L = 0
    
            function push (v) {
                arr[L++] = v
            }
    
            for (i = 0, j = 0; i < l; i += 4, j += 3) {
                tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
                push((tmp & 0xFF0000) >> 16)
                push((tmp & 0xFF00) >> 8)
                push(tmp & 0xFF)
            }
    
            if (placeHolders === 2) {
                tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
                push(tmp & 0xFF)
            } else if (placeHolders === 1) {
                tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
                push((tmp >> 8) & 0xFF)
                push(tmp & 0xFF)
            }
    
            return arr
        }
    
        function uint8ToBase64 (uint8) {
            var i,
                extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
                output = "",
                temp, length
    
            function encode (num) {
                return lookup.charAt(num)
            }
    
            function tripletToBase64 (num) {
                return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
            }
    
            // go through the array every three bytes, we'll deal with trailing stuff later
            for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
                temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
                output += tripletToBase64(temp)
            }
    
            // pad the end with zeros, but make sure to not forget the extra bytes
            switch (extraBytes) {
                case 1:
                    temp = uint8[uint8.length - 1]
                    output += encode(temp >> 2)
                    output += encode((temp << 4) & 0x3F)
                    output += '=='
                    break
                case 2:
                    temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
                    output += encode(temp >> 10)
                    output += encode((temp >> 4) & 0x3F)
                    output += encode((temp << 2) & 0x3F)
                    output += '='
                    break
            }
    
            return output
        }
    
        module.exports.toByteArray = b64ToByteArray
        module.exports.fromByteArray = uint8ToBase64
    }())
    
    },{}],5:[function(require,module,exports){
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m,
          eLen = nBytes * 8 - mLen - 1,
          eMax = (1 << eLen) - 1,
          eBias = eMax >> 1,
          nBits = -7,
          i = isLE ? (nBytes - 1) : 0,
          d = isLE ? -1 : 1,
          s = buffer[offset + i];
    
      i += d;
    
      e = s & ((1 << (-nBits)) - 1);
      s >>= (-nBits);
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);
    
      m = e & ((1 << (-nBits)) - 1);
      e >>= (-nBits);
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);
    
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : ((s ? -1 : 1) * Infinity);
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c,
          eLen = nBytes * 8 - mLen - 1,
          eMax = (1 << eLen) - 1,
          eBias = eMax >> 1,
          rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
          i = isLE ? 0 : (nBytes - 1),
          d = isLE ? 1 : -1,
          s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;
    
      value = Math.abs(value);
    
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
    
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
    
      for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);
    
      e = (e << mLen) | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);
    
      buffer[offset + i - d] |= s * 128;
    };
    
    },{}]},{},[])