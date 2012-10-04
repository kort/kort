Ext.define('CrimeFinder.controller.tablet.Main', {
    extend: 'CrimeFinder.controller.Main',
   
    config: {
       refs: {
          'mainTabPanel' : 'viewport > tabpanel'
       }
    },
   
    showRecentActivity: function() {
    	this.getMainTabPanel().setActiveItem(0);
    },
  
    showWantedByFbi: function() {
    	  this.getMainTabPanel().setActiveItem(1);
    },
    
    showMedia: function() {
    	  this.getMainTabPanel().setActiveItem(3);
    },
    
    showNews: function() {
    	  this.getMainTabPanel().setActiveItem(2);
    },
  
    showConfess: function() {
    	  this.getMainTabPanel().setActiveItem(4);
    }
});