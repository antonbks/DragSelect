/**
 * DragSelect Class.
 *
 * @constructor
 * @param {Object} options - The options object.
 */
declare class DragSelect {
    selectedClass: string;
    hoverClass: string;
    selectorClass: string;
    selectableClass: string;
    selectables: Array<any>;
    multiSelectKeys: Array<string>;
    multiSelectMode: boolean;
    autoScrollSpeed: number;
    onElementUnselect: Function;
    onElementSelect: Function;
    onDragStart: Function;
    onDragMove: Function;
    onDragStartBegin: Function;
    callback: Function;
    area: any;
    customStyles: boolean;
    selector: HTMLElement;
    private _prevSelected;
    private _breaked;
    private _lastTouch;
    multiSelectKeyPressed: boolean;
    initialScroll: {
        x: number;
        y: number;
    };
    initialCursorPos: {
        x: number;
        y: number;
    };
    newCursorPos: {
        x: number;
        y: number;
    };
    previousCursorPos: {
        x: number;
        y: number;
    };
    selected: Array<any>;
    mouseInteraction: boolean;
    constructor({ selectedClass, hoverClass, selectorClass, selectableClass, selectables, multiSelectKeys, multiSelectMode, autoScrollSpeed, onElementSelect, onElementUnselect, onDragStartBegin, onDragStart, onDragMove, callback, area, customStyles, selector }: {
        selectedClass?: string | undefined;
        hoverClass?: string | undefined;
        selectorClass?: string | undefined;
        selectableClass?: string | undefined;
        selectables?: never[] | undefined;
        multiSelectKeys?: string[] | undefined;
        multiSelectMode?: boolean | undefined;
        autoScrollSpeed?: number | undefined;
        onElementSelect?: (() => void) | undefined;
        onElementUnselect?: (() => void) | undefined;
        onDragStartBegin?: (() => void) | undefined;
        onDragStart?: (() => void) | undefined;
        onDragMove?: (() => void) | undefined;
        callback?: (() => void) | undefined;
        area?: Document | undefined;
        customStyles?: boolean | undefined;
        selector?: undefined;
    });
    /**
     * Binds the `this` to the event listener Functions
     */
    private _createBindings;
    /**
     * Add/Remove Selectables also handles css classes and event listeners.
     */
    private _handleSelectables;
    private _addSelectable;
    private _removeSelectable;
    /**
     * Create the selector node when not provided by options object.
     */
    private _createSelector;
    /**
     * Triggers when a node is actively selected.
     *
     * This might be an "onClick" method but it also triggers when
     * <button> nodes are pressed via the keyboard.
     * Making DragSelect accessible for everyone!
     */
    private _onClick;
    /**
     * Check if some multiSelection modifier key is in Event object
     */
    isMultiSelectKeyPressed(event: any): boolean;
    /**
     * Starts the functionality. Automatically triggered when created.
     * Also, resets the functionality after a teardown
     */
    start(): void;
    /**
     * Startup when the area is clicked.
     */
    private _startUp;
    /**
     * Grabs the starting position of all needed elements
     */
    private _getStartingPositions;
    /**
     * Handles what happens while the mouse is moved
     */
    private _handleMove;
    /**
     * Calculates and returns the exact x,y w,h positions of the selector element
     */
    getPosition(event: Event): {
        x: number;
        w: number;
        y: number;
        h: number;
    };
    /**
     * Checks if element is inside selection and takes action based on that
     *
     * force handles first clicks and accessibility. Here is user is clicking directly onto
     * some element at start, (contrary to later hovers) we can assume that he
     * really wants to select/deselect that item.
     */
    checkIfInsideSelection(force?: boolean): boolean;
    /**
     * Logic when an item is selected
     */
    private _handleSelection;
    /**
     * Logic when an item is de-selected
     */
    private _handleUnselection;
    /**
     * Adds an item to the selection.
     *
     * @param {Node} item – item to select.
     * @return {Node} item
     */
    select(item: HTMLElement | SVGElement): HTMLElement | SVGElement;
    /**
     * Removes an item from the selection.
     */
    unselect(item: HTMLElement | SVGElement): HTMLElement | SVGElement;
    /**
     * Adds/Removes an item to the selection.
     * If it is already selected = remove, if not = add.
     */
    toggle(item: HTMLElement | SVGElement): HTMLElement | SVGElement;
    /**
     * Checks if element is touched by the selector rect (and vice-versa)
     */
    isElementTouching: (element: HTMLElement | SVGElement, selectionRect: {
        x: number;
        y: number;
        w: number;
        h: number;
    }, scroll: {
        x: number;
        y: number;
    }) => boolean;
    /**
     * Automatically Scroll the area by selecting
     */
    private _autoScroll;
    /**
     * Check if the selector is near an edge of the area
     * @return {string|false} top / bottom / left / right / false
     */
    isCursorNearEdge(event: Event, area: HTMLElement | SVGElement): string | false;
    /**
     * Unbind functions when mouse click is released
     */
    reset(event?: Event): false | undefined;
    /**
     * Function break: used in callbacks to stop break the code at the specific moment
     * - Event listeners and calculation will continue working
     * - Selector won’t display and will not select
     */
    break(): void;
    /**
     * Complete function teardown
     */
    stop(): void;
    /**
     * Returns the current selected nodes
     */
    getSelection(): any[];
    /**
     * Returns cursor x, y position based on event object
     * Will be relative to an area including the scroll unless advised otherwise
     * @param {HTMLElement | SVGElement | boolean} _area – containing area / this.area if none / document if === false
     */
    getCursorPos(event: Event, _area?: HTMLElement | SVGElement | boolean, ignoreScroll?: boolean): {
        x: number;
        y: number;
    };
    /**
     * Adds several items to the selection list
     * also adds the specific classes and take into account
     * all calculations.
     * Does not clear the selection, in contrary to .setSelection
     * Can add multiple nodes at once, in contrary to .select
     * @param {boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
     */
    addSelection(_nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement, triggerCallback?: boolean, dontAddToSelectables?: boolean): HTMLElement[] | SVGElement[];
    /**
     * Removes specific nodes from the selection
     * Multiple nodes can be given at once, in contrary to unselect
     * @param {boolean} removeFromSelectables - if element should be removed from the list of selectable nodes
     */
    removeSelection(_nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement, triggerCallback?: boolean, removeFromSelectables?: boolean): HTMLElement[] | SVGElement[];
    /**
     * Toggles specific nodes from the selection:
     * If element is not in selection it will be added, if it is already selected, it will be removed.
     * Multiple nodes can be given at once.
     * @param {boolean} _special - if true, it also removes selected elements from possible selectable nodes & don’t add them to selectables if they are not
     * @return {Array} all selected nodes
     */
    toggleSelection(_nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement, triggerCallback?: boolean, _special?: boolean): HTMLElement[] | SVGElement[];
    /**
     * Sets the current selected nodes and optionally run the callback
     * @param {Boolean} dontAddToSelectables - if element should not be added to the list of selectable nodes
     * @return {Nodes}
     */
    setSelection(nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement, triggerCallback?: boolean, dontAddToSelectables?: boolean): HTMLElement[] | SVGElement[];
    /**
     * Unselect / Deselect all current selected Nodes
     */
    clearSelection(triggerCallback?: boolean): Array<null>;
    /**
     * Add nodes that can be selected.
     * The algorithm makes sure that no node is added twice
     * @param {Boolean} addToSelection – if elements should also be added to current selection
     */
    addSelectables(_nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement, addToSelection?: boolean): HTMLElement[] | SVGElement[];
    /**
     * Gets all nodes that can be selected
     */
    getSelectables(): HTMLElement[] | SVGElement[];
    /**
     * Sets all elements that can be selected.
     * Removes all current selectables (& their respective classes).
     * Adds the new set to the selectables set,
     * thus replacing the original set.
     * @param removeFromSelection – if elements should also be removed from current selection
     * @param addToSelection – if elements should also be added to current selection
     */
    setSelectables(nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement, removeFromSelection?: boolean, addToSelection?: boolean): HTMLElement[] | SVGElement[];
    /**
     * Remove nodes from the nodes that can be selected.
     * @param {boolean} removeFromSelection – if elements should also be removed from current selection
     */
    removeSelectables(_nodes: HTMLElement[] | HTMLElement | SVGElement[] | SVGElement, removeFromSelection?: boolean): HTMLElement[] | SVGElement[];
    /**
     * Based on a click event object,
     * checks if the right mouse button was pressed.
     * (found @ https://stackoverflow.com/a/2405835)
     */
    isRightClick(event: any): boolean;
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
    private _getCursorPos;
    /**
     * Returns the starting/initial position of the cursor/selector
     */
    getInitialCursorPosition(): {
        x: number;
        y: number;
    };
    /**
     * Returns the last seen position of the cursor/selector
     */
    getCurrentCursorPosition(): {
        x: number;
        y: number;
    };
    /**
     * Returns the previous position of the cursor/selector
     */
    getPreviousCursorPosition(): {
        x: number;
        y: number;
    };
    /**
     * Returns the cursor position difference between start and now
     * If usePreviousCursorDifference is passed,
     * it will output the cursor position difference between the previous selection and now
     */
    getCursorPositionDifference(usePreviousCursorDifference?: boolean): object;
    /**
     * Returns the current x, y scroll value of a container
     * If container has no scroll it will return 0
     */
    getScroll(area?: HTMLElement | SVGElement): {
        x: number;
        y: number;
    };
    /**
     * Returns the top/left/bottom/right/width/height
     * values of a node. If Area is document then everything
     * except the sizes will be nulled.
     */
    getAreaRect(area: HTMLElement | SVGElement | Document): {
        top: number;
        left: number;
        bottom: number;
        right: number;
        width: number;
        height: number;
    };
    /**
     * Updates the node style left, top, width,
     * height values accordingly.
     */
    updatePos(node: HTMLElement | SVGElement, pos: {
        x: number;
        y: number;
        w: number;
        h: number;
    }): HTMLElement | SVGElement;
    /**
     * Transforms a nodelist or single node to an array
     * so user doesn’t have to care.
     * @return {array}
     */
    toArray(nodes: any): any[];
    /**
     * Checks if a node is of type element
     * all credits to vikynandha: https://gist.github.com/vikynandha/6539809
     */
    isElement(node: HTMLElement | SVGElement): boolean;
}
