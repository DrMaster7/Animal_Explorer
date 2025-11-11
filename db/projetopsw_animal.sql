-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: projetopsw
-- ------------------------------------------------------
-- Server version	8.0.43

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
-- Table structure for table `animal`
--

DROP TABLE IF EXISTS `animal`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `animal` (
  `animal_id` int NOT NULL AUTO_INCREMENT,
  `animal_name` varchar(50) DEFAULT NULL,
  `animal_population` varchar(50) DEFAULT NULL,
  `animal_status` varchar(50) DEFAULT NULL,
  `animal_status_class` varchar(50) DEFAULT NULL,
  `animal_description` text,
  `animal_image_url` text,
  `animal_habitat` varchar(100) DEFAULT NULL,
  `animal_category` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`animal_id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `animal`
--

LOCK TABLES `animal` WRITE;
/*!40000 ALTER TABLE `animal` DISABLE KEYS */;
INSERT INTO `animal` VALUES (1,'Leão','~20.000','Vulnerável','status-vulnerable','O leão é um grande felino do género Panthera, nativo de África e da Índia. Conhecido como \"rei da selva\", vive em grupos familiares chamados alcateias.','https://images.weserv.nl/?url=www.infoescola.com/wp-content/uploads/2017/04/leao-126767138.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','África Subsaariana (savanas e florestas)','Mamíferos'),(2,'Elefante','~415.000','Vulnerável','status-vulnerable','O elefante é o maior animal terrestre. Vive em savanas e florestas de África e Ásia, em grupos liderados por fêmeas mais velhas.','https://images.weserv.nl/?url=www.infoescola.com/wp-content/uploads/2016/12/elefante-asiatico-198685685.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','África Subsaariana e Sudeste Asiático (savanas e florestas)','Mamíferos'),(3,'Águia-real','Desconhecida','Pouco preocupante','status-safe','A águia-real é uma das maiores aves de rapina. Habita zonas montanhosas e é símbolo de força e liberdade.','https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/1/1e/Bald_Eagle_Portrait.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Hemisfério Norte (zonas montanhosas e arquipélagos)','Aves'),(4,'Pinguim-imperador','~595.000','Quase ameaçado','status-stable','Maior espécie de pinguim, vive na Antártida e é adaptado a condições extremas de frio.','https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/4/4f/2007_Snow-Hill-Island_Luyten-De-Hauwere-Emperor-Penguin-111.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Antártica','Aves'),(5,'Cobra-real','Desconhecida','Vulnerável','status-vulnerable','Maior cobra venenosa do mundo, encontrada no sul e sudeste da Ásia.','https://images.weserv.nl/?url=inaturalist-open-data.s3.amazonaws.com/photos/307874083/original.jpeg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Sul da Ásia','Répteis'),(6,'Tartaruga-verde','Desconhecida','Em perigo','status-endangered','Espécie marinha que percorre longas distâncias nos oceanos tropicais e subtropicais.','https://images.weserv.nl/?url=www.infoescola.com/wp-content/uploads/2013/09/tartaruga-verde.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Global (oceanos tropicais/subtropicais)','Répteis'),(7,'Sapo-comum','Comum','Pouco preocupante','status-safe','Espécie amplamente distribuída pela Europa, conhecida pela pele rugosa e hábitos noturnos.','https://images.weserv.nl/?url=montejunto.pt/wp-content/uploads/2020/06/Bufo-bufo-1024x683.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Europa','Anfíbios'),(8,'Axolote','Em declínio','Criticamente em perigo','status-endangered','Espécie mexicana conhecida pela capacidade de regeneração e por permanecer em fase larval durante toda a vida.','https://images.weserv.nl/?url=conteudo.imguol.com.br/2f/2016/07/17/axolote-anfibio-da-familia-das-salamandras-1468758440950_1920x1441.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','México','Anfíbios'),(9,'Tubarão-branco','Desconhecida','Vulnerável','status-vulnerable','Predador marinho de topo encontrado em todos os oceanos temperados.','https://images.weserv.nl/?url=static.todamateria.com.br/upload/tu/ba/tubaraobranco-cke.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Global (oceanos temperados)','Peixes'),(10,'Cavalo-marinho','Desconhecida','Vulnerável','status-vulnerable','Peixe pequeno que vive em águas rasas e se caracteriza pelo formato do corpo e pela forma de reprodução única.','https://images.weserv.nl/?url=pequenopet.com.br/wp-content/uploads/Exoticos-Cavalo-Marinho-1.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Global (águas rasas costeiras, tropicais e subtropicais)','Peixes'),(11,'Borboleta-monarca','Em declínio','Quase ameaçado','status-stable','Espécie migratória que percorre milhares de quilómetros entre o Canadá e o México.','https://images.weserv.nl/?url=bolschare.com/wp-content/uploads/2024/04/butterfly-3886065_1280.webp&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','América do Norte','Insetos'),(12,'Abelha-europeia','Comum mas em declínio','Quase ameaçado','status-stable','Importante polinizadora em ecossistemas e agricultura, ameaçada pelo uso de pesticidas e perda de habitat.','https://images.weserv.nl/?url=upload.wikimedia.org/wikipedia/commons/7/70/Apis_mellifera_-_Brassica_napus_-_Valingu.jpg&w=600&h=600&fit=inside&we=1&bg=white&output=jpg&q=90','Europa (zonas temperadas)','Insetos'),(13,'Mosquito','~110 biliões','Não avaliado','status-other','Os mosquitos são os insetos mais numerosos no planeta, com estimativas apontando para cerca de 110 biliões de indivíduos.','https://upload.wikimedia.org/wikipedia/commons/8/8f/Mosquito-Macro.jpg','Global (ambientes terrestres com água estagnada)','Insetos'),(14,'Gato','~600 milhões a mil milhão','Não avaliado','status-other','Gatos são mamíferos independentes, ágeis e territoriais. Caçam por instinto e valorizam o controlo do ambiente.','https://upload.wikimedia.org/wikipedia/commons/6/68/Orange_tabby_cat_sitting_on_fallen_leaves-Hisashi-01A.jpg','Global','Mamíferos'),(15,'Falcão-peregrino','~248.000 a 478.000','Pouco preocupante','status-safe','Ave de rapina veloz que atinge mais de 300 km/h em mergulhos. Caça aves em pleno voo e tem uma visão extremamente aguçada.','https://upload.wikimedia.org/wikipedia/commons/9/9c/Falco_peregrinus_m_Humber_Bay_Park_Toronto.jpg','Global (falésias e zonas urbanas)','Aves'),(16,'Crocodilo-do-nilo','~50 000 a 70 000','Pouco preocupante','status-safe','Grande réptil semiaquático, usa emboscadas e força da mandíbula para capturar as suas presas. Habita rios e lagos pela África.','https://upload.wikimedia.org/wikipedia/commons/8/81/NileCrocodile.jpg','África','Répteis'),(17,'Salamandra-de-fogo','Desconhecida','Pouco preocupante','status-safe','Anfíbio de cores vivas (preto e amarelo) que inclui toxinas defensivas na pele. Vive em florestas húmidas e é ativo sobretudo à noite.','https://upload.wikimedia.org/wikipedia/commons/1/1b/Salamandra_salamandra_MHNT_1.jpg','Europa Ocidental, Central e Meridional (florestas caducifólias ou mistas húmidas)','Anfíbios'),(18,'Cyprinodon arcuatus','0','Extinto','status-extinct','Era uma espécie de peixe da família Cyprinodontidae que era encontrado na porção superior da bacia do rio Santa Cruz no Arizona e em Sonora. Foi declarado como extinto oficialmente em 2013.','','Rio Santa Cruz (Arizona e Sonora)','Peixes');
/*!40000 ALTER TABLE `animal` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-10 22:51:00