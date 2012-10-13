Ext.define("EnergyApp.view.Main", {
    extend: "Ext.Panel",
    config: {
        id: "main",
        fullscreen: true,
        layout: 'fit',

        sheet: {
            hidden: true,
            enter: 'left',
            exit: 'left',
            hideOnMaskTap: true,
            zIndex: 400,
            layout: 'fit'
        },

        mainRegion: {
            layout: 'card'
        },

        launchScreen: {
            cls: 'launchscreen',
            scrollable: true,
            html: '<div>' +
                '<p><strong>This application visualizes US Energy data with charts from the Sencha Touch Charts package.</strong><br>' +
                'Start by selecting consumption or production.</p>' +
                '</div>'
        },

        navigation: {
            width: 250,
            docked: 'left'
        },

        navigationButton: {
            id: "navigationButton",
            iconCls: 'arrow_down',
            iconMask: true,
            text: Ext.os.is.Phone ? "" : "Navigate",
            zIndex: 30
        },

        chartView: {
            xtype: 'chartview',
            id: 'chartView'
        },

        title: '',

        toolbar: {
            ui: 'dark',
            docked: 'top',
            items: [
                {
                    text: '<<',
                    id: 'prevButton',
                    disabled: true,
                    ui: 'back',
                    align: 'left'
                },
                {
                    text: '>>',
                    id: 'nextButton',
                    disabled: true,
                    ui: 'forward',
                    align: 'right'
                }
            ]
        },

        navigationDocked: true
    },

    updateNavigationDocked: function (docked) {
        var navigation = this.getNavigation(),
            navigationButton = this.getNavigationButton(),
            sheet = this.getSheet();
        if (docked) {
            this.add(navigation);
            navigation.setConfig({
                docked: 'left',
                width: 250,
                height: null
            });
        } else {
            sheet.add(navigation);
            navigation.setConfig({
                docked: 'bottom',
                width: Ext.os.is.Phone ? 200 : 250,
                height: 300
            });
        }
        navigation.show();
        if (navigationButton) {
            navigationButton.setHidden(docked);
        }
    },

    orientate: function (orientation) {
        var docked = Ext.os.deviceType !== 'Phone' && orientation === "landscape";
        this.setNavigationDocked(docked);
    },

    applyMainRegion: function (mainRegion, oldMainRegion) {
        return Ext.factory(mainRegion, "Ext.Panel", oldMainRegion);
    },

    updateMainRegion: function (mainRegion, oldMainRegion) {
        if (oldMainRegion) {
            this.remove(oldMainRegion);
        }
        if (mainRegion) {
            this.add(mainRegion);
        }
    },

    updateChartView: function (chartView, oldChartView) {
        if (oldChartView) {
            this.getMainRegion().add(oldChartView);
        }
        if (chartView) {
            this.getMainRegion().insert(1, chartView);
        }
    },

    applyLaunchScreen: function (launchScreen, oldLaunchScreen) {
        return Ext.factory(launchScreen, "Ext.Panel", oldLaunchScreen);
    },

    updateLaunchScreen: function (launchScreen, oldLaunchScreen) {
        if (oldLaunchScreen) {
            this.getMainRegion().remove(oldLaunchScreen);
        }
        if (launchScreen) {
            this.getMainRegion().add(launchScreen);
        }
    },

    applySheet: function (sheet, currentSheetInstance) {
        return Ext.factory(sheet, "Ext.Sheet", currentSheetInstance);
    },

    updateSheet: function (sheet, oldSheet) {
        if (oldSheet) {
            Ext.Viewport.remove(oldSheet);
        }
        if (sheet) {
            Ext.Viewport.add(sheet);
        }
    },

    applyNavigation: function (navigation, currentNavigationInstance) {
        return Ext.factory(navigation, "EnergyApp.view.Navigation", currentNavigationInstance);
    },

    updateNavigation: function (navigation, currentNavigationInstance) {
        if (currentNavigationInstance) {
            this.remove(currentNavigationInstance);
        }
        if (navigation) {
            this.add(navigation);
        }
    },

    applyNavigationButton: function (navigationButton, currentNavigationButtonInstance) {

        navigationButton = Ext.factory(navigationButton, "Ext.Button", currentNavigationButtonInstance);
        return navigationButton;
    },

    updateNavigationButton: function (navigationButton, currentNavigationButtonInstance) {
        if (currentNavigationButtonInstance) {
            this.getToolbar().remove(currentNavigationButtonInstance);
        }
        if (navigationButton) {
            this.getToolbar().add(navigationButton);
        }
    },

    updateTitle: function (title) {
        if (this.getToolbar()) {
            this.getToolbar().setTitle(title);
        }
    },

    applyToolbar: function (toolbar, currentToolbarInstance) {
        toolbar = Ext.factory(toolbar, "Ext.TitleBar", currentToolbarInstance);
        return toolbar;
    },

    updateToolbar: function (toolbar, oldToolbar) {
        if (oldToolbar) {
            this.getMainRegion().remove(oldToolbar);
        }
        if (toolbar) {
            this.getMainRegion().add(toolbar);
        }
    }
});