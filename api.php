<?php
include("dbconfig.php");

// Get the data variable from the request, if it exists
$data = (array_key_exists('data',$_REQUEST) ? $_REQUEST['data'] : 0);

// Only return library data if data=1
if ($data == 1) {

	// Initialize mysql connection
	mysqli_report(MYSQLI_REPORT_ERROR);
	$db = new mysqli($conf['host'], $conf['user'], $conf['pass'], $conf['db'], $conf['port']);

	// Run query to get information for the whole library
	$result = $db->query("SELECT * FROM books;");

	// Get all of the data as an associative array
	$data = $result->fetch_all(MYSQLI_NUM);

	// Close the database connection
	$db->close();

	// Setup the return array structure, with the data array as a subkey
	// Potentially allows for more data to be transferred this way
	$return = array(
		"data"=>$data
	);

	// Return JSON
	header("Content-Type: application/json; charset=utf-8");
	header('Access-Control-Allow-Origin: *');
	echo json_encode($return, JSON_NUMERIC_CHECK | JSON_INVALID_UTF8_SUBSTITUTE);

}

?>