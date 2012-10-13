//<debug>
Ext.Loader.setPath({
    'Ext': '../../src',
    'states': 'app'
});
//</debug>

Ext.application({
    name: 'States',

    requires: [
        'Ext.Ajax',
        'Ext.draw.Component',
        'Ext.TitleBar',
        'Ext.tab.Panel',
        'Ext.layout.Fit',
        'Ext.carousel.Carousel',
        'Ext.chart.series.Bar',
        'Ext.chart.axis.Numeric',
        'Ext.chart.axis.Category',
        'Ext.chart.interactions.Rotate',
        'Ext.chart.interactions.PanZoom',
        'Ext.chart.interactions.ItemHighlight',
        'Ext.draw.modifier.Highlight'
    ],

    stores: [
        'PieStore',
        'PyramidStore',
        'BarStore',
        'GeoStore'
    ],

    controllers: [
        'Main'
    ],

    views: [
        'Population',
        'Gender',
        'Main',
        'USMap',
        'Pyramid',
        'Race'
    ],

    icon: {
        '57': 'resource/icons/icon.png',
        '72': 'resource/icons/icon@72.png',
        '114': 'resource/icons/icon@2x.png',
        '144': 'resource/icons/icon@144.png'
    },

    isIconPrecomposed: true,

    startupImage: {
        '320x460': 'resources/startup/320x460.jpg',
        '640x920': 'resources/startup/640x920.png',
        '640x1096': 'resources/startup/640x1096.png',
        '768x1004': 'resources/startup/768x1004.png',
        '748x1024': 'resources/startup/748x1024.png',
        '1536x2008': 'resources/startup/1536x2008.png',
        '1496x2048': 'resources/startup/1496x2048.png'
    },

    launch: function () {
        States.colorMap = {};
        Ext.Viewport.add(Ext.create("States.view.Main", {title: '2010 Census Data'}));

        var me = this;
        Ext.Ajax.request({
            url: 'app/data/states_data.json',
            success: function (response) {
                States.statesData = JSON.parse(response.responseText);
                var statesData = States.statesData,
                    prop,
                    barChartData = [];

                for (prop in statesData) {
                    barChartData.push({
                        name: prop,
                        population: +statesData[prop].POP100
                    });
                }

                barChartData.sort(function (b, a) {
                    var aname = a.name,
                        bname = b.name;

                    if (bname > aname) {
                        return 1;
                    } else if (bname < aname) {
                        return -1;
                    }

                    return 0;
                });

                Ext.getStore("BarStore").setData(barChartData);
                me.transitionData();
                me.setStateData('CA');
            },
            failure: function () {
                console.log('something went wrong');
            }
        });
    },

    setStateData: function (id) {
        var statesData = States.statesData,
            countyData = statesData[id];
        Ext.getStore("PieStore").setData(countyData.race);
        Ext.getStore("PyramidStore").setData(countyData.sex_by_age);
        Ext.ComponentQuery.query("#titlebar")[0].setTitle('2010 Census Data - ' + statesData[id].NAME);
        Ext.ComponentQuery.query('usmap')[0].setSelection(id);
        Ext.ComponentQuery.query('popu')[0].setSelection(id);
    },

    transitionData: function () {
        var i = 0,
            store = Ext.getStore("GeoStore"),
            data = States.statesData,
            l = data.length,
            items = {},
            min = Number.MAX_VALUE,
            max = Number.MIN_VALUE,
            value, colorArray, p, id,
            color = {
                from: [49, 130, 189],
                to: [222, 235, 247]
            }, colorMap = {};

        store.getData().each(function (record) {
            items[record.get('id')] = record;
            record.beginEdit();
        });

        for (id in data) {
            value = +data[id].POP100;
            min = min < value ? min : value;
            max = max > value ? max : value;
        }

        for (id in data) {
            value = +data[id].POP100;
            colorArray = [
                ((value - min) / (max - min) * (color.to[0] - color.from[0]) + color.from[0]) >> 0,
                ((value - min) / (max - min) * (color.to[1] - color.from[1]) + color.from[1]) >> 0,
                ((value - min) / (max - min) * (color.to[2] - color.from[2]) + color.from[2]) >> 0
            ];
            if (items[id]) {
                items[id].set('fill', colorMap[id] = 'rgb(' + colorArray.join() + ')');
                items[id].commit();
            }
        }
        States.colorMap = colorMap;
    }
});
