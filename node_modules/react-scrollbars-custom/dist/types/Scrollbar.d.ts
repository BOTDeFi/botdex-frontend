import * as PropTypes from "prop-types";
import * as React from "react";
import Emittr from "./Emittr";
import { ScrollbarThumbProps } from "./ScrollbarThumb";
import { ScrollbarTrackProps } from "./ScrollbarTrack";
import { ElementPropsWithElementRefAndRenderer, ScrollState, TRACK_CLICK_BEHAVIOR } from "./types";
export declare type ScrollbarProps = ElementPropsWithElementRefAndRenderer & {
    createContext?: boolean;
    rtl?: boolean;
    momentum?: boolean;
    native?: boolean;
    mobileNative?: boolean;
    noScrollX?: boolean;
    noScrollY?: boolean;
    noScroll?: boolean;
    permanentTrackX?: boolean;
    permanentTrackY?: boolean;
    permanentTracks?: boolean;
    removeTracksWhenNotUsed?: boolean;
    removeTrackYWhenNotUsed?: boolean;
    removeTrackXWhenNotUsed?: boolean;
    minimalThumbSize?: number;
    maximalThumbSize?: number;
    minimalThumbXSize?: number;
    maximalThumbXSize?: number;
    minimalThumbYSize?: number;
    maximalThumbYSize?: number;
    scrollbarWidth?: number;
    fallbackScrollbarWidth?: number;
    scrollTop?: number;
    scrollLeft?: number;
    scrollDetectionThreshold?: number;
    translateContentSizesToHolder?: boolean;
    translateContentSizeYToHolder?: boolean;
    translateContentSizeXToHolder?: boolean;
    noDefaultStyles?: boolean;
    disableTracksMousewheelScrolling?: boolean;
    disableTrackXMousewheelScrolling?: boolean;
    disableTrackYMousewheelScrolling?: boolean;
    disableTracksWidthCompensation?: boolean;
    disableTrackXWidthCompensation?: boolean;
    disableTrackYWidthCompensation?: boolean;
    trackClickBehavior?: TRACK_CLICK_BEHAVIOR;
    wrapperProps?: ElementPropsWithElementRefAndRenderer;
    scrollerProps?: ElementPropsWithElementRefAndRenderer;
    contentProps?: ElementPropsWithElementRefAndRenderer;
    trackXProps?: Pick<ScrollbarTrackProps, Exclude<keyof ScrollbarTrackProps, "axis">>;
    trackYProps?: Pick<ScrollbarTrackProps, Exclude<keyof ScrollbarTrackProps, "axis">>;
    thumbXProps?: Pick<ScrollbarThumbProps, Exclude<keyof ScrollbarThumbProps, "axis">>;
    thumbYProps?: Pick<ScrollbarThumbProps, Exclude<keyof ScrollbarThumbProps, "axis">>;
    onUpdate?: (scrollValues: ScrollState, prevScrollState: ScrollState) => void;
    onScroll?: (scrollValues: ScrollState, prevScrollState: ScrollState) => void;
    onScrollStart?: (scrollValues: ScrollState) => void;
    onScrollStop?: (scrollValues: ScrollState) => void;
};
export declare type ScrollbarState = {
    trackXVisible: boolean;
    trackYVisible: boolean;
    isRTL?: boolean;
};
export declare type ScrollbarContextValue = {
    parentScrollbar: Scrollbar | null;
};
export declare const ScrollbarContext: React.Context<ScrollbarContextValue>;
export default class Scrollbar extends React.Component<ScrollbarProps, ScrollbarState> {
    static contextType: React.Context<ScrollbarContextValue>;
    static propTypes: {
        createContext: PropTypes.Requireable<boolean>;
        rtl: PropTypes.Requireable<boolean>;
        native: PropTypes.Requireable<boolean>;
        mobileNative: PropTypes.Requireable<boolean>;
        momentum: PropTypes.Requireable<boolean>;
        noDefaultStyles: PropTypes.Requireable<boolean>;
        disableTracksMousewheelScrolling: PropTypes.Requireable<boolean>;
        disableTrackXMousewheelScrolling: PropTypes.Requireable<boolean>;
        disableTrackYMousewheelScrolling: PropTypes.Requireable<boolean>;
        disableTracksWidthCompensation: PropTypes.Requireable<boolean>;
        disableTrackXWidthCompensation: PropTypes.Requireable<boolean>;
        disableTrackYWidthCompensation: PropTypes.Requireable<boolean>;
        minimalThumbSize: PropTypes.Requireable<number>;
        maximalThumbSize: PropTypes.Requireable<number>;
        minimalThumbXSize: PropTypes.Requireable<number>;
        maximalThumbXSize: PropTypes.Requireable<number>;
        minimalThumbYSize: PropTypes.Requireable<number>;
        maximalThumbYSize: PropTypes.Requireable<number>;
        noScrollX: PropTypes.Requireable<boolean>;
        noScrollY: PropTypes.Requireable<boolean>;
        noScroll: PropTypes.Requireable<boolean>;
        permanentTrackX: PropTypes.Requireable<boolean>;
        permanentTrackY: PropTypes.Requireable<boolean>;
        permanentTracks: PropTypes.Requireable<boolean>;
        translateContentSizesToHolder: PropTypes.Requireable<boolean>;
        translateContentSizeYToHolder: PropTypes.Requireable<boolean>;
        translateContentSizeXToHolder: PropTypes.Requireable<boolean>;
        removeTracksWhenNotUsed: PropTypes.Requireable<boolean>;
        removeTrackYWhenNotUsed: PropTypes.Requireable<boolean>;
        removeTrackXWhenNotUsed: PropTypes.Requireable<boolean>;
        trackClickBehavior: PropTypes.Requireable<TRACK_CLICK_BEHAVIOR>;
        scrollbarWidth: PropTypes.Requireable<number>;
        fallbackScrollbarWidth: PropTypes.Requireable<number>;
        scrollDetectionThreshold: PropTypes.Requireable<number>;
        scrollTop: PropTypes.Requireable<number>;
        scrollLeft: PropTypes.Requireable<number>;
        className: PropTypes.Requireable<string>;
        wrapperProps: PropTypes.Requireable<object>;
        contentProps: PropTypes.Requireable<object>;
        trackXProps: PropTypes.Requireable<object>;
        trackYProps: PropTypes.Requireable<object>;
        thumbXProps: PropTypes.Requireable<object>;
        thumbYProps: PropTypes.Requireable<object>;
        onUpdate: PropTypes.Requireable<(...args: any[]) => any>;
        onScroll: PropTypes.Requireable<(...args: any[]) => any>;
        onScrollStart: PropTypes.Requireable<(...args: any[]) => any>;
        onScrollStop: PropTypes.Requireable<(...args: any[]) => any>;
    };
    static defaultProps: {
        momentum: boolean;
        minimalThumbSize: number;
        fallbackScrollbarWidth: number;
        trackClickBehavior: TRACK_CLICK_BEHAVIOR;
        scrollDetectionThreshold: number;
        wrapperProps: {};
        scrollerProps: {};
        contentProps: {};
        trackXProps: {};
        trackYProps: {};
        thumbXProps: {};
        thumbYProps: {};
    };
    /**
     * @description UUID identifying scrollbar instance
     */
    readonly id: string;
    /**
     * @description Reference to the holder HTMLDivElement or null if it wasn't rendered or <i>native</i> property is true
     */
    holderElement: HTMLDivElement | null;
    /**
     * @description Reference to the wrapper HTMLDivElement or null if it wasn't rendered or <i>native</i> property is true
     */
    wrapperElement: HTMLDivElement | null;
    /**
     * @description Reference to the HTMLDivElement that actually has browser's scrollbars
     */
    scrollerElement: HTMLDivElement | null;
    /**
     * @description Reference to the content HTMLDivElement that contains component's children (and has browser's scrollbars)
     */
    contentElement: HTMLDivElement | null;
    /**
     * @description Reference to the horizontal track HTMLDivElement or null if it wasn't rendered
     */
    trackXElement: HTMLDivElement | null;
    /**
     * @description Reference to the vertical track HTMLDivElement or null if it wasn't rendered
     */
    trackYElement: HTMLDivElement | null;
    /**
     * @description Reference to the horizontal thumb HTMLDivElement or null if it wasn't rendered
     */
    thumbXElement: HTMLDivElement | null;
    /**
     * @description Reference to the vertical thumb HTMLDivElement or null if it wasn't rendered
     */
    thumbYElement: HTMLDivElement | null;
    readonly eventEmitter: Emittr;
    /**
     * @description Current ScrollState (cached)
     */
    private scrollValues;
    private _scrollDetectionTO;
    constructor(props: any);
    get scrollTop(): number;
    set scrollTop(top: number);
    get scrollLeft(): number;
    set scrollLeft(left: number);
    get scrollHeight(): number;
    get scrollWidth(): number;
    get clientHeight(): number;
    get clientWidth(): number;
    static calculateStyles(props: ScrollbarProps, state: ScrollbarState, scrollValues: any, scrollbarWidth: number): {
        holder: React.CSSProperties;
        wrapper: React.CSSProperties;
        content: React.CSSProperties;
        scroller: React.CSSProperties;
        trackX: React.CSSProperties;
        trackY: React.CSSProperties;
        thumbX: React.CSSProperties;
        thumbY: React.CSSProperties;
    };
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentDidUpdate(prevProps: Readonly<ScrollbarProps>, prevState: Readonly<ScrollbarState>): void;
    /**
     * @description Get current scroll-related values.<br/>
     * If <i>force</i> if truthy - will recalculate them instead of returning cached values.
     *
     * @return ScrollState
     */
    getScrollState: (force?: boolean) => ScrollState;
    /**
     * @description Scroll to top border
     */
    scrollToTop: () => this;
    /**
     * @description Scroll to left border
     */
    scrollToLeft: () => this;
    /**
     * @description Scroll to bottom border
     */
    scrollToBottom: () => this;
    /**
     * @description Scroll to right border
     */
    scrollToRight: () => this;
    /**
     * @description Set the scrolls at given coordinates.<br/>
     * If coordinate is undefined - current scroll value will persist.
     */
    scrollTo: (x?: number | undefined, y?: number | undefined) => this;
    /**
     * @description Center the viewport at given coordinates.<br/>
     * If coordinate is undefined - current scroll value will persist.
     */
    centerAt: (x?: number | undefined, y?: number | undefined) => this;
    update: (force?: boolean) => ScrollState | void;
    render(): React.ReactNode;
    private updaterNative;
    private updaterCustom;
    private elementRefHolder;
    private elementRefWrapper;
    private elementRefScroller;
    private elementRefContent;
    private elementRefTrackX;
    private elementRefTrackY;
    private elementRefThumbX;
    private elementRefThumbY;
    private handleTrackXClick;
    private handleTrackYClick;
    private handleTrackYMouseWheel;
    private handleTrackXMouseWheel;
    private handleThumbXDrag;
    private handleThumbXDragEnd;
    private handleThumbYDrag;
    private handleThumbYDragEnd;
    private handleScrollerScroll;
    private _scrollDetection;
    private _scrollDetectionCallback;
}
