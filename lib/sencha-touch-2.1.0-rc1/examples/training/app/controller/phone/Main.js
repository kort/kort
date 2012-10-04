
Ext.define('CrimeFinder.controller.phone.Main', {
    extend: 'Ext.app.Controller',

    fbiRssStore: null,
    
    config: {
        routes: {
        	'historicalactivity' : 'showHistoricalActivity',
            'wantedbyfbi' : 'showWantedByFbi',
            'recentactivity' : 'showRecentActivity',
            'missingpersons' : 'showMissingPersons',
            'domesticterrorists' : 'showDomesticTerrorists',
            'cybercriminals' : 'showCyberCriminals',
            'video'  : 'showVideo',
            'podcast' : 'showPodcast',
            'confess' : 'showConfess'
        },
        refs: {
        	  'mainNavigationView' : 'viewport > navigationview',
        	  'mainMenu' : 'iconmenu'
        	  
        },
        control: {
        	'mainNavigationView' : {
        		pop: 'onMainNavigationViewPop'
        	},
        	'iconmenu button' : {
        		tap: 'onMainMenuButtonTap'
        	}
        }
    },
    
    init: function() {
    	
    	Ext.Viewport.on('orientationchange', 'onViewportOrientationChange', this, {buffer: 50 });
    },
    
    onViewportOrientationChange : function(objviewport,o,width,height,e) {
    	var orientation = objviewport.getOrientation();
    	
    	this.getMainMenu().removeAll(true);
    	if (orientation == 'landscape') {
    		this.getMainMenu().setItemsPerRow(5);
    	} else {
    		this.getMainMenu().setItemsPerRow(3);
    	}
    	
    	this.getMainMenu().add(this.getMainMenu().generateMenuItems());
    },
    
    onMainNavigationViewPop : function(navView, poppedView, eOpts){
    	poppedView.destroy();
    	if (navView.getItems().items.length == 2) {
    		window.location.hash='';
    	}
    },
   
    onMainMenuButtonTap: function(b,e) {
    	window.location.hash="#" + b.config.route;
    },
    
   showHistoricalActivity: function() {
    	this.getMainNavigationView().push({xtype: 'crimereport', title: 'Historical Activity'});
   },
   showWantedByFbi: function() {
   		console.log('foo');
    	this.getMainNavigationView().push({xtype: 'mostwanteds', title: 'FBI RSS Feeds'});
   },
   showRecentActivity: function() {
    	this.getMainNavigationView().push({xtype: 'confesslist', title: 'Recent Activity'});
   },
   showMissingPersons: function() {
   	  	this.getMainNavigationView().push({xtype: 'confesslist', title: 'Recent Activity'});
   	
   },
   /*
          
            'missingpersons' : 'showMissingPersons',
            'domesticterrorists' : 'showDomesticTerrorists',
            'cybercriminals' : 'showCyberCriminals',
   */
   
   showMissingPersons: function() {
   	  	this.getMainNavigationView().push({
   	  		xtype: 'fbipersons', 
   	  		title: 'Missing Persons',
   	  		url: 'http://www.fbi.gov/wanted/kidnap/wanted-feed.xml'
   	  	});
   },
   
    showDomesticTerrorists: function() {
   	  	this.getMainNavigationView().push({
   	  		xtype: 'fbipersons', 
   	  		title: 'Domestic Terrorists',
   	  		url: 'http://www.fbi.gov/wanted/dt/wanted-feed.xml'
   	  	});
   },
   
   showCyberCriminals: function() {
   	  	this.getMainNavigationView().push({
   	  		xtype: 'fbipersons', 
   	  		title: 'Domestic Terrorists',
   	  		url: 'http://www.fbi.gov/wanted/cyber/wanted-feed.xml'
   	  	});
   },
   
   showVideo: function() {
   	  	this.getMainNavigationView().push({xtype: 'crimefindervideo', title: 'Fiasco-Cam'});
   },
   showPodcast: function() {
   	   this.getMainNavigationView().push({xtype: 'crimefinderaudio', title: 'FBI PodCast'});
   },
   showConfess: function() {
   	    this.getMainNavigationView().push({xtype: 'confessform', title: "Book 'em Danno"});

   }
       
            
    

   
    
});

