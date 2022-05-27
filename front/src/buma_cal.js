export function hex2int4(str) {
    let temp = parseInt(str, 16);
    if ((temp & 0x8000) === 0x8000) {
        return -((temp - 1) ^ 0xFFFF);
    } else {
        return temp;
    }
}

export function hex2int2(str) {
    let temp = parseInt(str, 16);
    if ((temp & 0x80) === 0x80) {
        return -((temp - 1) ^ 0xFF);
    } else {
        return temp;
    }
}

export function diff(ms) {
    const ns = new Array();
    ns.push(hex2int4(ms[0].substring(2, 4) + ms[0].substring(0, 2)))
    for (let i=1; i<ms.length; i++) {
        ns.push(ns[i-1] + hex2int2(ms[i]));
    }
    return ns;
}

export function onebag(oridata) {
    const xs = new Array(), ys = new Array(), zs = new Array();
    let i = 0;
    i += 16;
    xs.push(oridata.substr(i, 4));
    i += 4;
    ys.push(oridata.substr(i, 4));
    i += 4;
    zs.push(oridata.substr(i, 4));
    i += 4;

    while ((oridata.substr(i, 6) !== '00aeae') && (i < (oridata.length - 8))) {
        xs.push(oridata.substr(i, 2));
        ys.push(oridata.substr(i+2, 2));
        zs.push(oridata.substr(i+2+2, 2));
        i += 6;
    }

    return [diff(xs), diff(ys), diff(zs)];
}

export function threebag(oridatas) {
    oridatas = oridatas.split("aeae");
    let xs = [], ys = [], zs = [];
    for (let oridata of oridatas.slice(0, oridatas.length-1)) {
        let [x, y, z] = onebag(oridata + 'aeae');
        xs.push(...x), ys.push(...y), zs.push(...z);
    }
    return {
        x: xs,
        y: ys,
        z: zs
    };
}
