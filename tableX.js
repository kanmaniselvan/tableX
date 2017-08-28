(function($){
    var tableX = 'tableX', tableX_class = '.'+tableX, tableX_cell = 'tableX-cell', tableX_disabled = tableX_cell +'-disabled', tableX_cell_class = '.'+tableX_cell,
        active_cell = 'active-cell', active_cell_class = '.'+active_cell, tableX_txtbox = 'tableX-txt-box', tableX_txtbox_class = '.'+tableX_txtbox,
        projected = 'projected', text_area_html = '<input type="text" class="'+tableX_txtbox+'"/>', selected_area = 'selected-area',
        selected_area_class = '.'+selected_area, clicked = false, STRING = 'string', ctrl_key_pressed = false,
        caret_position, TD = 'td', TR = 'tr', TBODY_TR = 'tbody tr', tableX_clipboard_text_area = 'tableX-clipboard-text-area', tableX_clipboard_text_area_class = '.' + tableX_clipboard_text_area,
        key_codes = { nav_left: 37, nav_right: 39, nav_up: 38, nav_down: 40, tab: 9,
            delete: 46, escape: 27, enter: 13, ctrl: 17, c: 67, a: 65, v: 86, x: 88 };

    document.onkeydown = function(e) {
        var $active_cell = $(tableX_class).find('.active-cell');

        var active_cell_index = $active_cell.index();

        if (e.ctrlKey) {
            ctrl_key_pressed = true;
        }

        switch (e.keyCode) {
            case key_codes.nav_left:
                if( $active_cell.prev().hasClass(tableX_cell) && canNavigate($active_cell, key_codes.nav_left) ) {
                    $active_cell.trigger('click');
                    $active_cell.removeClass(active_cell);
                    $active_cell.prev().addClass(active_cell);
                }
                break;

            case key_codes.tab:
                e.preventDefault();
            case key_codes.nav_right:
                $active_cell.focus();
                if( $active_cell.next().hasClass(tableX_cell) && canNavigate($active_cell, key_codes.nav_right) ) {
                    $active_cell.trigger('click');
                    $active_cell.removeClass(active_cell);
                    $active_cell.next().addClass(active_cell);
                }
                break;

            case key_codes.nav_up:
                var $parent_tr = $active_cell.parent();
                var $parent_tbody = $active_cell.parents().eq(1);
                var target_tr = $parent_tbody.find(TR).get($parent_tr.index() - 1);
                var $target_cell = $($(target_tr).find(TD).get(active_cell_index));
                if( $target_cell.hasClass(tableX_cell) && $parent_tr.index() != 0 ) {
                    $active_cell.trigger('click');
                    $active_cell.removeClass(active_cell);
                    $target_cell.addClass(active_cell);
                }
                break;

            case key_codes.nav_down:
                navDown($active_cell, active_cell_index);
                break;

            case key_codes.delete:
                $active_cell.text('').trigger('keyup');
                $active_cell.parents().eq(1).find(selected_area_class).text('').trigger('keyup');
                break;

            case key_codes.escape:
                $active_cell.trigger('click');
                break;

            case key_codes.enter:
                if($active_cell.find(tableX_txtbox_class).length != 0) {
                    navDown($active_cell, active_cell_index);
                } else {
                    $active_cell.trigger('dblclick');
                }
                break;

            case key_codes.a:
                if (ctrl_key_pressed){
                    $active_cell.trigger('click');
                    $active_cell.parents().eq(1).find(tableX_cell_class).addClass(selected_area);
                    $active_cell.removeClass(active_cell);
                    $($(selected_area_class)[0]).addClass(active_cell);
                    copyAll($active_cell);
                } else {
                    if( $(e.target).hasClass('search-input') ) return;
                    if( $(e.target).hasClass(tableX_txtbox) ) return;
                    $active_cell.text('');
                    $active_cell.trigger('dblclick');
                }
                break;

            case key_codes.c:
                if(ctrl_key_pressed){
                    return;
                } else {
                    if( $(e.target).hasClass('search-input') ) return;
                    if( $(e.target).hasClass(tableX_txtbox) ) return;
                    $active_cell.text('');
                    $active_cell.trigger('dblclick');
                }
                break;

            case key_codes.v:
                if(ctrl_key_pressed){
                    $(tableX_clipboard_text_area_class).focus();
                    $(tableX_clipboard_text_area_class).val('');
                }

                break;

            case key_codes.x:
                if(!ctrl_key_pressed) return;
                $(selected_area_class).text('').trigger('keyup');
                break;

            default:
                if(ctrl_key_pressed) return;
                if( $(e.target).hasClass('search-input') ) return;
                if( $(e.target).hasClass(tableX_txtbox) ) return;

                if(e.keyCode == 78) {
                    $active_cell.trigger('click');
                    $active_cell.text('na');
                    $active_cell.trigger('keyup');
                    return
                }

                if(e.keyCode == 79 || e.keyCode == 80) {
                    $active_cell.trigger('click');
                    $active_cell.text('op');
                    $active_cell.trigger('keyup');
                    return
                }

                $active_cell.text('');
                $active_cell.trigger('dblclick');
                break;
        }
    };

    document.onkeyup = function(e) {
        if( key_codes.ctrl == e.keyCode ){
            ctrl_key_pressed = false
        }
        if(key_codes.v == e.keyCode) {
            if(!ctrl_key_pressed) return;
            var $active_cell = $(tableX_class).find('.active-cell');
            pasteData($active_cell);
        }
    };

    document.onmouseup = function(){
        clicked = false;
    };

    function copyAll($active_cell){
        var copied_data = '';

        var $selected_area_rows = getSelectedAreaRows($active_cell);

        if(0 == $selected_area_rows.length) {
            $active_cell.trigger('click', [true]);
            copied_data = $active_cell.text();
            $(tableX_clipboard_text_area_class).val('').val(copied_data);
            $(tableX_clipboard_text_area_class).select();
            return copied_data;
        }

        var copied_data_array = [];
        $selected_area_rows.each(function(index, row){
            var $cells = $(row).find(selected_area_class);
            copied_data_array[index] = $cells.map(function(){ return $(this).text().trim() }).get();
        });

        for(var i=0; i < copied_data_array.length; i++){
            copied_data = copied_data + copied_data_array[i].join('\t') + '\n';
        }

        $(tableX_clipboard_text_area_class).val('').val(copied_data);
        $(tableX_clipboard_text_area_class).select();
        return copied_data;
    }

    function pasteData($active_cell){
        var clipboard_data = $(tableX_clipboard_text_area_class).val().trim();

        var paste_data = [], row_array = clipboard_data.split('\n');
        for(var i = 0; i < row_array.length; i++) {
            paste_data.push(row_array[i].split('\t'));
        }

        var starting_row_index, $current_cell = $active_cell;
        starting_row_index = $active_cell.parent().index();
        for(i=0; i < paste_data.length; i++) {
            var inner_array = paste_data[i];
            for(var k = 0; k < inner_array.length; k++) {
                $current_cell.text(inner_array[k]).trigger('keyup', [{include_active_cell: false}]);
                if($current_cell.next().hasClass(tableX_cell)) {
                    $current_cell = $current_cell.next()
                }
            }

            var $next_row = $(tableX_class).find(TBODY_TR).get( starting_row_index + i + 1);
            $current_cell = $($($next_row).find(TD).get($active_cell.index()));
        }
    }

    function isDefined(element){
        return ( typeof(element) !== undefined )
    }

    function canNavigate($active_cell, nav_code){
        var $text_box = $active_cell.find(tableX_txtbox_class);

        if($text_box.length != 0) {
            if(nav_code == key_codes.nav_right) {
                return ($text_box.val().length == caret_position);
            } else if(nav_code == key_codes.nav_left) {
                return ( caret_position == 0 )
            } else {
                return true;
            }

        } else {
            return true;
        }
    }

    function getSelectedAreaRows($target){
        return $target.parents().eq(1).find(TR).filter(function(index, row){
            return $(row).find(TD).hasClass(selected_area);
        });
    }

    function updateCaretPosition(){
        $(tableX_class).on('keydown', tableX_txtbox_class ,function(){
            caret_position = this.selectionStart;
        });
    }

    function clickAndSelectArea() {
        var start_column_cell_index, start_cell_row_index, $start_cell;
        $(tableX_class).on('mousedown', TD+tableX_cell_class, function(){
            clicked = true;
            $(this).trigger('click');
            $start_cell = $(this);
            start_column_cell_index = $(this).index();
            start_cell_row_index = $(this).parent().index();
        });

        $(tableX_class).on('mousemove', TD+tableX_cell_class, function(){
            if(clicked == false){
                return;
            }

            $(tableX_class).css('cursor', 'default');
            var end_column_cell_index = $(this).index();
            var end_cell_row_index = $(this).parent().index();

            if( (start_column_cell_index == end_column_cell_index) && (start_cell_row_index == end_cell_row_index) ) {
                $(this).trigger('click');
            }
            // clicked and moved in same row but different cell
            var start_select, end_select;
            if( (start_column_cell_index != end_column_cell_index) && (start_cell_row_index == end_cell_row_index) ) {
                if(start_column_cell_index < end_column_cell_index ) {
                    start_select = start_column_cell_index;
                    end_select = end_column_cell_index;
                } else {
                    start_select = end_column_cell_index;
                    end_select = start_column_cell_index;
                }

                $(this).parent().find(selected_area_class).each(function(index, element){
                    var element_index = $(element).index();
                    if( ! ( (start_select <= element_index) && (end_select >= element_index) ) ) {
                        $(element).removeClass(selected_area);
                    }
                });

                $(this).parents().eq(1).find(TR).filter(function(index){
                    return index != end_column_cell_index
                }).find(selected_area_class).removeClass(selected_area);

                $(this).parent().find(TD).slice(start_select, end_select + 1).addClass(selected_area);
            }


            // clicked and moved in same column but different row
            if( (start_column_cell_index == end_column_cell_index) && (start_cell_row_index != end_cell_row_index) ) {
                if(start_cell_row_index < end_cell_row_index ) {
                    start_select = start_cell_row_index;
                    end_select = end_cell_row_index;
                } else {
                    start_select = end_cell_row_index;
                    end_select = start_cell_row_index;
                }

                var $selected_area_rows = getSelectedAreaRows($(this));

                $selected_area_rows.each(function(index, element){
                    var element_index = $(element).index();
                    if( ! ( (start_select <= element_index) && (end_select >= element_index) ) ) {
                        $(element).find(TD).removeClass(selected_area);
                    }
                });

                var $selected_rows = $(this).parents().eq(1).find(TR).slice(start_select, end_select + 1);

                $selected_rows.each(function(index, row){
                    $(row).find(TD).filter(function(index){
                        return index != start_column_cell_index
                    }).filter(selected_area_class).removeClass(selected_area);
                });

                $selected_rows.each(function(row_index, row){
                    $($(row).find(TD).get(start_column_cell_index)).addClass(selected_area);
                })
            }

            // clicked and moved in different column and different row
            var row_select_start, row_select_end;
            if( (start_column_cell_index != end_column_cell_index) && (start_cell_row_index != end_cell_row_index) ) {
                if(start_column_cell_index < end_column_cell_index ) {
                    start_select = start_column_cell_index;
                    end_select = end_column_cell_index;
                } else {
                    start_select = end_column_cell_index;
                    end_select = start_column_cell_index;
                }
                if(start_cell_row_index < end_cell_row_index ){
                    row_select_start = start_cell_row_index;
                    row_select_end = end_cell_row_index;
                } else {
                    row_select_start = end_cell_row_index;
                    row_select_end = start_cell_row_index;
                }

                $selected_area_rows = getSelectedAreaRows($(this));

                $selected_area_rows.each(function(index, row){
                    var element_index = $(row).index();
                    $(row).find(selected_area_class).each(function(index, element){
                        var element_index = $(element).index();
                        if( ! ( (start_select <= element_index) && (end_select >= element_index) ) ) {
                            $(element).removeClass(selected_area);
                        }
                    });

                    if( ! ( (row_select_start <= element_index) && (row_select_end >= element_index) ) ) {
                        $(row).find(TD).removeClass(selected_area);
                    }
                });

                var $current_selection_rows = $(this).parents().eq(1).find(TR).slice(row_select_start, row_select_end + 1);

                $current_selection_rows.each(function(index, row){
                    var $cells = $(row).find(TD);
                    for(var i = start_select; i<= end_select; i++ ){
                        $($cells[i]).addClass(selected_area);
                    }
                });
            }

            copyAll($(this));
        });
    }

    function navDown($active_cell, active_cell_index) {
        var $parent_tr = $active_cell.parent();
        var $parent_tbody = $active_cell.parents().eq(1);
        var target_tr = $parent_tbody.find(TR).get($parent_tr.index() + 1);
        var $target_cell = $($(target_tr).find(TD).get(active_cell_index));
        if( $target_cell.hasClass(tableX_cell)) {
            $active_cell.trigger('click');
            $active_cell.removeClass(active_cell);
            $active_cell.removeClass(active_cell);
            $target_cell.addClass(active_cell);
        }
    }

    function init(){
        $(tableX_class).on('click', tableX_cell_class, function(e, dont_call_copy_all){
            var $parent_tbody = $(this).parents().eq(1);
            $parent_tbody.find(active_cell_class).removeClass(active_cell);
            $parent_tbody.find(selected_area_class).removeClass(selected_area);
            $(this).addClass(active_cell);
            var text_box_val = $parent_tbody.find(tableX_txtbox_class).val();
            $parent_tbody.find(tableX_txtbox_class).parent().text(text_box_val).removeClass(projected);

            if (!dont_call_copy_all) {
                copyAll($(this));
            }
        });

        $(tableX_class).on('dblclick', tableX_cell_class, function(){
            var $this = $(this);
            if( $this.find(tableX_txtbox_class).length != 0 ) {
                return;
            }
            var cell_text = $this.text().trim();
            var text_box_width = $this.width();
            $this.text('').addClass(projected);
            $this.append($(text_area_html).val(cell_text).width(text_box_width));
            $this.find(tableX_txtbox_class).focus();
        });

        $(tableX_class).on('keydown', tableX_cell_class, function(event){
            if(event.keyCode == key_codes.escape) {
                $(this).trigger('click');
            }
        });

        $('body').append('<textarea class="tableX-clipboard-text-area" ></textarea>');
    }

    $.fn.tableX = function(_options) {

        updateCaretPosition();

        clickAndSelectArea();

        init();

        var options = $.extend(_options, {});
        var $rows  = this.find(TBODY_TR);
        var rows_length = $rows.length;

        return $rows.each(function(row_index, row){

            if(isDefined(options)){
                if(isDefined(options.index_from_top)) {
                    if( row_index <= options.index_from_top ) {
                        return true;
                    }
                }
                if(isDefined(options.index_from_bottom)) {
                    var $row_index_need_to_excluded = rows_length - (options.index_from_bottom + 1);
                    if( (row_index >= $row_index_need_to_excluded) ){
                        return true;
                    }
                }
            }

            var $cells = $(row).find(TD);

            var cells_length = $cells.length;border="1"
            $cells.each(function(index, cell){
                var $cell = $(cell);

                if(isDefined(options)){
                    if(isDefined(options.index_from_left)) {
                        if(index <= options.index_from_left) {
                            return true;
                        }
                    }
                    if(isDefined(options.index_from_right)) {
                        var $cell_index_need_to_excluded = cells_length - (options.index_from_right + 1);
                        if(index >= $cell_index_need_to_excluded){
                            return true;
                        }
                    }
                }

                if( $cell.hasClass(tableX_disabled) ){
                    return true
                }

                $cell.addClass(tableX_cell);
            });
        });
    }
})(jQuery);
