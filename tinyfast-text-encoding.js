// https://github.com/samthor/fast-text-encoding

/*!
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "{}"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright {yyyy} {name of copyright owner}

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/

/**
 * @param {Uint8Array} bytes
 * @return {string}
 */
export function decodeFallback(bytes) {
    var inputIndex = 0;
  
    // Create a working buffer for UTF-16 code points, but don't generate one
    // which is too large for small input sizes. UTF-8 to UCS-16 conversion is
    // going to be at most 1:1, if all code points are ASCII. The other extreme
    // is 4-byte UTF-8, which results in two UCS-16 points, but this is still 50%
    // fewer entries in the output.
    var pendingSize = Math.min(256 * 256, bytes.length + 1);
    var pending = new Uint16Array(pendingSize);
    var chunks = [];
    var pendingIndex = 0;
  
    for (;;) {
      var more = inputIndex < bytes.length;
  
      // If there's no more data or there'd be no room for two UTF-16 values,
      // create a chunk. This isn't done at the end by simply slicing the data
      // into equal sized chunks as we might hit a surrogate pair.
      if (!more || pendingIndex >= pendingSize - 1) {
        // nb. .apply and friends are *really slow*. Low-hanging fruit is to
        // expand this to literally pass pending[0], pending[1], ... etc, but
        // the output code expands pretty fast in this case.
        // These extra vars get compiled out: they're just to make TS happy.
        // Turns out you can pass an ArrayLike to .apply().
        var subarray = pending.subarray(0, pendingIndex);
        var arraylike = /** @type {number[]} */ (
          /** @type {unknown} */ (subarray)
        );
        chunks.push(String.fromCharCode.apply(null, arraylike));
  
        if (!more) {
          return chunks.join("");
        }
  
        // Move the buffer forward and create another chunk.
        bytes = bytes.subarray(inputIndex);
        inputIndex = 0;
        pendingIndex = 0;
      }
  
      // The native TextDecoder will generate "REPLACEMENT CHARACTER" where the
      // input data is invalid. Here, we blindly parse the data even if it's
      // wrong: e.g., if a 3-byte sequence doesn't have two valid continuations.
  
      var byte1 = bytes[inputIndex++];
      if ((byte1 & 0x80) === 0) {
        // 1-byte or null
        pending[pendingIndex++] = byte1;
      } else if ((byte1 & 0xe0) === 0xc0) {
        // 2-byte
        var byte2 = bytes[inputIndex++] & 0x3f;
        pending[pendingIndex++] = ((byte1 & 0x1f) << 6) | byte2;
      } else if ((byte1 & 0xf0) === 0xe0) {
        // 3-byte
        var byte2 = bytes[inputIndex++] & 0x3f;
        var byte3 = bytes[inputIndex++] & 0x3f;
        pending[pendingIndex++] = ((byte1 & 0x1f) << 12) | (byte2 << 6) | byte3;
      } else if ((byte1 & 0xf8) === 0xf0) {
        // 4-byte
        var byte2 = bytes[inputIndex++] & 0x3f;
        var byte3 = bytes[inputIndex++] & 0x3f;
        var byte4 = bytes[inputIndex++] & 0x3f;
  
        // this can be > 0xffff, so possibly generate surrogates
        var codepoint =
          ((byte1 & 0x07) << 0x12) | (byte2 << 0x0c) | (byte3 << 0x06) | byte4;
        if (codepoint > 0xffff) {
          // codepoint &= ~0x10000;
          codepoint -= 0x10000;
          pending[pendingIndex++] = ((codepoint >>> 10) & 0x3ff) | 0xd800;
          codepoint = 0xdc00 | (codepoint & 0x3ff);
        }
        pending[pendingIndex++] = codepoint;
      } else {
        // invalid initial byte
      }
    }
  }
  
  /**
   * @param {string} string
   * @return {Uint8Array}
   */
  export function encodeFallback(string) {
    var pos = 0;
    var len = string.length;
  
    var at = 0; // output position
    var tlen = Math.max(32, len + (len >>> 1) + 7); // 1.5x size
    var target = new Uint8Array((tlen >>> 3) << 3); // ... but at 8 byte offset
  
    while (pos < len) {
      var value = string.charCodeAt(pos++);
      if (value >= 0xd800 && value <= 0xdbff) {
        // high surrogate
        if (pos < len) {
          var extra = string.charCodeAt(pos);
          if ((extra & 0xfc00) === 0xdc00) {
            ++pos;
            value = ((value & 0x3ff) << 10) + (extra & 0x3ff) + 0x10000;
          }
        }
        if (value >= 0xd800 && value <= 0xdbff) {
          continue; // drop lone surrogate
        }
      }
  
      // expand the buffer if we couldn't write 4 bytes
      if (at + 4 > target.length) {
        tlen += 8; // minimum extra
        tlen *= 1.0 + (pos / string.length) * 2; // take 2x the remaining
        tlen = (tlen >>> 3) << 3; // 8 byte offset
  
        var update = new Uint8Array(tlen);
        update.set(target);
        target = update;
      }
  
      if ((value & 0xffffff80) === 0) {
        // 1-byte
        target[at++] = value; // ASCII
        continue;
      } else if ((value & 0xfffff800) === 0) {
        // 2-byte
        target[at++] = ((value >>> 6) & 0x1f) | 0xc0;
      } else if ((value & 0xffff0000) === 0) {
        // 3-byte
        target[at++] = ((value >>> 12) & 0x0f) | 0xe0;
        target[at++] = ((value >>> 6) & 0x3f) | 0x80;
      } else if ((value & 0xffe00000) === 0) {
        // 4-byte
        target[at++] = ((value >>> 18) & 0x07) | 0xf0;
        target[at++] = ((value >>> 12) & 0x3f) | 0x80;
        target[at++] = ((value >>> 6) & 0x3f) | 0x80;
      } else {
        continue; // out of range
      }
  
      target[at++] = (value & 0x3f) | 0x80;
    }
  
    return target.slice(0, at);
  }
  

// ADDED BY ME
  
  let encoder = null;
  /** @param {string} str */
  export function myEncode(str) {
    if (globalThis.TextEncoder) {
      if (!encoder) {
        encoder = new TextEncoder();
      }
      return encoder.encode(str);
    }
    return encodeFallback(str);
  }
  
  let decoder = null;
  /** @param {Uint8Array} bytes */
  export function myDecode(bytes) {
    if (globalThis.TextDecoder) {
      if (!decoder) {
        decoder = new TextDecoder();
      }
      return decoder.decode(bytes);
    }
    return decodeFallback(bytes);
  }
  