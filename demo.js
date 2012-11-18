$(document).ready(function(){

    var app = {
        views: {},
        collections: {},
        models: {}
    };

    var genMockData = function(_key) {
        var demoContent = {
            '1': 'list',

            '1/1': 'list_1_item',

            '1/1/1': 'list_1_item_1_detail',
            '1/1/2': 'list_1_item_2_detail',
            '1/1/3': 'list_1_item_3_detail',

            '1/2': 'list_2_item',
            '1/2/1': 'list_2_item_1_detail',
            '1/2/2': 'list_2_item_2_detail',
            '1/2/3': 'list_2_item_3_detail',


            '1/3': 'list_3_item',
            '1/3/1': 'list_3_item_1_detail',
            '1/3/2': 'list_3_item_2_detail',
            '1/3/3': 'list_3_item_3_detail'
        }
        return {
            url: '/api/list/' + _key,
            responseTime: 0,
            responseText: {
                errCode: 0,
                data: [
                    { id: 1, url: '/api/list/' + _key + '/1', content: demoContent[_key] + '_1' },
                    { id: 2, url: '/api/list/' + _key + '/2', content: demoContent[_key] + '_2' },
                    { id: 3, url: '/api/list/' + _key + '/3', content: demoContent[_key] + '_3' }
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
    $.mockjax(genMockData('1/2/3'));

    $.mockjax(genMockData('1/3/1'));
    $.mockjax(genMockData('1/3/2'));
    $.mockjax(genMockData('1/3/3'));

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

