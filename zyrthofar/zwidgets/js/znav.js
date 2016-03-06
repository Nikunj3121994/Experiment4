(function($) {

    $.widget("ui.znavigation", {
        version: "1.10.3",
        options: {
            data: {},
            menuCaret: '<i class="fa fa-caret-down"></i>',
            waitingAnimation: '<i class="fa fa-spinner fa-spin"></i>',
            activateCurrentPage: true
        },

        _create: function() {
            this.element.addClass('navbar navbar-default');
            structureHandler.createNav(this.element, this.options.data, this.options);
        },

        _destroy: function() {
            this.element.removeClass('navbar navbar-default');
            structureHandler.destroyNav(this.element);
        },

        setItem: function(itemId, data) {
            var $item = $('#' + itemId);

            if ($item) {
                var item = $item.data('item');

                if (item) {
                    for (var p in data) {
                        item[p] = data[p];
                    }
                    item.waiting = false;

                    structureHandler.setItem($item, item);
                }
            }
        }

    });

    var menuDropdownHandler = (function() {

        var current = {
            $menu: null,
            $column: null,
            $item: null
        };

        var activateCurrentPage = true,
            menuState = null, // 'preview', 'active', or null
            previewDelay = 250,
            closingTimeout = null,
            previewOpeningTimeout = null,
            previewClosingTimeout = null;

        function _getCurrentItem() {
            return (current.$item && current.$item.length > 0 ? current.$item : null) ||
                _getFirstItemInColumn(current.$column) ||
                _getFirstItemInMenu(current.$menu);
        };

        function _getFirstItemInColumn($column) {
            $column = $column || current.$column;

            if ($column) {
                var $item = $column
                    .find('li:not(.hidden):not(.disabled)')
                    .first();

                if ($item && $item.length > 0) {
                    return $item;
                }
            }

            return null;
        };

        function _getLastItemInColumn($column) {
            $column = $column || current.$column;

            if ($column) {
                var $item = $column
                    .find('li:not(.hidden):not(.disabled)')
                    .last();

                if ($item && $item.length > 0) {
                    return $item;
                }
            }

            return null;
        };

        function _getFirstItemInMenu($menu) {
            if ($menu) {
                var $item = _getFirstItemInColumn(_getFirstColumnInMenu($menu));

                if ($item && $item.length > 0) {
                    return $item;
                }
            }

            return null;
        };

        function _getPreviousItem($item) {
            $item = $item || _getCurrentItem();

            if ($item) {
                var $prevItem = $item
                    .prevAll('li:not(.hidden):not(.disabled)')
                    .first();

                return $prevItem.length > 0
                    ? $prevItem
                    : _getLastItemInColumn(_getColumnFromItem($item));
            }

            return null;
        };

        function _getNextItem($item) {
            $item = $item || _getCurrentItem();

            if ($item) {
                var $nextItem = $item
                    .nextAll('li:not(.hidden):not(.disabled)')
                    .first();

                return $nextItem.length > 0
                    ? $nextItem
                    : _getFirstItemInColumn(_getColumnFromItem($item));
            }

            return null;
        };

        function _getItemInPreviousColumn($item) {
            $item = $item || _getCurrentItem();

            if ($item) {
                var $column = _getPreviousColumn(_getColumnFromItem($item)) ||
                    _getLastColumnInMenu();

                return _getItemAtVerticalPosition(_getItemVerticalPosition($item), $column);
            }

            return null;
        };

        function _getItemInNextColumn($item) {
            $item = $item || _getCurrentItem();

            if ($item) {
                var $column = _getNextColumn(_getColumnFromItem($item)) ||
                    _getFirstColumnInMenu();

                return _getItemAtVerticalPosition(_getItemVerticalPosition($item), $column);
            }

            return null;
        };


        function _getCurrentColumn() {
            return current.$column ||
                _getFirstColumnInMenu(current.$menu);
        };

        function _getFirstColumnInMenu($menu) {
            $menu = $menu || current.$menu;

            if ($menu) {
                var $column = $menu.next().find('ul').first();

                if ($column && $column.length > 0) {
                    return $column;
                }
            }

            return null;
        };

        function _getLastColumnInMenu($menu) {
            $menu = $menu || current.$menu;

            if ($menu) {
                var $column = $menu.next().find('ul').last();

                if ($column && $column.length > 0) {
                    return $column;
                }
            }

            return null;
        };

        function _getPreviousColumn($column) {
            if ($column) {
                var $prevColumn = $column.prev();

                return $prevColumn.length > 0
                    ? $prevColumn
                    : _getLastColumnInMenu();
            }

            return null;
        };

        function _getNextColumn($column) {
            if ($column) {
                var $nextColumn = $column.next();

                return $nextColumn.length > 0
                    ? $nextColumn
                    : _getFirstColumnInMenu();
            }

            return null;
        };

        function _getColumnFromItem($item) {
            if ($item) {
                return $item.parents('li').first();
            }

            return null;
        };


        function _getItemVerticalPosition($item) {
            return $item && $item.length > 0
                ? $item.offset().top + $item.height() / 2
                : 0;
        };

        function _getItemAtVerticalPosition(vpos, $column) {
            if ($column) {
                var $item = null;

                $column.find('li:not(.hidden):not(.disabled)')
                    .each(function() {
                        var $this = $(this);
                        if ($this.offset().top > vpos) {
                            return false;
                        }

                        $item = $this;

                        return true;
                    });

                return $item && $item.length > 0
                    ? $item
                    : _getFirstItemInColumn($column);
            }

            return null;
        };

        function _keyboardSelectItem($item) {
            if ($item) {
                current.$menu.next().find('.selected').removeClass('selected');

                current.$item = $item;
                current.$item.addClass('selected');

                current.$column = _getColumnFromItem($item);
                current.$column.addClass('selected');

                var $list = $item.parent(),
                    listHeight = $list.height(),
                    itemHeight = $item.height(),
                    listTop = $list.position().top,
                    itemTop = $item.position().top - listTop,
                    listScrollTop = $list.scrollTop();

                if (itemTop < 0) {
                    $list.scrollTop(itemTop + listScrollTop);
                }
                else if (itemTop + itemHeight > listHeight) {
                    $list.scrollTop(itemTop + itemHeight + listScrollTop - listHeight);
                }
            }
        };

        function _setItemsStatus($menu) {
            $menu = $menu || current.$menu;

            var $items = $menu.next().find('ul.menu-column li');

            $items.each(function(i, el) {
                var $item = $(el),
                    item = $item.data('item');

                if (item && (item.type === 'link' || item.type === 'action')) {
                    _setItemStatus($item, item);
                }

            });
        }

        function _setItemStatus($item, item) {
            var isActive = false,
                isDisabled = false,
                isCurrentPage = false;

            if (item.isActive) {
                isActive = typeof item.isActive === 'function'
                    ? item.isActive(item) === true
                    : item.isActive === true;
            }

            if (item.isDisabled) {
                isDisabled = typeof item.isDisabled === 'function'
                    ? item.isDisabled(item) === true
                    : item.isDisabled === true;
            }

            if (activateCurrentPage) {
                isCurrentPage = window.location.pathname.indexOf(item.url) !== -1;
            }

            $item
                .toggleClass('active', isActive || isCurrentPage)
                .toggleClass('disabled', isDisabled);
        }


        function _openMenu($menu, state) {
            if ($menu) {
                _closeMenu();

                current.$menu = $menu;
                current.$column = null;
                current.$item = null;
                menuState = state;

                _setItemsStatus($menu);

                var $dropdown = $menu.next();
                $dropdown.addClass('open');

                if (menuState === 'active') {
                    _activateMenu($menu);

                    $(document).one('click', function() { _closeMenu(); });
                }
                else if (menuState === 'preview') {
                    $dropdown
                        .on('mouseenter', function() {
                            _cancelOpenPreview();
                            _cancelClosePreview();
                        })
                        .on('mouseleave', _scheduleClosePreview);

                    $menu
                        .on('mouseleave', _scheduleClosePreview);
                }

                _cancelOpenPreview();
                _cancelClosePreview();
            }
        };

        function _closeMenu($menu) {
            $menu = $menu || current.$menu;

            if ($menu) {
                var $dropdown = $menu.next();

                $dropdown.removeClass('open');

                current.$menu = null;

                $dropdown.find('input').val('');
                $dropdown.find('li.hidden').removeClass('hidden');
                $dropdown.find('li.selected').removeClass('selected');

                _cancelClosePreview();
            }
        };

        function _activateMenu($menu) {
            $menu = $menu || current.$menu;
            var $dropdown = $menu.next();

            menuState = 'active';

            var $target = $dropdown.find('input.column-filter').first();
            ($target.length > 0 ? $target : $dropdown).focus();

            var $item = _getFirstItemInMenu($menu);
            _keyboardSelectItem($item);
        };

        function _scheduleOpenPreview($menu, state) {
            if (menuState !== 'active') {
                _cancelOpenPreview();

                previewOpeningTimeout = window.setTimeout(function() {
                    _openMenu($menu, state);
                }, previewDelay);
            }
        };

        function _scheduleClosePreview() {
            if (menuState !== 'active') {
                _cancelOpenPreview();
                _cancelClosePreview();

                previewClosingTimeout = window.setTimeout(function() {
                    _closeMenu();
                }, previewDelay);
            }
        };

        function _cancelOpenPreview() {
            if (previewOpeningTimeout) {
                window.clearTimeout(previewOpeningTimeout);
                previewOpeningTimeout = null;
            }
        };

        function _cancelClosePreview() {
            if (previewClosingTimeout) {
                window.clearTimeout(previewClosingTimeout);
                previewClosingTimeout = null;
            }
        };


        return {

            selectFirstItem: function() {
                _keyboardSelectItem(_getFirstItemInColumn());
            },

            selectPreviousItem: function() {
                _keyboardSelectItem(_getPreviousItem());
            },

            selectNextItem: function() {
                _keyboardSelectItem(_getNextItem());
            },

            selectLastItem: function() {
                _keyboardSelectItem(_getLastItemInColumn());
            },

            selectPreviousColumn: function() {
                _keyboardSelectItem(_getItemInPreviousColumn());
            },

            selectNextColumn: function() {
                _keyboardSelectItem(_getItemInNextColumn());
            },

            selectFirstItemInMenu: function() {
                _keyboardSelectItem(_getFirstItemInColumn(_getFirstColumnInMenu()));
            },

            selectLastItemInMenu: function() {
                _keyboardSelectItem(_getLastItemInColumn(_getLastColumnInMenu()));
            },

            previewMenu: function($menu){
                if (menuState !== 'active') {
                    $menu = $menu || current.$menu;

                    _scheduleOpenPreview($menu, 'preview');
                }
            },

            activateMenu: function() {
                if (menuState !== 'active') {
                    _activateMenu();

                    _cancelOpenPreview();
                    _cancelClosePreview();
                }
            },

            openMenu: function($menu) {
                $menu = $menu || current.$menu;

                _openMenu($menu, 'active');
            },

            closeMenu: function($menu) {
                $menu = $menu || current.$menu;
                menuState = null;

                _closeMenu($menu);
            },

            toggleMenu: function($menu, value) {
                $menu = $menu || current.$menu;

                if (value === true) {
                    _openMenu($menu, 'active');
                }
                else if (value === false) {
                    _closeMenu($menu);
                }
                else if ($menu.next().hasClass('open')) {
                    if (menuState === 'preview') {
                        _activateMenu($menu);
                    }
                    else {
                        _closeMenu($menu);
                    }
                }
                else {
                    _openMenu($menu, 'active');
                }
            },

            activateItem: function($item) {
                $item = $item || current.$item;

                if ($item) {
                    var item = $item.data('item');

                    if (item) {
                        if (item.type === 'link') {
                            window.location.href = item.url;
                        }
                        else if (item.type === 'action') {
                            if (item.fn) {
                                item.fn(item);
                            }
                        }
                    }
                }
            },

            closeMenuWithTimeout: function($menu) {
                closingTimeout = setTimeout(function() {
                   _closeMenu($menu);
                }, 100);
            },

            cancelCloseMenuWithTimeout: function() {
                if (closingTimeout) {
                    clearTimeout(closingTimeout);
                }
            }

        };

    })();

    var shortcutHandler = (function() {

        var shortcuts = [];

        function _addShortcut(type, $target, key, ctrl, alt, shift) {
            shortcuts.push({
                type: type,
                $target: $target,
                key: key,
                ctrl: ctrl,
                alt: alt,
                shift: shift
            })
        };

        function _checkShortcuts(e) {
            if (shortcuts && shortcuts.length > 0) {
                var k = e.charCode,
                    c = e.ctrlKey,
                    a = e.altKey;

                for (var i = 0, it = shortcuts.length; i < it; i++) {
                    var s = shortcuts[i];
                    if (s.key.charCodeAt(0) == k && s.ctrl === c && s.alt === a) {
                        if (s.type === 'menu') {
                            menuDropdownHandler.toggleMenu(s.$target);
                        }
                        else if (s.type === 'link') {
                            window.location.href = s.$target.attr('href');
                        }
                        else if (s.type === 'action') {
                            var item = s.$target.parent().data('item');

                            if (item && item.fn) {
                                item.fn(item);
                            }
                        }
                        break;
                    }
                }
            }
        }

        $(document).on('keypress', _checkShortcuts);

        return {

            addAlphabeticShortcut: function(type, $target, key, ctrl, alt, shift) {
                if (key) {
                    key = key.toLowerCase();
                    if (key >= 'a' && key <= 'z') {
                        _addShortcut(type, $target, key, ctrl === true, alt === true, shift === true);
                    }
                }
            },

            addNumericShortcut: function(type, $target, key, ctrl, alt, shift) {
                if (key && key >= 0 && key <= 9) {
                    key = key + '';
                    _addShortcut(type, $target, key, ctrl === true, alt === true, shift === true);
                }
            }

        };

    })();

    var structureHandler = (function() {

        var activateCurrentPage,
            menuCaret,
            waitingAnimation;

        function _generateSection(section) {
            if (section) {
                switch (section.type) {
                    case('header'): return _generateHeader(section);
                    case('navbar'): return _generateNavBar(section);
                }
            }

            return null;
        };

        function _generateHeader(header) {
            if (header) {
                var $header = $('<div class="navbar-header"></div>');

                if (header.items) {
                    for (var i = 0, it = header.items.length; i < it; i++) {
                        $header.append(_generateItem(header.items[i]));
                    }
                }

                return $header;
            }

            return null;
        };

        function _generateNavBar(navbar) {
            if (navbar) {
                var $navbar = $('<ul class="nav navbar-nav"></ul>');

                if (navbar.items) {
                    for (var i = 0, it = navbar.items.length; i < it; i++) {
                        $navbar.append(_generateItem(navbar.items[i]));
                    }
                }

                return $navbar;
            }

            return null;
        };

        function _generateItem(item) {
            if (item) {
                switch (item.type) {
                    case('brand'): return _generateBrand(item);
                    case('link'): return _generateLink(item);
                    case('action'): return _generateAction(item);
                    case('menu'): return _generateMenu(item);
                    case('column'): return _generateMenuColumn(item);
                };
            }

            return null;
        };

        function _generateBrand(brand) {
            if (brand) {
                var $anchor = $('<a class="navbar-brand" href="'+ brand.url + '">' + brand.name + '</a>');

                return $('<li></li>')
                    .append($anchor);
            }

            return null;
        };

        function _generateLink(link) {
            if (link) {
                var name = (link.name || '') + (link.waiting ? ' ' + waitingAnimation : ''),
                    url = link.url || '#',
                    $anchor = $('<a href="' + url + '">' + name + '</a>'),
                    isActive = false,
                    isDisabled = false,
                    isCurrentPage = false;


                if (link.description) {
                    $anchor.attr('title', link.description);
                }

                if (link.key) {
                    shortcutHandler.addAlphabeticShortcut('link', $anchor, link.key, true, true, false);
                }

                if (link.parentType === 'column') {
                    $anchor.attr('tabindex', '-1');
                }
                else if (!link.parentType) {
                    $anchor.on('keypress', function(e) {
                        if (e.keyCode === 13 || e.charCode === 32) {
                            // ENTER or SPACE key - activate link.
                            window.location.href = $(this).attr('href');
                            e.stopPropagation();
                            e.preventDefault();
                        }
                    });
                }

                if (link.isActive) {
                    isActive = typeof link.isActive === 'function'
                        ? link.isActive(link) === true
                        : link.isActive === true;
                }

                if (link.isDisabled) {
                    isDisabled = typeof link.isDisabled === 'function'
                        ? link.isDisabled(link) === true
                        : link.isDisabled === true;
                }

                if (activateCurrentPage) {
                    isCurrentPage = window.location.pathname.indexOf(link.url) !== -1;
                }

                var $li = $('<li></li>');

                if (link.id) {
                    $li.attr('id', link.id);
                }

                return $li
                    .addClass(link.class)
                    .toggleClass('active', isActive || isCurrentPage)
                    .toggleClass('disabled', isDisabled)
                    .data('item', link)
                    .append($anchor);
            }

            return null;
        };

        function _generateAction(action) {
            if (action) {
                var name = (action.name || '') + (action.waiting ? ' ' + waitingAnimation : ''),
                    $anchor = $('<a href="#">' + name + '</a>')
                        .on('click', function(e) {
                            menuDropdownHandler.closeMenu();
                            menuDropdownHandler.activateItem($(this).parent());

                            e.stopPropagation();
                            e.preventDefault();
                        })
                        .on('keypress', function(e) {
                            if (e.keyCode === 13 || e.charCode === 32) {
                                // ENTER or SPACE key - activate action.
                                menuDropdownHandler.closeMenu();
                                menuDropdownHandler.activateItem($(this).parent());

                                e.stopPropagation();
                                e.preventDefault();
                            }
                        }),
                    isActive = false,
                    isDisabled = false;

                if (action.description) {
                    $anchor.attr('title', action.description);
                }

                if (action.key) {
                    shortcutHandler.addAlphabeticShortcut('action', $anchor, action.key, true, true, false);
                }

                if (action.parentType === 'column') {
                    $anchor.attr('tabindex', '-1');
                }

                if (action.isActive) {
                    isActive = typeof action.isActive === 'function'
                        ? action.isActive(action) === true
                        : action.isActive === true;
                }

                if (action.isDisabled) {
                    isDisabled = typeof action.isDisabled === 'function'
                        ? action.isDisabled(action) === true
                        : action.isDisabled === true;
                }

                var $li = $('<li></li>');

                if (action.id) {
                    $li.attr('id', action.id);
                }

                return $li
                    .addClass(action.class)
                    .toggleClass('active', isActive)
                    .toggleClass('disabled', isDisabled)
                    .data('item', action)
                    .append($anchor);
            }

            return null;
        };

        function _generateMenu(menu) {
            if (menu) {
                var $anchor = null,
                    $dropdown = null;

                if (!menu.columns && menu.items) {
                    menu.columns = [{ items: menu.items }];
                }

                if (menu.columns) {
                    $anchor = $('<a href="#">' + menu.name + ' ' + menuCaret + '</a>')
                        .addClass('dropdown-toggle')
                        .on('click', function(e) {
                            menuDropdownHandler.toggleMenu($(this));
                            e.stopPropagation();
                        })
                        .on('keypress', function(e) {
                            if (e.keyCode === 13 || e.charCode === 32 || e.keyCode === 40) {
                                // ENTER or SPACE or DOWN arrow key - open dropdown.
                                menuDropdownHandler.toggleMenu($anchor);
                                e.stopPropagation();
                                e.preventDefault();
                            }
                        })
                        .on('mouseenter', function() {
                            menuDropdownHandler.previewMenu($(this));
                        })
                        .on('focus', function() {
                            menuDropdownHandler.cancelCloseMenuWithTimeout();
                        })
                    ;

                    $dropdown = $('<ul></ul>')
                        .addClass('dropdown-menu dropdown-multicolumn')
                        .addClass(menu.class)
                        .attr('tabindex', 0)
                        .on('click', function(e) {
                            // Prevents the menu from closing when clicking on it.
                            menuDropdownHandler.activateMenu();
                            e.stopPropagation();
                        })
                        .on('keypress', function(e) {
                            if (e.keyCode === 27) {
                                // ESCAPE key - close the current menu.
                                menuDropdownHandler.closeMenu();
                                e.stopPropagation();
                            }
                            else if(e.keyCode === 13) {
                                // ENTER key - activate keyboard-selected link or action.

                                menuDropdownHandler.closeMenu();
                                menuDropdownHandler.activateItem();
                                e.stopPropagation();
                            }
                            else if (e.keyCode === 37) {
                                // LEFT arrow key - previous column.
                                menuDropdownHandler.selectPreviousColumn();
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            else if (e.keyCode === 38) {
                                // UP arrow key - previous item.
                                menuDropdownHandler.selectPreviousItem();
                                e.stopPropagation();
                                e.preventDefault();
                                e.preventDefault();
                            }
                            else if (e.keyCode === 39) {
                                // RIGHT arrow key - next column.
                                menuDropdownHandler.selectNextColumn();
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            else if (e.keyCode === 40) {
                                // DOWN arrow key - next item.
                                menuDropdownHandler.selectNextItem();
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            else if (e.keyCode === 33) {
                                // PAGE UP key - first item in column.
                                menuDropdownHandler.selectFirstItem();
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            else if (e.keyCode === 34) {
                                // PAGE DOWN key - last item in column.
                                menuDropdownHandler.selectLastItem();
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            else if (e.keyCode === 35) {
                                // END key - first item in first column.
                                menuDropdownHandler.selectLastItemInMenu();
                                e.stopPropagation();
                                e.preventDefault();
                            }
                            else if (e.keyCode === 36) {
                                // HOME key - last item in last column.
                                menuDropdownHandler.selectFirstItemInMenu();
                                e.stopPropagation();
                                e.preventDefault();
                            }
                        })
                        .on('focusout', function() {
                            menuDropdownHandler.closeMenuWithTimeout($anchor);
                        })
                        .on('focusin', function() {
                            menuDropdownHandler.cancelCloseMenuWithTimeout();
                        });

                    for (var i = 0, it = menu.columns.length; i < it; i++) {
                        menu.columns[i].type = 'column';
                        menu.columns[i].height = menu.height;
                        menu.columns[i].style = menu.columns[i].style || menu.style;

                        $dropdown.append(_generateMenuColumn(menu.columns[i]));
                    }

                    if (menu.key) {
                        shortcutHandler.addAlphabeticShortcut('menu', $anchor, menu.key, true, true, false);
                    }
                }
                else if (menu.waiting === true) {
                    $anchor = $('<a href="#">' + menu.name + ' ' + waitingAnimation + '</a>')
                }

                var $li = $('<li class="dropdown"></li>');

                if (menu.id) {
                    $li.attr('id', menu.id);
                }

                return $li
                    .data('item', menu)
                    .append($anchor)
                    .append($dropdown);
            }

            return null;
        };

        function _generateMenuColumn(column) {
            if (column) {
                var $column = $('<ul></ul>')
                        .addClass('menu-column')
                        .attr('tabindex', '-1');

                var $columnFilter = column.waiting !== true ? _generateMenuColumnFilter(column) : null;

                if (column.width) {
                    $column.css('width', column.width + 'px')
                }

                if (column.height) {
                    $column.css('height', column.height + 'px');
                    $column.css('min-height', column.height + 'px');
                    $column.css('max-height', column.height + 'px');
                }

                if (column.items) {
                    for (var i = 0, it = column.items.length; i < it; i++) {
                        column.items[i].parentType = 'column';
                        $column.append(_generateItem(column.items[i]));
                    }

                    if (column.autoMapToNumberKeys === true) {
                        $column.find('li a')
                            .each(function(i, item) {
                                if (i < 10) {
                                    shortcutHandler.addNumericShortcut('link', $(item), (i+1)%10, true, true, false);
                                }
                            });
                    }
                }
                else if (column.waiting === true) {
                    $column.append('<li><a href="#">' + waitingAnimation + '</a></li>');
                }

                var $li = $('<li class="dropdown-column"></li>');

                if (column.id) {
                    $li.attr('id', column.id);
                }

                return $li
                    .addClass('dropdown-column-' + column.style)
                    .addClass(column.class)
                    .data('item', column)
                    .append($columnFilter)
                    .append($column);
            }

            return null;
        };

        function _generateMenuColumnFilter(column) {
            if (column && column.isSearchable === true) {
                var $input = $('<input type="text" placeholder="Filter list" />')
                    .addClass('column-filter form-control input-sm')
                    .on('keypress', function(e) { _filterColumn($(e.target)); });

                return $('<div></div>')
                    .addClass('column-filter-ctn input-group')
                    .append('<span class="input-group-addon"><i class="fa fa-search"></i></span>')
                    .append($input);
            }

            return null;
        };

        function _filterColumn($input, $column) {
            $column = $column || $input.parent().next();

            var column = $column.data('item');

            if (column && column.waiting === true) {
                // Don't filter if the column in waiting for data.
                return;
            }

            // setTimeout needed because, on a keypress, the new key is not in the input yet.
            setTimeout(function () {
                var filter = $input.val().toLowerCase();

                $column.children().each(function(i, item) {
                    var $item = $(item),
                        d = $item.data('item'),
                        target = d ? d.name.toLowerCase() : '';

                    $item.toggleClass('hidden', target.indexOf(filter) === -1);
                });
            }.bind(this), 1);
        };


        return {

            createNav: function($el, data, options) {
                if (!$el || !data) {
                    throw 'z-navigation\'s createNav function requires a target element and a menu data.';
                }

                if (options) {
                    activateCurrentPage = options.activateCurrentPage || true;
                    menuDropdownHandler.activateCurrentPage = activateCurrentPage;
                    menuCaret = options.menuCaret || '';
                    waitingAnimation = options.waitingAnimation || '...';
                }

                for (var i = 0, it = data.length; i < it; i++) {
                    $el.append(_generateSection(data[i]));
                }
            },

            destroyNav: function($el) {
                $el.empty();
            },

            setItem: function($el, item) {
                $el.replaceWith(_generateItem(item));
            }

        };

    })();

})(jQuery);
