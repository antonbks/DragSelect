"use strict";
// v 1.10.0
/*
    ____                   _____      __          __
   / __ \_________ _____ _/ ___/___  / /__  _____/ /_
  / / / / ___/ __ `/ __ `/\__ \/ _ \/ / _ \/ ___/ __/
 / /_/ / /  / /_/ / /_/ /___/ /  __/ /  __/ /__/ /_
/_____/_/   \__,_/\__, //____/\___/_/\___/\___/\__/
                 /____/

Key-Features
  - No dependencies
  - Ease of use
  - Add drag selection
  - Accessibility (a11y)
  - Choose which elements can be selected.
  - Great browser support, works perfectly on IE9
  - Lightweight, only ~2KB gzipped
  - Free & open source under MIT License

 Default classes
  ** .ds-selected       On elements that are selected
  ** .ds-hover          On elements that are currently hovered
  ** .ds-selector       On the selector element
  ** .ds-selectable     On elements that can be selected

 Usefull Methods
  ** .start             ()                    reset the functionality after a teardown
  ** .stop              ()                    will teardown/stop the whole functionality
  ** .break             ()                    used in callbacks to disable the execution of the upcoming code (in contrary to "stop", all callbacks are still working, cursor position calculations and event listeners will also continue)
  ** .getSelection      ()                    returns the current selection
  ** .addSelection      ([nodes], bool, bool) adds one or multiple elements to the selection. If boolean is set to true: callback will be called afterwards. By default, adds new elements also to the list of selectables (can be turned off by setting the last boolean to true)
  ** .removeSelection   ([nodes], bool, bool) removes one or multiple elements to the selection. If boolean is set to true: callback will be called afterwards. If last boolean is set to true, it also removes them from the possible selectable nodes if they were.
  ** .toggleSelection   ([nodes], bool, bool) toggles one or multiple elements to the selection. If element is not in selection it will be added, if it is already selected, it will be removed. If boolean is set to true: callback will be called afterward. If last boolean is set to true, it also removes selected elements from possible selectable nodes & doesn’t add them to selectables if they are not.
  ** .setSelection      ([nodes], bool, bool) sets the selection to one or multiple elements. If boolean is set to true: callback will be called afterwards. By default, adds new elements also to the list of selectables (can be turned off by setting the last boolean to true)
  ** .clearSelection    ([nodes], bool)       remove all elements from the selection. If boolean is set to true: callback will be called afterwards.
  ** .addSelectables    ([nodes], bool)       add elements that can be selected. Intelligent algorithm never adds elements twice. If set to true: will also add them to the current selection
  ** .removeSelectables ([nodes], bool)       remove elements that can be selected. Also removes the 'selected' class from those elements if boolean is set to true.
  ** .getSelectables    ()                    returns all nodes that can be selected.
  ** .setSelectables    ([nodes], bool, bool) sets all elements that can be selected. Removes all current selectables (& their respective applied classes). Adds the new set to the selectables set. Thus, replacing the original set. First boolean if old elements should be removed from the selection. Second boolean if new elements should be added to the selection.
  ** .getCurrentCursorPosition    ()          returns the last seen position of the cursor/selector
  ** .getInitialCursorPosition    ()          returns the first position of the cursor/selector
  ** .getCursorPositionDifference (bool)      returns object with the x, y difference between the initial and the last cursor position. If the first argument is set to true, it will instead return the x, y difference to the previous selection
  ** .getCursorPos      (event, node, bool)   returns the cursor x, y coordinates based on a click event object. The click event object is required. By default, takes scroll and area into consideration. Area is this.area by default and can be fully ignored by setting the second argument explicitely to false. Scroll can be ignored by setting the third argument to true.
  ** and everything else

 <*> <*> <*> STAR THIS PLUGIN ON GITHUB: <*> <*> <*>

 https://github.com/ThibaultJanBeyer/DragSelect
 Please give it a like, this is what makes me happy :-)
 Thanks You

 ******************************************
 ********* The MIT License (MIT) **********
 ******************************************
 Copyright (c) 2017 ThibaultJanBeyer
 web: http://www.thibaultjanbeyer.com/
 github: https://github.com/ThibaultJanBeyer/DragSelect
 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:
 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.
 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/
// Setup
//////////////////////////////////////////////////////////////////////////////////////
/**
 * DragSelect Class.
 *
 * @constructor
 * @param {Object} options - The options object.
 */
var DragSelect = /** @class */ (function () {
    function DragSelect(_a) {
        var _b = _a.selectedClass, selectedClass = _b === void 0 ? 'ds-selected' : _b, _c = _a.hoverClass, hoverClass = _c === void 0 ? 'ds-hover' : _c, _d = _a.selectorClass, selectorClass = _d === void 0 ? 'ds-selector' : _d, _e = _a.selectableClass, selectableClass = _e === void 0 ? 'ds-selectable' : _e, _f = _a.selectables, selectables = _f === void 0 ? [] : _f, _g = _a.multiSelectKeys, multiSelectKeys = _g === void 0 ? ['ctrlKey', 'shiftKey', 'metaKey'] : _g, _h = _a.multiSelectMode, multiSelectMode = _h === void 0 ? false : _h, _j = _a.autoScrollSpeed, autoScrollSpeed = _j === void 0 ? 1 : _j, _k = _a.onElementSelect, onElementSelect = _k === void 0 ? function () { } : _k, _l = _a.onElementUnselect, onElementUnselect = _l === void 0 ? function () { } : _l, _m = _a.onDragStartBegin, onDragStartBegin = _m === void 0 ? function () { } : _m, _o = _a.onDragStart, onDragStart = _o === void 0 ? function () { } : _o, _p = _a.onDragMove, onDragMove = _p === void 0 ? function () { } : _p, _q = _a.callback, callback = _q === void 0 ? function () { } : _q, _r = _a.area, area = _r === void 0 ? document : _r, _s = _a.customStyles, customStyles = _s === void 0 ? false : _s, _t = _a.selector, selector = _t === void 0 ? undefined : _t;
        this.selectables = []; // the elements that can be selected
        // private properties
        this._prevSelected = []; // memory to fix #9
        this._breaked = false;
        // readable properties
        this.multiSelectKeyPressed = false;
        this.initialScroll = { x: 0, y: 0 };
        this.initialCursorPos = { x: 0, y: 0 };
        this.newCursorPos = { x: 0, y: 0 };
        this.previousCursorPos = { x: 0, y: 0 };
        this.selected = [];
        this.mouseInteraction = false; // fix firefox doubleclick issue
        /**
         * Checks if element is touched by the selector rect (and vice-versa)
         */
        this.isElementTouching = function (element, selectionRect, scroll) {
            var rect = element.getBoundingClientRect();
            var elementRect = {
                y: rect.top + scroll.y,
                x: rect.left + scroll.x,
                h: rect.height,
                w: rect.width
            };
            // Axis-Aligned Bounding Box Colision Detection.
            // Imagine following Example:
            //    b01
            // a01[1]a02
            //    b02      b11
            //          a11[2]a12
            //             b12
            // to check if those two boxes collide we do this AABB calculation:
            //& a01 < a12 (left border pos box1 smaller than right border pos box2)
            //& a02 > a11 (right border pos box1 larger than left border pos box2)
            //& b01 < b12 (top border pos box1 smaller than bottom border pos box2)
            //& b02 > b11 (bottom border pos box1 larger than top border pos box2)
            // See: https://en.wikipedia.org/wiki/Minimum_bounding_box#Axis-aligned_minimum_bounding_box and https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
            if (selectionRect.x < elementRect.x + elementRect.w &&
                selectionRect.x + selectionRect.w > elementRect.x &&
                selectionRect.y < elementRect.y + elementRect.h &&
                selectionRect.h + selectionRect.y > elementRect.y) {
                return true; // collision detected!
            }
            else {
                return false;
            }
        };
        this.selectedClass = selectedClass;
        this.hoverClass = hoverClass;
        this.selectorClass = selectorClass;
        this.selectableClass = selectableClass;
        this.multiSelectKeys = multiSelectKeys;
        this.multiSelectMode = multiSelectMode;
        this.autoScrollSpeed = autoScrollSpeed === 0 ? 0 : autoScrollSpeed;
        this.onElementSelect = onElementSelect;
        this.onElementUnselect = onElementUnselect;
        this.onDragStartBegin = onDragStartBegin;
        this.onDragStart = onDragStart;
        this.onDragMove = onDragMove;
        this.callback = callback;
        this.area = area;
        this.customStyles = customStyles;
        this.selector = selector || this._createSelector();
        this.selector.classList.add(this.selectorClass);
        this._handleSelectables(this.toArray(selectables));
        // Area has to have a special position attribute for calculations
        if (this.area !== document) {
            var computedArea = getComputedStyle(this.area);
            var isPositioned = computedArea.position === 'absolute' ||
                computedArea.position === 'relative' ||
                computedArea.position === 'fixed';
            if (!isPositioned) {
                this.area.style.position = 'relative';
            }
        }
        this._createBindings();
        this.start();
    }
    /**
     * Binds the `this` to the event listener Functions
     */
    DragSelect.prototype._createBindings = function () {
        this._startUp = this._startUp.bind(this);
        this._handleMove = this._handleMove.bind(this);
        this.reset = this.reset.bind(this);
        this._onClick = this._onClick.bind(this);
    };
    /**
     * Add/Remove Selectables also handles css classes and event listeners.
     */
    DragSelect.prototype._handleSelectables = function (selectables, remove, // if elements should be removed.
    toSelection // if elements should also be added/removed to the current selection.
    ) {
        for (var index = 0, il = selectables.length; index < il; index++) {
            var selectable = selectables[index];
            var indexOf = this.selectables.indexOf(selectable);
            if (indexOf < 0 && !remove) {
                this._addSelectable(selectable, toSelection);
            }
            else if (indexOf > -1 && remove) {
                this._removeSelectable(selectable, indexOf, toSelection);
            }
        }
    };
    DragSelect.prototype._addSelectable = function (selectable, toSelection) {
        selectable.classList.add(this.selectableClass);
        selectable.addEventListener('click', this._onClick);
        this.selectables.push(selectable);
        // also add to current selection
        if (toSelection && this.selected.indexOf(selectable) < 0) {
            selectable.classList.add(this.selectedClass);
            this.selected.push(selectable);
        }
    };
    DragSelect.prototype._removeSelectable = function (selectable, indexOf, toSelection) {
        // remove
        selectable.classList.remove(this.hoverClass);
        selectable.classList.remove(this.selectableClass);
        selectable.removeEventListener('click', this._onClick);
        this.selectables.splice(indexOf, 1);
        // also remove from current selection
        if (toSelection && this.selected.indexOf(selectable) > -1) {
            selectable.classList.remove(this.selectedClass);
            this.selected.splice(this.selected.indexOf(selectable), 1);
        }
    };
    /**
     * Create the selector node when not provided by options object.
     */
    DragSelect.prototype._createSelector = function () {
        var selector = document.createElement('div');
        selector.style.position = 'absolute';
        if (!this.customStyles) {
            selector.style.background = 'rgba(0, 0, 255, 0.1)';
            selector.style.border = '1px solid rgba(0, 0, 255, 0.45)';
            selector.style.display = 'none';
            selector.style.pointerEvents = 'none'; // fix for issue #8 (ie11+)
        }
        var _area = this.area === document ? document.body : this.area;
        _area.appendChild(selector);
        return selector;
    };
    /**
     * Triggers when a node is actively selected.
     *
     * This might be an "onClick" method but it also triggers when
     * <button> nodes are pressed via the keyboard.
     * Making DragSelect accessible for everyone!
     */
    DragSelect.prototype._onClick = function (event) {
        if (this.mouseInteraction)
            return;
        if (this.isRightClick(event))
            return;
        var node = event.target;
        if (this.isMultiSelectKeyPressed(event)) {
            this._prevSelected = this.selected.slice();
        } // #9
        else {
            this._prevSelected = [];
        } // #9
        this.checkIfInsideSelection(true); // reset selection if no multiselectionkeypressed
        if (this.selectables.indexOf(node) > -1)
            this.toggle(node);
        this.reset();
    };
    /**
     * Check if some multiSelection modifier key is in Event object
     */
    DragSelect.prototype.isMultiSelectKeyPressed = function (event) {
        var _this = this;
        this.multiSelectKeyPressed = false;
        if (this.multiSelectMode)
            this.multiSelectKeyPressed = true;
        else
            this.multiSelectKeys.forEach(function (mKey) {
                if (event[mKey])
                    _this.multiSelectKeyPressed = true;
            });
        return this.multiSelectKeyPressed;
    };
    // Start
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Starts the functionality. Automatically triggered when created.
     * Also, resets the functionality after a teardown
     */
    DragSelect.prototype.start = function () {
        this.area.addEventListener('mousedown', this._startUp);
        this.area.addEventListener('touchstart', this._startUp, { passive: false });
    };
    /**
     * Startup when the area is clicked.
     */
    DragSelect.prototype._startUp = function (event) {
        // touchmove handler
        if (event.type === 'touchstart')
            // Call preventDefault() to prevent double click issue, see https://github.com/ThibaultJanBeyer/DragSelect/pull/29 & https://developer.mozilla.org/vi/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
            event.preventDefault();
        // callback
        this.onDragStartBegin(event);
        if (this._breaked)
            return false;
        if (this.isRightClick(event)) {
            return;
        }
        this.mouseInteraction = true;
        this.selector.style.display = 'block';
        if (this.isMultiSelectKeyPressed(event)) {
            this._prevSelected = this.selected.slice();
        } // #9
        else {
            this._prevSelected = [];
        } // #9
        // move element on location
        this._getStartingPositions(event);
        this.checkIfInsideSelection(true);
        this.selector.style.display = 'none'; // hidden unless moved, fix for issue #8
        // callback
        this.onDragStart(event);
        if (this._breaked) {
            return false;
        }
        // event listeners
        this.area.removeEventListener('mousedown', this._startUp);
        this.area.removeEventListener('touchstart', this._startUp, {
            passive: false
        });
        this.area.addEventListener('mousemove', this._handleMove);
        this.area.addEventListener('touchmove', this._handleMove);
        document.addEventListener('mouseup', this.reset);
        document.addEventListener('touchend', this.reset);
    };
    /**
     * Grabs the starting position of all needed elements
     */
    DragSelect.prototype._getStartingPositions = function (event) {
        this.initialCursorPos = this.newCursorPos = this._getCursorPos(event, this.area);
        this.initialScroll = this.getScroll(this.area);
        var selectorPos = {
            x: this.initialCursorPos.x + this.initialScroll.x,
            y: this.initialCursorPos.y + this.initialScroll.y,
            w: 0,
            h: 0
        };
        this.updatePos(this.selector, selectorPos);
    };
    // Movements/Sizing of selection
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Handles what happens while the mouse is moved
     */
    DragSelect.prototype._handleMove = function (event) {
        var selectorPos = this.getPosition(event);
        // callback
        this.onDragMove(event);
        if (this._breaked)
            return false;
        this.selector.style.display = 'block'; // hidden unless moved, fix for issue #8
        // move element on location
        this.updatePos(this.selector, selectorPos);
        this.checkIfInsideSelection();
        // scroll area if area is scrollable
        this._autoScroll(event);
    };
    /**
     * Calculates and returns the exact x,y w,h positions of the selector element
     */
    DragSelect.prototype.getPosition = function (event) {
        var cursorPosNew = this._getCursorPos(event, this.area);
        var scrollNew = this.getScroll(this.area);
        // save for later retrieval
        this.newCursorPos = cursorPosNew;
        // if area or document is scrolled those values have to be included aswell
        var scrollAmount = {
            x: scrollNew.x - this.initialScroll.x,
            y: scrollNew.y - this.initialScroll.y
        };
        /** check for direction
         *
         * This is quite complicated math, so also quite complicated to explain. Lemme’ try:
         *
         * Problem #1:
         * Sadly in HTML we can not have negative sizes.
         * so if we want to scale our element 10px to the right then it is easy,
         * we just have to add +10px to the width. But if we want to scale the element
         * -10px to the left then things become more complicated, we have to move
         * the element -10px to the left on the x axis and also scale the element
         * by +10px width to fake a negative sizing.
         *
         * One solution to this problem is using css-transforms scale() with
         * transform-origin of top left. BUT we can’t use this since it will size
         * everything, then when your element has a border for example, the border will
         * get inanely huge. Also transforms are not widely supported in IE.
         *
         * Example #1:
         * Unfortunately, things get even more complicated when we are inside a scrollable
         * DIV. Then, let’s say we scoll to the right by 10px and move the cursor right by 5px in our
         * checks we have to substract 10px from the initialcursor position in our check
         * (since the inital position is moved to the left by 10px) so in our example:
         * 1. cursorPosNew.x (5) > initialCursorPos.x (0) - scrollAmount.x (10) === 5 > -10 === true
         * then reset the x position to its initial position (since we might have changed that
         * position when scrolling to the left before going right) in our example:
         * 2. selectorPos.x = initialCursorPos.x (0) + initialScroll.x (0) === 0;
         * then we cann calculate the elements width, which is
         * the new cursor position minus the initial one plus the scroll amount, so in our example:
         * 3. selectorPos.w = cursorPosNew.x (5) - initialCursorPos.x (0) + scrollAmount.x (10) === 15;
         *
         * let’s say after that movement we now scroll 20px to the left and move our cursor by 30px to the left:
         * 1b. cursorPosNew.x (-30) > initialCursorPos.x (0) - scrollAmount.x (-20) === -30 > -20 === false;
         * 2b. selectorPos.x = cursorPosNew.x (-30) + scrollNew.x (-20)
         *                   === -50;  // move left position to cursor (for more info see Problem #1)
         * 3b. selectorPos.w = initialCursorPos.x (0) - cursorPosNew.x (-30) - scrollAmount.x (-20)
         *                   === 0--30--20 === 0+30+20 === 50;  // scale width to original left position (for more info see Problem #1)
         *
         * same thing has to be done for top/bottom
         *
         * I hope that makes sence, try stuff out and play around with variables to get a hang of it.
         */
        var selectorPos = {
            x: 0,
            w: 0,
            y: 0,
            h: 0
        };
        // right
        if (cursorPosNew.x > this.initialCursorPos.x - scrollAmount.x) {
            // 1.
            selectorPos.x = this.initialCursorPos.x + this.initialScroll.x; // 2.
            selectorPos.w = cursorPosNew.x - this.initialCursorPos.x + scrollAmount.x; // 3.
            // left
        }
        else {
            // 1b.
            selectorPos.x = cursorPosNew.x + scrollNew.x; // 2b.
            selectorPos.w = this.initialCursorPos.x - cursorPosNew.x - scrollAmount.x; // 3b.
        }
        // bottom
        if (cursorPosNew.y > this.initialCursorPos.y - scrollAmount.y) {
            selectorPos.y = this.initialCursorPos.y + this.initialScroll.y;
            selectorPos.h = cursorPosNew.y - this.initialCursorPos.y + scrollAmount.y;
            // top
        }
        else {
            selectorPos.y = cursorPosNew.y + scrollNew.y;
            selectorPos.h = this.initialCursorPos.y - cursorPosNew.y - scrollAmount.y;
        }
        return selectorPos;
    };
    // Colision detection
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Checks if element is inside selection and takes action based on that
     *
     * force handles first clicks and accessibility. Here is user is clicking directly onto
     * some element at start, (contrary to later hovers) we can assume that he
     * really wants to select/deselect that item.
     */
    DragSelect.prototype.checkIfInsideSelection = function (force) {
        var anyInside = false;
        for (var i = 0, il = this.selectables.length; i < il; i++) {
            var selectable = this.selectables[i];
            var scroll = this.getScroll(this.area);
            var selectionRect = {
                y: this.selector.getBoundingClientRect().top + scroll.y,
                x: this.selector.getBoundingClientRect().left + scroll.x,
                h: this.selector.offsetHeight,
                w: this.selector.offsetWidth
            };
            if (this.isElementTouching(selectable, selectionRect, scroll)) {
                this._handleSelection(selectable, force);
                anyInside = true;
            }
            else {
                this._handleUnselection(selectable, force);
            }
        }
        return anyInside;
    };
    /**
     * Logic when an item is selected
     */
    DragSelect.prototype._handleSelection = function (item, force) {
        if (item.classList.contains(this.hoverClass) && !force)
            return false;
        var posInSelectedArray = this.selected.indexOf(item);
        if (posInSelectedArray < 0)
            this.select(item);
        else if (posInSelectedArray > -1 && this.multiSelectKeyPressed)
            this.unselect(item);
        item.classList.add(this.hoverClass);
    };
    /**
     * Logic when an item is de-selected
     */
    DragSelect.prototype._handleUnselection = function (item, force) {
        if (!item.classList.contains(this.hoverClass) && !force)
            return false;
        var posInSelectedArray = this.selected.indexOf(item);
        var isInPrevSelection = this._prevSelected.indexOf(item); // #9
        /**
         * Special algorithm for issue #9.
         * if a multiselectkey is pressed, ds 'remembers' the last selection and reverts
         * to that state if the selection is not kept, to mimic the natural OS behaviour
         * = if item was selected and is not in selection anymore, reselect it
         * = if item was not selected and is not in selection anymore, unselect it
         */
        if (posInSelectedArray > -1 && isInPrevSelection < 0)
            this.unselect(item);
        else if (posInSelectedArray < 0 && isInPrevSelection > -1)
            this.select(item);
        item.classList.remove(this.hoverClass);
    };
    /**
     * Adds an item to the selection.
     *
     * @param {Node} item – item to select.
     * @return {Node} item
     */
    DragSelect.prototype.select = function (item) {
        if (this.selected.indexOf(item) > -1)
            return item;
        this.selected.push(item);
        item.classList.add(this.selectedClass);
        this.onElementSelect(item);
        return item;
    };
    /**
     * Removes an item from the selection.
     */
    DragSelect.prototype.unselect = function (item) {
        if (this.selected.indexOf(item) < 0)
            return item;
        this.selected.splice(this.selected.indexOf(item), 1);
        item.classList.remove(this.selectedClass);
        this.onElementUnselect(item);
        return item;
    };
    /**
     * Adds/Removes an item to the selection.
     * If it is already selected = remove, if not = add.
     */
    DragSelect.prototype.toggle = function (item) {
        if (this.selected.indexOf(item) > -1)
            return this.unselect(item);
        return this.select(item);
    };
    // Autoscroll
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Automatically Scroll the area by selecting
     */
    DragSelect.prototype._autoScroll = function (event) {
        var edge = this.isCursorNearEdge(event, this.area);
        var docEl = document &&
            document.documentElement &&
            document.documentElement.scrollTop &&
            document.documentElement;
        var _area = this.area === document ? docEl || document.body : this.area;
        if (edge === 'top' && _area.scrollTop > 0)
            return (_area.scrollTop -= 1 * this.autoScrollSpeed);
        if (edge === 'bottom')
            return (_area.scrollTop += 1 * this.autoScrollSpeed);
        if (edge === 'left' && _area.scrollLeft > 0)
            return (_area.scrollLeft -= 1 * this.autoScrollSpeed);
        if (edge === 'right')
            return (_area.scrollLeft += 1 * this.autoScrollSpeed);
    };
    /**
     * Check if the selector is near an edge of the area
     * @return {string|false} top / bottom / left / right / false
     */
    DragSelect.prototype.isCursorNearEdge = function (event, area) {
        var cursorPosition = this._getCursorPos(event, area);
        var areaRect = this.getAreaRect(area);
        var tolerance = {
            x: Math.max(areaRect.width / 10, 30),
            y: Math.max(areaRect.height / 10, 30)
        };
        if (cursorPosition.y < tolerance.y)
            return 'top';
        if (areaRect.height - cursorPosition.y < tolerance.y)
            return 'bottom';
        if (areaRect.width - cursorPosition.x < tolerance.x)
            return 'right';
        if (cursorPosition.x < tolerance.x)
            return 'left';
        return false;
    };
    // Ending
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Unbind functions when mouse click is released
     */
    DragSelect.prototype.reset = function (event) {
        var _this = this;
        this.previousCursorPos = this._getCursorPos(event, this.area);
        document.removeEventListener('mouseup', this.reset);
        document.removeEventListener('touchend', this.reset);
        this.area.removeEventListener('mousemove', this._handleMove);
        this.area.removeEventListener('touchmove', this._handleMove);
        this.area.addEventListener('mousedown', this._startUp);
        this.area.addEventListener('touchstart', this._startUp, { passive: false });
        this.callback(this.selected, event);
        if (this._breaked)
            return false;
        this.selector.style.width = '0';
        this.selector.style.height = '0';
        this.selector.style.display = 'none';
        setTimeout(
        // debounce in order "onClick" to work
        function () { return (_this.mouseInteraction = false); }, 100);
    };
    /**
     * Function break: used in callbacks to stop break the code at the specific moment
     * - Event listeners and calculation will continue working
     * - Selector won’t display and will not select
     */
    DragSelect.prototype.break = function () {
        var _this = this;
        this._breaked = true;
        setTimeout(
        // debounce the break should only break once instantly after call
        function () { return (_this._breaked = false); }, 100);
    };
    /**
     * Complete function teardown
     */
    DragSelect.prototype.stop = function () {
        this.reset();
        this.area.removeEventListener('mousedown', this._startUp);
        this.area.removeEventListener('touchstart', this._startUp, {
            passive: false
        });
        document.removeEventListener('mouseup', this.reset);
        document.removeEventListener('touchend', this.reset);
    };
    // Usefull methods for user
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Returns the current selected nodes
     */
    DragSelect.prototype.getSelection = function () {
        return this.selected;
    };
    /**
     * Returns cursor x, y position based on event object
     * Will be relative to an area including the scroll unless advised otherwise
     * @param {HTMLElement | SVGElement | boolean} _area – containing area / this.area if none / document if === false
     */
    DragSelect.prototype.getCursorPos = function (event, _area, ignoreScroll) {
        var area = _area || (_area !== false && this.area);
        var pos = this._getCursorPos(event, area);
        var scroll = ignoreScroll ? { x: 0, y: 0 } : this.getScroll(area);
        return {
            x: pos.x + scroll.x,
            y: pos.y + scroll.y
        };
    };
    /**
     * Adds several items to the selection list
     * also adds the specific classes and take into account
     * all calculations.
     * Does not clear the selection, in contrary to .setSelection
     * Can add multiple nodes at once, in contrary to .select
     * @param {boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
     */
    DragSelect.prototype.addSelection = function (_nodes, triggerCallback, dontAddToSelectables) {
        var _this = this;
        var nodes = this.toArray(_nodes);
        nodes.forEach(function (node) { return _this.select(node); });
        if (!dontAddToSelectables)
            this.addSelectables(nodes);
        if (triggerCallback)
            this.callback(this.selected, false);
        return this.selected;
    };
    /**
     * Removes specific nodes from the selection
     * Multiple nodes can be given at once, in contrary to unselect
     * @param {boolean} removeFromSelectables - if element should be removed from the list of selectable nodes
     */
    DragSelect.prototype.removeSelection = function (_nodes, triggerCallback, removeFromSelectables) {
        var _this = this;
        var nodes = this.toArray(_nodes);
        nodes.forEach(function (node) { return _this.unselect(node); });
        if (removeFromSelectables)
            this.removeSelectables(nodes);
        if (triggerCallback)
            this.callback(this.selected, false);
        return this.selected;
    };
    /**
     * Toggles specific nodes from the selection:
     * If element is not in selection it will be added, if it is already selected, it will be removed.
     * Multiple nodes can be given at once.
     * @param {boolean} _special - if true, it also removes selected elements from possible selectable nodes & don’t add them to selectables if they are not
     * @return {Array} all selected nodes
     */
    DragSelect.prototype.toggleSelection = function (_nodes, triggerCallback, _special) {
        var _this = this;
        var nodes = this.toArray(_nodes);
        nodes.forEach(function (node) {
            if (_this.selected.indexOf(node) < 0)
                _this.addSelection(node, triggerCallback, _special);
            else
                _this.removeSelection(node, triggerCallback, _special);
        });
        return this.selected;
    };
    /**
     * Sets the current selected nodes and optionally run the callback
     * @param {Boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
     * @return {Nodes}
     */
    DragSelect.prototype.setSelection = function (nodes, triggerCallback, dontAddToSelectables) {
        this.clearSelection();
        this.addSelection(nodes, triggerCallback, dontAddToSelectables);
        return this.selected;
    };
    /**
     * Unselect / Deselect all current selected Nodes
     */
    DragSelect.prototype.clearSelection = function (triggerCallback) {
        var _this = this;
        var selection = this.selected.slice();
        selection.forEach(function (node) { return _this.unselect(node); });
        if (triggerCallback)
            this.callback(this.selected, false);
        return this.selected;
    };
    /**
     * Add nodes that can be selected.
     * The algorithm makes sure that no node is added twice
     * @param {Boolean} addToSelection – if elements should also be added to current selection
     */
    DragSelect.prototype.addSelectables = function (_nodes, addToSelection) {
        var nodes = this.toArray(_nodes);
        this._handleSelectables(nodes, false, addToSelection);
        return this.selectables;
    };
    /**
     * Gets all nodes that can be selected
     */
    DragSelect.prototype.getSelectables = function () {
        return this.selectables;
    };
    /**
     * Sets all elements that can be selected.
     * Removes all current selectables (& their respective classes).
     * Adds the new set to the selectables set,
     * thus replacing the original set.
     * @param removeFromSelection – if elements should also be removed from current selection
     * @param addToSelection – if elements should also be added to current selection
     */
    DragSelect.prototype.setSelectables = function (nodes, removeFromSelection, addToSelection) {
        this.removeSelectables(this.getSelectables(), removeFromSelection);
        return this.addSelectables(nodes, addToSelection);
    };
    /**
     * Remove nodes from the nodes that can be selected.
     * @param {boolean} removeFromSelection – if elements should also be removed from current selection
     */
    DragSelect.prototype.removeSelectables = function (_nodes, removeFromSelection) {
        var nodes = this.toArray(_nodes);
        this._handleSelectables(nodes, true, removeFromSelection);
        return this.selectables;
    };
    // Helpers
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Based on a click event object,
     * checks if the right mouse button was pressed.
     * (found @ https://stackoverflow.com/a/2405835)
     */
    DragSelect.prototype.isRightClick = function (event) {
        if (!event)
            return false;
        var isRightMB = false;
        if ('which' in event) {
            // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
            isRightMB = event.which === 3;
        }
        else if ('button' in event) {
            // IE, Opera
            isRightMB = event.button === 2;
        }
        return isRightMB;
    };
    /**
     * Returns cursor x, y position based on event object
     * /!\ for internal calculation reasons it does _not_ take
     * the AREA scroll into consideration unless it’s the outer Document.
     * Use the public .getCursorPos() from outside, it’s more flexible
     *
     * @param {Object} event
     * @param {Node} area – containing area / document if none
     * @return {Object} cursor X/Y
     */
    DragSelect.prototype._getCursorPos = function (event, area) {
        if (!event)
            return { x: 0, y: 0 };
        // touchend has not touches. so we take the last toucb if a touchevent, we need to store the positions on the prototype
        if ('touches' in event && event.type !== 'touchend')
            this._lastTouch = event;
        //if a touchevent, return the last touch rather than the regular event
        // we need .touches[0] from that event instead
        event = event.touches ? this._lastTouch.touches[0] : event;
        var cPos = {
            // event.clientX/Y fallback for <IE8
            x: event.pageX,
            y: event.pageY
        };
        var areaRect = this.getAreaRect(area || document);
        var docScroll = this.getScroll(); // needed when document is scrollable but area is not
        return {
            // if it’s constrained in an area the area should be substracted calculate
            x: cPos.x - areaRect.left - docScroll.x,
            y: cPos.y - areaRect.top - docScroll.y
        };
    };
    /**
     * Returns the starting/initial position of the cursor/selector
     */
    DragSelect.prototype.getInitialCursorPosition = function () {
        return this.initialCursorPos;
    };
    /**
     * Returns the last seen position of the cursor/selector
     */
    DragSelect.prototype.getCurrentCursorPosition = function () {
        return this.newCursorPos;
    };
    /**
     * Returns the previous position of the cursor/selector
     */
    DragSelect.prototype.getPreviousCursorPosition = function () {
        return this.previousCursorPos;
    };
    /**
     * Returns the cursor position difference between start and now
     * If usePreviousCursorDifference is passed,
     * it will output the cursor position difference between the previous selection and now
     */
    DragSelect.prototype.getCursorPositionDifference = function (usePreviousCursorDifference) {
        var posA = this.getCurrentCursorPosition();
        var posB = usePreviousCursorDifference
            ? this.getPreviousCursorPosition()
            : this.getInitialCursorPosition();
        return {
            x: posA.x - posB.x,
            y: posA.y - posB.y
        };
    };
    /**
     * Returns the current x, y scroll value of a container
     * If container has no scroll it will return 0
     */
    DragSelect.prototype.getScroll = function (area) {
        var body = {
            top: document.body.scrollTop > 0
                ? document.body.scrollTop
                : document.documentElement.scrollTop,
            left: document.body.scrollLeft > 0
                ? document.body.scrollLeft
                : document.documentElement.scrollLeft
        };
        var scroll = {
            // when the rectangle is bound to the document, no scroll is needed
            y: area && area.scrollTop >= 0 ? area.scrollTop : body.top,
            x: area && area.scrollLeft >= 0 ? area.scrollLeft : body.left
        };
        return scroll;
    };
    /**
     * Returns the top/left/bottom/right/width/height
     * values of a node. If Area is document then everything
     * except the sizes will be nulled.
     */
    DragSelect.prototype.getAreaRect = function (area) {
        if (area === document) {
            var size = {
                y: area.documentElement.clientHeight > 0
                    ? area.documentElement.clientHeight
                    : window.innerHeight,
                x: area.documentElement.clientWidth > 0
                    ? area.documentElement.clientWidth
                    : window.innerWidth
            };
            return {
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                width: size.x,
                height: size.y
            };
        }
        var rect = area.getBoundingClientRect();
        return {
            top: rect.top,
            left: rect.left,
            bottom: rect.bottom,
            right: rect.right,
            width: rect.width,
            height: rect.height
        };
    };
    /**
     * Updates the node style left, top, width,
     * height values accordingly.
     */
    DragSelect.prototype.updatePos = function (node, pos) {
        node.style.left = pos.x + "px";
        node.style.top = pos.y + "px";
        node.style.width = pos.w + "px";
        node.style.height = pos.h + "px";
        return node;
    };
    // Useful helper methods
    //////////////////////////////////////////////////////////////////////////////////////
    /**
     * Transforms a nodelist or single node to an array
     * so user doesn’t have to care.
     * @return {array}
     */
    DragSelect.prototype.toArray = function (nodes) {
        if (!nodes.length && this.isElement(nodes))
            return [nodes];
        var array = [];
        for (var i = nodes.length - 1; i >= 0; i--) {
            array[i] = nodes[i];
        }
        return array;
    };
    /**
     * Checks if a node is of type element
     * all credits to vikynandha: https://gist.github.com/vikynandha/6539809
     */
    DragSelect.prototype.isElement = function (node) {
        try {
            // Using W3 DOM2 (works for FF, Opera and Chrome), also checking for SVGs
            return node instanceof HTMLElement || node instanceof SVGElement;
        }
        catch (e) {
            // Browsers not supporting W3 DOM2 don't have HTMLElement and
            // an exception is thrown and we end up here. Testing some
            // properties that all elements have. (works even on IE7)
            return (typeof node === 'object' &&
                node.nodeType === 1 &&
                typeof node.style === 'object' &&
                typeof node.ownerDocument === 'object');
        }
    };
    return DragSelect;
}());
// Make exportable
//////////////////////////////////////////////////////////////////////////////////////
//[[place-exporters-here]]
