-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 192.168.56.10    Database: neuroplay
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `activity`
--

DROP TABLE IF EXISTS `activity`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `activity` (
  `act_id` int NOT NULL,
  `act_lev_id` int NOT NULL,
  `act_question` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `act_optionA` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `act_optionB` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `act_optionC` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `act_optionD` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `act_answer` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `act_ansAudio` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `act_anotherOptionAudio` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`act_id`,`act_lev_id`),
  KEY `act_lev_id` (`act_lev_id`),
  CONSTRAINT `activity_ibfk_1` FOREIGN KEY (`act_lev_id`) REFERENCES `levels` (`lev_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `activity`
--

LOCK TABLES `activity` WRITE;
/*!40000 ALTER TABLE `activity` DISABLE KEYS */;
INSERT INTO `activity` VALUES (1,1,'Qual dessas é a letra A?','A','O','','','A','letterA.mp3','letterO.mp3'),(2,1,'Qual dessas é a letra A?','E','A','','','A','letterA.mp3','letterE.mp3'),(3,1,'Qual dessas é a letra A?','A','I','','','A','letterA.mp3','letterI.mp3'),(4,2,'Qual dessas é a letra E?','E','U','','','E','letterE.mp3','letterU.mp3'),(5,2,'Qual dessas é a letra E?','I','E','','','E','letterE.mp3','letterI.mp3'),(6,2,'Qual dessas é a letra E?','E','A','','','E','letterE.mp3','letterA.mp3'),(7,3,'Qual dessas é a letra I?','I','O','','','I','letterI.mp3','letterO.mp3'),(8,3,'Qual dessas é a letra I?','A','I','','','I','letterI.mp3','letterA.mp3'),(9,3,'Qual dessas é a letra I?','I','U','','','I','letterI.mp3','letterU.mp3'),(10,4,'Qual dessas é a letra O?','O','A','','','O','letterO.mp3','letterA.mp3'),(11,4,'Qual dessas é a letra O?','I','O','','','O','letterO.mp3','letterI.mp3'),(12,4,'Qual dessas é a letra O?','O','E','','','O','letterO.mp3','letterE.mp3'),(13,5,'Qual dessas é a letra U?','U','E','','','U','letterU.mp3','letterE.mp3'),(14,5,'Qual dessas é a letra U?','U','I','','','U','letterU.mp3','letterI.mp3'),(15,5,'Qual dessas é a letra U?','U','O','','','U','letterU.mp3','letterO.mp3'),(16,6,'João ganhou o presente que tanto queria no seu aniversário. Qual emoção condiz com a mesma emoção que ele?','Feliz','Triste','','','Feliz','',''),(17,6,'Ana foi escolhida para dançar na apresentação da escola e está muito contente, como ela se sentiu?','Raiva','Feliz','','','Feliz','',''),(18,6,'Maria ficou muito feliz porque se saiu bem na prova. Qual dos personagens combina com sua emoção?','Feliz','Nojo','','','Feliz','',''),(19,1,'Agora, repita o som da letra A:',NULL,NULL,NULL,NULL,'A','letterA.mp3',NULL),(20,2,'Agora, repita o som da letra E:',NULL,NULL,NULL,NULL,'E','letterE.mp3',NULL),(21,3,'Agora, repita o som da letra I:',NULL,NULL,NULL,NULL,'I','letterI.mp3',NULL),(22,4,'Agora, repita o som da letra O:',NULL,NULL,NULL,NULL,'O','letterO.mp3',NULL),(23,5,'Agora, repita o som da letra U:',NULL,NULL,NULL,NULL,'U','letterU.mp3',NULL);
/*!40000 ALTER TABLE `activity` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `ani_id` int NOT NULL,
  `ani_desc` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `ani_name` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `ani_photo` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `ani_descAudio` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`ani_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (1,'Organização e disciplina : As abelhas são conhecidas pela cooperação, lealdade, organização, disciplina, ordem, alma, diligência, produtividade e harmonia;','Abelha','beeStamp.png','descBee.mp3'),(2,'Memória: O elefante é símbolo de memória, solidariedade, companheirismo, sabedoria, força, longevidade, estabilidade','Elefante','elephantStamp.png','descElephant.mp3'),(3,'Adaptabilidade e Resiliência: As iguanas são animais muito adaptáveis, capazes de viver em diferentes ambientes, desde florestas tropicais até regiões desérticas, elas têm uma grande capacidade de resistir a condições adversas.','Iguana','iguanaStamp.png','descIguana.mp3'),(4,'Força e sabedoria: A onça é frequentemente associada à força e poder natural, porque é predador de topo, lguns povos indígenas acreditam que a onça possui sabedoria e uma forte conexão com a natureza.','Onça','ounceStamp.png','descOunce.mp3'),(5,'Proteção e laços fortes: A imponência e a força física do urso o tornam um símbolo de poder, eles têm laços fortes com seus filhotes e com a sua família.','Urso','bearStamp.png','descBear.mp3'),(6,'Comunicação: Os golfinhos são frequentemente descritos como animais alegres, inteligentes e sociáveis, com um forte senso de comunidade e comunicação.','Golfinho','elephantStamp.jpg','descDolphin.mp3');
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `levels`
--

DROP TABLE IF EXISTS `levels`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `levels` (
  `lev_id` int NOT NULL,
  `lev_name` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `lev_description` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `lev_difficulty` int DEFAULT NULL,
  `lev_ani_id` int DEFAULT NULL,
  `lev_sta_id` int DEFAULT NULL,
  PRIMARY KEY (`lev_id`),
  KEY `lev_ani_id` (`lev_ani_id`),
  KEY `lev_sta_id` (`lev_sta_id`),
  CONSTRAINT `levels_ibfk_1` FOREIGN KEY (`lev_ani_id`) REFERENCES `animal` (`ani_id`),
  CONSTRAINT `levels_ibfk_2` FOREIGN KEY (`lev_sta_id`) REFERENCES `stamp` (`sta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `levels`
--

LOCK TABLES `levels` WRITE;
/*!40000 ALTER TABLE `levels` DISABLE KEYS */;
INSERT INTO `levels` VALUES (1,'Alfabetizaçao','Vamos conhecer a letra A',0,1,1),(2,'Alfabetizaçao','Vamos conhecer a letra E',0,2,2),(3,'Alfabetizaçao','Vamos conhecer a letra I',0,3,3),(4,'Alfabetizaçao','Vamos conhecer a letra O',0,4,4),(5,'Alfabetizaçao','Vamos conhecer a letra U',0,5,5),(6,'Emoções','Vamos conhecer as emoções',0,6,6);
/*!40000 ALTER TABLE `levels` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `professional`
--

DROP TABLE IF EXISTS `professional`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `professional` (
  `prof_id` int NOT NULL,
  `prof_desc` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `prof_name` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `prof_email` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `prof_user` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `prof_password` varchar(30) COLLATE utf8mb4_bin NOT NULL,
  `prof_profileImage` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `prof_faceId` LONGTEXT COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`prof_id`),
  UNIQUE KEY `prof_user` (`prof_user`),
  CONSTRAINT `professional_chk_1` CHECK ((`prof_desc` in (_utf8mb4'Terapeuta',_utf8mb4'Professor')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `professional`
--

LOCK TABLES `professional` WRITE;
/*!40000 ALTER TABLE `professional` DISABLE KEYS */;
INSERT INTO `professional` VALUES (1,'Professor','Ludmilla','ludmilla@gmail.com','ludmilla.s','12345678','Ludmilla1.png'),(2,'Professor','Gabrielle','gabi@gmail.com','gabi.s','12345678',''),(3,'Professor','Ingrid','ingrid@gmail.com','ingrid.s','12345678',NULL),(4,'Terapeuta','Sara Jessica','ga@ga.com','sara.s','12345678',NULL),(5,'Professor','cleiaa','cleia@gmail.com','cleiaa.s','12345678',NULL),(6,'Terapeuta','cleia','cleia@gmail.com','cleia.s','12345678',''),(7,'Professor','alice','alice@gmail.com','alicec','12345678',NULL),(8,'Professor','Cleia','cleia@gmail.com','cleia.amaral','12345678','Cleia8.jpg'),(9,'Professor','a','a@gmail.com','a','12345678',NULL);
/*!40000 ALTER TABLE `professional` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress`
--

DROP TABLE IF EXISTS `progress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress` (
  `prog_id` int NOT NULL,
  `prog_stu_id` int DEFAULT NULL,
  `prog_lev_id` int DEFAULT NULL,
  `prog_act_id` int DEFAULT NULL,
  `prog_date` date DEFAULT NULL,
  PRIMARY KEY (`prog_id`),
  KEY `prog_stu_id` (`prog_stu_id`),
  KEY `prog_lev_id` (`prog_lev_id`),
  KEY `prog_act_id` (`prog_act_id`),
  CONSTRAINT `progress_ibfk_1` FOREIGN KEY (`prog_stu_id`) REFERENCES `student` (`stu_id`),
  CONSTRAINT `progress_ibfk_2` FOREIGN KEY (`prog_lev_id`) REFERENCES `levels` (`lev_id`),
  CONSTRAINT `progress_ibfk_3` FOREIGN KEY (`prog_act_id`) REFERENCES `activity` (`act_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress`
--

LOCK TABLES `progress` WRITE;
/*!40000 ALTER TABLE `progress` DISABLE KEYS */;
INSERT INTO `progress` VALUES (1,1,1,NULL,'2025-06-05'),(2,1,2,NULL,'2025-06-05'),(3,2,1,NULL,'2025-06-05'),(4,2,2,NULL,'2025-06-05'),(5,2,3,NULL,'2025-06-05'),(6,3,1,NULL,'2025-06-05'),(7,4,1,NULL,'2025-06-05'),(8,5,1,NULL,'2025-06-05'),(9,4,2,NULL,'2025-06-05'),(10,1,3,NULL,'2025-06-10'),(11,1,4,NULL,'2025-06-10'),(12,1,5,NULL,'2025-06-10'),(13,2,4,NULL,'2025-06-11'),(14,7,1,NULL,'2025-06-14'),(15,8,1,NULL,'2025-06-16'),(16,2,5,NULL,'2025-06-16'),(17,9,1,NULL,'2025-06-17'),(18,9,2,NULL,'2025-06-17'),(19,10,1,NULL,'2025-06-17'),(20,11,1,NULL,'2025-06-25'),(21,11,2,NULL,'2025-06-25'),(22,11,3,NULL,'2025-06-25'),(23,11,4,NULL,'2025-06-25'),(24,11,5,NULL,'2025-06-25'),(25,11,6,NULL,'2025-06-25'),(26,12,1,NULL,'2025-06-25'),(27,13,1,NULL,'2025-06-25'),(28,13,2,NULL,'2025-06-25'),(29,14,1,NULL,'2025-06-25'),(30,1,6,NULL,'2025-10-17');
/*!40000 ALTER TABLE `progress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_animal`
--

DROP TABLE IF EXISTS `progress_animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_animal` (
  `progAni_id` int NOT NULL,
  `progAni_prog_id` int DEFAULT NULL,
  `progAni_ani_id` int DEFAULT NULL,
  `progAni_date` date DEFAULT NULL,
  PRIMARY KEY (`progAni_id`),
  KEY `progAni_prog_id` (`progAni_prog_id`),
  KEY `progAni_ani_id` (`progAni_ani_id`),
  CONSTRAINT `progress_animal_ibfk_1` FOREIGN KEY (`progAni_prog_id`) REFERENCES `progress` (`prog_id`),
  CONSTRAINT `progress_animal_ibfk_2` FOREIGN KEY (`progAni_ani_id`) REFERENCES `animal` (`ani_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_animal`
--

LOCK TABLES `progress_animal` WRITE;
/*!40000 ALTER TABLE `progress_animal` DISABLE KEYS */;
INSERT INTO `progress_animal` VALUES (1,1,1,'2025-06-05'),(2,2,2,'2025-06-05'),(3,3,1,'2025-06-05'),(4,4,2,'2025-06-05'),(5,5,3,'2025-06-05'),(6,6,1,'2025-06-05'),(7,7,1,'2025-06-05'),(8,8,1,'2025-06-05'),(9,9,2,'2025-06-05'),(10,10,3,'2025-06-10'),(11,11,4,'2025-06-10'),(12,12,5,'2025-06-10'),(13,13,4,'2025-06-11'),(14,14,1,'2025-06-14'),(15,15,1,'2025-06-16'),(16,16,5,'2025-06-16'),(17,17,1,'2025-06-17'),(18,18,2,'2025-06-17'),(19,19,1,'2025-06-17'),(20,20,1,'2025-06-25'),(21,21,2,'2025-06-25'),(22,22,3,'2025-06-25'),(23,23,4,'2025-06-25'),(24,24,5,'2025-06-25'),(25,25,6,'2025-06-25'),(26,26,1,'2025-06-25'),(27,27,1,'2025-06-25'),(28,28,2,'2025-06-25'),(29,29,1,'2025-06-25'),(30,30,6,'2025-10-17');
/*!40000 ALTER TABLE `progress_animal` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `progress_stamp`
--

DROP TABLE IF EXISTS `progress_stamp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `progress_stamp` (
  `progSta_id` int NOT NULL,
  `progSta_prog_id` int DEFAULT NULL,
  `progSta_sta_id` int DEFAULT NULL,
  `progSta_date` date DEFAULT NULL,
  PRIMARY KEY (`progSta_id`),
  KEY `progSta_prog_id` (`progSta_prog_id`),
  KEY `progSta_sta_id` (`progSta_sta_id`),
  CONSTRAINT `progress_stamp_ibfk_1` FOREIGN KEY (`progSta_prog_id`) REFERENCES `progress` (`prog_id`),
  CONSTRAINT `progress_stamp_ibfk_2` FOREIGN KEY (`progSta_sta_id`) REFERENCES `stamp` (`sta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `progress_stamp`
--

LOCK TABLES `progress_stamp` WRITE;
/*!40000 ALTER TABLE `progress_stamp` DISABLE KEYS */;
INSERT INTO `progress_stamp` VALUES (1,1,1,'2025-06-05'),(2,2,2,'2025-06-05'),(3,3,1,'2025-06-05'),(4,4,2,'2025-06-05'),(5,5,3,'2025-06-05'),(6,6,1,'2025-06-05'),(7,7,1,'2025-06-05'),(8,8,1,'2025-06-05'),(9,9,2,'2025-06-05'),(10,10,3,'2025-06-10'),(11,11,4,'2025-06-10'),(12,12,5,'2025-06-10'),(13,13,4,'2025-06-11'),(14,14,1,'2025-06-14'),(15,15,1,'2025-06-16'),(16,16,5,'2025-06-16'),(17,17,1,'2025-06-17'),(18,18,2,'2025-06-17'),(19,19,1,'2025-06-17'),(20,20,1,'2025-06-25'),(21,21,2,'2025-06-25'),(22,22,3,'2025-06-25'),(23,23,4,'2025-06-25'),(24,24,5,'2025-06-25'),(25,25,6,'2025-06-25'),(26,26,1,'2025-06-25'),(27,27,1,'2025-06-25'),(28,28,2,'2025-06-25'),(29,29,1,'2025-06-25'),(30,30,6,'2025-10-17');
/*!40000 ALTER TABLE `progress_stamp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stamp`
--

DROP TABLE IF EXISTS `stamp`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stamp` (
  `sta_id` int NOT NULL,
  `sta_name` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `sta_photo` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`sta_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stamp`
--

LOCK TABLES `stamp` WRITE;
/*!40000 ALTER TABLE `stamp` DISABLE KEYS */;
INSERT INTO `stamp` VALUES (1,'beeStamp','beeStamp.png'),(2,'elephantStamp','elephantStamp.png'),(3,'iguanaStamp','iguanaStamp.png'),(4,'onçaStamp','ounceStamp.png'),(5,'ursoStamp','bearStamp.png'),(6,'golfinhoStamp','elephantStamp.jpg');
/*!40000 ALTER TABLE `stamp` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `student`
--

DROP TABLE IF EXISTS `student`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `student` (
  `stu_id` int NOT NULL,
  `stu_name` varchar(100) COLLATE utf8mb4_bin DEFAULT NULL,
  `stu_age` int DEFAULT NULL,
  `stu_diagnostic` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `stu_user` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `stu_password` varchar(30) COLLATE utf8mb4_bin DEFAULT NULL,
  `stu_prof_id` int DEFAULT NULL,
  `stu_profileImage` varchar(255) COLLATE utf8mb4_bin DEFAULT NULL,
  `stu_faceId` LONGTEXT COLLATE utf8mb4_bin DEFAULT NULL,
  PRIMARY KEY (`stu_id`),
  UNIQUE KEY `stu_user` (`stu_user`),
  KEY `stu_prof_id` (`stu_prof_id`),
  CONSTRAINT `student_ibfk_1` FOREIGN KEY (`stu_prof_id`) REFERENCES `professional` (`prof_id`),
  CONSTRAINT `student_chk_1` CHECK ((`stu_diagnostic` in (_utf8mb4'TDAH',_utf8mb4'Dislexia',_utf8mb4'TEA',_utf8mb4'Outro')))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `student`
--

LOCK TABLES `student` WRITE;
/*!40000 ALTER TABLE `student` DISABLE KEYS */;
INSERT INTO `student` VALUES (1,'gabrielle',5,'Dislexia','gabiopires','12345678',NULL,''),(2,'henrique',10,'TDAH','henrique.s','12345678',1,''),(3,'sara',1,'TEA','sara.s','12345678',NULL,NULL),(4,'gabriel',5,'TEA','gabriel.s','12345678',NULL,NULL),(5,'joão',6,'TEA','joao.s','12345678',1,NULL),(6,'alo',10,'TDAH','ss',NULL,2,NULL),(7,'Biatriz',10,'TDAH','bia.s','12345678',1,NULL),(8,'alice',10,'Outro','alice.s','12345678',NULL,NULL),(9,'lucas',10,'Outro','lucas.s','12345678lucas',6,''),(10,'Diogo',12,'Outro','diogo.s','12345678',6,NULL),(11,'alice',10,'Dislexia','alice','12345678',NULL,NULL),(12,'Luiz',10,'Outro','luiz','12345678l',NULL,NULL),(13,'gustavo',12,'Outro','gustavo','12345678',8,'gustavo13.jpg'),(14,'cristian',12,'Outro','cristian','12345678',8,NULL);
/*!40000 ALTER TABLE `student` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-05 23:11:12
