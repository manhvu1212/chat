<?php $this->start('script'); ?>
<script type="text/javascript">
    var user = jQuery.parseJSON('<?php echo $user; ?>');
    var messages = jQuery.parseJSON('<?php echo $messages; ?>');
    var timeEnd = jQuery.parseJSON('<?php echo $timeEnd; ?>');
    var timeStart = jQuery.parseJSON('<?php echo $timeStart; ?>');
</script>
<?php echo $this->Html->script('chat'); ?>
<?php $this->end(); ?>
