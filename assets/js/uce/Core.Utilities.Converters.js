//FAZER ISTO PARA STRINGS!!!!!
//-Several conversion functions

function hex2a(hex) {
    var str = '';
    for (var i = 0; i < hex.length; i += 2)
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    return str;
}

//Usage - DoAsciiHex(value,'A2H') or DoAsciiHex(value,'H2A')

var MCarr = new Array(
"*", "|", ".-", "-...", "-.-.", "-..", ".", "..-.", "--.", "....", "..", ".---", "-.-", ".-..", "--", "-.", "---",
".--.", "--.-", ".-.", "...", "-", "..-", "...-", ".--", "-..-", "-.--", "--..", "-----", ".----", "..---", "...--", "....-",
".....", "-....", "--...", "---..", "----."
);
var ABC012arr = "*|ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function DoMorseDecrypt(x) {
    mess = ""; apos = 0; bpos = 0;
    while (bpos < x.length) {
        bpos = x.indexOf(" ", apos); if (bpos < 0) { bpos = x.length };
        dits = x.substring(apos, bpos); apos = bpos + 1; let = "";
        for (j = 0; j < MCarr.length; j++) { if (dits == MCarr[j]) { let = ABC012arr.charAt(j) } };
        if (let == "") { let = "*" };
        mess += let;
    };
    return mess;
};

function DoMorseEncrypt(x) {
    mess = "";
    for (i = 0; i < x.length; i++) {
        let = x.charAt(i).toUpperCase();
        for (j = 0; j < MCarr.length; j++) { if (let == ABC012arr.charAt(j)) { mess += MCarr[j] } };
        mess += " ";
    };
    mess = mess.substring(0, mess.length - 1);
    return mess;
};


function DoReverse(x) { y = ""; for (i = 0; i < x.length; i++) { y += x.charAt(x.length - 1 - i); }; return y };


function DoCaeserEncrypt(x, shf) {
    abc = "abcdefghijklmnopqrstuvwxyz";
    ABC = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    r1 = ""; r2 = ""; shf = eval(shf);
    for (i = 0; i < x.length; i++) { let = x.charAt(i); pos = ABC.indexOf(let); if (pos >= 0) { r1 += ABC.charAt((pos + shf) % 26) } else { r1 += let }; };
    for (i = 0; i < r1.length; i++) { let = r1.charAt(i); pos = abc.indexOf(let); if (pos >= 0) { r2 += abc.charAt((pos + shf) % 26) } else { r2 += let }; };
    return r2;
};

function DoCaeserDecrypt(x, shf)
{ return DoCaeserEncrypt(x, 26 - shf); };


function MakeCipherABC(abc, key1) {
    abc = abc.toUpperCase(); key1 = key1.toUpperCase();
    cyabc = key1 + abc;
    for (i = 0; i < abc.length; i++) {
        let = cyabc.charAt(i); pos = cyabc.indexOf(let, i + 1);
        while (pos > -1) { cyabc = cyabc.substring(0, pos) + cyabc.substring(pos + 1, cyabc.length); pos = cyabc.indexOf(let, i + 1); };
    };
    return cyabc;
}


function DoVigenere(et, key1, key2, abc, dir, vigtype, altluabc) {
    dt = ""; et = et.toUpperCase(); key1 = key1.toUpperCase(); key2 = key2.toUpperCase(); abc = abc.toUpperCase(); dir = dir.toUpperCase();
    pos = et.indexOf(" ");
    while (pos > -1) { et = et.substring(0, pos) + et.substring(pos + 1, et.length); pos = et.indexOf(" "); };
    cyabc = MakeCipherABC(abc, key1);
    key1 = cyabc;
    lu = cyabc;
    if (vigtype == "N") { lu = abc };
    if (vigtype == "K") { lu = cyabc };
    if (vigtype == "A") { lu = altluabc };
    for (i = 0; i < et.length; i++) {
        let = et.charAt(i); letinabc = abc.indexOf(let);
        if (letinabc < 0) { dt += let; et = et.substring(0, i) + et.substring(i + 1, et.length); i-- }
        else {
            if (dir == "E") { dt += lu.charAt((key1.indexOf(let) + key1.length + key1.indexOf(key2.charAt(i % key2.length))) % key1.length); };
            if (dir == "D") { dt += lu.charAt((key1.indexOf(let) + key1.length - key1.indexOf(key2.charAt(i % key2.length))) % key1.length); };
        };

    };
    return dt;
};

function DoFreqCnt(x, abc) {
    var i, abc, pos, freqs;
    pos = x.indexOf(" "); while (pos > -1) { x = x.substring(0, pos) + x.substring(pos + 1, x.length); pos = x.indexOf(" "); };
    x = x.toUpperCase(); freqs = "";
    letarr = new Array("");
    for (i = 0; i < abc.length; i++) { letarr[i] = 0; };
    for (i = 0; i < x.length; i++) { letarr[abc.indexOf(x.charAt(i))]++ };
    for (i = 0; i < abc.length; i++) { freqs += abc.charAt(i) + ":" + letarr[i] + "/" + x.length + "=" + letarr[i] / x.length + "\n"; };
    return freqs;
}

function DoRowColumnTranspose(et, rowcol, jump, startrow) {
    dt = ""; if ((et == "") || (rowcol == "") || (jump == "") || (startrow == "")) { dt = "You must supply all values"; return dt; }
    maxrow = eval(rowcol.substring(0, rowcol.indexOf(",")));
    maxcol = eval(rowcol.substring(rowcol.indexOf(",") + 1, rowcol.length));
    jump = eval(jump); startrow = eval(startrow);
    if (startrow > maxrow) { dt = "Start Row must be <= Max Rows"; return dt; }
    lin = new Array("");
    for (i = 0; i < maxrow; i++) { lin[i] = et.substring(maxcol * i, maxcol * (i + 1)) };
    row = startrow - 1; col = maxcol - 1; //starting point
    for (i = 0; i < (maxrow * maxcol); i++) {
        dt += lin[row].charAt(col);
        row = row + jump;
        while (row >= maxrow) { row -= maxrow; col -= 1; };
        while (col <= -1) { col += maxcol; row -= 1; };
        while (row <= -1) { row += maxrow; col -= 1; };
        while (col >= maxcol) { col -= maxcol; row -= 1; };
    };
    return dt;
};


function DoModTranspose(et, startlet, jumpinc, modulus) {
    dt = ""; if ((et == "") || (startlet == "") || (jumpinc == "") || (modulus == "")) { dt = "You must supply all values"; return dt; }
    startlet = eval(startlet) - 1; jumpinc = eval(jumpinc); modulus = eval(modulus);
    if (startlet > modulus) { dt = "startlet must be <= maxchar"; return dt; }
    et = escape(et);
    pos = et.indexOf("%0D");
    while (pos > -1) { et = et.substring(0, pos) + et.substring(pos + 3, et.length); pos = et.indexOf("%0D"); };
    pos = et.indexOf("%0A");
    while (pos > -1) { et = et.substring(0, pos) + et.substring(pos + 3, et.length); pos = et.indexOf("%0A"); };
    et = unescape(et);
    for (i = 0; i < (modulus); i++) { dt += et.charAt((startlet + jumpinc * i) % modulus); };
    return dt;
};


function DoAsciiHex(x, dir) {
    hex = "0123456789ABCDEF"; almostAscii = ' !"#$%&' + "'" + '()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[' + '\\' + ']^_`abcdefghijklmnopqrstuvwxyz{|}'; r = "";
    if (dir == "A2H")
    { for (i = 0; i < x.length; i++) { let = x.charAt(i); pos = almostAscii.indexOf(let) + 32; h16 = Math.floor(pos / 16); h1 = pos % 16; r += hex.charAt(h16) + hex.charAt(h1); }; };
    if (dir == "H2A")
    { for (i = 0; i < x.length; i++) { let1 = x.charAt(2 * i); let2 = x.charAt(2 * i + 1); val = hex.indexOf(let1) * 16 + hex.indexOf(let2); r += almostAscii.charAt(val - 32); }; };
    return r;
};


function DoSubstitute(x, orig, sub, dir) {
    x = x.toUpperCase(); r = "";
    if (dir == "e")
    { for (i = 0; i < x.length; i++) { let = x.charAt(i); pos = orig.indexOf(let); if (pos > -1) { r += sub.charAt(pos) } else { r += let } } };
    if (dir == "d")
    { for (i = 0; i < x.length; i++) { let = x.charAt(i); pos = sub.indexOf(let); if (pos > -1) { r += orig.charAt(pos) } else { r += let } } };
    return r;
};

function SwitchEm(x, a, b) {
    posA = x.indexOf(a);
    posB = x.indexOf(b);
    r1 = x.substring(0, posA) + b + x.substring(posA + 1, x.length);
    r2 = r1.substring(0, posB) + a + r1.substring(posB + 1, r1.length);
    return r2;
};





function MakePlayfairSquare(abc, key1) {
    cyabc = MakeCipherABC(abc, key1);
    row = new Array(); for (i = 0; i < 5; i++) { row[i] = "" };
    for (i = 0; i < 5; i++) { for (j = 0; j < 5; j++) row[i] += cyabc.charAt(5 * i + j); };
    sqr = ""; for (i = 0; i < 5; i++) { sqr += row[i] + "\n" };
    return sqr;
};


function DoPlayfair(et, abc, key1, dir, dup) {
    et = et.toUpperCase(); abc = abc.toUpperCase(); key1 = key1.toUpperCase();
    pos = et.indexOf(" ");
    while (pos > -1) { et = et.substring(0, pos) + et.substring(pos + 1, et.length); pos = et.indexOf(" "); };

    pos = et.indexOf("?");
    while (pos > -1) { et = et.substring(0, pos) + et.substring(pos + 1, et.length); pos = et.indexOf("?"); };

    for (i = 0; i < et.length; i = i + 2)
    { let1 = et.charAt(i); let2 = et.charAt(i + 1); if (let1 == let2) { et = et.substring(0, i + 1) + "X" + et.substring(i + 1, et.length) }; };
    if ((et.length % 2) == 1) { et += 'X' }

    if (dup != "") {
        pos = et.indexOf(dup);
        while (pos > -1) { et = et.substring(0, pos) + "I" + et.substring(pos + 1, et.length); pos = et.indexOf(dup); };
    };

    cyabc = MakeCipherABC(abc, key1)
    row = new Array(); for (i = 0; i < 5; i++) { row[i] = "" };
    for (i = 0; i < 5; i++) { for (j = 0; j < 5; j++) row[i] += cyabc.charAt(5 * i + j); };

    shf = 1; if (dir == "E") { shf = 1 }; if (dir == "D") { shf = 4 };

    dt = "";
    for (i = 0; i < et.length; i = i + 2) {
        pos1 = cyabc.indexOf(et.charAt(i)); pos2 = cyabc.indexOf(et.charAt(i + 1));
        x1 = pos1 % 5; y1 = Math.floor(pos1 / 5); x2 = pos2 % 5; y2 = Math.floor(pos2 / 5);

        if (y1 == y2) { x1 = (x1 + shf) % 5; x2 = (x2 + shf) % 5 }
        else if (x1 == x2) { y1 = (y1 + shf) % 5; y2 = (y2 + shf) % 5 }
        else { temp = x1; x1 = x2; x2 = temp };

        dt += row[y1].charAt(x1) + row[y2].charAt(x2);
    };


    return dt;
};


var Convert = {
    chars: " !\"#$%&amp;'()*+'-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~",
    hex: '0123456789ABCDEF', bin: ['0000', '0001', '0010', '0011', '0100', '0101', '0110', '0111', '1000', '1001', '1010', '1011', '1100', '1101', '1110', '1111'],
    decToHex: function (d) {
        return (this.hex.charAt((d - d % 16) / 16) + this.hex.charAt(d % 16));
    },
    toBin: function (ch) {
        var d = this.toDec(ch);
        var l = this.hex.charAt(d % 16);
        var h = this.hex.charAt((d - d % 16) / 16);
        var hhex = "ABCDEF";
        var lown = l < 10 ? l : (10 + hhex.indexOf(l));
        var highn = h < 10 ? h : (10 + hhex.indexOf(h));
        return this.bin[highn] + ' ' + this.bin[lown];
    },
    toHex: function (ch) {
        return this.decToHex(this.toDec(ch));
    },
    toDec: function (ch) {
        var p = this.chars.indexOf(ch);
        return (p <= -1) ? 0 : (p + 32);
    }
};