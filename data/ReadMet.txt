Dentro desta pasta estão todos os dados, criados durante este projeto. Os mesmos se encontram no formato GeoJSON, para facilitar a manipulação
e edição dos mesmos.

Para o caso dos arquivos "features_IFC_Corridors_PrimeiroAndar.geojson" e "features_IFC_Corridors_SegundoAndar.geojson" os mesmos estão em dados não tratados para uso da extenção do banco de dados Postgres SQL, o PgRouting, e necesitam de tratamento com as funções "pgr_nodeNetwork()" e "pgr_createTopology()". 
Adaptado para ser inserido diretamente e sem demais ações na extenção esta o arquivo "features_IFC_RoutingCorredores_PrimeiroAndar.geojson".
