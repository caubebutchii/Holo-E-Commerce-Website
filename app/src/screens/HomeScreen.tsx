import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Text, TouchableOpacity, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Header from '../components/common/Header';
import SearchBar from '../components/common/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductGrid from '../components/ProductGrid';
import FeaturedBanner from '../components/FeaturedBanner';
import DiscountedBanner from '../components/DiscountedBanner';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebase/firebaseConfig';
import { app } from '../firebase/firebaseConfig';
import { collection, getDocs, query, updateDoc, where,doc } from "firebase/firestore";
import AddProduct from '../firebase/addData';
import AddProducts from '../firebase/addData';
import SplashAd from '../components/SplashAd';
import { useUser } from '../context/UserContext';

const tui = [
  {
    "id": "021",
    "name": "Túi xách nữ đeo chéo vai đẹp basic trẻ trung dáng vuông nhiều ngăn dây xích có hộp full box 7K STORE TX26",
    "price": 199000,
    "image": "https://s.net.vn/A5C3",
    "description": "Túi xách nữ đeo chéo vai thiết kế đẹp, basic, trẻ trung. Dáng vuông với nhiều ngăn tiện lợi và dây xích thời trang. Sản phẩm có hộp full box 7K STORE TX26, phù hợp với nhiều dịp khác nhau.",
    "category": "túi nữ",
    "rating": 4.6,
    "tags": ["basic", "trẻ trung", "nhiều ngăn", "dây xích", "full box"],
    "colors": ["Trắng", "Đen", "Trắng TX39", "Đen TX03"],
    "colorImages": {
      "Trắng": "https://s.net.vn/w9SR",
      "Đen": "https://s.net.vn/lSRS",
      "Trắng TX39": "https://s.net.vn/gzSP",
      "Đen TX03": "https://s.net.vn/TtVe"
    }
  },
  {
    "id": "022",
    "name": "Túi đeo vai nữ LESAC Bloom Bag",
    "price": 650000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FLESAC%20Bloom%20Bag%2Fvn-11134207-7r98o-lyd9dz0v03vl39.webp?alt=media&token=b067ef87-37d1-40ba-aedb-958b2ba344f6",
    "description": "Túi đeo vai nữ LESAC Bloom Bag với thiết kế thời trang và tinh tế, mang đến vẻ đẹp sang trọng và thanh lịch. Chất liệu cao cấp, bền đẹp, phù hợp cho nhiều dịp khác nhau.",
    "category": "túi nữ",
    "rating": 4.8,
    "colors": ["Denim", "Trà Sữa", "Đen"],
    "tags": ["LESAC", "thanh lịch", "chất liệu cao cấp", "nhiều dịp", "bền đẹp"],
    "colorImages": {
      "Denim": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FLESAC%20Bloom%20Bag%2Fdenim.webp?alt=media&token=f173c70e-b168-4e52-911b-4984b408a28e",
      "Trà Sữa": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FLESAC%20Bloom%20Bag%2Ftr%C3%A0%20s%E1%BB%AFa.webp?alt=media&token=ae667817-1ff1-416d-bd4f-def6bb5d845e",
      "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FLESAC%20Bloom%20Bag%2F%C4%91en.webp?alt=media&token=e5130d4d-c6a3-4cb4-8302-f328f7c93ae4"
    }
  },

  {
    "id": "023",
    "name": "Chic joy y2k Túi Xách tote Cầm Tay Sức Chứa Lớn Hình Bướm Phong Cách retro Hàn Quốc Cá Tính Dành Cho Nữ",
    "price": 61000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FChic%20joy%20y2k%2Fcn-11134207-7r98o-loarnpk2x6hva6.webp?alt=media&token=c5072ba8-3224-4b87-b2aa-0746fe6ed24a",
    "description": "Túi xách tote cầm tay Chic joy y2k với sức chứa lớn và họa tiết hình bướm. Phong cách retro Hàn Quốc cá tính, dành cho nữ, phù hợp cho nhiều dịp khác nhau.",
    "category": "túi nữ",
    "rating": 4.2,
    "colors": ["Bạc", "Nâu", "Trắng", "Đen"],
    "tags": ["tote", "retro", "Hàn Quốc", "cá tính", "nhiều ngăn", "sức chứa lớn", "dành cho nữ", "hình bướm"],
    "colorImages": {
      "Bạc": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FChic%20joy%20y2k%2Fb%E1%BA%A1c.webp?alt=media&token=e218d4ea-a942-44a4-ae1f-b7d53dc0598d",
      "Nâu": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FChic%20joy%20y2k%2Fn%C3%A2u.webp?alt=media&token=57d82475-a23c-4291-96df-8416f0d2391f",
      "Trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FChic%20joy%20y2k%2Ftr%E1%BA%AFng.webp?alt=media&token=031b18e3-4e04-49e3-ad5a-1ca87c86ac11",
      "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FChic%20joy%20y2k%2F%C4%91en.webp?alt=media&token=7f08354f-eccb-4a78-9bf7-3ed66be87e5b"
    }
  },
  {
    "id": "024",
    "name": "MOSSDOOM Túi đeo chéo nữ để đồ trendy",
    "price": 319000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FMOSSDOOM%2Fcn-11134207-7qukw-lkeyqunkhbd23f.webp?alt=media&token=fd87b96b-0703-4522-8589-0b88f23892ce",
    "description": "Túi đeo chéo nữ MOSSDOOM với thiết kế trendy, trẻ trung, hiện đại, chất liệu cao cấp, bền đẹp, phù hợp với nhiều dịp khác nhau. Sức chứa lớn, tiện lợi cho mọi hoạt động hàng ngày.",
    "category": "túi nữ",
    "rating": 4.4,
    "colors": ["Quả Mơ", "Trắng", "Đen"],
    "tags": ["đeo chéo", "trendy", "trẻ trung", "hiện đại", "sức chứa lớn", "dành cho nữ", "MOSSDOOM"],
    "colorImages": {
      "Quả Mơ": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FMOSSDOOM%2Fqu%E1%BA%A3%20m%C6%A1.webp?alt=media&token=623fdb54-71b6-4fa4-9f6d-80c52aeba2af",
      "Trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FMOSSDOOM%2Ftr%E1%BA%AFng.webp?alt=media&token=8e7da576-8d9c-4ba3-a017-665b89d111b9",
      "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FMOSSDOOM%2F%C4%91en.webp?alt=media&token=2f3aaff2-4a0a-4124-8cc0-699ca3fd3586"
    }
  },
  {
    "id": "025",
    "name": "Túi Handmade Tự Đan Đính Sticker Dễ Thương, Quà Tặng Ý Nghĩa",
    "price": 120000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FHandmade%2Fvn-11134207-7r98o-lq5103t46n1zc2.webp?alt=media&token=7089b24d-9559-4f89-a0d6-8d4b137c69e2",
    "description": "Túi Handmade tự đan, đính sticker dễ thương, món quà tặng ý nghĩa dành cho người thân yêu. Thiết kế độc đáo, ngộ nghĩnh và mang đậm dấu ấn cá nhân, thích hợp cho nhiều dịp khác nhau.",
    "category": "túi nữ",
    "rating": 4.3,
    "colors": ["Xanh, dây ngọc + xích", "Cam, dây ngọc + xích", "Hồng, dây ngọc + xích", "Trắng, ngọc + xích"],
    "tags": ["handmade", "tự đan", "dễ thương", "quà tặng", "cá nhân", "nhiều ngăn"],
    "colorImages": {
      "Xanh, dây ngọc + xích": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FHandmade%2FXanh%2C%20d%C3%A2y%20ng%E1%BB%8Dc%20%2B%20x%C3%ADch.webp?alt=media&token=842f3586-8796-449f-86b3-60cc3233bd64",
      "Cam, dây ngọc + xích": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FHandmade%2Fcam%2Cd%C3%A2y%20ng%E1%BB%8Dc%20%2Bx%C3%ADch.webp?alt=media&token=8f104288-bd9d-483b-a9d2-913e839bf9c0",
      "Hồng, dây ngọc + xích": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FHandmade%2Fh%E1%BB%93ng%2C%20d%C3%A2y%20ng%E1%BB%8Dc%20%2B%20x%C3%ADch.webp?alt=media&token=641a16e9-f163-481d-add8-ee93cdbf33ba",
      "Trắng, ngọc + xích": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FHandmade%2Ftr%E1%BA%AFng%2C%20ng%E1%BB%8Dc%2Bx%C3%ADch.webp?alt=media&token=6e86a48f-6fe2-4f09-8388-d7d2e8a77c7f"
    }
  },




]
const tuine = {
  "id": "026",
  "name": "Túi xách DAVID JONES thời trang paris có dây đeo cho nữ",
  "price": 483550,
  "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FDAVID%20JONES%2Fcn-11134207-7ras8-m0oodlge1xzibe.webp?alt=media&token=490674ad-b514-4e0e-b58a-7b3dffe46d92",
  "description": "Túi xách thời trang DAVID JONES Paris với thiết kế tinh tế và dây đeo tiện lợi dành cho nữ. Phù hợp với phong cách sang trọng và hiện đại, hoàn hảo cho nhiều dịp khác nhau.",
  "category": "túi nữ",
  "rating": 4.5,
  "colors": ["Nâu", "Xanh", "Đen"],
  "colorImages": {
    "Nâu": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FDAVID%20JONES%2Fn%C3%A2u.webp?alt=media&token=36724099-e205-4430-8ac3-e7526aaf4926",
    "Xanh": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FDAVID%20JONES%2Fxanh.webp?alt=media&token=7b59b8f0-344d-4846-932b-acdcb9bbcf56",
    "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2FDAVID%20JONES%2F%C4%91en.webp?alt=media&token=83a63958-cafa-447e-a96d-4e37ced2155b"
  },
  "tags": ["thời trang", "DAVID JONES", "Paris", "dây đeo", "sang trọng", "hiện đại", "dành cho nữ"]
}
const dongho = [
  {
    "id": "031",
    "name": "Đồng hồ nam dây da PABLO RAEZ dạ quang chống nước lịch sự đơn giản U850 CARIENT",
    "price": 227000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fvn-11134207-7ras8-m12qfldkgx0b3f.webp?alt=media&token=8a9492f6-4786-4c2c-8ea2-03713343968b",
    "description": "Đồng hồ nam dây da PABLO RAEZ với tính năng dạ quang, chống nước, thiết kế lịch sự, đơn giản và hiện đại, phù hợp cho nhiều dịp khác nhau.",
    "category": "đồng hồ",
    "rating": 4.6,
    "colors": ["Dây da nâu mặt trắng", "Dây da đen mặt trắng", "Dây da đen mặt đen", "Dây thép mặt trắng", "Dây thép mặt đen"],
    "colorImages": {
      "Dây da nâu mặt trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20da%20n%C3%A2u%20m%E1%BA%B7t%20tr%E1%BA%AFng.webp?alt=media&token=137ab3cd-b76c-4bc7-b796-6c63ff74203e",
      "Dây da đen mặt trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20da%20%C4%91en%20m%E1%BA%B7t%20tr%E1%BA%AFng.webp?alt=media&token=25779a77-e44f-4562-b92c-c2016441ac61",
      "Dây da đen mặt đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20da%20%C4%91en%20m%E1%BA%B7t%20%C4%91en.webp?alt=media&token=6a981e62-7cef-4924-bc91-3e285c8313ae",
      "Dây thép mặt trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20th%C3%A9p%20m%E1%BA%B7t%20tr%E1%BA%AFng.webp?alt=media&token=49538d6d-635f-4ce2-abc1-e9823f6add69",
      "Dây thép mặt đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20th%C3%A9p%20m%E1%BA%B7t%20%C4%91en.webp?alt=media&token=4618200b-5555-433b-9486-8761f5056365"
    },
    "tags": ["đồng hồ", "PABLO RAEZ", "dạ quang", "chống nước", "lịch sự", "đơn giản", "hiện đại", "dành cho nam"]
  },
  {
    "id": "032",
    "name": "Vòng đeo tay thông minh Huawei Band 9 Chính Hãng - 100 chế độ tập luyện | Bảo hành 12 tháng",
    "price": 890000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FHuawei%20Band%209%2Fvn-11134207-7r98o-lyupsizvp8b13c.webp?alt=media&token=0b230f1d-a2ea-48f3-8d43-689e6f88043f",
    "description": "Vòng đeo tay thông minh Huawei Band 9 với 100 chế độ tập luyện, chính hãng, bảo hành 12 tháng. Thiết kế hiện đại, nhiều màu sắc trẻ trung, phù hợp cho mọi đối tượng.",
    "category": "đồng hồ",
    "rating": 4.7,
    "colors": ["Hồng", "Trắng", "Vàng", "Đen"],
    "colorImages": {
      "Hồng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FHuawei%20Band%209%2Fh%E1%BB%93ng.webp?alt=media&token=48befc5d-3720-4641-ad0e-94073856f28c",
      "Trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FHuawei%20Band%209%2Ftr%E1%BA%AFng.webp?alt=media&token=51db8d7c-dedb-4ac8-862d-ae23a0be208c",
      "Vàng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FHuawei%20Band%209%2Fv%C3%A0ng.webp?alt=media&token=617cbfd8-7a7b-4c8a-980f-f56fd9c94372",
      "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FHuawei%20Band%209%2F%C4%91en.webp?alt=media&token=ac3fea44-e120-435b-91f8-0a15513d4ed4"
    },
    "tags": ["vòng đeo tay thông minh", "Huawei", "100 chế độ tập luyện", "bảo hành 12 tháng", "hiện đại", "trẻ trung", "dành cho mọi đối tượng"]
  },
  {
    "id": "033",
    "name": "Đồng hồ kỹ thuật số mới nhất SHIKICK, Đồng hồ báo thức LED di động điện tử, Phòng ngủ có thể điều chỉnh độ sáng",
    "price": 84500,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20k%E1%BB%B9%20thu%E1%BA%ADt%2Fsg-11134201-7rbna-logch52cj4p65c.webp?alt=media&token=fb382cb2-f83b-49af-9a58-c6ac8b36c434",
    "description": "Đồng hồ kỹ thuật số SHIKICK với tính năng báo thức LED di động, có thể điều chỉnh độ sáng, phù hợp cho phòng ngủ. Thiết kế hiện đại và tiện lợi, hoàn hảo cho nhiều dịp khác nhau.",
    "category": "đồng hồ",
    "rating": 4.3,
    "colors": ["Nhiều màu trắng", "Nhiều màu đen", "Đen"],
    "colorImages": {
      "Nhiều màu trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20k%E1%BB%B9%20thu%E1%BA%ADt%2Fnhi%E1%BB%81u%20m%C3%A0u%20tr%E1%BA%AFng.webp?alt=media&token=89b94897-0d31-4584-914e-1b28ef3f5ed0",
      "Nhiều màu đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20k%E1%BB%B9%20thu%E1%BA%ADt%2Fnhi%E1%BB%81u%20m%C3%A0u%20%C4%91en.webp?alt=media&token=cd0c1e90-5eb2-42ba-a65d-fafe4a09fa5f",
      "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20k%E1%BB%B9%20thu%E1%BA%ADt%2F%C4%91en.webp?alt=media&token=70662129-a6ca-498f-9365-0cda2d7a7575"
    },
    "tags": ["đồng hồ kỹ thuật số", "SHIKICK", "báo thức LED", "điều chỉnh độ sáng", "phòng ngủ", "hiện đại", "tiện lợi"]
  },
  {
    "id": "034",
    "name": "Đồng hồ kim 2876 GAGAY OLES Đồng hồ chính hãng dây da Chống thấm nước 3ATM GD849",
    "price": 373450,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20kim%202876%2Fvn-11134207-7ras8-m1l3tcgj85eb81.webp?alt=media&token=266a4d2c-b71b-491a-9e8b-83eab473877b",
    "description": "Đồng hồ kim 2876 GAGAY OLES chính hãng với dây da, chống thấm nước 3ATM, thiết kế lịch sự và tinh tế, phù hợp cho nhiều dịp khác nhau.",
    "category": "đồng hồ",
    "rating": 4.5,
    "colors": ["Dây nâu- mặt đen", "Dây đen- mặt trắng", "Dây đen- mặt xanh", "Dây đen- mặt đen"],
    "colorImages": {
      "Dây nâu- mặt đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20kim%202876%2Fd%C3%A2y%20n%C3%A2u-%20m%E1%BA%B7t%20%C4%91en.webp?alt=media&token=f8f01875-98a1-458d-83c9-efb25e538357",
      "Dây đen- mặt trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20kim%202876%2Fd%C3%A2y%20%C4%91en-%20m%E1%BA%B7t%20tr%E1%BA%AFng.webp?alt=media&token=3584f61a-a524-4dda-826b-0477071ebb8e",
      "Dây đen- mặt xanh": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20kim%202876%2Fd%C3%A2y%20%C4%91en-%20m%E1%BA%B7t%20xanh.webp?alt=media&token=c620cdb5-66e6-4d6f-af8e-f45bd1f3871a",
      "Dây đen- mặt đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20kim%202876%2Fd%C3%A2y%20%C4%91en-%20m%E1%BA%B7t%20%C4%91en.webp?alt=media&token=349f2b1a-5981-4725-a3a9-a48bbdffd190"
    },
    "tags": ["đồng hồ kim", "GAGAY OLES", "chính hãng", "dây da", "chống thấm nước", "3ATM", "lịch sự", "tinh tế"]
  },
  {
    "id": "035",
    "name": "HUAWEI WATCH Ultimate Vật Liệu Kim Loại Lỏng | Tập Luyện Chuyên Nghiệp",
    "price": 19990000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FHUAWEI%20WATCH%20Ultimate%2Fvn-11134207-7ras8-m0wsh5xomre5ae.webp?alt=media&token=7c24465c-cdf7-4b7e-82ea-8631aa7e5b84",
    "description": "HUAWEI WATCH Ultimate với vật liệu kim loại lỏng, thiết kế tinh tế và tập luyện chuyên nghiệp. Đồng hồ thông minh cao cấp, bền đẹp, thích hợp cho nhiều hoạt động và phong cách sống.",
    "category": "đồng hồ",
    "rating": 4.8,
    "colors": ["Origin"],
    "colorImages": {
      "Origin": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FHUAWEI%20WATCH%20Ultimate%2Fvn-11134207-7ras8-m0wsh5xomre5ae.webp?alt=media&token=7c24465c-cdf7-4b7e-82ea-8631aa7e5b84"
    },
    "tags": ["Huawei", "WATCH Ultimate", "vật liệu kim loại lỏng", "tập luyện chuyên nghiệp", "cao cấp", "bền đẹp", "thích hợp nhiều hoạt động"]
  },
  {
    "id": "036",
    "name": "Đồng hồ thông minh BeFit B3s 44mm",
    "price": 790000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20th%C3%B4ng%20minh%20BeFit%20B3s%2044mm%2Fsg-11134201-7rdxp-m0wt6skeigh0a9.webp?alt=media&token=d55686f2-20fb-40bc-a847-eece5553e88e",
    "description": "Đồng hồ thông minh BeFit B3s 44mm với thiết kế hiện đại, nhiều tính năng thông minh, phù hợp cho mọi hoạt động và phong cách sống. Thiết kế tinh tế, bền đẹp, phù hợp cho nhiều đối tượng.",
    "category": "đồng hồ",
    "rating": 4.5,
    "colors": ["Vàng", "Xám", "Đen"],
    "colorImages": {
      "Vàng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20th%C3%B4ng%20minh%20BeFit%20B3s%2044mm%2Fv%C3%A0ng.webp?alt=media&token=8ab0e108-c200-44de-9b1a-a6c5438871e0",
      "Xám": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20th%C3%B4ng%20minh%20BeFit%20B3s%2044mm%2Fx%C3%A1m.webp?alt=media&token=b5940d64-4562-4ff0-816a-daef62493fd4",
      "Đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2F%C4%90%E1%BB%93ng%20h%E1%BB%93%20th%C3%B4ng%20minh%20BeFit%20B3s%2044mm%2F%C4%91en.webp?alt=media&token=7764ed8a-f5ba-4a3b-ad1e-dd7bbe3d24ba"
    },
    "tags": ["đồng hồ thông minh", "BeFit", "44mm", "hiện đại", "tinh tế", "bền đẹp", "dành cho mọi đối tượng"]
  }

]
const lamdep = [
  {
    "id": "041",
    "name": "Sữa dưỡng thể da sáng tức thì Vaseline 350ml/chai",
    "price": 114000,
    "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2Fvn-11134207-7r98o-ltwb8bc2ekgacb.webp?alt=media&token=48e3eedf-5c91-4f99-8dee-c4ae074c5135",
    "description": "Sữa dưỡng thể Vaseline giúp làm sáng da tức thì, giữ da mềm mịn và cung cấp độ ẩm lâu dài.",
    "category": "làm đẹp",
    "rating": 4.7,
    "colors": ["Dịu mát sáng da", "Ngăn ngừa lão hóa", "Sáng da tức thì"],
    "colorImages": {
      "Dịu mát sáng da": {
        "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2Fd%E1%BB%8Bu%20m%C3%A1t%20s%C3%A1ng%20da.webp?alt=media&token=256d2351-80f7-41a9-b675-ca9ca295cd6a",
        "available_quantity": 50
      },
      "Ngăn ngừa lão hóa": {
        "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2Fng%C4%83n%20ng%E1%BB%ABa%20l%C3%A3o%20h%C3%B3a.webp?alt=media&token=c004ecd3-3237-423d-a9b2-b5d2d3a5c358",
        "available_quantity": 30
      },
      "Sáng da tức thì": {
        "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2Fs%C3%A1ng%20da%20t%E1%BB%A9c%20th%C3%AC.webp?alt=media&token=1d36b154-0937-4c03-9a22-3d07617b7cb2",
        "available_quantity": 20
      }
    },
    "tags": ["sữa dưỡng thể", "Vaseline", "dưỡng da", "chăm sóc da", "làm đẹp"]
},
{
  "id": "042",
  "name": "[Combo] Bộ 2 Kem dưỡng sáng da đa tầng ngày & đêm Pond's Bright Miracle mờ thâm sạm với 50X Niasorcinol 45G+45G",
  "price": 269000,
  "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BCombo%5D%20B%E1%BB%99%202%20Kem%20d%C6%B0%E1%BB%A1ng%20s%C3%A1ng%20da%20%C4%91a%20t%E1%BA%A7ng%20ng%C3%A0y%20%26%20%C4%91%C3%AAm%20Pond's%20Bright%20Miracle%20m%E1%BB%9D%20th%C3%A2m%20s%E1%BA%A1m%20v%E1%BB%9Bi%2050X%20Niasorcinol%2045G%2B45G%2Fvn-11134207-7r98o-lsaw5h2mj2dg10.webp?alt=media&token=7900d81e-338d-4208-b3a3-5491af9fd147",
  "description": "Combo bộ 2 kem dưỡng sáng da đa tầng ngày & đêm Pond's Bright Miracle giúp mờ thâm sạm với công thức chứa 50X Niasorcinol, mang lại làn da rạng rỡ.",
  "category": "làm đẹp",
  "rating": 4.8,
  "colors": ["Combo 2 kem dưỡng"],
  "colorImages": {
      "Combo 2 kem dưỡng": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BCombo%5D%20B%E1%BB%99%202%20Kem%20d%C6%B0%E1%BB%A1ng%20s%C3%A1ng%20da%20%C4%91a%20t%E1%BA%A7ng%20ng%C3%A0y%20%26%20%C4%91%C3%AAm%20Pond's%20Bright%20Miracle%20m%E1%BB%9D%20th%C3%A2m%20s%E1%BA%A1m%20v%E1%BB%9Bi%2050X%20Niasorcinol%2045G%2B45G%2Fcombo%202%20Kem%20d%C6%B0%E1%BB%A1ng.webp?alt=media&token=1c041bfe-a133-4715-bbfd-8466313aee7d",
          "available_quantity": 40
      }
  },
  "tags": ["kem dưỡng da", "Pond's", "sáng da", "ngày và đêm", "làm đẹp"]
},
{
  "id": "043",
  "name": "[DIỆN MẠO MỚI] Sữa Rửa Mặt Simple lành tính và hiệu quả cho mọi loại da 150ml",
  "price": 102000,
  "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BDI%E1%BB%86N%20M%E1%BA%A0O%20M%E1%BB%9AI%5D%20S%E1%BB%AFa%20R%E1%BB%ADa%20M%E1%BA%B7t%20Simple%20l%C3%A0nh%20t%C3%ADnh%20v%C3%A0%20hi%E1%BB%87u%20qu%E1%BA%A3%20cho%20m%E1%BB%8Di%20lo%E1%BA%A1i%20da%20150ml%2Fvn-11134207-7ras8-m27r7y5klk1e51.webp?alt=media&token=a9083c86-e9a6-4baa-a881-b5a48d3d7913",
  "description": "Sữa Rửa Mặt Simple lành tính và hiệu quả, phù hợp cho mọi loại da, cung cấp độ ẩm và giúp làm sạch sâu.",
  "category": "làm đẹp",
  "rating": 4.6,
  "colors": ["Cấp ẩm", "Lành tính"],
  "colorImages": {
      "Cấp ẩm": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BDI%E1%BB%86N%20M%E1%BA%A0O%20M%E1%BB%9AI%5D%20S%E1%BB%AFa%20R%E1%BB%ADa%20M%E1%BA%B7t%20Simple%20l%C3%A0nh%20t%C3%ADnh%20v%C3%A0%20hi%E1%BB%87u%20qu%E1%BA%A3%20cho%20m%E1%BB%8Di%20lo%E1%BA%A1i%20da%20150ml%2Fc%E1%BA%A5p%20%E1%BA%A9m.webp?alt=media&token=c4ddee7b-ee2e-4b68-894d-e7f1bac282b0",
          "available_quantity": 60
      },
      "Lành tính": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BDI%E1%BB%86N%20M%E1%BA%A0O%20M%E1%BB%9AI%5D%20S%E1%BB%AFa%20R%E1%BB%ADa%20M%E1%BA%B7t%20Simple%20l%C3%A0nh%20t%C3%ADnh%20v%C3%A0%20hi%E1%BB%87u%20qu%E1%BA%A3%20cho%20m%E1%BB%8Di%20lo%E1%BA%A1i%20da%20150ml%2Fl%C3%A0nh%20t%C3%ADnh.webp?alt=media&token=69f8ed85-5430-43d6-88d6-c366428a89b7",
          "available_quantity": 45
      }
  },
  "tags": ["sữa rửa mặt", "Simple", "lành tính", "chăm sóc da", "làm đẹp"]
},
{
  "id": "044",
  "name": "Dầu Gội Đầu cho nam Clear Men đánh bay gàu, ngứa và vi khuẩn mát lạnh cực đỉnh suốt ngày dài 630g",
  "price": 195000,
  "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2FD%E1%BA%A7u%20G%E1%BB%99i%20%C4%90%E1%BA%A7u%20cho%20nam%20Clear%20Men%20%C4%91%C3%A1nh%20bay%20g%C3%A0u%2C%20ng%E1%BB%A9a%20v%C3%A0%20vi%20khu%E1%BA%A9n%20m%C3%A1t%20l%E1%BA%A1nh%20c%E1%BB%B1c%20%C4%91%E1%BB%89nh%20su%E1%BB%91t%20ng%C3%A0y%20d%C3%A0i%20630g%2Fvn-11134207-7ras8-m224ciq58jxa08.webp?alt=media&token=f8a3b03f-fbe8-4351-a4ce-4a8d447e7e06",
  "description": "Dầu Gội Đầu cho nam Clear Men giúp đánh bay gàu, ngứa và vi khuẩn, mang lại cảm giác mát lạnh cực đỉnh suốt ngày dài.",
  "category": "làm đẹp",
  "rating": 4.7,
  "colors": ["Mát lạnh bạc hà"],
  "colorImages": {
      "Mát lạnh bạc hà": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2FD%E1%BA%A7u%20G%E1%BB%99i%20%C4%90%E1%BA%A7u%20cho%20nam%20Clear%20Men%20%C4%91%C3%A1nh%20bay%20g%C3%A0u%2C%20ng%E1%BB%A9a%20v%C3%A0%20vi%20khu%E1%BA%A9n%20m%C3%A1t%20l%E1%BA%A1nh%20c%E1%BB%B1c%20%C4%91%E1%BB%89nh%20su%E1%BB%91t%20ng%C3%A0y%20d%C3%A0i%20630g%2Fm%C3%A1t%20l%E1%BA%A1nh%20b%E1%BA%A1c%20h%C3%A0.webp?alt=media&token=93eac6c2-2223-41ee-a423-5ab9b6d59067",
          "available_quantity": 55
      }
  },
  "tags": ["dầu gội đầu", "Clear Men", "gàu", "mát lạnh", "chăm sóc tóc", "làm đẹp"]
},
{
  "id": "045",
  "name": "[HB Gift - PC] Sữa tắm Lifebuoy Chăm Sóc Chuyên Sâu, giúp detox sạch sâu và giảm mụn trên da chai 100g",
  "price": 100000,
  "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BHB%20Gift%20-%20PC%5D%20S%E1%BB%AFa%20t%E1%BA%AFm%20Lifebuoy%20Ch%C4%83m%20S%C3%B3c%20Chuy%C3%AAn%20S%C3%A2u%2C%20gi%C3%BAp%20detox%20s%E1%BA%A1ch%20s%C3%A2u%20v%C3%A0%20gi%E1%BA%A3m%20m%E1%BB%A5n%20tr%C3%AAn%20da%20chai%20100g%2Fsg-11134301-7rdy4-m186ry3blh3n49%20(1).webp?alt=media&token=4f305758-23f5-4fcb-a620-b36c2f59db26",
  "description": "Sữa tắm Lifebuoy Chăm Sóc Chuyên Sâu giúp detox sạch sâu và giảm mụn trên da, mang lại làn da sạch sẽ và khỏe mạnh.",
  "category": "làm đẹp",
  "rating": 4.7,
  "colors": ["Than hoạt tính", "Muối hồng"],
  "colorImages": {
      "Than hoạt tính": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BHB%20Gift%20-%20PC%5D%20S%E1%BB%AFa%20t%E1%BA%AFm%20Lifebuoy%20Ch%C4%83m%20S%C3%B3c%20Chuy%C3%AAn%20S%C3%A2u%2C%20gi%C3%BAp%20detox%20s%E1%BA%A1ch%20s%C3%A2u%20v%C3%A0%20gi%E1%BA%A3m%20m%E1%BB%A5n%20tr%C3%AAn%20da%20chai%20100g%2Fthan%20ho%E1%BA%A1t%20t%C3%ADnh.webp?alt=media&token=f1fc011d-37e3-45bd-a2fd-1f0032d4cd4f",
          "available_quantity": 40
      },
      "Muối hồng": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2F%5BHB%20Gift%20-%20PC%5D%20S%E1%BB%AFa%20t%E1%BA%AFm%20Lifebuoy%20Ch%C4%83m%20S%C3%B3c%20Chuy%C3%AAn%20S%C3%A2u%2C%20gi%C3%BAp%20detox%20s%E1%BA%A1ch%20s%C3%A2u%20v%C3%A0%20gi%E1%BA%A3m%20m%E1%BB%A5n%20tr%C3%AAn%20da%20chai%20100g%2Fmu%E1%BB%91i%20h%E1%BB%93ng.webp?alt=media&token=bfe22607-6c10-46be-ba23-f081f1538215",
          "available_quantity": 35
      }
  },
  "tags": ["sữa tắm", "Lifebuoy", "detox", "chăm sóc da", "làm đẹp"]
},
{
  "id": "046",
  "name": "Dầu Gội/ Dầu Xả TRESemmé Đẹp Chuẩn Salon Cho Tóc Vào Nếp, Chắc Khỏe, Giảm Gãy Rụng 640g/ 620g",
  "price": 206000,
  "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2FD%E1%BA%A7u%20G%E1%BB%99i%2Fsg-11134301-7rdy4-lxi2brw661cwe6.webp?alt=media&token=53aa42c5-94c0-44ee-9d28-9cc40dde2f50",
  "description": "Dầu Gội và Dầu Xả TRESemmé giúp tóc vào nếp, chắc khỏe và giảm gãy rụng, mang lại mái tóc đẹp chuẩn salon.",
  "category": "làm đẹp",
  "rating": 4.8,
  "colors": ["Dầu Gội", "Dầu Xả", "Xả vào nếp suôn mượt", "Gội vào nếp suôn mượt", "Gội ngăn gãy rụng tóc"],
  "colorImages": {
      "Xả vào nếp suôn mượt": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2FD%E1%BA%A7u%20G%E1%BB%99i%2Fx%E1%BA%A3%20v%C3%A0o%20n%E1%BA%BFp%20su%C3%B4n%20m%C6%B0%E1%BB%A3t.webp?alt=media&token=96b5a7d5-b4cf-4c32-8a26-8be76452f3c3",
          "available_quantity": 25
      },
      "Gội vào nếp suôn mượt": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2FD%E1%BA%A7u%20G%E1%BB%99i%2Fg%E1%BB%99i%20v%C3%A0o%20n%E1%BA%BFp%20su%C3%B4n%20m%E1%BB%B0%E1%BB%A3t.webp?alt=media&token=3090802d-b6a3-473e-bc56-12eea3d97a37",
          "available_quantity": 30
      },
      "Gội ngăn gãy rụng tóc": {
          "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/beautyful%2FD%E1%BA%A7u%20G%E1%BB%99i%2Fg%E1%BB%99i%20ng%C4%83n%20g%C3%A3y%20r%E1%BB%A5ng%20t%C3%B3c.webp?alt=media&token=a11a95a9-8262-4c10-807e-5970200f2b48",
          "available_quantity": 20
      }
  },
  "tags": ["dầu gội", "dầu xả", "TRESemmé", "chăm sóc tóc", "làm đẹp"]
}

]
const HomeScreen = ({ navigation }: any) => {
  // đây là user context lấy từ userProvider
  const { user } = useUser();

  const [categories, setCategories] = useState<{ id: string;[key: string]: any }[]>([]);
  const [products, setProducts] = useState<{ id: string;[key: string]: any }[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [hasAddedProducts, setHasAddedProducts] = useState(false); // xử lý việc thêm dữ liệu
  useEffect(() => {
    const fetchDataCate = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'categories'));
        const fetchedItems: { id: string;[key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setCategories(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };
    const fetchDataItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'items'));
        const fetchedItems: { id: string;[key: string]: any }[] = [];
        querySnapshot.forEach((doc) => {
          fetchedItems.push({ id: doc.id, ...doc.data() });
        });
        setProducts(fetchedItems);
      } catch (error) {
        console.error('Error getting documents: ', error);
      }
    };
    fetchDataCate();
    fetchDataItems();

    return () => {
      setCategories([]);
      setProducts([]);
    }; // Clean up function to reset state
  }, []);
  const featuredProductShoe = {
    id: 1,
    name: 'Shoes',
    "price": 790000,
    "category": "thời trang nam",
    "rating": 4.5,
    "discount": '50% off',
    image: 'https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/shoes%2Fpexels-desertedinurban-4462781.jpg?alt=media&token=1de69849-7e62-40ab-8060-43b30c436592',
  };
  const featuredProducts = [
    {
      "id": "1",
      "name": "Shoes",
      "price": 790000,
      "category": "thời trang nam",
      "rating": 4.5,
      "discount": "50% off",
      "image": "https://firebasestorage.googleapis.com/v0/b/commerce-9e46f.appspot.com/o/shoes%2Fpexels-desertedinurban-4462781.jpg?alt=media&token=1de69849-7e62-40ab-8060-43b30c436592",
    },
    {
      "id": "031",
      "name": "Watch",
      "price": 227000,
      "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2Fpexels-bemistermister-380782.jpg?alt=media&token=3714995a-6504-4aa4-a780-0b40586816a0",
      "description": "Đồng hồ nam dây da PABLO RAEZ với tính năng dạ quang, chống nước, thiết kế lịch sự, đơn giản và hiện đại, phù hợp cho nhiều dịp khác nhau.",
      "category": "đồng hồ",
      "rating": 4.6,
      "discount": "35% off",
      "colors": ["Dây da nâu mặt trắng", "Dây da đen mặt trắng", "Dây da đen mặt đen", "Dây thép mặt trắng", "Dây thép mặt đen"],
      "colorImages": {
        "Dây da nâu mặt trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20da%20n%C3%A2u%20m%E1%BA%B7t%20tr%E1%BA%AFng.webp?alt=media&token=137ab3cd-b76c-4bc7-b796-6c63ff74203e",
        "Dây da đen mặt trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20da%20%C4%91en%20m%E1%BA%B7t%20tr%E1%BA%AFng.webp?alt=media&token=25779a77-e44f-4562-b92c-c2016441ac61",
        "Dây da đen mặt đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20da%20%C4%91en%20m%E1%BA%B7t%20%C4%91en.webp?alt=media&token=6a981e62-7cef-4924-bc91-3e285c8313ae",
        "Dây thép mặt trắng": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20th%C3%A9p%20m%E1%BA%B7t%20tr%E1%BA%AFng.webp?alt=media&token=49538d6d-635f-4ce2-abc1-e9823f6add69",
        "Dây thép mặt đen": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fclock%2FPABLO%20RAEZ%2Fd%C3%A2y%20th%C3%A9p%20m%E1%BA%B7t%20%C4%91en.webp?alt=media&token=4618200b-5555-433b-9486-8761f5056365"
      },
      "tags": ["đồng hồ", "PABLO RAEZ", "dạ quang", "chống nước", "lịch sự", "đơn giản", "hiện đại", "dành cho nam"]
    },
    {
      "id": "3",
      "name": "Dior bag",
      "price": 790000,
      "category": "túi nữ",
      "rating": 4.5,
      "discount": "90% off",
      "image": "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2Fpexels-ejov-igor-1726422-11980639.jpg?alt=media&token=334a3fc9-aab0-4803-8c5d-c10155faa692",
    },
  ]
  const featuredProductFashion = {
    id: 2,
    name: "túi sách nữ thời trang",
    discount: "30%",
    image: "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fbag%2Fwomen%20bag.jpg?alt=media&token=cc01787c-95a4-436a-892d-9cedd468ebcb",
  };
  const featuredProductElectronic = {
    id: 3,
    name: "Iphone X",
    discount: "45%",
    image: "https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/items%2Fphone%2FiphoneX.jpg?alt=media&token=6477f96a-676b-4efa-af7e-7b87d1d969b1",
  };


  const handleCategoryPress = (category: any) => {

    navigation.navigate('ProductListing', { category, categories });
  };

  const handleProductPress = (product: any) => {
    navigation.navigate('ProductDetails', { product });
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text)
  };
  const handlePressSearch = () => {
    navigation.navigate('ProductListing', { searchQuery, category: null, categories });
  }
  const handleFilter = () => {
    navigation.navigate('filter');
  };
  const handleSplashAdPress = () => {
      navigation.navigate('ProductListing', { category: {name:'làm đẹp'}, categories });
    };
  const handleSplashAdClose = () => {
    // Handle close action if needed
  };
  // Render item function for FlatListss
  const renderItem = ({ item }: { item: any }) => {
    switch (item.type) {
      case 'header':
        return <Header title="All Deals" showCart />;

      case 'search':
        return <SearchBar placeholder="Search for product" onPressSearch={handlePressSearch}
          onChangeText={handleSearch} onPressFilter={handleFilter}
        />;
      case 'featuredBanner':
        return <FeaturedBanner products={featuredProducts} onPressProduct={() => handleProductPress} />;
      case 'categoryList':
        return(
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Shop by categories</Text>
          </View>
          <CategoryList categories={categories} onCategoryPress={handleCategoryPress} />
        </View>);
      case 'discountedBanner':
        return (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Special Offers</Text>
            </View>
            <View style={styles.featuredContainer}>
              <DiscountedBanner item={featuredProductFashion} onPress={() => handleProductPress(featuredProductFashion)} />
              <DiscountedBanner item={featuredProductElectronic} onPress={() => handleProductPress(featuredProductElectronic)} />
            </View>
          </View>
        );
      case 'productGrid':
        return (
          <View style={styles.section}>
            <View style={{ ...styles.ProductHeader, }}>
              <Text style={styles.sectionTitle}>Popular Products</Text>
              <TouchableOpacity
                onPress={() => {
                  handleCategoryPress(null)
                }}>
                <Text style={styles.seeAllText}>See All</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginRight: -10 }}>
              <ProductGrid
                products={products}
                onProductPress={handleProductPress}
              />
            </View>
          </View>

        );
      default:
        return null;
    }
  };

  // Data for FlatList
  const data = [
    { type: 'header', id:1 },
    { type: 'search', id:2 },
    { type: 'featuredBanner', id:3 },
    { type: 'categoryList', id:4 },
    { type: 'discountedBanner', id:5 },
    { type: 'productGrid', id:6 },
  ];
  const handleAddProductsComplete = () => {
    setHasAddedProducts(true); // Cập nhật giá trị thành true khi hoàn thành
  };
  return (

    <LinearGradient colors={['#99FFEE', '#ffffff']} style={styles.container}>
      {/* {!hasAddedProducts && lamdep.length > 0 && (
        <AddProducts productsData={lamdep} onComplete={handleAddProductsComplete} />
      )} */}
      <SplashAd 
        onClose={handleSplashAdClose} 
        onPress={handleSplashAdPress} 
        imageUri="https://firebasestorage.googleapis.com/v0/b/commerce-f8062.appspot.com/o/Splash%20advertising%2Fvn-11134258-7ras8-m27zuycibr90b4.png?alt=media&token=0c154377-9b0a-41ba-8f80-042ca0c570dd"
        navigation={navigation}
      />
      <FlatList
        data={data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id ? item.id.toString() : item.type}
      />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginVertical: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  ProductHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,

  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  seeAllText: {
    fontSize: 14,
    color: '#007AFF',
  },
  featuredContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
});

export default HomeScreen;