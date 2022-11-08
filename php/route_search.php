<?php
    //Get the Database Informations
    require_once("./database_information.php");

    //Concect to PostgreeSQL Database via PDO
    try {
        $dsn = "pgsql:host=$dbhost;port=5432;dbname=$dbname;";
        //Make a Database Connection
        $pdo = new PDO($dsn, $dbuser, $dbpassword, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
        
        if ($pdo) {
            //echo "Connected to the $db database successfully!";
        }

    } catch (PDOException $e) {
        die($e->getMessage());

    }


    $ini = $_POST["start_point"];
    $end = $_POST["end_point"];

    //echo "Inicio".$_POST["start_point"];
    //echo " Fim".$_POST["end_point"];

    //SQL Geo-DBMS for PostGIS
    $sql = "SELECT seq, edge, geom, ST_AsGeoJSON(geom) AS geojson
    FROM pgr_dijkstra(
      'SELECT id,
          source, 
          target,
          st_length(geom) AS cost,
          st_length(geom) AS reverse_cost
        FROM coredores_noded',"
      ."$ini".","."$end".",
      false
    ) AS a
    JOIN coredores_noded AS b ON (a.edge = b.id) ORDER BY seq";

    $result = $pdo->query($sql);

    if (!$result) {
    echo "SQL error!";
    exit();
    }
    
    //Buld the GeoJSON Feature Colletion Array
    $geojson = array (
        "type" => "FeatureCollection",
        "features" => array ()
    );

    //Loop Through Rows to Build Features Arrays
    while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
        $properties = $row;

        //Remove GeoJSON and Geometry Fields From $properties
        unset($properties["geojson"]);
        unset($properties["geom"]);
        
        $feature = array (
            "type" => "Feature",
            "geometry" => json_decode($row["geojson"], true),
            "properties" => $properties
        );

        //Add Feature Arrays to Feature Colection Array
        array_push($geojson["features"], $feature);
    }
    //Create JSON Header
    header("Content-type: application/json");


    //Display GeoJSON output_add_rewrite_var
    echo json_encode($geojson, JSON_NUMERIC_CHECK);

    //Close the Database Connection
    $pdo = null;