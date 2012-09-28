Ext.define('ChartMe.view.ChartContainer', {
    extend: 'Ext.Container',
    alias: 'widget.chartcontainer',

    config: {
        flex: 1,
        padding: 10,
        style: '',
        cls: [
            'chart-container'
        ],
        listeners: [
            {
                fn: 'onContainerInitialize',
                event: 'initialize'
            }
        ]
    },

    onContainerInitialize: function(component, options) {

        this.tmpPanel = null;
        this.start = false;
        this.main = Ext.getCmp('MainView');
        this.heightOffset = 47;

        if(!this.main.cmpArray) {
            this.main.cmpArray = [];
        }

        //adds this component to MainView array, keeps track of all components added to loop through later
        this.main.cmpArray.push(this.getId());

        component.element.on({
            taphold: function(event, node, options, eOpts){
                this.element.addCls('x-dragging');
                this.element.fireEvent('dragstart');
                this.start = true;
            },

            tap: function(event, node, options, eOpts){
                //this handles if container is pressed down and then user lifts finger
                this.element.removeCls('x-dragging');
                this.start = false;
            },

            dragstart: this.dragstart,

            drag: this.drag,

            dragend: this.dragend,

            scope: this
        });
    },

    dragstart: function(event, node, options, eOpts) {
        this.start = true; //remove this line to enable taphold to drag component

        if(!this.start) {
            return;
        }

        this.element.setVisibility(0);

        this.tmpPanel = Ext.create('Ext.Container', {  
            cls: 'temp-container',
            padding: this.getPadding(),
            html: this.getHtml(),
            top: this.element.getY()-this.heightOffset,
            left: this.element.getX(),
            height: this.element.getHeight(),
            width: this.element.getWidth()
        });

        this.main.add(this.tmpPanel);
    },

    drag: function(event, node, options, eOpts) {
        if(!this.start) {
            return;
        }

        var left = this.element.getX()+event.deltaX;
        var top = this.element.getY()-this.heightOffset+event.deltaY;
        var prevComp = this.hoveredComp;
        this.hoveredComp = this.getHoveredChart(event.pageX,event.pageY);

        //add/remove hovered border
        if(prevComp && prevComp.hasBorder && prevComp != this.hoveredComp){
            prevComp.removeCls('drop-border');    
            prevComp.hasBorder = false;
        } else if(this.hoveredComp && this != this.hoveredComp && !this.hoveredComp.hasBorder){
            this.hoveredComp.addCls('drop-border');
            this.hoveredComp.hasBorder = true;
        }

        this.tmpPanel.setTop(top);
        this.tmpPanel.setLeft(left);
    },

    dragend: function(event, node, options, eOpts) {
        this.element.removeCls('x-dragging');

        if(!this.start) {
            return;
        }

        //get destination container
        var destComp = this.getHoveredChart(event.pageX,event.pageY);


        if(!destComp||this==destComp) { //if a component was not found or same as original
            this.doAnimate(this.tmpPanel,this);
        } else {

            destComp.removeCls('drop-border');

            //set visibility
            var destElem = destComp.element;
            destElem.setVisibility(0);
            this.element.setVisibility(0);

            //switch container positions
            var parent1 = this.getParent(),
                parent2 = destComp.getParent(),
                index1 = parent1.indexOf(this),
                index2 = parent2.indexOf(destComp);
            parent1.insert(index1,destComp);
            parent2.insert(index2,this);   

            //find smallest panel size
            var width;
            var height;
            if(this.element.getWidth() < destElem.getWidth()) {
                width = this.element.getWidth();
                height = this.element.getHeight();      
            } else {
                width = destElem.getWidth();
                height = destElem.getHeight();     
            }

            //add second hovered panel
            var hoveredPanel = Ext.create('Ext.Container', {  
                cls: 'temp-container',
                padding: this.getPadding(),
                html: destComp.getHtml(),
                top: this.element.getY()-this.heightOffset,
                left: this.element.getX(),
                height: height,
                width: width
            });
            this.main.add(hoveredPanel);

            //set height/width of first hovered panel
            this.tmpPanel.setHeight(height);
            this.tmpPanel.setWidth(width);

            //animate hovered panels to correct positions
            this.doAnimate(hoveredPanel,destComp);
            this.doAnimate(this.tmpPanel,this);
        }

        //uninit
        this.tmpPanel = null;
        this.start = false;
    },

	//this function animates the floating panel to the position of the destComp, removes the floating panel, and shows the hidden destComp
    doAnimate: function(panel,destComp) {
        
        //request animation frame from browser
        var requestAnimFrame = (function(callback){
            return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback){
                window.setTimeout(callback, 1000 / 30);
            };
        })();

        var main = this.main;
        var heightOffset = this.heightOffset;
        var linearSpeed = 1300; // pixels / second
        var me = this;

        //find relative xy directions to destination component
        var xdir,ydir;
        if (panel.element.getX() < destComp.element.getX()) {
            xdir = 1;
        } else if(panel.element.getX() > destComp.element.getX()) {
            xdir = -1;
        } else {
            xdir = 0;
        }
        if (panel.element.getY() < destComp.element.getY()) {
            ydir = 1;
        } else if(panel.element.getY() > destComp.element.getY()) {
            ydir = -1;
        } else {
            ydir = 0;
        }

        //y=mx+b
        var slope = (destComp.element.getY()-panel.element.getY())/(destComp.element.getX()-panel.element.getX());
        var b = destComp.element.getY() - slope*destComp.element.getX()-heightOffset;

        function animate(lastTime){

            // update
            var date = new Date();
            var time = date.getTime();
            var timeDiff = time - lastTime;
            lastTime = time;    
            var linearDistEachFrame = linearSpeed * timeDiff / 1000;

            var x, y;

            //if slope is greater than 1, this gets the correct values when slope approaches infinity
            if(Math.abs(slope)>=1) {       
                y = panel.getTop()+linearDistEachFrame*ydir;
                x = (y-b)/slope||panel.getLeft(); //if slope is infinity use old x value
            } else {
                x = panel.getLeft()+linearDistEachFrame*xdir; 
                y = slope*x+b;
            }

            //calc if panel is in correct position
            var bool1 = x <= destComp.element.getX() && xdir < 0,
                bool2 = x >= destComp.element.getX() && xdir > 0,
                bool3 = y <= destComp.element.getY()-heightOffset && ydir < 0,
                bool4 = y >= destComp.element.getY()-heightOffset && ydir > 0;

            if(!b || bool1 || bool2 || bool3 || bool4) {       
                destComp.element.setVisibility(1);
                main.remove(panel);
                return;
            }

            //set panel pos
            panel.setLeft(x);
            panel.setTop(y);

            requestAnimFrame(function(){
                animate(lastTime);
            });
        }

        var date = new Date(),
            time = date.getTime();

        //start animation
        animate(time);
    },

    getHoveredChart: function(pageX, pageY) {
        var els = this.main.cmpArray, //gets array of all componenets added to MainView
        destComp = null;

        //finds component that mouse pointer is currently over
        for(var i in els) {
            var c = Ext.getCmp(els[i]),
                el = c.element,
                height = el.getHeight(),
                width = el.getWidth(),
                x = el.getX(),
                y = el.getY();
            if(pageX < x+width && pageX > x && pageY < y+height && pageY > y) {
                destComp = c;
                break;
            }
        }

        return destComp;
    }

});