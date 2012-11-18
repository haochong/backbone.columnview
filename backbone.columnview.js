(function(window) {

    Backbone.ItemView = Backbone.View.extend({
        tagName: "li",
        className: "item",
        template: _.template('<a href="javascript:;" data-url="<%= url %>" class="next-btn"><%= content %></a>'),
        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        }
    });

    Backbone.ColumnView = Backbone.View.extend({
        tagName: "ul",
        className: "column-view",
        initialize: function() {

            var manager = this.options.manager
            , views = manager.views
            , viewIndex = manager.views.length
            , parentView
            , left;

            if(viewIndex && views && views[viewIndex-1]) {
                parentView = views[viewIndex-1].$el;
            }
            left = parentView ? (parseInt(parentView.css('left')) + parentView.outerWidth()) : 0;
            
            this.viewIndex = viewIndex;

            this.$el.css({
                position: "absolute",
                top: 0,
                left: left
            });
        },
        events: {
            "click .next-btn": "nextColumn"
        },

        nextColumn: function(e) {
            var manager = this.options.manager
              , views = manager.views
              , viewIndex = this.viewIndex
              , newViews = [];

            var list = new manager.CollectionClass();
            list.url = $(e.target).data("url");
            list.fetch({
                success: function(collection, response) {
                    if(viewIndex < views.length) {
                        for(var i = viewIndex+1; i < views.length; i++) {
                            views[i].$el.remove();
                        }
                        views.splice(viewIndex+1, views.length);
                    }
                    if(collection && collection.length) {
                        manager.nextColumn(collection);
                    }
                }
            });

        },
        render: function() {

            var el = this.el;
            if(this.collection.length) {
                this.collection.each(function(item) {
                    $(el).append(new Backbone.ItemView({
                        model: item
                    }).render().el);
                });
            }

            return this;
        }
        
    });

    Backbone.ColumnViewManager = Backbone.View.extend({
        tagName: "div",
        className: "column-view-wrap",
        initialize: function() {
            this.views = [];
            this.CollectionClass = this.options.collectionClass;
            this.$el.css({
                position: "relative"
            });
            if(this.collection) {
                this.nextColumn(this.collection);
            }
        },
        events: {
            "click .next-btn": "nextColumn"
        },
        render: function() {
            return this;
        },
        nextColumn: function(_collection) {
            console.trace('nextColumn');
            if(_collection.length) {
                var column = new Backbone.ColumnView({ collection: _collection, manager: this });
                this.views.push(column);
                this.$el.append(column.render().$el);
            } else {
                //console.error('collection error');
            }
        }

      });

})(this);
