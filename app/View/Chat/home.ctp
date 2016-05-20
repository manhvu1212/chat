<?php $this->start('script'); ?>
<script type="text/javascript">
    var user = jQuery.parseJSON('<?php echo $user; ?>');
    var message = jQuery.parseJSON('<?php echo $message; ?>');
    console.log(message);
</script>
<?php echo $this->Html->script('chat'); ?>
<?php $this->end(); ?>
