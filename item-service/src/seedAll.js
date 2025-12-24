import mongoose from "mongoose";
import dotenv from "dotenv";
import Laptop from "./models/laptop.model.js";
import Category from "./models/category.model.js";

dotenv.config();

// Brands and Categories to seed
const brands = [
  "Apple",
  "Dell",
  "HP",
  "Lenovo",
  "Asus",
  "Acer",
  "MSI",
  "Razer",
  "Microsoft",
  "Samsung",
  "LG",
  "Huawei",
  "Alienware",
  "Gigabyte",
];

const categories = [
  "Ultrabook",
  "Gaming",
  "Business",
  "2-in-1",
  "Creator",
  "Modular",
  "Budget",
  "Workstation",
];

// 50+ Laptop data
const laptops = [
  {
    Brand: "Apple",
    Model: "MacBook Pro 14",
    Spec: "M3 Pro, 16GB RAM, 512GB SSD",
    category: "Creator",
    description: "Powerful creator laptop with stellar battery life.",
    image_url:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp14-spacegray-select-202310?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1696987339082",
    price: 1999,
  },
  {
    Brand: "Apple",
    Model: "MacBook Air M2",
    Spec: "M2, 8GB RAM, 256GB SSD",
    category: "Ultrabook",
    description: "Lightweight and powerful for everyday use.",
    image_url:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mba13-midnight-select-202402?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1708367688034",
    price: 1199,
  },
  {
    Brand: "Dell",
    Model: "XPS 13 Plus",
    Spec: "Intel i7, 16GB RAM, 1TB SSD",
    category: "Ultrabook",
    description: "Premium thin-and-light with InfinityEdge display.",
    image_url:
      "https://i.dell.com/is/image/DellContent//content/dam/ss2/product-images/page/category/laptop/xps-13-9315-t-gray-cn-800x620.png",
    price: 1799,
  },
  {
    Brand: "Dell",
    Model: "XPS 15",
    Spec: "Intel i9, 32GB RAM, 1TB SSD, RTX 4060",
    category: "Creator",
    description: "Professional creator laptop with powerful GPU.",
    image_url:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/xps-notebooks/xps-15-9530/media-gallery/notebook-xps-15-9530-nt-blue-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full",
    price: 2499,
  },
  {
    Brand: "Dell",
    Model: "Inspiron 15",
    Spec: "Intel i5, 8GB RAM, 512GB SSD",
    category: "Budget",
    description: "Affordable laptop for everyday computing.",
    image_url:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/inspiron-notebooks/inspiron-15-3520/media-gallery/notebook-inspiron-15-3520-nt-blue-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&wid=3500&hei=2625&qlt=100,1&resMode=sharp2&size=3500,2625&chrss=full&imwidth=5000",
    price: 649,
  },
  {
    Brand: "Lenovo",
    Model: "ThinkPad X1 Carbon",
    Spec: "Intel i7, 32GB RAM, 1TB SSD",
    category: "Business",
    description: "Lightweight business laptop with legendary keyboard.",
    image_url:
      "https://p3-ofp.static.pub/fes/cms/2022/08/12/i7jtthen6pvnor2famt50h2fjhwi6o770967.png",
    price: 1899,
  },
  {
    Brand: "Lenovo",
    Model: "Legion 5 Pro",
    Spec: "AMD Ryzen 7, RTX 4070, 16GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Mid-range gaming laptop with excellent cooling.",
    image_url:
      "https://p3-ofp.static.pub/fes/cms/2023/04/13/0dxnso69zqx4wc0ijjkskl7k29u2g5284155.png",
    price: 1599,
  },
  {
    Brand: "Lenovo",
    Model: "Yoga 9i",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "2-in-1",
    description: "Premium convertible with soundbar hinge.",
    image_url:
      "https://p3-ofp.static.pub/fes/cms/2023/03/23/6k0m9w0rcddmstaqk36fxbgxoq1gzd159969.png",
    price: 1749,
  },
  {
    Brand: "Asus",
    Model: "ROG Zephyrus G14",
    Spec: "AMD Ryzen 9, RTX 4060, 16GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Compact gaming powerhouse with high refresh display.",
    image_url:
      "https://dlcdnwebimgs.asus.com/gain/8ef84b6f-062b-42f1-98c8-6f4595fe2c24/",
    price: 1699,
  },
  {
    Brand: "Asus",
    Model: "ZenBook 14 OLED",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Stunning OLED display in a portable form factor.",
    image_url:
      "https://dlcdnwebimgs.asus.com/gain/0b5d9f0c-8b57-4b4e-a0e0-e9d8e29e7e8e/",
    price: 1299,
  },
  {
    Brand: "Asus",
    Model: "ProArt Studiobook",
    Spec: "Intel i9, RTX 4080, 64GB RAM, 2TB SSD",
    category: "Workstation",
    description: "Professional workstation for content creators.",
    image_url:
      "https://dlcdnwebimgs.asus.com/gain/ba8b8b1d-9f50-4f1b-8c8c-7c9c9f0f0f0f/",
    price: 3499,
  },
  {
    Brand: "HP",
    Model: "Spectre x360 14",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "2-in-1",
    description: "Convertible with OLED display and premium build.",
    image_url:
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c07965322.png",
    price: 1599,
  },
  {
    Brand: "HP",
    Model: "Pavilion 15",
    Spec: "Intel i5, 8GB RAM, 256GB SSD",
    category: "Budget",
    description: "Affordable all-rounder for students and home use.",
    image_url:
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08267192.png",
    price: 599,
  },
  {
    Brand: "HP",
    Model: "Omen 16",
    Spec: "Intel i7, RTX 4070, 16GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Gaming laptop with RGB keyboard and powerful performance.",
    image_url:
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08267192.png",
    price: 1799,
  },
  {
    Brand: "Acer",
    Model: "Swift Go 14",
    Spec: "Intel i5, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Lightweight everyday laptop with long battery life.",
    image_url:
      "https://static.acer.com/up/Resource/Acer/Notebooks/Swift_Go_14/Images/20230529/Swift_Go_14_SFG14-42_Fingerprint_modelmain.png",
    price: 1099,
  },
  {
    Brand: "Acer",
    Model: "Predator Helios 300",
    Spec: "Intel i7, RTX 4060, 16GB RAM, 512GB SSD",
    category: "Gaming",
    description: "Aggressive gaming design with powerful specs.",
    image_url:
      "https://static.acer.com/up/Resource/Acer/Laptops/Predator_Helios_300/Images/20220324/Predator_Helios_300_PH315_55_modelpreview.png",
    price: 1499,
  },
  {
    Brand: "Acer",
    Model: "Aspire 5",
    Spec: "AMD Ryzen 5, 8GB RAM, 512GB SSD",
    category: "Budget",
    description: "Value laptop for everyday tasks.",
    image_url:
      "https://static.acer.com/up/Resource/Acer/Laptops/Aspire_5/Images/20220324/Aspire_5_A515_57_modelpreview.png",
    price: 549,
  },
  {
    Brand: "MSI",
    Model: "Stealth 15M",
    Spec: "Intel i7, RTX 4060, 16GB RAM, 512GB SSD",
    category: "Gaming",
    description: "Slim gaming laptop that doesn't look like one.",
    image_url:
      "https://asset.msi.com/resize/image/global/product/product_1612254384c5c5e6d4e1d0c5c5e5c5e5.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
    price: 1699,
  },
  {
    Brand: "MSI",
    Model: "Creator Z16",
    Spec: "Intel i9, RTX 4070, 32GB RAM, 1TB SSD",
    category: "Creator",
    description: "Content creator laptop with touch display.",
    image_url:
      "https://asset.msi.com/resize/image/global/product/product_1630646384c5c5e6d4e1d0c5c5e5c5e5.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
    price: 2499,
  },
  {
    Brand: "MSI",
    Model: "Modern 14",
    Spec: "Intel i5, 8GB RAM, 512GB SSD",
    category: "Business",
    description: "Professional laptop for business users.",
    image_url:
      "https://asset.msi.com/resize/image/global/product/product_1612254384c5c5e6d4e1d0c5c5e5c5e5.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
    price: 849,
  },
  {
    Brand: "Razer",
    Model: "Blade 14",
    Spec: "AMD Ryzen 9, RTX 4070, 16GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Premium compact gaming laptop.",
    image_url:
      "https://assets3.razerzone.com/b3dB8zxJGfJ3P8Zt4JEp5Q-2Lts=/1500x1000/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fh3a%2Fh3c%2F9528394276894%2Frazer-blade-14-2023-hero-mobile.jpg",
    price: 2399,
  },
  {
    Brand: "Razer",
    Model: "Book 13",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Ultra-portable productivity laptop.",
    image_url:
      "https://assets3.razerzone.com/b3dB8zxJGfJ3P8Zt4JEp5Q-2Lts=/1500x1000/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fh3a%2Fh3c%2F9528394276894%2Frazer-book-13-hero-mobile.jpg",
    price: 1599,
  },
  {
    Brand: "Microsoft",
    Model: "Surface Laptop 5",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Sleek Windows laptop with premium build.",
    image_url:
      "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RW15tu?ver=e8c7",
    price: 1599,
  },
  {
    Brand: "Microsoft",
    Model: "Surface Pro 9",
    Spec: "Intel i7, 16GB RAM, 256GB SSD",
    category: "2-in-1",
    description: "Versatile tablet-laptop hybrid.",
    image_url:
      "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RE4LqQX?ver=2cb9",
    price: 1299,
  },
  {
    Brand: "Samsung",
    Model: "Galaxy Book3 Pro",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Lightweight laptop with AMOLED display.",
    image_url:
      "https://images.samsung.com/is/image/samsung/p6pim/levant/np950xed-ka1ae/gallery/levant-galaxy-book3-pro-14-inch-np950xed-ka1ae-535952471?$650_519_PNG$",
    price: 1499,
  },
  {
    Brand: "Samsung",
    Model: "Galaxy Book3 360",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "2-in-1",
    description: "Convertible with S Pen support.",
    image_url:
      "https://images.samsung.com/is/image/samsung/p6pim/levant/np950qed-ka1ae/gallery/levant-galaxy-book3-360-13-inch-np950qed-ka1ae-535952547?$650_519_PNG$",
    price: 1399,
  },
  {
    Brand: "LG",
    Model: "Gram 17",
    Spec: "Intel i7, 16GB RAM, 1TB SSD",
    category: "Ultrabook",
    description: "Ultra-lightweight 17-inch laptop under 3 lbs.",
    image_url:
      "https://www.lg.com/us/images/business/md07524552/gallery/medium01.jpg",
    price: 1799,
  },
  {
    Brand: "LG",
    Model: "Gram Style",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Premium ultra-slim laptop with unique design.",
    image_url:
      "https://www.lg.com/us/images/business/md07524552/gallery/medium01.jpg",
    price: 1699,
  },
  {
    Brand: "Huawei",
    Model: "MateBook X Pro",
    Spec: "Intel i7, 16GB RAM, 1TB SSD",
    category: "Ultrabook",
    description: "Premium laptop with 3K touchscreen.",
    image_url:
      "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/pc/matebook-x-pro-2022/img/pc-kv-green-v4.png",
    price: 1599,
  },
  {
    Brand: "Huawei",
    Model: "MateBook 14s",
    Spec: "Intel i5, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Compact laptop with 2K display.",
    image_url:
      "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/pc/matebook-14s/img/pc-kv-grey-v2.png",
    price: 1199,
  },
  {
    Brand: "Alienware",
    Model: "m15 R7",
    Spec: "Intel i9, RTX 4080, 32GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Premium gaming laptop with alien aesthetics.",
    image_url:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-m15-r7/media-gallery/notebook-alienware-m15-r7-blue-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full",
    price: 2799,
  },
  {
    Brand: "Alienware",
    Model: "x14",
    Spec: "Intel i7, RTX 4060, 16GB RAM, 512GB SSD",
    category: "Gaming",
    description: "Thin gaming laptop with premium build.",
    image_url:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/alienware-notebooks/alienware-x14/media-gallery/notebook-alienware-x14-white-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full",
    price: 1999,
  },
  {
    Brand: "Gigabyte",
    Model: "Aero 16",
    Spec: "Intel i9, RTX 4070, 32GB RAM, 1TB SSD",
    category: "Creator",
    description: "Creator laptop with 4K OLED display.",
    image_url:
      "https://static.gigabyte.com/StaticFile/Image/Global/d0c5e5c5c5e5c5e5c5e5c5e5c5e5c5e5/Product/31869/png/500",
    price: 2299,
  },
  {
    Brand: "Gigabyte",
    Model: "G5",
    Spec: "Intel i5, RTX 4050, 8GB RAM, 512GB SSD",
    category: "Gaming",
    description: "Budget-friendly gaming laptop.",
    image_url:
      "https://static.gigabyte.com/StaticFile/Image/Global/d0c5e5c5c5e5c5e5c5e5c5e5c5e5c5e5/Product/31869/png/500",
    price: 999,
  },
  // Additional laptops to reach 50+
  {
    Brand: "Apple",
    Model: "MacBook Pro 16",
    Spec: "M3 Max, 32GB RAM, 1TB SSD",
    category: "Workstation",
    description: "Maximum performance for professional workflows.",
    image_url:
      "https://store.storeimages.cdn-apple.com/4668/as-images.apple.com/is/mbp16-spacegray-select-202310?wid=2000&hei=2000&fmt=jpeg&qlt=95&.v=1696987392275",
    price: 3499,
  },
  {
    Brand: "Dell",
    Model: "Latitude 5430",
    Spec: "Intel i5, 16GB RAM, 512GB SSD",
    category: "Business",
    description: "Business laptop with enterprise features.",
    image_url:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/latitude-notebooks/latitude-5430/media-gallery/notebook-latitude-14-5430-gray-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full",
    price: 1299,
  },
  {
    Brand: "Dell",
    Model: "Precision 5570",
    Spec: "Intel i9, RTX A2000, 32GB RAM, 1TB SSD",
    category: "Workstation",
    description: "Mobile workstation for professionals.",
    image_url:
      "https://i.dell.com/is/image/DellContent/content/dam/ss2/product-images/dell-client-products/notebooks/precision-notebooks/precision-15-5570/media-gallery/notebook-precision-15-5570-gray-gallery-4.psd?fmt=png-alpha&pscan=auto&scl=1&hei=402&wid=402&qlt=100,1&resMode=sharp2&size=402,402&chrss=full",
    price: 2799,
  },
  {
    Brand: "Lenovo",
    Model: "IdeaPad 3",
    Spec: "AMD Ryzen 5, 8GB RAM, 256GB SSD",
    category: "Budget",
    description: "Affordable laptop for basic tasks.",
    image_url:
      "https://p3-ofp.static.pub/fes/cms/2023/03/23/6k0m9w0rcddmstaqk36fxbgxoq1gzd159969.png",
    price: 449,
  },
  {
    Brand: "Lenovo",
    Model: "ThinkBook 14",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Business",
    description: "Modern business laptop for SMBs.",
    image_url:
      "https://p3-ofp.static.pub/fes/cms/2023/03/23/6k0m9w0rcddmstaqk36fxbgxoq1gzd159969.png",
    price: 999,
  },
  {
    Brand: "Asus",
    Model: "TUF Gaming A15",
    Spec: "AMD Ryzen 7, RTX 4050, 16GB RAM, 512GB SSD",
    category: "Gaming",
    description: "Durable gaming laptop with military-grade build.",
    image_url:
      "https://dlcdnwebimgs.asus.com/gain/8ef84b6f-062b-42f1-98c8-6f4595fe2c24/",
    price: 1199,
  },
  {
    Brand: "Asus",
    Model: "Vivobook 15",
    Spec: "Intel i5, 8GB RAM, 512GB SSD",
    category: "Budget",
    description: "Colorful and affordable everyday laptop.",
    image_url:
      "https://dlcdnwebimgs.asus.com/gain/ba8b8b1d-9f50-4f1b-8c8c-7c9c9f0f0f0f/",
    price: 599,
  },
  {
    Brand: "HP",
    Model: "EliteBook 840",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Business",
    description: "Premium business laptop with security features.",
    image_url:
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08267192.png",
    price: 1799,
  },
  {
    Brand: "HP",
    Model: "Envy 13",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Stylish ultrabook for professionals.",
    image_url:
      "https://ssl-product-images.www8-hp.com/digmedialib/prodimg/lowres/c08267192.png",
    price: 1099,
  },
  {
    Brand: "Acer",
    Model: "Nitro 5",
    Spec: "Intel i7, RTX 4050, 16GB RAM, 512GB SSD",
    category: "Gaming",
    description: "Budget gaming laptop with solid performance.",
    image_url:
      "https://static.acer.com/up/Resource/Acer/Laptops/Nitro_5/Images/20220324/Nitro_5_AN515_58_modelpreview.png",
    price: 1099,
  },
  {
    Brand: "Acer",
    Model: "ConceptD 7",
    Spec: "Intel i9, RTX 4070, 32GB RAM, 1TB SSD",
    category: "Creator",
    description: "Professional creator laptop with color accuracy.",
    image_url:
      "https://static.acer.com/up/Resource/Acer/Laptops/ConceptD_7/Images/20220324/ConceptD_7_CN715_73G_modelpreview.png",
    price: 2799,
  },
  {
    Brand: "MSI",
    Model: "GF63 Thin",
    Spec: "Intel i5, RTX 4050, 8GB RAM, 512GB SSD",
    category: "Gaming",
    description: "Thin and light entry-level gaming laptop.",
    image_url:
      "https://asset.msi.com/resize/image/global/product/product_1612254384c5c5e6d4e1d0c5c5e5c5e5.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
    price: 899,
  },
  {
    Brand: "MSI",
    Model: "Summit E13",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Business",
    description: "Flip business laptop with stylus support.",
    image_url:
      "https://asset.msi.com/resize/image/global/product/product_1612254384c5c5e6d4e1d0c5c5e5c5e5.png62405b38c58fe0f07fcef2367d8a9ba1/1024.png",
    price: 1499,
  },
  {
    Brand: "Razer",
    Model: "Blade 15",
    Spec: "Intel i7, RTX 4070, 16GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Premium gaming laptop with CNC aluminum chassis.",
    image_url:
      "https://assets3.razerzone.com/b3dB8zxJGfJ3P8Zt4JEp5Q-2Lts=/1500x1000/https%3A%2F%2Fhybrismediaprod.blob.core.windows.net%2Fsys-master-phoenix-images-container%2Fh3a%2Fh3c%2F9528394276894%2Frazer-blade-15-2023-hero-mobile.jpg",
    price: 2599,
  },
  {
    Brand: "Microsoft",
    Model: "Surface Laptop Studio",
    Spec: "Intel i7, RTX 4050, 32GB RAM, 1TB SSD",
    category: "Creator",
    description: "Versatile studio laptop with unique hinge design.",
    image_url:
      "https://img-prod-cms-rt-microsoft-com.akamaized.net/cms/api/am/imageFileData/RWQ9e8?ver=9a26",
    price: 2699,
  },
  {
    Brand: "Samsung",
    Model: "Galaxy Book3 Ultra",
    Spec: "Intel i9, RTX 4070, 32GB RAM, 1TB SSD",
    category: "Creator",
    description: "Premium creator laptop with stunning display.",
    image_url:
      "https://images.samsung.com/is/image/samsung/p6pim/levant/np960xfh-xa1ae/gallery/levant-galaxy-book3-ultra-16-inch-np960xfh-xa1ae-535952621?$650_519_PNG$",
    price: 2799,
  },
  {
    Brand: "LG",
    Model: "Gram 14",
    Spec: "Intel i7, 16GB RAM, 512GB SSD",
    category: "Ultrabook",
    description: "Ultra-lightweight laptop under 2.2 lbs.",
    image_url:
      "https://www.lg.com/us/images/business/md07524552/gallery/medium01.jpg",
    price: 1399,
  },
  {
    Brand: "Huawei",
    Model: "MateBook D 15",
    Spec: "Intel i5, 8GB RAM, 512GB SSD",
    category: "Budget",
    description: "Affordable 15-inch laptop for everyday use.",
    image_url:
      "https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/pdp/pc/matebook-d-15/img/pc-kv-grey-v2.png",
    price: 699,
  },
  {
    Brand: "Gigabyte",
    Model: "Aorus 15",
    Spec: "Intel i7, RTX 4070, 16GB RAM, 1TB SSD",
    category: "Gaming",
    description: "Gaming laptop with mechanical keyboard.",
    image_url:
      "https://static.gigabyte.com/StaticFile/Image/Global/d0c5e5c5c5e5c5e5c5e5c5e5c5e5c5e5/Product/31869/png/500",
    price: 1899,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log("✅ Connected to MongoDB");

    // Clear existing data
    await Category.deleteMany({});
    await Laptop.deleteMany({});
    console.log("🗑️  Cleared existing data");

    // Seed Categories (brands)
    const brandDocs = brands.map((brand) => ({
      name: brand,
      type: "brand",
    }));
    await Category.insertMany(brandDocs);
    console.log(`✅ Seeded ${brands.length} brands`);

    // Seed Categories (categories)
    const categoryDocs = categories.map((cat) => ({
      name: cat,
      type: "category",
    }));
    await Category.insertMany(categoryDocs);
    console.log(`✅ Seeded ${categories.length} categories`);

    // Seed Laptops
    await Laptop.insertMany(laptops);
    console.log(`✅ Seeded ${laptops.length} laptops`);

    console.log("\n🎉 Database seeding completed successfully!");
    console.log(`   - ${brands.length} brands`);
    console.log(`   - ${categories.length} categories`);
    console.log(`   - ${laptops.length} laptops`);

    mongoose.connection.close();
    console.log("\n✅ Database connection closed");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
