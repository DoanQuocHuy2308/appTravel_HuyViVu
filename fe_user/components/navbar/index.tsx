import { View, Image, Text, TouchableOpacity } from 'react-native';
import React from "react";
import { Bell, Search, FileText } from "lucide-react-native";
import { useRouter } from 'expo-router';
export default function Navbar() {
    const router = useRouter();
    return (
        <View className='z-50 sticky py-2 top-0'>
            <View className="flex-row justify-between items-center">
                <TouchableOpacity className="p-2 rounded-full  border border-gray-400 active:bg-gray-300">
                    <FileText size={26} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="flex-1 mx-3 flex-row items-center bg-white rounded-full px-4 py-2 shadow"
                    onPress={() => {router.push('/screens/(search)')}}
                >
                    <Search size={20} color="#555" />
                    <View className="flex-1 ml-2">
                        <Text className="text-base text-[#777]">Tìm kiếm ...</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity className="p-2 rounded-full border border-gray-400 active:bg-gray-300 mr-2">
                    <Bell size={26} color="white" />
                </TouchableOpacity>
                <TouchableOpacity className="rounded-full w-12 h-12 overflow-hidden border border-gray-400 active:bg-gray-300">
                    <Image src='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAALcAAAETCAMAAABDSmfhAAAAkFBMVEXaJR3//wDZEx7slhDYAB7ZHx3ZGx7YDx7//QD++QDcLBv97wDwrQ7+9wD+9QDYBx754AjhXhnvpg/cOBvtoRD1ywvxtw7vqg786wTrmhPeSBvgUxn75AXyswzbMBzkZBbkbRbmexXzvg3rkBDiWhf20Qn41wbqiBLdPhrfThrogBPzuwvmdRX0xgvmcRT31AlBZKkgAAAEnklEQVR4nO3c6XaqMBQFYBM5UdA6Is4TWqdqff+3u8jtgBJQLJhkrf39bq+7cDyZ4JZKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADpSHWAJ+1UB3gK7f29iVdctFlbqA7xhEqHdSqqQzzBqrGapTpEduQwxhzzCrzSD3L3zSsUcQ5yn437YlJ7EOQetE0rFDFkF0PTLrjjh7l9R3WQbGhkh7ntkVmFwg/svwNXHSUTq/eVu2fU0EOO/ZXbnplUKHzLvm1NKhR++sl9Mig3jSc/uSdjcwpFHNivgzlDD00juafGXG+aNSK5G8Z0FDFnUXNTCqX5cZX7o6k60GPIqV3lrhmy6hFH+yr329GMQhEeu+YZkZtGm5vcGyMms2LBbi1MuOC8HstdN2GOYtViuU3Y/6FRLDZjBhR4JV4mQaEYsP/TkuRuqQ51l1g0JLkb2ncU0ZfEZqyveW7q9qS5e129v5nUlsZmTNVGoWgGKhc8jVVOyF22Un8v/JcvH5FzPdHy5HvetN7vuO6wnGw1SMg9WKX81tB1O/361PP80zLn+8JdOyFRnqqd3GcE1qesMeerdSxgQiC6spEwTx/dQrolWcek6s3DYGkV1XP4+HT/85/UGxc42RWl4VshqW3XKXREpea8iK9na94selziu4/7OTLyRy9YEBH/zLdW3pb8NZOAyvo9x9jn9ssWFaLbyS32tJimLUfNxeR+pAdMPgtr2nJ8lEcrP+1fvkMhnOFfZ1q2O1OwDKLm/m+tfLJ+cY18E6O/tPKXNG05ouWztVLdksoVZ2UtXwff875WvBMkZs+08v4rm7Yc8WPWVj44vmhgT8d32Vp57/VNW07M3AyxOyqathxZo/imt1xtrKhpy1nT+5FDdb228C3ZLqxMQ6vcYv1gbMbW2lR3oPn41spUo1Nvmj0+w2pp9HiEOD5a3kGBa3TqLbKM9R1tclP39mQ7zUabo4fEQwY5bZ5RriQdMsiVdTnMtLJt0+py6k37TLEZ0+S1nkqW2eCFq0ehOFm6ycVGi4fZxTxhDls9JSyaa1o8mff1JkM8XZvWCX+RFm89OPLNWW/HS6Irn5a/a1AotJPWyCp8+5JKW2mt7NR3lMgj6r826+8VOx/LbsdK/crYineTqhc5ZBKlafySb5QPPbSLTWHftldv6BIdYj/SUF4oPNZNznQ7rHARq5Wh8kK52fOxXclTvBTbKz8pSHqVaHy9yVabS7dZ6XZwUv3Wg7juJn436f7z2fXTvlu1Qw/3ozVSTnllnmgVPfb0lRY4lSJRNm2RdvNJrM+Rn1b6vwKI4+/F9ujerRci0sqVLut/Xp9jjUfOPaKtXOULd7T7XqFtHtwcFj+T9YHCoYevqmGGaufhTShyvh4wqyqco9D/3tb4zHA2RrT438o9ZdebxmECf5btyvFS+OfWlA09YTex3dTuJ0M8fNpJWUe5dJPJU09Ii/lEYUfhwWfz5y6aaAbzMUVfzGClkzawp6PSStUrvHw6zlzav0jsp6ou+N8aAilfOwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQGH+AVcTO+OsJU/QAAAAAElFTkSuQmCC'
                        className=' w-full h-full' />
                </TouchableOpacity>
            </View>
        </View>
    )
};
