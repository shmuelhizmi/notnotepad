import Blockly from "blockly";
//blocks construction functions
const genAttributes = attribute => {
  let res = [];
  attribute.forEach(element => {
    res.push({
      type: element.name,
      belongTo: element.belongTo,
      message0: "%1 %2 %3",
      args0: [
        {
          type: "field_label_serializable",
          name: "attribute_name",
          text: element.name
        },
        {
          type: "field_input",
          name: "attribute_value",
          text: "set value"
        },
        {
          type: "input_value",
          name: "input_attributes",
          align: "RIGHT"
        }
      ],
      output: null,
      colour: 255,
      tooltip: element.description,
      helpUrl: "soon"
    });
  });
  return res;
};

//pre constarct blocks
const attributes = [
  {
    name: "accept",
    belongTo: ["input"],
    description:
      'Sets what types of files that the server accepts (only for type="file")'
  },
  {
    name: "accept-charset",
    belongTo: ["form"],
    description:
      "Sets the character encodings that are to be used for the form submission"
  },
  {
    name: "accesskey",
    belongTo: ["ALL"],
    description: "Sets a shortcut key to activate/focus an element"
  },
  {
    name: "action",
    belongTo: ["form"],
    description: "Sets where to send the form-data when the form is submitted"
  },
  {
    name: "align",
    belongTo: ["Obsolete!"],
    description:
      "Sets the alignment according to surrounding elements. Obsolete attribute use CSS instead"
  },
  {
    name: "alt",
    belongTo: ["area", "img", "input"],
    description:
      "Sets an alternate text when the original element fails to display"
  },
  {
    name: "async",
    belongTo: ["script"],
    description:
      "Sets that the script is executed asynchronously (only for external scripts)"
  },
  {
    name: "autocomplete",
    belongTo: ["form", "input"],
    description:
      "Sets whether the form or the input element should have autocomplete enabled"
  },
  {
    name: "autofocus",
    belongTo: ["button", "input", "select", "textarea"],
    description:
      "Sets that the element should automatically get focus when the page loads"
  },
  {
    name: "autoplay",
    belongTo: ["audio", "video"],
    description:
      "Sets that the audio/video will start playing as soon as it is ready"
  },
  {
    name: "bgcolor",
    belongTo: ["Obsolete!"],
    description: "Sets the background color of an element. Use CSS instead"
  },
  {
    name: "border",
    belongTo: ["Obsolete!"],
    description: "Sets the width of the border of an element. Use CSS instead"
  },
  {
    name: "charset",
    belongTo: ["meta", "script"],
    description: "Sets the character encoding"
  },
  {
    name: "checked",
    belongTo: ["input"],
    description:
      'Sets that an input element should be pre-selected when the page loads (for type="checkbox" or type="radio")'
  },
  {
    name: "cite",
    belongTo: ["blockquote", "del", "ins", "q"],
    description: "Sets a URL which explains the quote/deleted/inserted text"
  },
  {
    name: "class",
    belongTo: ["ALL"],
    description:
      "Sets one or more classnames for an element (refers to a class in a style sheet)"
  },
  {
    name: "color",
    belongTo: ["Obsolete!"],
    description: "Sets the text color of an element. Use CSS instead"
  },
  {
    name: "cols",
    belongTo: ["textarea"],
    description: "Sets the visible width of a text area"
  },
  {
    name: "colspan",
    belongTo: ["td", "th"],
    description: "Sets the number of columns a table cell should span"
  },
  {
    name: "content",
    belongTo: ["meta"],
    description:
      "Gives the value associated with the http-equiv or name attribute"
  },
  {
    name: "contenteditable",
    belongTo: ["ALL"],
    description: "Sets whether the content of an element is editable or not"
  },
  {
    name: "contextmenu",
    belongTo: ["ALL"],
    description:
      "Sets a context menu for an element. The context menu appears when a user right-clicks on the element"
  },
  {
    name: "controls",
    belongTo: ["audio", "video"],
    description:
      "Sets that audio/video controls should be displayed (such as a play/pause button etc)"
  },
  {
    name: "coords",
    belongTo: ["area"],
    description: "Sets the coordinates of the area"
  },
  {
    name: "data",
    belongTo: ["object"],
    description: "Sets the URL of the resource to be used by the object"
  },
  {
    name: "data-*",
    belongTo: ["ALL"],
    description: "Used to store custom data private to the page or application"
  },
  {
    name: "datetime",
    belongTo: ["del", "ins", "time"],
    description: "Sets the date and time"
  },
  {
    name: "default",
    belongTo: ["track"],
    description:
      "Sets that the track is to be enabled if the users preferences do not indicate that another track would be more appropriate"
  },
  {
    name: "defer",
    belongTo: ["script"],
    description:
      "Sets that the script is executed when the page has finished parsing (only for external scripts)"
  },
  {
    name: "dir",
    belongTo: ["ALL"],
    description: "Sets the text direction for the content in an element"
  },
  {
    name: "dirname",
    belongTo: ["input", "textarea"],
    description: "Sets that the text direction will be submitted"
  },
  {
    name: "disabled",
    belongTo: [
      "button",
      "fieldset",
      "input",
      "optgroup",
      "option",
      "select",
      "textarea"
    ],
    description:
      "Sets that the specified element/group of elements should be disabled"
  },
  {
    name: "download",
    belongTo: ["a", "area"],
    description:
      "Sets that the target will be downloaded when a user clicks on the hyperlink"
  },
  {
    name: "draggable",
    belongTo: ["ALL"],
    description: "Sets whether an element is draggable or not"
  },
  {
    name: "dropzone",
    belongTo: ["ALL"],
    description:
      "Sets whether the dragged data is copied moved or linked when dropped"
  },
  {
    name: "enctype",
    belongTo: ["form"],
    description:
      'Sets how the form-data should be encoded when submitting it to the server (only for method="post")'
  },
  {
    name: "for",
    belongTo: ["label", "output"],
    description: "Sets which form element(s) a label/calculation is bound to"
  },
  {
    name: "form",
    belongTo: [
      "button",
      "fieldset",
      "input",
      "label",
      "meter",
      "object",
      "output",
      "select",
      "textarea"
    ],
    description: "Sets the name of the form the element belongs to"
  },
  {
    name: "formaction",
    belongTo: ["button", "input"],
    description:
      'Sets where to send the form-data when a form is submitted. Only for type="submit"'
  },
  {
    name: "headers",
    belongTo: ["td", "th"],
    description: "Sets one or more headers cells a cell is related to"
  },
  {
    name: "height",
    belongTo: ["canvas", "embed", "iframe", "img", "input", "object", "video"],
    description: "Sets the height of the element"
  },
  {
    name: "hidden",
    belongTo: ["ALL"],
    description: "Sets that an element is not yet or is no longer relevant"
  },
  {
    name: "high",
    belongTo: ["meter"],
    description: "Sets the range that is considered to be a high value"
  },
  {
    name: "href",
    belongTo: ["a", "area", "base", "link"],
    description: "Sets the URL of the page the link goes to"
  },
  {
    name: "hreflang",
    belongTo: ["a", "area", "link"],
    description: "Sets the language of the linked document"
  },
  {
    name: "http-equiv",
    belongTo: ["meta"],
    description:
      "Provides an HTTP header for the information/value of the content attribute"
  },
  {
    name: "id",
    belongTo: ["ALL"],
    description: "Sets a unique id for an element"
  },
  {
    name: "ismap",
    belongTo: ["img"],
    description: "Sets an image as a server-side image-map"
  },
  {
    name: "kind",
    belongTo: ["track"],
    description: "Sets the kind of text track"
  },
  {
    name: "label",
    belongTo: ["track", "option", "optgroup"],
    description: "Sets the title of the text track"
  },
  {
    name: "lang",
    belongTo: ["ALL"],
    description: "Sets the language of the elements content"
  },
  {
    name: "list",
    belongTo: ["input"],
    description:
      "Refers to a datalist element that contains pre-defined options for an input element"
  },
  {
    name: "loop",
    belongTo: ["audio", "video"],
    description:
      "Sets that the audio/video will start over again every time it is finished"
  },
  {
    name: "low",
    belongTo: ["meter"],
    description: "Sets the range that is considered to be a low value"
  },
  {
    name: "max",
    belongTo: ["input", "meter", "progress"],
    description: "Sets the maximum value"
  },
  {
    name: "maxlength",
    belongTo: ["input", "textarea"],
    description: "Sets the maximum number of characters allowed in an element"
  },
  {
    name: "media",
    belongTo: ["a", "area", "link", "source", "style"],
    description: "Sets what media/device the linked document is optimized for"
  },
  {
    name: "method",
    belongTo: ["form"],
    description: "Sets the HTTP method to use when sending form-data"
  },
  {
    name: "min",
    belongTo: ["input", "meter"],
    description: "Sets a minimum value"
  },
  {
    name: "multiple",
    belongTo: ["input", "select"],
    description: "Sets that a user can enter more than one value"
  },
  {
    name: "muted",
    belongTo: ["video", "audio"],
    description: "Sets that the audio output of the video should be muted"
  },
  {
    name: "name",
    belongTo: [
      "button",
      "fieldset",
      "form",
      "iframe",
      "input",
      "map",
      "meta",
      "object",
      "output",
      "param",
      "select",
      "textarea"
    ],
    description: "Sets the name of the element"
  },
  {
    name: "novalidate",
    belongTo: ["form"],
    description: "Sets that the form should not be validated when submitted"
  },
  {
    name: "onabort",
    belongTo: ["audio", "embed", "img", "object", "video"],
    description: "Script to be run on abort"
  },
  {
    name: "onafterprint",
    belongTo: ["body"],
    description: "Script to be run after the document is printed"
  },
  {
    name: "onbeforeprint",
    belongTo: ["body"],
    description: "Script to be run before the document is printed"
  },
  {
    name: "onbeforeunload",
    belongTo: ["body"],
    description: "Script to be run when the document is about to be unloaded"
  },
  {
    name: "onblur",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element loses focus"
  },
  {
    name: "oncanplay",
    belongTo: ["audio", "embed", "object", "video"],
    description:
      "Script to be run when a file is ready to start playing (when it has buffered enough to begin)"
  },
  {
    name: "oncanplaythrough",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when a file can be played all the way to the end without pausing for buffering"
  },
  {
    name: "onchange",
    belongTo: ["Visible elements"],
    description: "Script to be run when the value of the element is changed"
  },
  {
    name: "onclick",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element is being clicked"
  },
  {
    name: "oncontextmenu",
    belongTo: ["Visible elements"],
    description: "Script to be run when a context menu is triggered"
  },
  {
    name: "oncopy",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when the content of the element is being copied"
  },
  {
    name: "oncuechange",
    belongTo: ["track"],
    description: "Script to be run when the cue changes in a track element"
  },
  {
    name: "oncut",
    belongTo: ["Visible elements"],
    description: "Script to be run when the content of the element is being cut"
  },
  {
    name: "ondblclick",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element is being double-clicked"
  },
  {
    name: "ondrag",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element is being dragged"
  },
  {
    name: "ondragend",
    belongTo: ["Visible elements"],
    description: "Script to be run at the end of a drag operation"
  },
  {
    name: "ondragenter",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when an element has been dragged to a valid drop target"
  },
  {
    name: "ondragleave",
    belongTo: ["Visible elements"],
    description: "Script to be run when an element leaves a valid drop target"
  },
  {
    name: "ondragover",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when an element is being dragged over a valid drop target"
  },
  {
    name: "ondragstart",
    belongTo: ["Visible elements"],
    description: "Script to be run at the start of a drag operation"
  },
  {
    name: "ondrop",
    belongTo: ["Visible elements"],
    description: "Script to be run when dragged element is being dropped"
  },
  {
    name: "ondurationchange",
    belongTo: ["audio", "video"],
    description: "Script to be run when the length of the media changes"
  },
  {
    name: "onemptied",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when something bad happens and the file is suddenly unavailable (like unexpectedly disconnects)"
  },
  {
    name: "onended",
    belongTo: ["audio", "video"],
    description:
      'Script to be run when the media has reach the end (a useful event for messages like "thanks for listening")'
  },
  {
    name: "onerror",
    belongTo: [
      "audio",
      "body",
      "embed",
      "img",
      "object",
      "script",
      "style",
      "video"
    ],
    description: "Script to be run when an error occurs"
  },
  {
    name: "onfocus",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element gets focus"
  },
  {
    name: "onhashchange",
    belongTo: ["body"],
    description:
      "Script to be run when there has been changes to the anchor part of the a URL"
  },
  {
    name: "oninput",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element gets user input"
  },
  {
    name: "oninvalid",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element is invalid"
  },
  {
    name: "onkeydown",
    belongTo: ["Visible elements"],
    description: "Script to be run when a user is pressing a key"
  },
  {
    name: "onkeypress",
    belongTo: ["Visible elements"],
    description: "Script to be run when a user presses a key"
  },
  {
    name: "onkeyup",
    belongTo: ["Visible elements"],
    description: "Script to be run when a user releases a key"
  },
  {
    name: "onload",
    belongTo: ["body", "iframe", "img", "input", "link", "script", "style"],
    description: "Script to be run when the element is finished loading"
  },
  {
    name: "onloadeddata",
    belongTo: ["audio", "video"],
    description: "Script to be run when media data is loaded"
  },
  {
    name: "onloadedmetadata",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when meta data (like dimensions and duration) are loaded"
  },
  {
    name: "onloadstart",
    belongTo: ["audio", "video"],
    description:
      "Script to be run just as the file begins to load before anything is actually loaded"
  },
  {
    name: "onmousedown",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when a mouse button is pressed down on an element"
  },
  {
    name: "onmousemove",
    belongTo: ["Visible elements"],
    description:
      "Script to be run as long as the mouse pointer is moving over an element"
  },
  {
    name: "onmouseout",
    belongTo: ["Visible elements"],
    description: "Script to be run when a mouse pointer moves out of an element"
  },
  {
    name: "onmouseover",
    belongTo: ["Visible elements"],
    description: "Script to be run when a mouse pointer moves over an element"
  },
  {
    name: "onmouseup",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when a mouse button is released over an element"
  },
  {
    name: "onmousewheel",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when a mouse wheel is being scrolled over an element"
  },
  {
    name: "onoffline",
    belongTo: ["body"],
    description: "Script to be run when the browser starts to work offline"
  },
  {
    name: "ononline",
    belongTo: ["body"],
    description: "Script to be run when the browser starts to work online"
  },
  {
    name: "onpagehide",
    belongTo: ["body"],
    description: "Script to be run when a user navigates away from a page"
  },
  {
    name: "onpageshow",
    belongTo: ["body"],
    description: "Script to be run when a user navigates to a page"
  },
  {
    name: "onpaste",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when the user pastes some content in an element"
  },
  {
    name: "onpause",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when the media is paused either by the user or programmatically"
  },
  {
    name: "onplay",
    belongTo: ["audio", "video"],
    description: "Script to be run when the media is ready to start playing"
  },
  {
    name: "onplaying",
    belongTo: ["audio", "video"],
    description: "Script to be run when the media actually has started playing."
  },
  {
    name: "onpopstate",
    belongTo: ["body"],
    description: "Script to be run when the windows history changes."
  },
  {
    name: "onprogress",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when the browser is in the process of getting the media data"
  },
  {
    name: "onratechange",
    belongTo: ["audio", "video"],
    description:
      "Script to be run each time the playback rate changes (like when a user switches to a slow motion or fast forward mode)."
  },
  {
    name: "onreset",
    belongTo: ["form"],
    description: "Script to be run when a reset button in a form is clicked."
  },
  {
    name: "onresize",
    belongTo: ["body"],
    description: "Script to be run when the browser window is being resized."
  },
  {
    name: "onscroll",
    belongTo: ["Visible elements"],
    description: "Script to be run when an elements scrollbar is being scrolled"
  },
  {
    name: "onsearch",
    belongTo: ["input"],
    description:
      'Script to be run when the user writes something in a search field (for input="search")'
  },
  {
    name: "onseeked",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when the seeking attribute is set to false indicating that seeking has ended"
  },
  {
    name: "onseeking",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when the seeking attribute is set to true indicating that seeking is active"
  },
  {
    name: "onselect",
    belongTo: ["Visible elements"],
    description: "Script to be run when the element gets selected"
  },
  {
    name: "onshow",
    belongTo: ["menu"],
    description:
      "Script to be run when a menu element is shown as a context menu"
  },
  {
    name: "onstalled",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when the browser is unable to fetch the media data for whatever reason"
  },
  {
    name: "onstorage",
    belongTo: ["body"],
    description: "Script to be run when a Web Storage area is updated"
  },
  {
    name: "onsubmit",
    belongTo: ["form"],
    description: "Script to be run when a form is submitted"
  },
  {
    name: "onsuspend",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when fetching the media data is stopped before it is completely loaded for whatever reason"
  },
  {
    name: "ontimeupdate",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when the playing position has changed (like when the user fast forwards to a different point in the media)"
  },
  {
    name: "ontoggle",
    belongTo: ["details"],
    description:
      "Script to be run when the user opens or closes the details element"
  },
  {
    name: "onunload",
    belongTo: ["body"],
    description:
      "Script to be run when a page has unloaded (or the browser window has been closed)"
  },
  {
    name: "onvolumechange",
    belongTo: ["audio", "video"],
    description:
      "Script to be run each time the volume of a video/audio has been changed"
  },
  {
    name: "onwaiting",
    belongTo: ["audio", "video"],
    description:
      "Script to be run when the media has paused but is expected to resume (like when the media pauses to buffer more data)"
  },
  {
    name: "onwheel",
    belongTo: ["Visible elements"],
    description:
      "Script to be run when the mouse wheel rolls up or down over an element"
  },
  {
    name: "open",
    belongTo: ["details"],
    description: "Sets that the details should be visible (open) to the user"
  },
  {
    name: "optimum",
    belongTo: ["meter"],
    description: "Sets what value is the optimal value for the gauge"
  },
  {
    name: "pattern",
    belongTo: ["input"],
    description:
      "Sets a regular expression that an input elements value is checked against"
  },
  {
    name: "placeholder",
    belongTo: ["input", "textarea"],
    description:
      "Sets a short hint that describes the expected value of the element"
  },
  {
    name: "poster",
    belongTo: ["video"],
    description:
      "Sets an image to be shown while the video is downloading or until the user hits the play button"
  },
  {
    name: "preload",
    belongTo: ["audio", "video"],
    description:
      "Sets if and how the author thinks the audio/video should be loaded when the page loads"
  },
  {
    name: "readonly",
    belongTo: ["input", "textarea"],
    description: "Sets that the element is read-only"
  },
  {
    name: "rel",
    belongTo: ["a", "area", "link"],
    description:
      "Sets the relationship between the current document and the linked document"
  },
  {
    name: "required",
    belongTo: ["input", "select", "textarea"],
    description:
      "Sets that the element must be filled out before submitting the form"
  },
  {
    name: "reversed",
    belongTo: ["ol"],
    description: "Sets that the list order should be descending (9,8,7...)"
  },
  {
    name: "rows",
    belongTo: ["textarea"],
    description: "Sets the visible number of lines in a text area"
  },
  {
    name: "rowspan",
    belongTo: ["td", "th"],
    description: "Sets the number of rows a table cell should span"
  },
  {
    name: "sandbox",
    belongTo: ["iframe"],
    description:
      "Enables an extra set of restrictions for the content in an iframe"
  },
  {
    name: "scope",
    belongTo: ["th"],
    description:
      "Sets whether a header cell is a header for a column row or group of columns or rows"
  },
  {
    name: "scoped",
    belongTo: ["style"],
    description:
      "Sets that the styles only apply to this elements parent element and that elements child elements"
  },
  {
    name: "selected",
    belongTo: ["option"],
    description:
      "Sets that an option should be pre-selected when the page loads"
  },
  {
    name: "shape",
    belongTo: ["area"],
    description: "Sets the shape of the area"
  },
  {
    name: "size",
    belongTo: ["input", "select"],
    description:
      "Sets the width in characters (for input) or specifies the number of visible options (for select)"
  },
  {
    name: "sizes",
    belongTo: ["img", "link", "source"],
    description: "Sets the size of the linked resource"
  },
  {
    name: "span",
    belongTo: ["col", "colgroup"],
    description: "Sets the number of columns to span"
  },
  {
    name: "spellcheck",
    belongTo: ["ALL"],
    description:
      "Sets whether the element is to have its spelling and grammar checked or not"
  },
  {
    name: "src",
    belongTo: [
      "audio",
      "embed",
      "iframe",
      "img",
      "input",
      "script",
      "source",
      "track",
      "video"
    ],
    description: "Sets the URL of the media file"
  },
  {
    name: "srcdoc",
    belongTo: ["iframe"],
    description: "Sets the HTML content of the page to show in the iframe"
  },
  {
    name: "srclang",
    belongTo: ["track"],
    description:
      'Sets the language of the track text data (required if kind="subtitles")'
  },
  {
    name: "srcset",
    belongTo: ["img", "source"],
    description: "Sets the URL of the image to use in different situations"
  },
  {
    name: "start",
    belongTo: ["ol"],
    description: "Sets the start value of an ordered list"
  },
  {
    name: "step",
    belongTo: ["input"],
    description: "Sets the legal number intervals for an input field"
  },
  {
    name: "style",
    belongTo: ["ALL"],
    description: "Sets an inline CSS style for an element"
  },
  {
    name: "tabindex",
    belongTo: ["ALL"],
    description: "Sets the tabbing order of an element"
  },
  {
    name: "target",
    belongTo: ["a", "area", "base", "form"],
    description:
      "Sets the target for where to open the linked document or where to submit the form"
  },
  {
    name: "title",
    belongTo: ["ALL"],
    description: "Sets extra information about an element"
  },
  {
    name: "translate",
    belongTo: ["ALL"],
    description:
      "Sets whether the content of an element should be translated or not"
  },
  {
    name: "type",
    belongTo: [
      "button",
      "embed",
      "input",
      "link",
      "menu",
      "object",
      "script",
      "source",
      "style"
    ],
    description: "Sets the type of element"
  },
  {
    name: "usemap",
    belongTo: ["img", "object"],
    description: "Sets an image as a client-side image-map"
  },
  {
    name: "value",
    belongTo: ["button", "input", "li", "option", "meter", "progress", "param"],
    description: "Sets the value of the element"
  },
  {
    name: "width",
    belongTo: ["canvas", "embed", "iframe", "img", "input", "object", "video"],
    description: "Sets the width of the element"
  },
  {
    name: "wrap",
    belongTo: ["textarea"],
    description:
      "Sets how the text in a text area is to be wrapped when submitted in a form"
  }
];
const makeBlock = block => {
  Blockly.Blocks[block.type] = {
    init: function() {
      this.jsonInit(block);
    }
  };
};
const makeBlocks = blocks => {
  blocks.forEach(block => {
    makeBlock(block);
  });
};

//blocks
export const htmlMetadataBlocks = [
  {
    type: "html",
    message0: "document %1 %2",
    args0: [
      {
        type: "input_dummy"
      },
      {
        type: "input_statement",
        name: "content",
        check: "document"
      }
    ],
    colour: 0,
    tooltip: "",
    helpUrl: "http://www.w3schools.com/tags/tag_html.asp"
  },
  {
    type: "head",
    message0: "head %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "body",
    message0: "body %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 20,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "text",
    message0: "text %1",
    args0: [
      {
        type: "field_input",
        name: "value",
        text: "default"
      }
    ],
    previousStatement: null,
    nextStatement: null,
    colour: 160,
    tooltip: "",
    helpUrl: ""
  }
];
export const htmlBasicElementsBlocks = [
  {
    type: "h1",
    message0: "Heading level 1 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h2",
    message0: "Heading level 2 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h3",
    message0: "Heading level 3 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h4",
    message0: "Heading level 4 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h5",
    message0: "Heading level 5 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "h6",
    message0: "Heading level 6 %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "p",
    message0: "paragraph %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "br",
    message0: "line breaker %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  },
  {
    type: "hr",
    message0: "thematic break %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  }
];
export const htmlStylingElements = [
  {
    type: "div",
    message0: "section %1 %2",
    args0: [
      {
        type: "input_value",
        name: "input_attributes"
      },
      {
        type: "input_statement",
        name: "input_body",
        align: "CENTRE"
      }
    ],
    inputsInline: true,
    previousStatement: null,
    nextStatement: null,
    colour: 120,
    tooltip: "",
    helpUrl: ""
  }
];
export const htmlAttributes = genAttributes(attributes);

const registerBlocks = () => {
  makeBlocks(htmlMetadataBlocks);
  makeBlocks(htmlBasicElementsBlocks);
  makeBlocks(htmlStylingElements);
  makeBlocks(htmlAttributes);
};
export default registerBlocks;
