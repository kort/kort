Ext.define('CrimeFinder.controller.Main', {
    extend: 'Ext.app.Controller',

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
            'confess' : 'showConfess',
            
            'news' : 'showNews',
            'media': 'showMedia'
        }
    }
    
});