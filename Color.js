

/**颜色的表示方法
//h,s,v 色相，饱和度，明度（色调） h(0-360) s(0-255) v(0-255)
//h, s, l 色相，饱和度，亮度  h(0-360) s(0-255) l(0-255)
RGB: r-红(Red) g-绿(Green) b-蓝(Blue)
CMYK: c-青(Cyan) m-洋红(Magenta) y-黄(Yellow) k-黑(Black)
HSB: h-色泽(Hue) s-饱和度(Saturation) b-亮度(Brightness)
LAB: l-亮度(Light) a-由绿到红 b-由蓝到黄
 */
let Hex = (function(){
	function Hex(h1 = '00', h2 = '00', h3 = '00', a = 1){
		let result = hex_getParam(h1);
		if(result){
			Object.assign(this, result);
		}else{
			this.h1 = h1.length == 1 ? h1 + '0' : h1; 
			this.h2 = h2.length == 1 ? h2 + '0' : h2; 
			this.h3 = h3.length == 1 ? h3 + '0' : h3; 
		}
		this.a = a;
	}
	Hex.prototype.toString = function(){ return hex_toString(this); }
	Hex.prototype.toRgba = function(){ return hex_to_rgba(this); }
	
	function hex_getParam(colorStr){
		if(!colorStr || typeof colorStr !== 'string'){
			return null;
		}
		const reg_HEX = /^\s*#\s*(?:([\da-z])\s*([\da-z])\s*([\da-z])\s*([\da-z])\s*([\da-z])\s*([\da-z])|([\da-z])\s*([\da-z])\s*([\da-z]))\s*/i;
		let arr = colorStr.toLowerCase().match(reg_HEX); // '#abc' 或 '#abcdef'
		if(arr){
			let result = arr[1] != null ? {h1: arr[1] + arr[2], h2: arr[3] + arr[4], h3: arr[5] + arr[6], a: 1} : // 如果是 #abcdef
						 arr[7] != null ? {h1: arr[7] + '0', h2: arr[8] + '0', h3: arr[9] + '0', a: 1} : null // 如果是 #abc
			return result;
		}
		return null;
	}
	function hex_to_rgba ({h1, h2, h3}){
		h1 = h1.length == 1 ? h1 + '0' : h1; 
		h2 = h2.length == 1 ? h2 + '0' : h2; 
		h3 = h3.length == 1 ? h3 + '0' : h3; 
		return {r: parseInt(`0x${h1}`), g: parseInt(`0x${h2}`), b: parseInt(`0x${h3}`), a: 1};
	}
	function hex_toString({h1, h2, h3}){
		return `#${h1}${h2}${h3}`;
	}

	return Hex;
})();

/**
 * 从rgb或rgba或十进制颜色中提取颜色的关键参数
 * @public
 * @param {string} str - rgb 或 rgba 或 颜色的十进制表示
 * @return {object} 对应颜色的参数对象  {r: 255, g: 200, b: 100, a: 0.3, hex: '#aacdef'}
 */
let Rgba = (function(){
	function Rgba(r = 0, g = 0, b = 0, a = 1){
		let result = rgba_getParam(r);
		if(result){
			Object.assign(this, result);
		}else{
			this.r = r; this.g = g; this.b = b;
		}
		this.a = typeof this.a == 'number' ? this.a : a;
	}
	Rgba.prototype.toString = function(type = 'rgba'){ 
		return type === 'rgba' ? rgba_toString(this) : rgb_toString(this); 
	}
	Rgba.prototype.toHex = function(){ return rgba_to_hex(this); }

	function rgba_getParam(colorStr){
		if(!colorStr || typeof colorStr !== 'string'){
			return null;
		}
		const reg_RGBA = /^\s*rgba?\s*\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*(?:,\s*([\d\.]+)\s*)?\)\s*$/i;
		let arr = colorStr.match(reg_RGBA); // 'rgba(43,55,64,0.2)' 或 'rgb(43,55,64)' 
		if(arr){
			arr[4] = arr[4] == null ? 1 : arr[4];
			return {r: +arr[1], g: +arr[2], b: +arr[3], a: +arr[4]};
		}
		return null;
	}
	function rgba_to_hex({r, g, b, a}){
		let first = (+r).toString(16), second = (+g).toString(16), third = (+b).toString(16);
		first = first.length == 1 ? '0' + first : first;
		second = second.length == 1? '0' + second : second;
		third = third.length == 1 ? '0' + third : third;
		return {h1: first, h2: second, h3: third, a: typeof a == 'number' ? a: 1};
	}
	function rgb_toString({r, g, b}){
		return `rgb(${r},${g},${b})`;
	}
	function rgba_toString({r, g, b, a}){
		return `rgba(${r},${g},${b},${a})`;
	}

	return Rgba;
})();



function rgbToHsb(red,green,blue){
	let r = (red / 255.0);
	let g = (green / 255.0);
	let b = (blue / 255.0);

	let max = Math.max(r, g, b);
	let min = Math.min(r, g, b);

	let hue = 0.0;
	if (max == r && g >= b){
		if (max - min == 0) {
			hue = 0.0;
		}else{ 
			hue = 60 * (g - b) / (max - min);
		}
	}else if (max == r && g < b){
		hue = 60 * (g - b) / (max - min) + 360;
	}else if (max == g){
		hue = 60 * (b - r) / (max - min) + 120;
	}else if (max == b){
		hue = 60 * (r - g) / (max - min) + 240;
	}

	let sat = (max == 0) ? 0.0 : (1.0 - (min / max));
	let bri = max;
	
console.log('hsb(' + Math.round(hue) + ',' + Math.round(sat*100) + ',' + Math.round(bri*100) + ')');
}

function hsbToRgb(hue, sat, bri){
	let r = 0;
	let g = 0;
	let b = 0;
	sat = sat/100;
	bri = bri/100;

	if (sat == 0){
		r = g = b = bri;
	}else{
		// the color wheel consists of 6 sectors. Figure out which sector you're in.
		let sectorPos = hue / 60.0;
		let sectorNumber = Math.floor(sectorPos);
		// get the fractional part of the sector
		let fractionalSector = sectorPos - sectorNumber;

		// calculate values for the three axes of the color. 
		let p = bri * (1.0 - sat);
		let q = bri * (1.0 - (sat * fractionalSector));
		let t = bri * (1.0 - (sat * (1 - fractionalSector)));

		// assign the fractional colors to r, g, and b based on the sector the angle is in.
		switch (sectorNumber){
			case 0:
				r = bri;
				g = t;
				b = p;
				break;
			case 1:
				r = q;
				g = bri;
				b = p;
				break;
			case 2:
				r = p;
				g = bri;
				b = t;
				break;
			case 3:
				r = p;
				g = q;
				b = bri;
				break;
			case 4:
				r = t;
				g = p;
				b = bri;
				break;
			case 5:
				r = bri;
				g = p;
				b = q;
				break;
		}
	}
	let red = r * 255;
	let green =  g * 255;
	let blue =  b * 255; 
	console.log('rgb(' + red + ',' + green + ',' + blue + ')');
}