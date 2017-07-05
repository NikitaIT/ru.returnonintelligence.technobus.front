$(function() {
    new DG.OnOffSwitch({
        el: '#on-off-switch-notext'
    });
    new DG.OnOffSwitch({
        el: '#on-off-switch',
        textOn: 'Sync On',
        textOff: 'Off',
        listener:function(name, checked){
            $("#listener-text").html("Listener called for " + name + ", checked: " + checked);
        }
    });
});
