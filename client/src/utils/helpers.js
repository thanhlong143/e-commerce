import icons from "./icons";
const { IoIosStar, /*IoIosStarHalf,*/ IoIosStarOutline } = icons;

export const createSlug = string => string.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").split(" ").join("-");
export const formatMoney = number => Number(number?.toFixed()).toLocaleString();

export const renderStarFromNumber = (number, size) => {
   if (!Number(number)) {
      return;
   }

   const stars = [];

   for (let i = 0; i < +number; i++) stars.push(<IoIosStar color="orange" size={size} />);
   // for (let i = 0.5; i < +number + 0.5; i++) stars.push(<IoIosStarHalf color="orange" size={size} />);
   for (let i = 5; i > +number; i--) stars.push(<IoIosStarOutline color="orange" size={size} />);

   return stars
}

export function secondsToHms(d) {
   d = Number(d) / 1000;
   const h = Math.floor(d / 3600);
   const m = Math.floor(d % 3600 / 60);
   const s = Math.floor(d % 3600 % 60);
   return ({ h, m, s });
}

export const validate = (payload, setInvalidFields) => {
   let invalids = 0;
   const formatPayload = Object.entries(payload);
   for (let array of formatPayload) {
      if (array[1].trim() === "") {
         invalids++;
         setInvalidFields(prev => [...prev, { name: array[0], message: "Require this field." }]);
      }
   }
   return invalids;
}

export const formatRoundPrice = number => Math.round(number / 1000) * 1000;

export const generateRange = (start, end) => {
   const length = end + 1 - start;
   return Array.from({ length }, (_, index) => start + index);
}