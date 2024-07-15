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