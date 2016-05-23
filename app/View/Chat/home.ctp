<?php $this->start('script'); ?>
<script type="text/javascript">
    var user = jQuery.parseJSON('<?php echo $user; ?>');
    var messages = jQuery.parseJSON('<?php echo $messages; ?>');
    var timeCurrent = jQuery.parseJSON('<?php echo $timeCurrent; ?>');
</script>
<?php echo $this->Html->script('chat'); ?>
<?php $this->end(); ?>
