var head = document.getElementsByTagName('head')[0];
var insertBefore = head.insertBefore;
head.insertBefore = function (newElement, referenceElement){
    if(newElement.href && newElement.href.indexOf('//fonts.googleapis.com/css?family=Roboto') > -1) {
        // console.info('Prevented Roboto font from loading!');
        return;
    }

    // intercept style elements for modern browsers
    if(newElement.tagName.toLowerCase() === 'style' && newElement.innerHTML.indexOf('.gm-style') > -1){
        // console.info('Prevented .gm-style from loading!');
        return;
    }
    insertBefore.call(head, newElement, referenceElement);
};