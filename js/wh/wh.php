<?
$arr = array('../../build/react-select.min.js','wh.js');

foreach ($arr as $key => $value) {
	// echo "$value\n";
	$text = file_get_contents($value);
	echo $text . "\n;\n";
}

?>