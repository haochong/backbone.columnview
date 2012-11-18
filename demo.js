$(document).ready(function(){

    var app = {
        views: {},
        collections: {},
        models: {}
    };

    var genMockData = function(_key) {
        return {
            url: '/api/list/' + _key,
            responseTime: 750,
            responseText: {
                errCode: 0,
                data: [
                    { id: 1, url: '/api/list/' + _key + '/1', content: _key + '_1_content' },
                    { id: 2, url: '/api/list/' + _key + '/2', content: _key + '_2_content' },
                    { id: 3, url: '/api/list/' + _key + '/3', content: _key + '_3_content' }
                ]
            }
        }
    };

    $.mockjax(genMockData('1'));

    $.mockjax(genMockData('1/1'));
    $.mockjax(genMockData('1/2'));
    $.mockjax(genMockData('1/3'));

    $.mockjax(genMockData('1/1/1'));
    $.mockjax(genMockData('1/1/2'));
    $.mockjax(genMockData('1/1/3'));

    $.mockjax(genMockData('1/2/1'));
    $.mockjax(genMockData('1/2/2'));

    $.mockjax(genMockData('1/3/1'));

    var ItemCollection = Backbone.Collection.extend({
        parse: function(response) {
            return response.data;
        }
    });
    var rootList = new ItemCollection();
    rootList.url = '/api/list/1';
    rootList.fetch({
        success: function(collection, response) {
            app.views.columnViewManager = new Backbone.ColumnViewManager({
                collection: collection,
                collectionClass: ItemCollection
            });
            $('div.container').html(app.views.columnViewManager.render().el);
        }
    });

});

