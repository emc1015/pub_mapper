<script>
function resetForm(){
         document.getElementById("contact_us").reset();
         }
</script>
<form method="POST" action="contactus.php" name"contact_us" id="contact_us">
      Name: <input type="text" name="name" required><br><br>
      E-Mail: <input type="text" name="email" required><br><br>
      Comment: <textarea form="contact_us" name="comment" required>Type your comment here</textarea><br><br>
      <input id="submit" type="submit" disabled='true'>
      <input type="reset" name="reset" value="Reset" onclick="resetForm()">
</form>
<?php
function checkName($name) {

        $name = trim($name);
        $name = stripslashes($name);
        $name = htmlspecialchars($name);

        if (empty($name)){
        return false;
        }else{
        return true;
        }}

function checkEmail($email) {

        $email = filter_var($email, FILTER_VALIDATE_EMAIL);

if (!$email){
        $GLOBALS['emailError'] = "Please input a valid E-mail";
        return false;
        }else{
        return true;
        }}

function checkComment($comment) {

        $comment = stripslashes($comment);
        $comment = htmlspecialchars($comment);

if (empty($comment)){
                return false;
        }else{
        return true;
        }
}

$validName = $validEmail = $validComment = $validInput = false;

if ($_SERVER['REQUEST_METHOD'] == "POST") {
        $name = $_POST['name'];
        $email = $_POST['email'];
        $comment = $_POST['comment'];

        $validName = checkName($name);
        $validEmail = checkEmail($email);
        $validComment = checkComment($comment);

        $validInput = $validName && $validEmail && $validComment;

}

if($validInput) {
	if($connection->query($innerSQL) == TRUE){
        echo "Success: We will submit the following information<br>";
        echo $_POST['name'] . "<br>";
        echo $_POST['email'] . "<br>";
	echo $_POST['comment'] . "<br>";
	}
	else{
		echo "Error: " . "<br>" . $connection->error;
	}

	$connection->close();
} else {
        include 'formerror.php';

}
?>

