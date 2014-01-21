/**
 * Configuration for kort application
 */
Ext.define('Kort.util.Config', {
	singleton: true,

	config: {
        /**
         * @cfg {String} version Current version number of application
         */
        version: '2.2.{BUILD_NR}',
        
        /**
         * @cfg {String[]} supportedLanguages Supported languages of the app
         */
        supportedLanguages: ['ca', 'cs', 'de', 'en', 'es', 'fr', 'gl', 'hr', 'hu', 'id', 'is', 'it', 'ja', 'nl', 'pt', 'ro', 'ru', 'sk', 'sl', 'sr', 'tr', 'vi'],

        /**
         * @cfg {String} defaultLanguage Default language of app when no language setting could be detected
         */
        defaultLanguage: 'en',

        /**
         * @cfg {Object} leafletMap Configuration for {@link Ext.ux.LeafletMap} component
         * @cfg {Number} [leafletMap.zoom=15] (required) Default zoom level of leaflet map
         * @cfg {String} [leafletMap.tileLayerUrl] (required) URL to tile server
         * @cfg {String} [leafletMap.retinaTileLayerUrl] (required) URL to retina tile server
         * @cfg {String} [leafletMap.tileLayerAttribution="Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a>"] (required) Copyright information of map
         * @cfg {String} [leafletMap.apiKey=729242682cb24de8aa825c8aed993cba] (required) API key for cloudmade tiles
         * @cfg {Number} [leafletMap.styleId=997] (required) Style id for cloudmade tiles
         */
		leafletMap: {
            zoom: 15,
            tileLayerUrl: 'http://{s}.tiles.lyrk.org/ls/{z}/{x}/{y}?apikey={apiKey}',
            retinaTileLayerUrl: 'http://{s}.tiles.lyrk.org/lr/{z}/{x}/{y}?apikey={apiKey}',
            tileLayerAttribution: 'Map data &copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> | Tiles by <a href="http://geodienste.lyrk.de/" target="_blank">Lyrk</a>',
            apiKey: '079ab13252d244d0a153d652489ad110'
		},

        /**
         * @cfg {Object} oAuth Configuration for OAuth
         * @cfg {Object} oAuth.google (required) Configuration for Google OAuth
         * @cfg {String} [oAuth.google.url="https://accounts.google.com/o/oauth2/auth"] (required) URL to Google OAuth
         * @cfg {String[]} oAuth.google.scopes (required) Configuration for Google OAuth
         * @cfg {String} [oAuth.google.redirect_path="server/oauth2callback/google"] (required) Redirect path after login
         * @cfg {String} [oAuth.google.client_id="653755350671.apps.googleusercontent.com"] (required) Google OAuth client id
         * @cfg {Object} oAuth.osm (required) Configuration for OpenStreetMap OAuth
         * @cfg {String} [oAuth.osm.url="./server/oauth2callback/osm/authorize.php"] (required) URL to OpenStreetMap OAuth
         */
        oAuth: {
            google: {
                url: 'https://accounts.google.com/o/oauth2/auth',
                scopes: [
                    'https://www.googleapis.com/auth/userinfo.profile',
                    'https://www.googleapis.com/auth/userinfo.email'
                ],
                redirect_path: 'server/oauth2callback/google',
                response_type: 'code',
                access_type: 'offline',
                client_id: '653755350671.apps.googleusercontent.com'
            },
            osm: {
                url: './server/oauth2callback/osm/authorize.php'
            },
            facebook: {
                url: 'https://www.facebook.com/dialog/oauth',
                scopes: [
                    'email'
                ],
                redirect_path: 'server/oauth2callback/facebook',
                response_type: 'code',
                client_id: '290615117735384'
            }
        },

        /**
         * @cfg {Number} timeout Default timeout for load tasks in ms
         */
        timeout: 10000,

        /**
         * @cfg {Object} zIndex zIndex for components
         * @cfg {Number} [zIndex.overlayLeafletMap=1500] (required) zIndex for panel to overlay leaflet map components
         * @cfg {Number} [zIndex.overlayOverlayPanel=1600] (required) zIndex for panel to overlay another overlay panel
         */
        zIndex: {
            overlayLeafletMap: 1500,
            overlayOverlayPanel: 1600
        },

        /**
         * @cfg {Object} osmMap Style configuration for osm objects
         * @cfg {String} [osmMap.featureColor="#FF0000"] (required) Color of features
         * @cfg {Number} [osmMap.featureOpacity=0.7] (required) Opacity of features
         */
        osmMap: {
            featureColor: '#FF0000',
            featureOpacity: 0.7
        },

        /**
         * @cfg {String} kortTitle App title which can be used in content
         */
        kortTitle: '<span class="kort-title"><span class="kort-k">K</span><span class="kort-ort">ORT</span></span>',

        /**
         * @cfg {Object} about Labels for about page
         * @cfg {String[]} about.information (required) Information about Kort
         * @cfg {String[]} about.developers (required) Developers of application
         * @cfg {Object} about.project (required) Information about the project
         * @cfg {String} about.project.title (required) Title of project
         * @cfg {String} about.project.school (required) Name of school
         * @cfg {String} about.project.advisor (required) Advisor
         * @cfg {Object} about.credits (required) Other credits
         */
        about: {
            information: [
                '<a href="http://www.kort.ch" target="_blank">kort.ch</a>',
                '<a href="http://kort.uservoice.com" target="_blank">UserVoice Contact</a>',
                '<a href="https://github.com/kort/kort/issues" target="_blank">GitHub</a>'
            ],
            developers: [
                'Jürg Hunziker',
                'Stefan Oderbolz',
                'Annrita Egli',
                'Carmelo Schumacher'
            ],
            project: {
                title: 'Bachelorarbeit HS2012/13<br>Semesterarbeit FS 2013',
                school: 'HSR Hochschule für Technik Rapperswil',
                advisor: 'Prof. Stefan Keller, <a href="http://wiki.hsr.ch/StefanKeller/wiki.cgi?GeometaLab" target="_blank">Geometa Lab</a>'
            },
            credits: {
                partner: '<a href="http://bitforge.ch" target="_blank">bitforge AG</a>',
                mapdata: '<a href="http://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap-Mitwirkende</a> (ODbL)',
                tiledata: '<a href="http://geodienste.lyrk.de/" target="_blank">Lyrk</a> (<a href="https://geodienste.lyrk.de/copyright" target="_blank">Copyright</a>)',
                markers: '<a href="http://mapicons.nicolasmollet.com" target="_blank">mapicons collection</a>',
                translation: '<a href="https://www.transifex.com/projects/p/kort/" target="_blank">Transifex</a>',
                dbhosting: '<a href="http://www.sourcepole.ch" target="_blank">sourcepole</a>'
            }
        },

        /**
         * @cfg {Object} messages Ext.i18n.bundle plugin doesn't work for form placeholders so these are stored in config file
         */
        messages: {
            ca: {
                'firststeps.form.username.placeholder': "Nom d'usuari",
                'pullrefresh.dateformat': 'm/d/Y h:iA'
            },
            cs: {
                'firststeps.form.username.placeholder': 'Uživatelské jméno',
                'pullrefresh.dateformat': 'd.m.Y H:i:s'
            },
            de: {
                'firststeps.form.username.placeholder': 'Benutzername',
                'pullrefresh.dateformat': 'd.m.Y H:i:s'
            },
            en: {
                'firststeps.form.username.placeholder': 'Username',
                'pullrefresh.dateformat': 'm/d/Y h:iA'
            },
            es: {
                'firststeps.form.username.placeholder': 'Nombre de usuario',
                'pullrefresh.dateformat': 'd/m/Y  h:i A'
            },
            fr: {
                'firststeps.form.username.placeholder': "Nom d'utilisateur",
                'pullrefresh.dateformat': 'd/m/Y H:i'
            },
            gl: {
                'firststeps.form.username.placeholder': 'Nome de usuario',
                'pullrefresh.dateformat': 'm/d/A h:iA'
            },
            hr: {
                'firststeps.form.username.placeholder': 'Korisničko ime',
                'pullrefresh.dateformat': 'd/m/Y h:iA'
            },
            hu: {
                'firststeps.form.username.placeholder': 'Felhasználónév',
                'pullrefresh.dateformat': 'Y. m. d. h:iA'
            },
            id: {
                'firststeps.form.username.placeholder': 'Nama pengguna',
                'pullrefresh.dateformat': 'm/d/Y h:iA'
            },
            is: {
                'firststeps.form.username.placeholder': 'Notandanafn',
                'pullrefresh.dateformat': 'd/m/Y h:iA'
            },
            it: {
                'firststeps.form.username.placeholder': 'Nome utente',
                'pullrefresh.dateformat': 'd.m.Y h:i:s'
            },
            ja: {
                'firststeps.form.username.placeholder': 'ユーザー名',
                'pullrefresh.dateformat': 'Y/m/d h:iA'
            },
            nl: {
                'firststeps.form.username.placeholder': 'Gebruikersnaam',
                'pullrefresh.dateformat': 'm/d/J u:m'
            },
            pt: {
                'firststeps.form.username.placeholder': 'Nome do usuario',
                'pullrefresh.dateformat': 'm/d/Y h:iA'
            },
            ro: {
                'firststeps.form.username.placeholder': 'Nume de utilizator',
                'pullrefresh.dateformat': 'm/d/Y h:iA'
            },
            ru: {
                'firststeps.form.username.placeholder': 'Имя',
                'pullrefresh.dateformat': 'd.m.Y H:i'
            },
            sk: {
                'firststeps.form.username.placeholder': 'Používateľské meno',
                'pullrefresh.dateformat': 'd. m. Y H:i'
            },
            sl: {
                'firststeps.form.username.placeholder': 'Uporabniško ime',
                'pullrefresh.dateformat': 'd/m/l h:iA'
            },
            sr: {
                'firststeps.form.username.placeholder': 'Корисничко име',
                'pullrefresh.dateformat': 'd/m/Y h:iA'
            },
            tr: {
                'firststeps.form.username.placeholder': 'Kullanıcı adı',
                'pullrefresh.dateformat': 'd/m/Y h:iA'
            },
            vi: {
                'firststeps.form.username.placeholder': 'tên người dùng',
                'pullrefresh.dateformat': 'd.m.Y H:i:s'
            }
        },

        /**
         * @cfg {Number} operationalRange Default parameter for what distance in meteres from user's gps coordinates a mission is considered to be solvable.
         */
        operationalRange: 5000,

        /**
         * @cfg {Object} webservices Configuration of webservices
         * @cfg {Object} webservices.mission Configuration of mission webservice
         * @cfg {Function} webservices.mission.getUrl (required) Returns url of mission webservice with given position (latitude, longitude)
         * @cfg {Number} webservices.mission.radius (required) Maximum range for bugs selection (in meters)
         * @cfg {Number} webservices.mission.limit (required) Limits bugs to given number
         * @cfg {Object} webservices.validation Configuration of validation webservice
         * @cfg {Function} webservices.validation.getUrl (required) Returns url of validation webservice with given position (latitude, longitude)
         * @cfg {Number} webservices.validation.radius (required) Maximum range for validations selection (in meters)
         * @cfg {Number} webservices.validation.limit (required) Limits validations to given number
         * @cfg {Object} webservices.promotion Configuration of promotion webservice
         * @cfg {Object} webservices.user.url Url of promotion webservice
         * @cfg {Object} webservices.user Configuration of user webservice
         * @cfg {Object} webservices.user.url Url of user webservice
         * @cfg {Object} webservices.userLogout Configuration of userlogout webservice
         * @cfg {Function} webservices.userLogout.getUrl (required) Returns url of userlogout webservice with given userid
         * @cfg {Object} webservices.userBadges Configuration of userbadges webservice
         * @cfg {Function} webservices.userBadges.getUrl (required) Returns url of userbadges webservice with given userid
         * @cfg {Object} webservices.highscore Configuration of highscore webservice
         * @cfg {Object} webservices.highscore.url Url of highscore webservice
         * @cfg {Number} webservices.highscore.limit (required) Limits highscore entries to given number
         * @cfg {Object} webservices.answer Configuration of answer webservice
         * @cfg {Object} webservices.answer.url Url of answer webservice
         * @cfg {Object} webservices.fix Configuration of fix webservice
         * @cfg {Object} webservices.fix.url Url of fix webservice
         * @cfg {Object} webservices.vote Configuration of vote webservice
         * @cfg {Object} webservices.vote.url Url of vote webservice
         * @cfg {Object} webservices.osm Configuration of osm webservice
         * @cfg {Function} webservices.osm.getUrl (required) Returns url of osm webservice with given osm object(id, type)
         */
        webservices: {
            mission: {
                getUrl: function(latitude, longitude) {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/mission/position/' + latitude + ',' + longitude;
                },
                radius: this.operationalRange,
                limit: 25
            },
            validation: {
                getUrl: function(latitude, longitude) {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/validation/position/' + latitude + ',' + longitude;
                },
                radius: this.operationalRange,
                limit: 25
            },
            promotion: {
                getUrl: function() {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/promotion/'
                }
            },
            user: {
                getUrl: function() {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/user/'
                }
            },
            userLogout: {
                getUrl: function(userid) {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/user/' + userid + '/logout';
                }
            },
            userBadges: {
                getUrl: function(userid) {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/user/' + userid + '/badges';
                }
            },
            highscore: {
                getAbsoluteUrl: function() {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/highscore/absolute'
                },
                getRelativeUrl: function() {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/highscore/relative'
                },
                limit: 10
            },
            answer: {
                getUrl: function() {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/answer/'
                }
            },
            fix: {
                getUrl: function() {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/mission/fix'
                }
            },
            vote: {
                getUrl: function() {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/validation/vote'
                }
            },
            osm: {
                getUrl: function(objectId, objectType) {
                    return Kort.util.Config.getWebServicesHost() + '/server/webservices/osm/' + objectType + '/' + objectId;
                }
            }
        },

        /**
        * @cfg {Object} mapMarkerState Enumeration of all possible mission states
        * @cfg {String} mapMarkerState.mission Enum-key for mission state
        * @cfg {String} mapMarkerState.missionPromotion Enum-key for missionPromotion state
        * @cfg {String} mapMarkerState.validation Enum-key for validation state
        * @cfg {String} mapMarkerState.validationPromotion Enum-key for validationPromotion state
        * @cfg {String} mapMarkerState.inactive Enum-key for inactive state
        */
        mapMarkerState: {
            mission: 'missionState',
            missionPromotion: 'missionPromotionState',
            validation: 'validationSate',
            validationPromotion: 'validationPromotionState',
            inactive: 'inactiveState'
        },

        /**
         * @cfg {String} URL of Atom news feed
         */
        newsAtomFeedUrl: './resources/stores/news_default.xml'
	},

    /**
     * @private
     * initializes the configuration
     */
	constructor: function(config) {
		this.initConfig(config);
		return this;
	},
    
    getMessage: function(key) {
        var lang = this.getLanguage();

        return this.getMessages()[lang][key];
    },
    
    /**
     * Returns current language setting of browser
     */
	getLanguage: function() {
        var currentLang = (navigator.language || navigator.browserLanguage || navigator.userLanguage || this.defaultLanguage),
            supportedLanguages = this.getSupportedLanguages(),
            langLen = supportedLanguages.length,
            i;

        currentLang = currentLang.substring(0, 2).toLowerCase();
        for(i = 0; i < langLen; i++) {
            if (supportedLanguages[i] === currentLang) {
                return currentLang;
            }
        }
        return this.getDefaultLanguage();
	},

    /**
     * Returns a Leaflet marker icon for a given type
     * @param {String} type Type of marker
     */
    getMarkerIcon: function(type, state, inOperationalRange) {
        var iconWidth = 35,
            iconHeight = 42,
            shadowWidth = 51,
            shadowHeight = 37,
            icon,
            iconCenterCorrectionFactor=0.064;

        icon = window.L.icon({
            iconUrl: this.constructMissionIconURL(type,state,false, inOperationalRange),
            iconRetinaUrl: this.constructMissionIconURL(type,state,true, inOperationalRange),
            iconSize: [iconWidth, iconHeight],
            iconAnchor: [((iconWidth/2)*(1-iconCenterCorrectionFactor)), iconHeight],
            shadowUrl: './resources/images/marker_icons/shadow.png',
            shadowRetinaUrl: './resources/images/marker_icons/shadow@2x.png',
            shadowSize: [shadowWidth, shadowHeight],
            shadowAnchor: [(iconWidth/2), shadowHeight],
            popupAnchor: [0, -(2*iconHeight/3)]
        });
        return icon;
    },

    /**
     * Constructs the correct Path to the mission icons depending
     * on type, state, retina and if it is in operationalRange.
     */
    constructMissionIconURL: function(type, state, retina, inOperationalRange) {
        if(typeof(state)==='undefined') {state=Kort.util.Config.getMapMarkerState().mission;}
        if(typeof(retina)==='undefined') {retina=false;}
        if(typeof(inOperationalRange)==='undefined') {inOperationalRange=true;}

        var pathToResourceFolder = './resources/images/marker_icons/',
            stateToPathSuffix = [],
            retinaPathSuffix = retina ? '@2x' : '',
            inOperationalStatePathSuffix = inOperationalRange ? '' : 'inactive';

        stateToPathSuffix[Kort.util.Config.getMapMarkerState().mission] = 'mission';
        stateToPathSuffix[Kort.util.Config.getMapMarkerState().missionPromotion] = 'missionpromotion';
        stateToPathSuffix[Kort.util.Config.getMapMarkerState().validation] = 'validation';
        stateToPathSuffix[Kort.util.Config.getMapMarkerState().validationPromotion] = 'validationpromotion';

        return pathToResourceFolder + type  + '_' + stateToPathSuffix[state] + inOperationalStatePathSuffix + retinaPathSuffix + '.png';
    },

    isNative: function() {
        return document.URL.indexOf( 'http://' ) === -1 && document.URL.indexOf( 'https://' ) === -1;
    },

    getWebServicesHost: function() {
        if(Kort.util.Config.isNative()) {
            return 'http://play.kort.ch';
        } else {
            return '.';
        }
    }

});
