import { Food } from './types';

export const FOOD_DATA: Food[] = [
  { id:1, name:"經典滷肉飯", region:"北部", city:"台北", emoji:"🍚", rating:4.8, price:"$40-65", reviews:125, desc:"在地傳承三十年的秘製滷汁，入口即化的手切黑豬五花肉。", tags:["飯類","銅板美食"], type:"飯食", featured:true, latest:false },
  { id:2, name:"紅燒牛肉麵", region:"北部", city:"台北", emoji:"🍜", rating:4.9, price:"$180-250", reviews:310, desc:"大火慢熬24小時牛骨湯底，搭配特選澳洲腱子心。", tags:["麵食","經典"], type:"麵食", featured:true, latest:false },
  { id:3, name:"鼎泰豐小籠包", region:"北部", city:"台北", emoji:"🥟", rating:4.7, price:"$220-450", reviews:980, desc:"黃金十八摺的極致工藝，薄皮嫩餡飽含鮮甜湯汁。", tags:["點心","米其林"], type:"點心", featured:true, latest:false },
  { id:4, name:"珍珠奶茶", region:"中部", city:"台中", emoji:"🧋", rating:4.6, price:"$55-85", reviews:420, desc:"台中的驕傲，Q彈珍珠與香濃奶茶的完美協奏曲。", tags:["飲品","必喝"], type:"飲品", featured:false, latest:true },
  { id:5, name:"台南擔仔麵", region:"南部", city:"台南", emoji:"🍜", rating:4.5, price:"$50-80", reviews:215, desc:"蝦頭熬製的精華湯頭，佐以百年傳承的獨門肉燥。", tags:["麵食","在地"], type:"麵食", featured:false, latest:false },
  { id:6, name:"棺材板", region:"南部", city:"台南", emoji:"🍞", rating:4.2, price:"$60-90", reviews:89, desc:"外酥內軟的油炸吐司，包覆著香濃的海鮮白醬。", tags:["創意小吃"], type:"點心", featured:false, latest:true },
  { id:7, name:"花蓮手工麻糬", region:"東部", city:"花蓮", emoji:"🍡", rating:4.4, price:"$30-100", reviews:156, desc:"選用花蓮在地糯米，堅持每日手工現擣，口感彈牙。", tags:["甜點","伴手禮"], type:"甜點", featured:false, latest:false },
  { id:8, name:"蚵仔煎", region:"北部", city:"基隆", emoji:"🍳", rating:4.3, price:"$60-85", reviews:180, desc:"鮮甜蚵仔搭配特調太白粉漿與甜辣醬，夜市必嘗美味。", tags:["夜市小吃","熱門"], type:"小吃", featured:false, latest:true },
  { id:9, name:"萬巒豬腳", region:"南部", city:"屏東", emoji:"🍖", rating:4.8, price:"$300-600", reviews:270, desc:"外皮Q彈帶勁，肉質扎實不油膩，蒜泥沾醬更是一絕。", tags:["肉料理","特色美食"], type:"肉類", featured:true, latest:false },
  { id:10, name:"嘉義雞肉飯", region:"中部", city:"嘉義", emoji:"🍗", rating:4.7, price:"$45-75", reviews:340, desc:"特選火雞肉手撕成絲，淋上純雞油，香氣撲鼻。", tags:["在地經典","必吃"], type:"飯食", featured:true, latest:false },
  { id:11, name:"阿給", region:"北部", city:"淡水", emoji:"🥘", rating:4.1, price:"$40-55", reviews:120, desc:"油豆腐塞入粉絲後封口，淡水獨有的河岸美味。", tags:["地方特色","古早味"], type:"小吃", featured:false, latest:false },
  { id:12, name:"宜蘭蔥油餅", region:"東部", city:"宜蘭", emoji:"🥞", rating:4.6, price:"$35-50", reviews:210, desc:"滿滿的三星蔥包覆在酥脆麵皮中，咬下瞬間香氣噴發。", tags:["夜市","小資美食"], type:"小吃", featured:false, latest:true },
  { id:13, name:"深坑臭豆腐", region:"北部", city:"深坑", emoji:"🧆", rating:4.5, price:"$50-120", reviews:195, desc:"獨特的焦香味與軟嫩口感，不管是清蒸還是麻辣都適合。", tags:["夜市","特色料理"], type:"小吃", featured:false, latest:false },
  { id:14, name:"澎湖海膽炒蛋", region:"外島", city:"澎湖", emoji:"🍱", rating:4.9, price:"$250-400", reviews:85, desc:"選用當季新鮮海膽，與滑嫩蛋液結合，海味爆炸。", tags:["海鮮","期間限定"], type:"海鮮", featured:true, latest:true },
  { id:15, name:"台南牛肉湯", region:"南部", city:"台南", emoji:"🥣", rating:4.9, price:"$100-200", reviews:560, desc:"清晨現宰溫體牛倒入熱湯瞬間燙熟，最鮮甜的南台早點。", tags:["必喝湯品","現燙"], type:"湯品", featured:true, latest:false }
];

export const REGIONS = ["全部","北部","中部","南部","東部","外島"];
export const TYPES = ["全部","飯食","麵食","點心","飲品","小吃","甜點","肉類","湯品","海鮮"];
