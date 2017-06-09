<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>Intenzita dopravy v Plzni</title>
        
        <?php
            $date = sprintf('%02d', $_GET['date']);
            $month = sprintf('%02d', (int)($_GET['month']) + 1);
            $year = $_GET['year'];
            $hour = sprintf('%02d', $_GET['hour']);
        ?>
        
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black"/>
        <link rel="stylesheet" type="text/css" href="calendar.css">
        <link rel="stylesheet" href="../../bower_components/TimelineJS3/compiled/css/timeline.css">
        <link rel="stylesheet" type="text/css" href="pilsen.css">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/1.3.4/jspdf.debug.js"></script>
        <script src="https://use.fontawesome.com/700d55ca16.js"></script>
        
        <?php if (isset($_GET['year'])) { ?>
        <meta name="description" content="Předpokládaná dopravní situace v Plzni dne <?php echo "$date.$month.$year v $hour"; ?>:00." />
        <!-- Twitter Card data -->
        <meta name="twitter:card" value="Předpokládaná dopravní situace v Plzni dne <?php echo "$date.$month.$year v $hour"; ?>:00.">

        <!-- Open Graph data -->
        <meta property="og:title" content="Intenzita dopravy v Plzni" />
        <meta property="og:type" content="map" />
        <meta property="og:url" content="<?php echo "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]"; ?>" />
        <meta property="og:image" content="<?php echo "http://$_SERVER[HTTP_HOST]" . explode('?', $_SERVER["REQUEST_URI"])[0] . "social-thumbnail.png"; ?>" />
        <meta property="og:description" content="Předpokládaná dopravní situace v Plzni dne <?php echo "$date.$month.$year v $hour"; ?>:00." />
        <?php } ?>
    </head>
    <body >
        <div hs ng-app="hs" ng-controller="Main" style="position: relative;"></div>
        <script src="../../bower_components/jquery/dist/jquery.min.js"></script>
        <script src="../../bower_components/requirejs/require.js"></script>     
        <script src="hslayers.js"></script> 
    </body>
</html>