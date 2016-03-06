var menuData = [
    { type: 'header', items: [{ type: 'brand', name: 'The Company', url: '/' }] },
    { type: 'navbar', items: [
        { type: 'link', name: 'Link 1', url: '/test', isDisabled: function() { return true;}},
        { type: 'link', name: 'Link 2', key: 'p', url: '/zwidgets/index.html' },
        { type: 'menu', name: 'Menu 1', key: 'm', height: 300, columns: [
            { items: [
                { type: 'link', name: 'Sublink 1', description: 'Link 1, 1', url: '/asd' },
                { type: 'link', name: 'Sublink 2', description: 'Link 1, 2', url: '/sdf' },
                { type: 'action', id: 'SixthAction', waiting: true }
            ]},
            { style: 'default', width: 200, items: [
                { type: 'link', name: 'Sublink 4', description: 'Link 2, 1', url: '/fgh' },
                { type: 'link', name: 'Sublink 5', description: 'Link 2, 2', url: '/ghj' },
                { type: 'link', name: 'Sublink 6', description: 'Link 2, 3', url: '/hjk', iisActive: true },
                { type: 'link', name: 'Sublink 7', description: 'Link 2, 4', url: '/jkl' },
                { type: 'link', name: 'Sublink 4', description: 'Link 2, 5', url: '/fgh' },
                { type: 'link', name: 'Sublink 5', description: 'Link 2, 6', url: '/ghj', isDisabled: true },
                { type: 'link', name: 'Sublink 8', description: 'Link 2, 7', url: '/kl;' }
            ]},
            { style: 'light', width: 200, isSearchable: true, id: 'ThirdColumn', waiting: true },
            { style: 'dark', width: 200, isSearchable: true,  items: [
                { type: 'link', name: 'Sublink 4', description: 'Link 4, 1', url: '/fgh' },
                { type: 'link', name: 'Sublink 5', description: 'Link 4, 2', key: 'r', url: '/ghj' },
                { type: 'link', name: 'Sublink 6', ddescription: 'Link 4, 3', url: '/hjk', iisActive: true },
                { type: 'link', name: 'Sublink 7', ddescription: 'Link 4, 4', url: '/jkl' },
                { type: 'link', name: 'Sublink 4', description: 'Link 4, 5', url: '/fgh' },
                { type: 'link', name: 'Sublink 5', ddescription: 'Link 4, 6', url: '/ghj', isDisabled: function() {return true;} },
                { type: 'link', name: 'Sublink 8', description: 'Link 4, 7', url: '/kl;' }
            ]},
            { style: 'inverse', autoMapToNumberKeys: true, width: 200, items: [
                { type: 'link', name: 'Sublink 4', description: 'Link 5, 1', url: '/fgh' },
                { type: 'link', name: 'Sublink 5', description: 'Link 5, 2', url: '/ghj' },
                { type: 'link', name: 'Sublink 6', description: 'Link 5, 3', url: '/hjk', iisActive: true },
                { type: 'link', id: 'FourthItem', waiting: true },
                { type: 'link', name: 'Sublink 4', description: 'Link 5, 5', url: '/fgh' },
                { type: 'link', name: 'Sublink 5', description: 'Link 5, 6', url: '/ghj', isDisabled: true },
                { type: 'link', name: 'Sublink 8', description: 'Link 5, 7', url: '/kl;' }
            ]}]},
        { type: 'menu', name: 'Menu 2', key: 'n', id: 'SecondMenu', waiting: true},
        { type: 'link', name: 'Link 3', url: '/testest' },
        { type: 'action', name: 'Action 4', fn: function() { alert('That was a button, not a link!'); } }]
    }];

var ajaxMenu = { items: [
    { type: 'link', name: 'Sublink 1', description: 'Second menu, here I come!', url: '/sdf' },
    { type: 'link', name: 'Sublink 2', description: 'Second menu, ahoy!', url: '/fghfh' }
]};

var ajaxColumn = { items: [
    { type: 'link', name: 'Sublink 1', description: 'Link 3, 1', url: '/fgh' },
    { type: 'link', name: 'Wait...', id: 'FifthItem', waiting: true },
    { type: 'link', name: 'Sublink 2', description: 'Link 3, 2', url: '/ghj' },
    { type: 'link', name: 'Sublink 3', description: 'Link 3, 3', url: '/hjk', isActive: function() { return false; } },
    { type: 'link', name: 'Sublink 4', description: 'Link 3, 4', url: '/jkl' },
    { type: 'link', name: 'Sublink 5', description: 'Link 3, 5', url: '/zwidgets/index.html' },
    { type: 'link', name: 'Sublink 6', description: 'Link 3, 6', url: '/ghj', isDisabled: true },
    { type: 'link', name: 'Sublink 7', description: 'Link 3, 7', url: '/kl;' },
    { type: 'link', name: 'Sublink 8', description: 'Link 3, 1', url: '/fgh' },
    { type: 'link', name: 'Sublink 9', description: 'Link 3, 2', url: '/ghj' },
    { type: 'link', name: 'Sublink 10', description: 'Link 3, 3', url: '/hjk', isActive: function() { return false; } },
    { type: 'link', name: 'Sublink 11', description: 'Link 3, 4', url: '/jkl' },
    { type: 'link', name: 'Sublink 12', description: 'Link 3, 5', url: '/sad' },
    { type: 'link', name: 'Sublink 13', description: 'Link 3, 6', url: '/ghj' },
    { type: 'link', name: 'Sublink 15', description: 'Link 3, 1', url: '/fgh' },
    { type: 'link', name: 'Sublink 16', description: 'Link 3, 2', url: '/ghj' },
    { type: 'link', name: 'Sublink 17', description: 'Link 3, 3', url: '/hjk', isActive: function() { return false; } },
    { type: 'link', name: 'Sublink 18', description: 'Link 3, 4', url: '/jkl' },
    { type: 'link', name: 'Sublink 19', description: 'Link 3, 5', url: '/da' },
    { type: 'link', name: 'Sublink 20', description: 'Link 3, 6', url: '/ghj', isDisabled: true },
    { type: 'link', name: 'Sublink 21', description: 'Link 3, 7', url: '/kl;' }
]};

var ajaxItem1 = { name: 'Sublink 7', description: 'Link 5, 4', url: '/jkl' };

var ajaxItem2 = { name: 'Sublink 14', description: 'Link 3, 7', url: '/kl;' };

var ajaxAction = { name: 'Save work', description: 'Async save of everything', key: 'e', fn: function() { alert('Saving...'); } };

$(document).ready(function() {
    var $target = $('#z-nav');

    if (!$target) {
        throw 'Target element for z-navigation was not found.';
    }

    if (!$target.znavigation) {
        throw 'z-navigation widget constructor not found.';
    }

    $target.znavigation({ data: menuData });

    setTimeout(function() {
        $target.znavigation('setItem', 'SecondMenu', ajaxMenu);
    }, 2000);

    setTimeout(function() {
        $target.znavigation('setItem', 'ThirdColumn', ajaxColumn);
    }, 3000);

    setTimeout(function() {
        $target.znavigation('setItem', 'FourthItem', ajaxItem1);
        $target.znavigation('setItem', 'FifthItem', ajaxItem2);
        $target.znavigation('setItem', 'SixthAction', ajaxAction);
    }, 3500);
});