# FloatingSizePopup
ES6 popup for viewing HTML element sizes and in real time. Currently this needs to be added to a Tampermonkey script, however the future plan is to make it run within a website when included.

The purpose of this is to allow a user to define what kind of HTML elements they would like to track in terms of their size. The element types is set within the ```myQueryString``` constant.

The popup by default will display automatically, and can be closed by hitting the ```ESC``` key. The key sequence to press to display the popup when hidden is currently ```alt + s```, but is configurable.

###Configuring the display key sequence
1. Find the keycodes you desire. You can get them from [this interactive site](http://keycode.info/) or the [MDN](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode).
2. On line 22 the ```keyStatus``` section begins, the current format for each keycode you wish to use is as follows:

```javascript
keyCode: { //This should be the integer number for sanity's sake.  
    name: "keyName",  //This name can be anything, but it should remind you what it is.
    pos: false  //This is the default position.
}
```  
3. Once those are set, that's it, just close hide the popup and try your sequence to verify.

###Todo
1. Make it so that you can have multiply element types/ids/classes used for the query. 
2. Set the code so that it's runnable from within the file.
3. Verify all code is up to ES6 standard.

