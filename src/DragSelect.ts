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
class DragSelect {
  // Properties passed from the config object
  public selectedClass: string; // the class assigned to the selected items
  public hoverClass: string; // the class assigned to the mouse hovered items
  public selectorClass: string; // the class assigned to the square selector helper
  public selectableClass: string; // the class assigned to the elements that can be selected
  public selectables: Array<any> = []; // the elements that can be selected
  public multiSelectKeys: Array<string>; // An array of keys that allows switching to the multi - select mode(see the @multiSelectMode option).The only possible values are keys that are provided via the event object.So far: <kbd>ctrlKey < /kbd>, <kbd>shiftKey</kbd >, <kbd>metaKey < /kbd> and <kbd>altKey</kbd >.Provide an empty array`[]` if you want to turn off the functionality.Default: `['ctrlKey', 'shiftKey', 'metaKey']`
  public multiSelectMode: boolean; // Add newly selected elements to the selection instead of replacing them.Default = false
  public autoScrollSpeed: number; // Speed in which the area scrolls while selecting(if available).Unit is pixel per movement.Default = 1
  public onElementUnselect: Function; // It is fired every time an element is de - selected.This callback gets a property which is the just de - selected node
  public onElementSelect: Function; // It is fired every time an element is selected.This callback gets a property which is the just selected node
  public onDragStart: Function; // function It is fired when the user clicks in the area.This callback gets the event object.Executed after DragSelect function code ran, before the setup of event listeners.
  public onDragMove: Function; // It is fired when the user drags.This callback gets the event object.Executed before DragSelect function code ran, after getting the current mouse position.
  public onDragStartBegin: Function; // Is fired when the user clicks in the area.This callback gets the event object.Executed * before * DragSelect function code ran.
  public callback: Function; // a callback function that gets fired when the element is dropped.This callback gets a property which is an array that holds all selected nodes.The second property passed is the event object.
  public area: any; // area in which you can drag.If not provided it will be the whole document
  public customStyles: boolean; // if set to true, no styles(except for position absolute) will be applied by default
  public selector: HTMLElement; // the square that will draw the selection

  // private properties
  private _prevSelected: Array<any> = []; // memory to fix #9
  private _breaked: boolean = false;
  private _lastTouch: any;

  // readable properties
  multiSelectKeyPressed: boolean = false;
  initialScroll: { x: number; y: number } = { x: 0, y: 0 };
  initialCursorPos: { x: number; y: number } = { x: 0, y: 0 };
  newCursorPos: { x: number; y: number } = { x: 0, y: 0 };
  previousCursorPos: { x: number; y: number } = { x: 0, y: 0 };
  selected: Array<any> = [];
  mouseInteraction: boolean = false; // fix firefox doubleclick issue

  constructor({
    selectedClass = 'ds-selected',
    hoverClass = 'ds-hover',
    selectorClass = 'ds-selector',
    selectableClass = 'ds-selectable',
    selectables = [],
    multiSelectKeys = ['ctrlKey', 'shiftKey', 'metaKey'],
    multiSelectMode = false,
    autoScrollSpeed = 1,
    onElementSelect = () => {},
    onElementUnselect = () => {},
    onDragStartBegin = () => {},
    onDragStart = () => {},
    onDragMove = () => {},
    callback = () => {},
    area = document,
    customStyles = false,
    selector = undefined
  }) {
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
      const computedArea = getComputedStyle(this.area);
      const isPositioned =
        computedArea.position === 'absolute' ||
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
  private _createBindings() {
    this._startUp = this._startUp.bind(this);
    this._handleMove = this._handleMove.bind(this);
    this.reset = this.reset.bind(this);
    this._onClick = this._onClick.bind(this);
  }

  /**
   * Add/Remove Selectables also handles css classes and event listeners.
   */
  private _handleSelectables(
    selectables: HTMLElement[] | SVGElement[],
    remove?: boolean, // if elements should be removed.
    toSelection?: boolean // if elements should also be added/removed to the current selection.
  ) {
    for (let index = 0, il = selectables.length; index < il; index++) {
      const selectable = selectables[index];
      const indexOf = this.selectables.indexOf(selectable);

      if (indexOf < 0 && !remove) {
        this._addSelectable(selectable, toSelection);
      } else if (indexOf > -1 && remove) {
        this._removeSelectable(selectable, indexOf, toSelection);
      }
    }
  }

  private _addSelectable(
    selectable: HTMLElement | SVGElement,
    toSelection?: boolean
  ) {
    selectable.classList.add(this.selectableClass);
    selectable.addEventListener('click', this._onClick);
    this.selectables.push(selectable);

    // also add to current selection
    if (toSelection && this.selected.indexOf(selectable) < 0) {
      selectable.classList.add(this.selectedClass);
      this.selected.push(selectable);
    }
  }

  private _removeSelectable(
    selectable: HTMLElement | SVGElement,
    indexOf: number,
    toSelection?: boolean
  ) {
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
  }

  /**
   * Create the selector node when not provided by options object.
   */
  private _createSelector(): HTMLElement {
    const selector = document.createElement('div');

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
  }

  /**
   * Triggers when a node is actively selected.
   *
   * This might be an "onClick" method but it also triggers when
   * <button> nodes are pressed via the keyboard.
   * Making DragSelect accessible for everyone!
   */
  private _onClick(event: Event) {
    if (this.mouseInteraction) return;
    if (this.isRightClick(event)) return;

    const node = <HTMLElement>event.target;

    if (this.isMultiSelectKeyPressed(event)) {
      this._prevSelected = this.selected.slice();
    } // #9
    else {
      this._prevSelected = [];
    } // #9

    this.checkIfInsideSelection(true); // reset selection if no multiselectionkeypressed

    if (this.selectables.indexOf(node) > -1) this.toggle(node);

    this.reset();
  }

  /**
   * Check if some multiSelection modifier key is in Event object
   */
  public isMultiSelectKeyPressed(event: any): boolean {
    this.multiSelectKeyPressed = false;

    if (this.multiSelectMode) this.multiSelectKeyPressed = true;
    else
      this.multiSelectKeys.forEach(mKey => {
        if (event[mKey]) this.multiSelectKeyPressed = true;
      });

    return this.multiSelectKeyPressed;
  }

  // Start
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Starts the functionality. Automatically triggered when created.
   * Also, resets the functionality after a teardown
   */
  public start() {
    this.area.addEventListener('mousedown', this._startUp);
    this.area.addEventListener('touchstart', this._startUp, { passive: false });
  }

  /**
   * Startup when the area is clicked.
   */
  private _startUp(event: Event) {
    // touchmove handler
    if (event.type === 'touchstart')
      // Call preventDefault() to prevent double click issue, see https://github.com/ThibaultJanBeyer/DragSelect/pull/29 & https://developer.mozilla.org/vi/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
      event.preventDefault();

    // callback
    this.onDragStartBegin(event);
    if (this._breaked) return false;

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
  }

  /**
   * Grabs the starting position of all needed elements
   */
  private _getStartingPositions(event: Event) {
    this.initialCursorPos = this.newCursorPos = this._getCursorPos(
      event,
      this.area
    );
    this.initialScroll = this.getScroll(this.area);

    const selectorPos = {
      x: this.initialCursorPos.x + this.initialScroll.x,
      y: this.initialCursorPos.y + this.initialScroll.y,
      w: 0,
      h: 0
    };
    this.updatePos(this.selector, selectorPos);
  }

  // Movements/Sizing of selection
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Handles what happens while the mouse is moved
   */
  private _handleMove(event: Event) {
    const selectorPos = this.getPosition(event);

    // callback
    this.onDragMove(event);
    if (this._breaked) return false;

    this.selector.style.display = 'block'; // hidden unless moved, fix for issue #8

    // move element on location
    this.updatePos(this.selector, selectorPos);
    this.checkIfInsideSelection();

    // scroll area if area is scrollable
    this._autoScroll(event);
  }

  /**
   * Calculates and returns the exact x,y w,h positions of the selector element
   */
  public getPosition(
    event: Event
  ): {
    x: number;
    w: number;
    y: number;
    h: number;
  } {
    const cursorPosNew = this._getCursorPos(event, this.area);
    const scrollNew = this.getScroll(this.area);

    // save for later retrieval
    this.newCursorPos = cursorPosNew;

    // if area or document is scrolled those values have to be included aswell
    const scrollAmount = {
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
    const selectorPos = {
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
    } else {
      // 1b.
      selectorPos.x = cursorPosNew.x + scrollNew.x; // 2b.
      selectorPos.w = this.initialCursorPos.x - cursorPosNew.x - scrollAmount.x; // 3b.
    }

    // bottom
    if (cursorPosNew.y > this.initialCursorPos.y - scrollAmount.y) {
      selectorPos.y = this.initialCursorPos.y + this.initialScroll.y;
      selectorPos.h = cursorPosNew.y - this.initialCursorPos.y + scrollAmount.y;
      // top
    } else {
      selectorPos.y = cursorPosNew.y + scrollNew.y;
      selectorPos.h = this.initialCursorPos.y - cursorPosNew.y - scrollAmount.y;
    }

    return selectorPos;
  }

  // Colision detection
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Checks if element is inside selection and takes action based on that
   *
   * force handles first clicks and accessibility. Here is user is clicking directly onto
   * some element at start, (contrary to later hovers) we can assume that he
   * really wants to select/deselect that item.
   */
  public checkIfInsideSelection(force?: boolean): boolean {
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
      } else {
        this._handleUnselection(selectable, force);
      }
    }
    return anyInside;
  }

  /**
   * Logic when an item is selected
   */
  private _handleSelection(item: HTMLElement | SVGElement, force?: boolean) {
    if (item.classList.contains(this.hoverClass) && !force) return false;

    const posInSelectedArray = this.selected.indexOf(item);

    if (posInSelectedArray < 0) this.select(item);
    else if (posInSelectedArray > -1 && this.multiSelectKeyPressed)
      this.unselect(item);

    item.classList.add(this.hoverClass);
  }

  /**
   * Logic when an item is de-selected
   */
  private _handleUnselection(item: HTMLElement | SVGElement, force?: boolean) {
    if (!item.classList.contains(this.hoverClass) && !force) return false;

    const posInSelectedArray = this.selected.indexOf(item);
    const isInPrevSelection = this._prevSelected.indexOf(item); // #9

    /**
     * Special algorithm for issue #9.
     * if a multiselectkey is pressed, ds 'remembers' the last selection and reverts
     * to that state if the selection is not kept, to mimic the natural OS behaviour
     * = if item was selected and is not in selection anymore, reselect it
     * = if item was not selected and is not in selection anymore, unselect it
     */
    if (posInSelectedArray > -1 && isInPrevSelection < 0) this.unselect(item);
    else if (posInSelectedArray < 0 && isInPrevSelection > -1)
      this.select(item);

    item.classList.remove(this.hoverClass);
  }

  /**
   * Adds an item to the selection.
   *
   * @param {Node} item – item to select.
   * @return {Node} item
   */
  public select(item: HTMLElement | SVGElement): HTMLElement | SVGElement {
    if (this.selected.indexOf(item) > -1) return item;

    this.selected.push(item);
    item.classList.add(this.selectedClass);

    this.onElementSelect(item);

    return item;
  }

  /**
   * Removes an item from the selection.
   */
  public unselect(item: HTMLElement | SVGElement): HTMLElement | SVGElement {
    if (this.selected.indexOf(item) < 0) return item;

    this.selected.splice(this.selected.indexOf(item), 1);
    item.classList.remove(this.selectedClass);

    this.onElementUnselect(item);

    return item;
  }

  /**
   * Adds/Removes an item to the selection.
   * If it is already selected = remove, if not = add.
   */
  public toggle(item: HTMLElement | SVGElement): HTMLElement | SVGElement {
    if (this.selected.indexOf(item) > -1) return this.unselect(item);

    return this.select(item);
  }

  /**
   * Checks if element is touched by the selector rect (and vice-versa)
   */
  public isElementTouching = function(
    element: HTMLElement | SVGElement,
    selectionRect: { x: number; y: number; w: number; h: number },
    scroll: { x: number; y: number }
  ): boolean {
    const rect = element.getBoundingClientRect();
    const elementRect = {
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
    if (
      selectionRect.x < elementRect.x + elementRect.w &&
      selectionRect.x + selectionRect.w > elementRect.x &&
      selectionRect.y < elementRect.y + elementRect.h &&
      selectionRect.h + selectionRect.y > elementRect.y
    ) {
      return true; // collision detected!
    } else {
      return false;
    }
  };

  // Autoscroll
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Automatically Scroll the area by selecting
   */
  private _autoScroll(event: Event) {
    const edge = this.isCursorNearEdge(event, this.area);

    const docEl =
      document &&
      document.documentElement &&
      document.documentElement.scrollTop &&
      document.documentElement;
    const _area = this.area === document ? docEl || document.body : this.area;

    if (edge === 'top' && _area.scrollTop > 0)
      return (_area.scrollTop -= 1 * this.autoScrollSpeed);

    if (edge === 'bottom') return (_area.scrollTop += 1 * this.autoScrollSpeed);

    if (edge === 'left' && _area.scrollLeft > 0)
      return (_area.scrollLeft -= 1 * this.autoScrollSpeed);

    if (edge === 'right') return (_area.scrollLeft += 1 * this.autoScrollSpeed);
  }

  /**
   * Check if the selector is near an edge of the area
   * @return {string|false} top / bottom / left / right / false
   */
  public isCursorNearEdge(
    event: Event,
    area: HTMLElement | SVGElement
  ): string | false {
    const cursorPosition = this._getCursorPos(event, area);
    const areaRect = this.getAreaRect(area);

    const tolerance = {
      x: Math.max(areaRect.width / 10, 30),
      y: Math.max(areaRect.height / 10, 30)
    };

    if (cursorPosition.y < tolerance.y) return 'top';

    if (areaRect.height - cursorPosition.y < tolerance.y) return 'bottom';

    if (areaRect.width - cursorPosition.x < tolerance.x) return 'right';

    if (cursorPosition.x < tolerance.x) return 'left';

    return false;
  }

  // Ending
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Unbind functions when mouse click is released
   */
  public reset(event?: Event) {
    this.previousCursorPos = this._getCursorPos(event, this.area);
    document.removeEventListener('mouseup', this.reset);
    document.removeEventListener('touchend', this.reset);
    this.area.removeEventListener('mousemove', this._handleMove);
    this.area.removeEventListener('touchmove', this._handleMove);
    this.area.addEventListener('mousedown', this._startUp);
    this.area.addEventListener('touchstart', this._startUp, { passive: false });

    this.callback(this.selected, event);
    if (this._breaked) return false;

    this.selector.style.width = '0';
    this.selector.style.height = '0';
    this.selector.style.display = 'none';

    setTimeout(
      // debounce in order "onClick" to work
      () => (this.mouseInteraction = false),
      100
    );
  }

  /**
   * Function break: used in callbacks to stop break the code at the specific moment
   * - Event listeners and calculation will continue working
   * - Selector won’t display and will not select
   */
  public break() {
    this._breaked = true;
    setTimeout(
      // debounce the break should only break once instantly after call
      () => (this._breaked = false),
      100
    );
  }

  /**
   * Complete function teardown
   */
  public stop() {
    this.reset();
    this.area.removeEventListener('mousedown', this._startUp);
    this.area.removeEventListener('touchstart', this._startUp, {
      passive: false
    });
    document.removeEventListener('mouseup', this.reset);
    document.removeEventListener('touchend', this.reset);
  }

  // Usefull methods for user
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Returns the current selected nodes
   */
  public getSelection() {
    return this.selected;
  }

  /**
   * Returns cursor x, y position based on event object
   * Will be relative to an area including the scroll unless advised otherwise
   * @param {HTMLElement | SVGElement | boolean} _area – containing area / this.area if none / document if === false
   */
  public getCursorPos(
    event: Event,
    _area?: HTMLElement | SVGElement | boolean,
    ignoreScroll?: boolean
  ): { x: number; y: number } {
    const area = _area || (_area !== false && this.area);
    const pos = this._getCursorPos(event, area);
    const scroll = ignoreScroll ? { x: 0, y: 0 } : this.getScroll(area);

    return {
      x: pos.x + scroll.x,
      y: pos.y + scroll.y
    };
  }

  /**
   * Adds several items to the selection list
   * also adds the specific classes and take into account
   * all calculations.
   * Does not clear the selection, in contrary to .setSelection
   * Can add multiple nodes at once, in contrary to .select
   * @param {boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
   */
  public addSelection(
    _nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement,
    triggerCallback?: boolean,
    dontAddToSelectables?: boolean
  ): HTMLElement[] | SVGElement[] {
    const nodes = this.toArray(_nodes);

    nodes.forEach(node => this.select(node));

    if (!dontAddToSelectables) this.addSelectables(nodes);

    if (triggerCallback) this.callback(this.selected, false);

    return this.selected;
  }

  /**
   * Removes specific nodes from the selection
   * Multiple nodes can be given at once, in contrary to unselect
   * @param {boolean} removeFromSelectables - if element should be removed from the list of selectable nodes
   */
  public removeSelection(
    _nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement,
    triggerCallback?: boolean,
    removeFromSelectables?: boolean
  ): HTMLElement[] | SVGElement[] {
    const nodes = this.toArray(_nodes);
    nodes.forEach(node => this.unselect(node));

    if (removeFromSelectables) this.removeSelectables(nodes);

    if (triggerCallback) this.callback(this.selected, false);

    return this.selected;
  }

  /**
   * Toggles specific nodes from the selection:
   * If element is not in selection it will be added, if it is already selected, it will be removed.
   * Multiple nodes can be given at once.
   * @param {boolean} _special - if true, it also removes selected elements from possible selectable nodes & don’t add them to selectables if they are not
   * @return {Array} all selected nodes
   */
  public toggleSelection(
    _nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement,
    triggerCallback?: boolean,
    _special?: boolean
  ): HTMLElement[] | SVGElement[] {
    const nodes = this.toArray(_nodes);

    nodes.forEach(node => {
      if (this.selected.indexOf(node) < 0)
        this.addSelection(node, triggerCallback, _special);
      else this.removeSelection(node, triggerCallback, _special);
    });

    return this.selected;
  }

  /**
   * Sets the current selected nodes and optionally run the callback
   * @param {Boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
   * @return {Nodes}
   */
  public setSelection(
    nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement,
    triggerCallback?: boolean,
    dontAddToSelectables?: boolean
  ): HTMLElement[] | SVGElement[] {
    this.clearSelection();
    this.addSelection(nodes, triggerCallback, dontAddToSelectables);

    return this.selected;
  }

  /**
   * Unselect / Deselect all current selected Nodes
   */
  public clearSelection(triggerCallback?: boolean): Array<null> {
    const selection = this.selected.slice();
    selection.forEach(node => this.unselect(node));

    if (triggerCallback) this.callback(this.selected, false);

    return this.selected;
  }

  /**
   * Add nodes that can be selected.
   * The algorithm makes sure that no node is added twice
   * @param {Boolean} addToSelection – if elements should also be added to current selection
   */
  public addSelectables(
    _nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement,
    addToSelection?: boolean
  ): HTMLElement[] | SVGElement[] {
    const nodes = this.toArray(_nodes);
    this._handleSelectables(nodes, false, addToSelection);
    return this.selectables;
  }

  /**
   * Gets all nodes that can be selected
   */
  getSelectables(): HTMLElement[] | SVGElement[] {
    return this.selectables;
  }

  /**
   * Sets all elements that can be selected.
   * Removes all current selectables (& their respective classes).
   * Adds the new set to the selectables set,
   * thus replacing the original set.
   * @param removeFromSelection – if elements should also be removed from current selection
   * @param addToSelection – if elements should also be added to current selection
   */
  public setSelectables(
    nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement,
    removeFromSelection?: boolean,
    addToSelection?: boolean
  ): HTMLElement[] | SVGElement[] {
    this.removeSelectables(this.getSelectables(), removeFromSelection);
    return this.addSelectables(nodes, addToSelection);
  }

  /**
   * Remove nodes from the nodes that can be selected.
   * @param {boolean} removeFromSelection – if elements should also be removed from current selection
   */
  public removeSelectables(
    _nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement,
    removeFromSelection?: boolean
  ): HTMLElement[] | SVGElement[] {
    var nodes = this.toArray(_nodes);
    this._handleSelectables(nodes, true, removeFromSelection);
    return this.selectables;
  }

  // Helpers
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Based on a click event object,
   * checks if the right mouse button was pressed.
   * (found @ https://stackoverflow.com/a/2405835)
   */
  isRightClick(event: any): boolean {
    if (!event) return false;

    let isRightMB = false;
    if ('which' in event) {
      // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
      isRightMB = event.which === 3;
    } else if ('button' in event) {
      // IE, Opera
      isRightMB = event.button === 2;
    }

    return isRightMB;
  }

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
  private _getCursorPos(
    event?: any,
    area?: HTMLElement | SVGElement
  ): { x: number; y: number } {
    if (!event) return { x: 0, y: 0 };

    // touchend has not touches. so we take the last toucb if a touchevent, we need to store the positions on the prototype
    if ('touches' in event && event.type !== 'touchend')
      this._lastTouch = event;

    //if a touchevent, return the last touch rather than the regular event
    // we need .touches[0] from that event instead
    event = event.touches ? this._lastTouch.touches[0] : event;

    const cPos = {
      // event.clientX/Y fallback for <IE8
      x: event.pageX,
      y: event.pageY
    };

    const areaRect = this.getAreaRect(area || document);
    const docScroll = this.getScroll(); // needed when document is scrollable but area is not

    return {
      // if it’s constrained in an area the area should be substracted calculate
      x: cPos.x - areaRect.left - docScroll.x,
      y: cPos.y - areaRect.top - docScroll.y
    };
  }

  /**
   * Returns the starting/initial position of the cursor/selector
   */
  public getInitialCursorPosition(): { x: number; y: number } {
    return this.initialCursorPos;
  }

  /**
   * Returns the last seen position of the cursor/selector
   */
  public getCurrentCursorPosition(): { x: number; y: number } {
    return this.newCursorPos;
  }

  /**
   * Returns the previous position of the cursor/selector
   */
  public getPreviousCursorPosition(): { x: number; y: number } {
    return this.previousCursorPos;
  }

  /**
   * Returns the cursor position difference between start and now
   * If usePreviousCursorDifference is passed,
   * it will output the cursor position difference between the previous selection and now
   */
  public getCursorPositionDifference(
    usePreviousCursorDifference?: boolean
  ): object {
    const posA = this.getCurrentCursorPosition();
    const posB = usePreviousCursorDifference
      ? this.getPreviousCursorPosition()
      : this.getInitialCursorPosition();

    return {
      x: posA.x - posB.x,
      y: posA.y - posB.y
    };
  }

  /**
   * Returns the current x, y scroll value of a container
   * If container has no scroll it will return 0
   */
  public getScroll(area?: HTMLElement | SVGElement): { x: number; y: number } {
    const body = {
      top:
        document.body.scrollTop > 0
          ? document.body.scrollTop
          : document.documentElement.scrollTop,
      left:
        document.body.scrollLeft > 0
          ? document.body.scrollLeft
          : document.documentElement.scrollLeft
    };

    const scroll = {
      // when the rectangle is bound to the document, no scroll is needed
      y: area && area.scrollTop >= 0 ? area.scrollTop : body.top,
      x: area && area.scrollLeft >= 0 ? area.scrollLeft : body.left
    };

    return scroll;
  }

  /**
   * Returns the top/left/bottom/right/width/height
   * values of a node. If Area is document then everything
   * except the sizes will be nulled.
   */
  public getAreaRect(
    area: HTMLElement | SVGElement | Document
  ): {
    top: number;
    left: number;
    bottom: number;
    right: number;
    width: number;
    height: number;
  } {
    if (area === document) {
      const size = {
        y:
          area.documentElement.clientHeight > 0
            ? area.documentElement.clientHeight
            : window.innerHeight,
        x:
          area.documentElement.clientWidth > 0
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

    const rect = (<HTMLElement | SVGElement>area).getBoundingClientRect();

    return {
      top: rect.top,
      left: rect.left,
      bottom: rect.bottom,
      right: rect.right,
      width: rect.width,
      height: rect.height
    };
  }

  /**
   * Updates the node style left, top, width,
   * height values accordingly.
   */
  public updatePos(
    node: HTMLElement | SVGElement,
    pos: { x: number; y: number; w: number; h: number }
  ): HTMLElement | SVGElement {
    node.style.left = `${pos.x}px`;
    node.style.top = `${pos.y}px`;
    node.style.width = `${pos.w}px`;
    node.style.height = `${pos.h}px`;
    return node;
  }

  // Useful helper methods
  //////////////////////////////////////////////////////////////////////////////////////

  /**
   * Transforms a nodelist or single node to an array
   * so user doesn’t have to care.
   * @return {array}
   */
  public toArray(nodes: any) {
    if (!nodes.length && this.isElement(nodes)) return [nodes];

    const array = [];
    for (var i = nodes.length - 1; i >= 0; i--) {
      array[i] = nodes[i];
    }

    return array;
  }

  /**
   * Checks if a node is of type element
   * all credits to vikynandha: https://gist.github.com/vikynandha/6539809
   */
  public isElement(node: HTMLElement | SVGElement): boolean {
    try {
      // Using W3 DOM2 (works for FF, Opera and Chrome), also checking for SVGs
      return node instanceof HTMLElement || node instanceof SVGElement;
    } catch (e) {
      // Browsers not supporting W3 DOM2 don't have HTMLElement and
      // an exception is thrown and we end up here. Testing some
      // properties that all elements have. (works even on IE7)
      return (
        typeof node === 'object' &&
        node.nodeType === 1 &&
        typeof node.style === 'object' &&
        typeof node.ownerDocument === 'object'
      );
    }
  }
}

// Make exportable
//////////////////////////////////////////////////////////////////////////////////////

//[[place-exporters-here]]
