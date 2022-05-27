import accur1 from '@/assets/accur12.png'
import accur2 from '@/assets/accur22.png'
import accur3 from '@/assets/accur32.png'
import accur4 from '@/assets/accur42.png'
import amp1 from '@/assets/amp001.png'
import amp2 from '@/assets/amp002.png'
import amp3 from '@/assets/amp003.png'
import amp4 from '@/assets/amp004.png'
import amp5 from '@/assets/amp005.png'
import amp6 from '@/assets/amp006.png'
import amp7 from '@/assets/amp007.png'
import amp8 from '@/assets/amp008.png'
import amp9 from '@/assets/amp009.png'
import amp10 from '@/assets/amp010.png'

// 添加电量比例
const valtocent = [4.011, 4.006, 4.004, 4.002, 3.997, 3.992, 3.988, 3.985, 3.984, 3.982, 3.980, 3.978,
    3.978, 3.976, 3.976, 3.973, 3.971, 3.970, 3.969, 3.969, 3.968, 3.968, 3.968, 3.967, 3.966,
    3.965, 3.963, 3.960, 3.957, 3.956, 3.954, 3.952, 3.949, 3.946, 3.942, 3.938, 3.936, 3.933,
    3.930, 3.927, 3.924, 3.922, 3.918, 3.915, 3.913, 3.911, 3.909, 3.906, 3.904, 3.900, 3.892,
    3.887, 3.884, 3.881, 3.876, 3.872, 3.868, 3.861, 3.857, 3.852, 3.845, 3.840, 3.837, 3.835,
    3.833, 3.828, 3.823, 3.816, 3.812, 3.807, 3.798, 3.792, 3.789, 3.787, 3.783, 3.779, 3.777,
    3.771, 3.765, 3.760, 3.751, 3.746, 3.742, 3.733, 3.728, 3.725, 3.721, 3.716, 3.707, 3.702,
    3.698, 3.691, 3.680, 3.654, 3.621, 3.571, 3.524, 3.472, 3.403, 3.311, 3.156
]


export default {
    install(Vue) {
        // 全局过滤器
        Vue.filter("userSlice", function(value) {
            return value.toFixed(2)
        })

        Vue.filter("addressSlice", function(value) {
            const arr = value.split("-")
            arr.pop();
            return arr.pop();
            
        })

        // 格式化终端节点的数据
        Vue.prototype.formattweets = (tweets)=> {
            tweets.forEach((tweet)=> {

                // 添加电量图片ADCPIC
                for (let j = 0; j <= 100; j++) {
                    if (1.224 * 4095 / tweet["adc_sensor"] > valtocent[j]) {
                        tweet["electricity"] = 100 - j
                        if (tweet["electricity"] > 90) {
                            tweet["accurimage"] = accur4
                            tweet["ampimage"] = amp1
                        } else if (tweet["electricity"] > 75) {
                            tweet["accurimage"] = accur3
                            tweet["ampimage"] = amp3
                        } else if (tweet["electircity"] > 30) {
                            tweet["accurimage"] = accur2
                            tweet["ampimage"] = amp6
                        } else {
                            tweet["accurimage"] = accur1
                            tweet["ampimage"] = amp10
                        }
                        break
                    } else {
                        tweet["accurimage"] = accur4
                        tweet["electricity"] = 100
                    }
                }

                if (tweet["amplitude"] < 20) {
                        tweet["ampimage"] = amp1
                    } else if (tweet["amplitude"] < 50) {
                        tweet["ampimage"] = amp2
                    } else if (tweet["amplitude"] < 100) {
                        tweet["ampimage"] = amp3
                    } else if (tweet["amplitude"] < 150) {
                        tweet["ampimage"] = amp4
                    } else if (tweet["amplitude"] < 200) {
                        tweet["ampimage"] = amp5
                    } else if (tweet["amplitude"] < 300) {
                        tweet["ampimage"] = amp6
                    } else if (tweet["amplitude"] < 500) {
                        tweet["ampimage"] = amp7
                    } else if (tweet["amplitude"] < 800) {
                        tweet["ampimage"] = amp8
                    } else if (tweet["amplitude"] < 1500) {
                        tweet["ampimage"] = amp9
                    } else {
                        tweet["ampimage"] = amp10
                    }

                tweet["voltage"] = tweet["adc_sensor"];
                tweet["read_time"] = (tweet["read_time"].slice(0, tweet["read_time"].length-5)).replace("T", " ");
            })
            return tweets;
        }

        Vue.prototype.valtocent = valtocent
    }
}