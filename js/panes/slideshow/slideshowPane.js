/*   slideshow Pane
**
*/

// Stick a stylesheet linjk int hte document if not already there
tabulator.panes.utils.addStyleSheet = function(dom, href) {
  var links = dom.querySelectorAll('link');
  for (i=0; i<links.length; i++){
    if ((links[i].getAttribute('rel') ||'') === 'stylesheet'
    && (links[i].getAttribute('href') ||'') === href ) return ;
  }
  var link = dom.createElement("link")
  link.setAttribute("rel", "stylesheet")
  link.setAttribute("type", "text/css")
  link.setAttribute("href", href)
  dom.getElementsByTagName("head")[0].appendChild(link)
}

tabulator.panes.utils.isImage = function(file){
  var imageExtensions = {'jpg': 1, 'png':1, 'jpeg':1, 'gif':1}
  return  (tabulator.ns.dct('Image') in tabulator.kb.findTypeURIs(file)
        || file.uri.split('.').slice(-1)[0] in imageExtensions) // @@cheating
}



tabulator.loadScript("js/panes/slideshow/better-simple-slideshow/js/better-simple-slideshow.js");

// load also js/panes/slideshow/better-simple-slideshow/css/simple-slideshow-styles.css

// These used to be in js/init/icons.js but are better in the pane.
tabulator.Icon.src.icon_slideshow = tabulator.iconPrefix + 'js/panes/common/icons/noun_138712.svg';
tabulator.Icon.tooltips[tabulator.Icon.src.icon_slideshow] = 'Slideshow'

tabulator.panes.register( {

  icon: tabulator.Icon.src.icon_slideshow,

  name: 'slideshow',

  // Does the subject deserve an contact pane?
  label: function(subject) {
    var kb = tabulator.kb;
    var ns = tabulator.ns;
    var t = kb.findTypeURIs(subject);
    if (t[ns.ldp('Container').uri]|| t[ns.ldp('BasicContainer').uri]) {
      var contents = kb.each(subject, ns.ldp('contains'))
      var count = 0; contents.map(function(file){
          if(tabulator.panes.utils.isImage(file)) count++
      })
      return count > 0 ? "Slideshow" : null;
    }
    return null;
  },

  // See https://github.com/leemark/better-simple-slideshow
  // and follow instructions there
  render: function(subject, dom) {

    tabulator.panes.utils.addStyleSheet(dom, tabulator.scriptBase + 'js/panes/slideshow/better-simple-slideshow/css/simple-slideshow-styles.css')
    // for now test we don't get two!
    tabulator.panes.utils.addStyleSheet(dom, tabulator.scriptBase + 'js/panes/slideshow/better-simple-slideshow/css/simple-slideshow-styles.css')


    var kb = tabulator.kb;
    var ns = tabulator.ns;
    var div = dom.createElement("div")
    div.setAttribute('class', 'bss-slides');

    var t = kb.findTypeURIs(subject);
    var noun, predicate;
    if (t[ns.ldp('BasicContainer').uri] || t[ns.ldp('Container').uri]) {
      noun = "image"
      predicate = ns.ldp('contains')
    }
    var images = kb.each(subject, predicate); // @@ random order?
    for (i=0; i<images.length; i++){
      if (!tabulator.panes.utils.isImage(images[i])) continue;
      var figure = div.appendChild(dom.createElement('figure'))
      var img = figure.appendChild(dom.createElement('img'))
      img.setAttribute('src', images[i].uri)
      img.setAttribute('width', '100%')
      var figcaption = figure.appendChild(dom.createElement('figcaption'))
    }
    var options =  {dom: dom};

    setTimeout(function(){
      makeBSS('.bss-slides', options);
    }, 1000) // Must run after the code which called this

    return div;
  }
}, true);

//ends
