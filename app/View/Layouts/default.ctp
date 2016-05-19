<!DOCTYPE html>
<html>
<head>
    <?php echo $this->Html->charset(); ?>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chat System</title>
    <?php echo $this->Html->meta('favicon.ico', '/img/favicon.png', array('type' => 'icon')); ?>
    <link href='https://fonts.googleapis.com/css?family=Roboto:400,100,100italic,300,300italic,400italic,500,500italic,700,700italic,900,900italic' rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/components/normalize-css/normalize.css">
    <?php echo $this->Html->css('style'); ?>
    <?php echo $this->fetch('meta'); ?>
    <?php echo $this->fetch('css'); ?>
</head>

<body></body>

<script src="/components/jquery/dist/jquery.min.js"></script>
<?php echo $this->fetch('script'); ?>

</html>
