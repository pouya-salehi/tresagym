// utils/helper/replaceNumber.js

// تبدیل اعداد انگلیسی به فارسی
export const e2p = (s) => {
  if (s == null) return "۰";
  return s.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);
};

// تبدیل اعداد فارسی به انگلیسی
export const p2e = (s) => {
  if (s == null) return 0;
  return s.toString().replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d));
};

// فرمت کردن عدد با جداکننده هزارگان و تبدیل به فارسی
export const sp = (number) => {
  if (number == null || isNaN(number)) number = 0;
  const separatedNumber =
    number
      .toString()
      .match(/\d{1,3}(?=(\d{3})*$)/g)
      ?.join(",") || "0";
  return e2p(separatedNumber);
};

// محاسبه قیمت نهایی بر اساس تخفیف
export const getFinalPrice = (product) => {
  if (!product) return 0;

  const { price = 0, discount = {} } = product;
  const now = new Date();

  if (
    discount &&
    discount.percent > 0 &&
    discount.active !== false &&
    (!discount.startDate || new Date(discount.startDate) <= now) &&
    (!discount.endDate || new Date(discount.endDate) >= now)
  ) {
    return price - (price * discount.percent) / 100;
  }

  return price;
};