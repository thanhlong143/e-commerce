import { useEffect, useState } from "react"

const useDebounce = (value, ms) => {
   const [debounceValue, setDebounceValue] = useState("");
   useEffect(() => {
      const setTimeOutId = setTimeout(() => {
         setDebounceValue(value)
      }, ms);
      return () => {
         clearTimeout(setTimeOutId);
      }
   }, [value, ms]);
   return debounceValue;
}

export default useDebounce;

// Muốn: khi mà nhập thay đổi giá thì sẽ gọi api
// Vấn đề: gọi api liên tục theo mỗi lượt nhập
// resolve: chỉ call api khi mà người dùng nhập xong
// Thời gian onchange

// Tách price thành 2 biến
// 1. Biến để phục vụ UI, gõ tới đâu thì lưu tới đó => UI render
// 2. Biến thứ 2 dùng quyết định call api => settimeout => biến sẽ gán sau 1 khoảng thời gian