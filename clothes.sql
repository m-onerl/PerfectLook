-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 08, 2024 at 03:50 PM
-- Wersja serwera: 10.4.32-MariaDB
-- Wersja PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `clothes`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `carts`
--

CREATE TABLE `carts` (
  `id_cart` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_product` int(11) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id_cart`, `id_user`, `id_product`, `quantity`) VALUES
(1, 1, 1, 2),
(2, 1, 2, 1),
(58, 2, 56, 1),
(59, 2, 1, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `categories`
--

CREATE TABLE `categories` (
  `id_category` int(11) NOT NULL,
  `name` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id_category`, `name`) VALUES
(1, 'T-Shirts'),
(2, 'Jeans'),
(3, 'Dresses'),
(4, 'Accessories'),
(5, 'Hoodies'),
(6, 'Pants');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `couriers`
--

CREATE TABLE `couriers` (
  `id_courier` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `price` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `couriers`
--

INSERT INTO `couriers` (`id_courier`, `name`, `price`) VALUES
(1, 'DHL', 25.6),
(2, 'DPD', 30.5),
(3, 'Inpost', 22.75);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orders`
--

CREATE TABLE `orders` (
  `id_order` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `date` date NOT NULL,
  `address` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci NOT NULL,
  `courier` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci NOT NULL,
  `payment_method` varchar(120) CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci NOT NULL,
  `status` enum('zapłacono','oczekiwanie') CHARACTER SET utf8mb4 COLLATE utf8mb4_polish_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id_order`, `id_user`, `date`, `address`, `courier`, `payment_method`, `status`) VALUES
(1, 1, '2024-11-20', '123 Example Street', 'DHL', 'credit_card', 'zapłacono'),
(2, 1, '2024-11-21', '123 Example Street', 'DPD', 'paypal', 'oczekiwanie');

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `products`
--

CREATE TABLE `products` (
  `product_id` int(11) NOT NULL,
  `name` text NOT NULL,
  `price` float DEFAULT NULL,
  `category_id` int(11) NOT NULL,
  `img_file` text NOT NULL,
  `description` text DEFAULT NULL COMMENT 'tu beda opisy ubran',
  `quantity` int(11) DEFAULT NULL,
  `product_type` enum('simple','configurable') NOT NULL,
  `hex_color` varchar(7) NOT NULL,
  `size` float DEFAULT NULL,
  `brand` text DEFAULT NULL,
  `fabric` text DEFAULT NULL COMMENT 'material z ktorego jest wykonany',
  `gender` enum('men','women','unisex') NOT NULL,
  `configurable_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_polish_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`product_id`, `name`, `price`, `category_id`, `img_file`, `description`, `quantity`, `product_type`, `hex_color`, `size`, `brand`, `fabric`, `gender`, `configurable_id`) VALUES
(1, 'Louis Vuitton Shirts', 19.99, 1, '/Shirts/Louis-Vuitton-Shirts-for-Louis-Vuitton-longsleeved-Cream-H003.jpg', 'High-quality cotton shirt.', 99, 'simple', '#D6BDAA', 40, 'Louis Vuitton', 'Cotton', 'unisex', 1),
(2, 'Blue Chrome Hearts Jeans', 49.99, 2, '/Jeans/Chrome-Hearts-Jeans-A002.jpg', 'Classic blue denim jeans with cross path', 49, 'simple', '#0000FF', 32, 'Chrome Hearts', 'Denim', 'men', NULL),
(3, 'Gucci Hoodie Lemon', 79.99, 5, '/Hoodies/Gucci-Hoodies-Cream-B004.png', 'Perfect hoodie comfortable materials.', 30, 'simple', '#FF69B4', 38, 'Gucci', 'Cotton', 'women', NULL),
(56, 'Louis Vuitton white Shirts', 19, 1, '/Shirts/Louis-Vuitton-Shirts-for-Louis-Vuitton-longsleeved-White-H002.jpg', 'white,comfy shirt', 49, 'simple', '#FFFFFF', 40, 'Louis Vuitton', 'Cotton', 'men', 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `last_name` varchar(30) NOT NULL,
  `address` text NOT NULL,
  `number` int(9) NOT NULL,
  `email` varchar(50) NOT NULL,
  `login` varchar(30) NOT NULL,
  `password` varchar(30) NOT NULL,
  `permission` enum('admin','pracownik','klient') NOT NULL COMMENT 'ENUM'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id_user`, `name`, `last_name`, `address`, `number`, `email`, `login`, `password`, `permission`) VALUES
(1, 'John', 'Doe', '123 Example Street', 123456789, 'john@example.com', 'john_doe', 'password123', 'klient'),
(2, 'Admin', 'Smith', '456 Admin Lane', 987654321, 'admin@example.com', 'admin', 'admin123', 'admin');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id_cart`),
  ADD KEY `id_product` (`id_product`),
  ADD KEY `id_user` (`id_user`) USING BTREE;

--
-- Indeksy dla tabeli `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_category`);

--
-- Indeksy dla tabeli `couriers`
--
ALTER TABLE `couriers`
  ADD PRIMARY KEY (`id_courier`);

--
-- Indeksy dla tabeli `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`),
  ADD KEY `fk_orders_users` (`id_user`);

--
-- Indeksy dla tabeli `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `category_id` (`category_id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id_cart` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id_category` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `couriers`
--
ALTER TABLE `couriers`
  MODIFY `id_courier` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `fk_carts_products` FOREIGN KEY (`id_product`) REFERENCES `products` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_carts_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_categories` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id_category`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
