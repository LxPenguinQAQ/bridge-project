var codeBook = {
    'f': '0', 
    'd': '1', 
    'e': '2', 
    'c': '3', 
    '7': '4', 
    '5': '5', 
    '6': '6', 
    '4': '7', 
    'b': '8', 
    '9': '9',      
    'a': 'a',
    '8': 'b', 
    '3': 'c', 
    '1': 'd', 
    '2': 'e', 
    '0': 'f'
}

export function hexToInt(strData) {
    var temp = parseInt(strData, 16)
    if (temp & 32768 !== 32768) {
        return temp
    } else {
        return -(65535-temp+1)
    }
}

export function calxyzs(xyzData) {
    var xs = []
    var ys = []
    var zs = []
    var xyzinx = 0
    var inx = 0

    while (inx < xyzData.length) {
        if (xyzData.substr(inx, 4) === "abad") {
            inx += 12
            xyzinx = 0
            continue
        }
        if (xyzData.substr(inx, 4) === "aeae") {
            if (xyzData.substr(inx+4, 4) === "abad") {
                inx+= 16
                xyzinx = 0
                continue
            } else {
                break
            }
        }

        var xhl = hexToInt(codeBook[xyzData[inx + 0]] + codeBook[xyzData[inx + 1]] + codeBook[xyzData[inx + 2]] + codeBook[xyzData[inx + 3]]) / 32768 * 16
        if (xyzinx === 0) {
            xs.push(xhl)
            xyzinx = 1
        } else if (xyzinx === 1) {
            ys.push(xhl)
            xyzinx = 2
        } else if (xyzinx === 2) {
            zs.push(xhl)
            xyzinx = 0
        }
        inx += 4 
    }
    return {
        x: xs,
        y: ys,
        z: zs
    }
}

// var readData = "abad02000002faffd30049fff4ffef0043fff6ffd0004bfffaffd8004bfffbffd0004afffbffd10048fff6ffd1004afff4ffd0004bfffbffef0049fff9ffd20044fff9ffd10044fff4ffd20049fff6ffd10048fffbffd1004bfffbffd1004afffbffd20046fff4ffef0043fffbffd10049fff8ffd30049fffbffef0049ffaeaeabad02010003fbffd10043fff5ffef0041fff4ffd00041fff9ffd2004afff4ffd2004bfff9ffd20044fff5ffd0004bfff4ffd2004afff9ffd00049fffbffd1004bfff9ffd10044fff9ffd3004bfffaffd1004bfffaffd10044fffbffd00049fffbffd10049fff5ffd1004afff9ffd00043fffaffd10049fff4ffd2004bffaeaeabad02020004fbffd1004bfff9ffd2004afff9ffd30044fff9ffd10049fff7ffef004afff8ffd00044fff4ffd00048fffbffd1004afff4ffd2004bfffbffda0046fff6ffd1004bfff5ffd0004afffbffd30049fff7ffed004afff7ffef004bfff6ffd3004bfff4ffd20044fffaffd3004bfffbffef0049fffbffd10048ffaeaeabad02030006f4ffd0004bfff4ffd20046fffbffd1004bfff9ffd0004afff6ffd30049fff6ffd1004bfff4ffd1004afff4ffd2004afffbffd30049fff7ffd20046fff4ffd0004afff4ffd3004bfff9ffd3004afffbffd00049fff9ffd1004afff4ffd20043fff9ffd0004bfff6ffd20049fff4ffd10041fffbffd80049ffaeaeabad02040009f6ffef0046fffbffd20044fff3ffd1004afff6ffd10043fff9ffd30049fffbffd10043fff6ffd20049fff5ffd10046fffbffd3004afff4ffed0043fffbffd3004afffbffd1004afffbffd00044fff4ffd3004afffbffd2004bfffbffd1004bfffbffd1004afff4ffd10044fff4ffd2004bfff8ffd1004affaeaeabad0205000df5ffef004afff4ffd20048fffbffd20048fff9ffd00044fff9ffd20049fff9ffd00048fffbffd00044fff4ffd00043fff1ffd8004afff6ffd2004bfff9ffd20049fff4ffd10049fff4ffd20049fffbffd00049fffbffd10043fff4ffef004bfff6ffd00048fff4ffd30049fff6ffd00049fff4ffd20045ffaeaeabad0206000ff6ffd00049fff9ffd10045fffaffd1004bfff4ffd0004afffaffd30044fffbffd1004bfffbffd1004bfff9ffd30046fff4ffd00043fff9ffd2004afff9ffd1004afff6ffd1004bfff5ffd1004afffbffd10043fffbffd20046fff4ffd20049fff6ffef004bfff9ffd20048fff4ffed0046fffaffd2004affaeaeabad02070010f6ffd1004afff4ffed004bfffbffda004bfff6ffd20049fff6ffd00043fffbffd00049fffbffd2004bfffbffd8004bfffbffd8004afff9ffd20048fff9ffd1004afff9ffd20043fff5ffd1004afff6ffd3004bfff4ffee004afff6ffd80049fff6ffd2004afff4ffd30049fff4ffd20048fffbffd80048ffaeaeabad02080011f5ffed004afff6ffd00044fff6ffd2004afffbffd10043fff6ffd20049fff4ffd20048fffbffd30046fff5ffd1004bfff4ffd10048fff4ffd00044fff4ffd10044fff4ffd0004bfff4ffd30049fffbffd1004bfff9ffd2004bfff6ffd10049fff9ffd1004afff4ffef004bfff9ffd20049fff9ffd1004bffaeaeabad02090013faffd00044fffbffef004afff9ffd10049fff4ffd2004bfff4ffd0004afff6ffd0004bfff4ffd00048fff4ffd20048fffbffd8004bfffaffd3004afff9ffd20048fffaffd2004afff4ffd00044fffaffd2004bfff9ffd30049fff6ffef004afff9ffd2004afff9ffd00049fff4ffd30044fffbffd10044ffaeaeabad020a0014f9ffd0004bfff9ffd80043fffbffd3004afffaffd3004afff6ffd00049fff9ffd20046fff9ffd3004afffbffd2004bfff6ffd00049fffaffd00044fffbffef004afffbffd2004bfff6ffd3004afffbffd00046fff4ffd10048fffbffd00049fffbffd10044fff4ffd2004afffbffd30043fff4ffef0049ffaeaeabad020b0015f4ffd0004afff4ffd20043fff4ffd20048fffbffd0004bfffbffd10049fff5ffd00049fff4ffd10049fff9ffd1004bfff9ffd10045fff4ffd30048fff9ffd1004afff4ffd2004bfffaffd2004afff6ffd10041fff4ffd2004afff4ffd10049fff9ffd2004bfff4ffd3004bfffaffd80049fff9ffd20045ffaeaeabad020c0017f9ffd1004bfff4ffd00049fffbffd1004bfffaffd10049fffbffd00049fffbffd0004afffbffd0004bfff9ffd20045fff4ffd00048fff5ffef0044fff5ffef0049fff4ffd1004afffbffd30043fffbffd20041fff4ffd10049fff4ffd00044fff4ffd20041fff4ffd1004afff9ffd1004bfff6ffd0004affaeaeabad020d0018faffd80049fff4ffd10048fffbffd20048fffbffd10049fff4ffd10045fffbffd20049fff4ffd3004afff4ffd10046fffbffd1004bfff9ffd00046fff9ffd10048fffbffd2004bfff9ffd2004afffbffd30045fff9ffd10041fff6ffd30043fff4ffd00049fffaffd30049fff6ffd2004bfff4ffd1004affaeaeabad020e0019f9ffd30043fff4ffd20043fffbffd20049fffbffd20044fff4ffd20049fffbffd10044fff9ffd3004bfff5ffef004afff4ffd2004bfffaffd10044fff4ffd1004bfff8ffd30044fff6ffd20049fffaffd20046fffbffd00049fffbffef0049fff4ffef004bfff9ffd30049fff6ffef004bfff5ffd00049ffaeaeabad020f001bf4ffef004bfff4ffd0004afff6ffd10048fff4ffd00049fffaffd1004afffbffd1004bfffbffd30048fff8ffd1004afff6ffd3004bfff6ffd0004bfffaffd2004bfff9ffd1004bfffaffd00049fff4ffd20045fffbffd0004afff9ffd30049fff5ffd0004bfff4ffd30049fff5ffd00049fff9ffd1004bffaeaeabad0210001df4ffd1004afff5ffd20049fff9ffd20043fffbffd30049fffaffd1004afff9ffd20044fff6ffd10048fff6ffd10048fffbffd2004bfff9ffd10049fffbffd10044fff5ffed004bfff4ffef0049fff5ffee004bfffbffef004bfffbffd20049fff9ffef004bfffbffd00049fff4ffd20044fffbffd1004affaeaeabad0211001ef9ffd8004bfff4ffd10048fffbffd10046fff6ffd2004afffbffd10044fff4ffd00049fff4ffd0004bfff9ffd00044fff4ffd10044fff4ffd20049fff6ffd20041fff4ffed0049fffbffd20048fff4ffd30046fff9ffd1004bfffcffef0049fff6ffd20049fff6ffd0004afff9ffd3004afff9ffd30043ffaeaeabad0212001ffbffd2004bfffaffd10046fff6ffef0048fffbffd20046fffbffd20044fffbffd2004bfff5ffd00048fff4ffd80048fffaffd30049fff9ffd80048fffbffd10046fffbffd10043fff4ffd00044fffbffef0044fff6ffd0004afffbffd2004afffbffd80049fffbffd2004afff6ffd00046fff4ffd3004affaeaeabad02130021faffd30046fff4ffd30048fff9ffd2004bfff5ffd10044fff6ffef004bfffbffd20048fffbffd10049fff6ffd10049fff4ffd2004afffbffd00043fff4ffef004bfff6ffd20044fff4ffd20044fffbffd00048fff4ffd20049fff5ffd00046fff4ffed0049fffbffd20042fff5ffd2004afff4ffef004bffaeaeabad02140022f6ffd2004afff6ffd20049fff4ffd00049fff9ffd30044fffbffd2004bfffbffd10043fff6ffd0004bfff4ffd10044fffbffd3004afff4ffd2004bfff4ffd10044fffbffd80043fff9ffd20043fff9ffd00047fffbffd00048fff4ffd2004afffaffd1004bfffaffd2004afff5ffd0004afff6ffd10049ffaeaeabad02150023fbffd10049fff4ffd00049fffbffd00046fff9ffd2004bfffaffd0004bfff4ffd2004afff9ffef0049fffbffd20043fffaffd80049fff5ffed004bfff9ffd20049fff6ffd20049fff4ffd2004bfffaffd30049fff9ffd20049fff4ffd30046fffbffd2004bfff4ffd1004bfffbffd0004afff5ffef0049ffaeaeabad02160025f4ffd0004afffbffd0004bfffbffd20046fff9ffd20049fff9ffd20049fff4ffd2004bfff5ffee004afff4ffef0044fff6ffd0004afffbffd2004afffbffd10049fff4ffd20044fff9ffef004bfff9ffd10047fff9ffd2004bfff6ffd10048fff9ffd20044fff4ffd0004afff9ffd1004bfff5ffd10048ffaeaeabad02170026f9ffd20049fff4ffef0046fffbffd3004afffcffed0048fff9ffd10049fff4ffd10046fff9ffd20049fffbffd30049fffaffd3004bfff9ffd80044fffbffd20044fff6ffd1004afff9ffd3004bfffbffd10049fff4ffd1004bfffbffd3004bfffaffd2004bfffaffd8004afff5ffd10044fff4ffd20045ffaeaeabad02180027fbffef004bfff6ffd0004bfff4ffd00044fff5ffd00048fffaffd30046fff4ffd0004afff4ffd20046fff4ffd20049fff9ffda0044fff6ffef004bfff8ffd00049fff9ffd20049fff4ffd0004afffbffd2004afff9ffd30043fffbffd20045fff6ffd0004afff4ffd20049fffbffef004bfff4ffd10048ffaeae"

// const result = calxyzs(readData)
// console.log(result.y.length)