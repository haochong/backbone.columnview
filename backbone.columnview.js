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
              , selectedItem = $(e.target)
              , viewIndex = this.viewIndex
              , newViews = [];

            var list = new manager.CollectionClass();

            this.$el.find('a.selected').removeClass('selected');
            selectedItem.addClass('selected');

            manager.$el.find('a.highlight').removeClass('highlight');
            selectedItem.addClass('highlight');

            list.url = selectedItem.data("url");
            list.fetch({
                success: function(collection, response) {
                    if(viewIndex < views.length) {
                        for(var i = viewIndex+1; i < views.length; i++) {
                            views[i].$el.remove();
                        }
                        views.splice(viewIndex+1, views.length);
                    }
                    if(collection && collection.length) {
                        manager.addColumn(collection);
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
                this.addColumn(this.collection);
            }
        },
        render: function() {
            return this;
        },
        addColumn: function(_collection) {
            if(_collection.length) {
                var column = new Backbone.ColumnView({ collection: _collection, manager: this });
                this.views.push(column);
                this.$el.append(column.render().$el);
            } else {
                console.error('collection error');
            }
        }

      });

})(this);
