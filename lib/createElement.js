var ___temp___ = (function() {
  function __isAcceptableChildren(a) {
    return __isElement(a) || typeof a === 'string' || typeof a === 'number' || typeof a === 'boolean';
  }

  function __isArray(a) {
    return Array.isArray(a);
  }

  function __isElement(obj) {
    return obj instanceof HTMLElement;
  }

  function __applyAttributes(element, properties) {
    const applyAsJsField = ['innerHTML', 'checked', 'disabled', 'value', 'selected', 'className', 'crossOrigin', 'muted'];
    const applyNotAsAttribute = applyAsJsField.concat(['events', 'dataset', 'style', '_cast', '_redraw', '_tweak']);

    Object.entries(properties).forEach(([key, property]) => {
      if (property === null || property === undefined ||
        (typeof property === 'object' && applyNotAsAttribute.indexOf(key) === -1)
      ) {
        return;
      }

      if (key.startsWith('on')) {
        element.addEventListener(key.substring(2), property);
      } else if (!applyNotAsAttribute.includes(key)) {
        element.setAttribute(key, property);
      } else if (applyAsJsField.includes(key)) {
        element[key] = property;
      }
    });

    if (typeof properties.dataset === 'object') {
      Object.assign(element.dataset, properties.dataset);
    }
    if (typeof properties.style === 'object') {
      Object.assign(element.style, properties.style);
    } else if (typeof properties.style === 'string') {
      element.style = properties.style;
    }
  }

  function __createElement(tag, properties, children) {
    if (__isElement(tag)) {
      return tag;
    }

    let element = document.createElement(tag);
    __applyAttributes(element, properties);

    if (children) {
      __fillElement(element, children);
    }

    if (typeof properties._cast === 'function') {
      properties._cast(element);
    }

    if (typeof properties._redraw === 'function') {
      const renderFunction = function(rawNotation) {
        if (!element.parentNode) {
          throw new Error('Cannot redraw element without parent node!');
        }

        const parent = element.parentNode;
        let update;
        if (__isArray(rawNotation)) {
          update = createElement(rawNotation[0], rawNotation[1], rawNotation[2]);
        } else if (typeof rawNotation === 'function') {
          throw new Error('_redraw callback does not accept functions as argument');
        } else if (typeof rawNotation === 'string' || typeof rawNotation === 'number') {
          update = document.createTextNode(rawNotation);
        } else {
          update = rawNotation;
        }
        parent.replaceChild(update, element);
        element = update;
      }

      properties._redraw(renderFunction);
    }

    if (typeof properties._tweak === 'function') {
      const originListenerKeys = Object.keys(properties).filter(v => v.startsWith('on'));
      const tweakFunction = function(partialNotation) {
        if (__isArray(partialNotation[0])) {
          clearElement(element);
          __fillElement(element, partialNotation[0]);
        } else if (!__isArray(partialNotation[0])) {

          const newKeys = Object.keys(partialNotation[0]);
          originListenerKeys.filter(v => newKeys.includes(v))
            .forEach(v => element.removeEventListener(v.substring(2)));

          __applyAttributes(element, partialNotation[0]);

          if (__isArray(partialNotation[1])) {
            clearElement(element);
            __fillElement(element, partialNotation[1]);
          }
        }
      }

      properties._tweak(tweakFunction);
    }

    return element;
  }

  function __fillElement(element, items) {
    let textCollection = null;
    let isPreviousElementTextNode = false;

    function makeTextNode() {
      if (!textCollection) return;
      element.appendChild(document.createTextNode(textCollection));
      textCollection = null;
      isPreviousElementTextNode = false;
    }

    items.forEach(c => {
      if (c === undefined || c === null) {
        return;
      }
      if (__isArray(c)) {
        if (isPreviousElementTextNode) {
          makeTextNode();
        }
        const parsed = __repackAndValidate(c[0], c[1], c[2]);
        if (__isElement(parsed)) {
          element.appendChild(parsed);
        } else {
          element.appendChild(__createElement(parsed[0], parsed[1], parsed[2]));
        }
      } else if (typeof c === 'function') {
        throw new Error('Function cannot be used as a child');
      } else if (__isElement(c)) {
        if (isPreviousElementTextNode) {
          makeTextNode();
        }
        element.appendChild(c);
      } else {
        if (textCollection === null) {
          textCollection = String(c);
        } else {
          textCollection += String(c);
        }
        isPreviousElementTextNode = true;
      }
    });
    makeTextNode();
  }

  function __repackAndValidate(tag, properties, children, noCast) {
    if (__isElement(tag)) {
      return [tag];
    }
    if (typeof tag !== 'string' && typeof tag !== 'function') {
      throw new Error('Unacceptable CSS selector ' + tag);
    }
    if (__isAcceptableChildren(children) && !__isArray(children)) {
      children = [children];
    }

    if (typeof properties === 'undefined') {
      properties = {};
    } else if (__isAcceptableChildren(properties)) {
      if (__isArray(children)) {
        children.unshift(properties);
      } else {
        children = [properties];
      }
      properties = {};
    } else if (__isArray(properties)) {
      if (__isArray(children)) {
        children.concat(properties);
      } else {
        children = properties;
      }
      properties = {};
    }

    if (!noCast) {
      if (typeof tag === 'string') {
        const classes = (tag || '').split('.');
        tag = classes.shift();
        if (classes.length > 0) {
          properties.className = (properties.className ? properties.className + ' ' : '') + classes.join(' ');
        }
        let id = tag.split('#');
        tag = id.shift() || 'div';
        id = id.shift();

        if (id && !properties.id) {
          properties.id = id;
        }
      } else {
        const parsedChildren = __validateChildren(children);
        const data = tag(properties, parsedChildren);
        if (__isElement(data)) return data;
        return __repackAndValidate(data[0], data[1], data[2]);
      }
    }

    return [tag, properties, children];
  }

  function __validateChildren(children) {
    if (!children) return;
    if (!Array.isArray(children)) return children;

    return children.map(function(child) {
      if (!Array.isArray(child)) return child;

      const output = __repackAndValidate(child[0], child[1], child[2], true);
      if (output[2]) {
        output[2] = __validateChildren(output[2]);
      }

      return output;
    });
  }

  function createElement(tag, properties, children) {
    const items = __repackAndValidate(tag, properties, children);

    return __createElement(items[0], items[1], items[2]);
  }

  function fillElement(element, items) {
    if (!__isElement(element)) {
      throw new Error('Unacceptable element ' + element);
    }
    if (__isElement(items)) {
      items = [items];
    }
    if (!__isArray(items)) {
      throw new Error('Unacceptable children ' + items);
    }

    __fillElement(element, items);
  }

  function wrapElement(element, target) {
    const parent = target.parentNode;
    parent.insertBefore(element, target);
    element.appendChild(target);
  }

  function clearElement(element) {
    while (element.hasChildNodes()) {
      element.removeChild(element.lastChild);
    }
  }

  return [createElement, fillElement, wrapElement, clearElement];
})();

var createElement = ___temp___[0];
var fillElement = ___temp___[1];
var wrapElement = ___temp___[2];
var clearElement = ___temp___[3];