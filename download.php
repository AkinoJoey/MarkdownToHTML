<?php
require 'vendor/autoload.php';

$html = file_get_contents('php://input');

$filename = 'converted.html';
header('Content-Type: text/html');
header(sprintf('Content-Disposition: attachment; filename="%s"', $filename));

echo $html;
