var str = "abcchhsbbskholaallsaldliweilhhil"
var length = str.length
console.log("length: ", length)
var start = 0
var end = 0

str = str.split("")
console.log(str)

for (var i = 0; i <= length; i++) {
	if (str[i+1] == str[i]) {
		start = i
		for (var j = start; j <= length; j++) {
			if (str[j+1] != str[j]) {
				end = j
				break
			}
		}
		if (end-start+1 > 0) {
			str.splice(start, end-start+1)
			console.log(start, end)
		}
	}
}

console.log(str)