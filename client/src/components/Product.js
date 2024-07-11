import React from 'react';
import { formatMoney } from '../utils/helpers';
import label from '../assets/blank-red-label.png';
import labelBlue from '../assets/blank-blue-label.png';
import defaultThumb from '../assets/Default Product Images.png';

const Product = ({ productData, isNew }) => {
   return (
      <div className='w-full text-base px-[10px]'>
         <div className='w-full border p-[15px] flex flex-col items-center'>
            <div className='w-full relative'>
               <img
                  src={productData?.thumb || defaultThumb}
                  alt=''
                  className='w-[243px] h-[243px] object-cover'
               />
               <img src={isNew ? label : labelBlue} alt=''
                  className={
                     `absolute ${isNew
                        ? 'w-[150px] top-[-39px] left-[-50px] '
                        : 'w-[150px] top-[-39px] left-[-50px] '} object-contain
                     `
                  }
               />
               <span className={`font-bold top-[-10px] ${isNew ? 'left-[4px]' : 'left-[-14px]' } text-white absolute`}>{isNew ? 'New' : 'Trending'}</span>
            </div>
            <div className='flex flex-col gap-1 mt-[15px] items-start w-full'>
               <span className='line-clamp-1'>{productData?.title}</span>
               <span>{`${formatMoney(productData?.price)} VND`}</span>
            </div>
         </div>
      </div>
   )
}

export default Product;