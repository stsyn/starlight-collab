var Grid = function(props, children) {
  const { _cast, ...rest } = props;

  return (
    ['.grid-wrapper', rest, [
      ['.grid', { _cast }, children]
    ]]
  );
}

var GridCell = function(props, children) {
  return (
    ['.cell', props, children]
  );
}

var ImageThumb = function(props, children) {
  const { large, background, onclick, ...rest } = props;

  if (props.preloadSrc === props.src) {
    return (
      ['.thumb', { onclick, className: large ? 'large' : '' }, [
        [background ? BackgroundImage : 'img', { _cast: rest._containerCast, ...rest }]
      ]]
    );
  }

  return (
    ['.thumb', { onclick, className: props.large ? 'large' : '' }, [
      [background ? PreloadableBackgroundImage : PreloadableImage, rest]
    ]]
  );
}

var PreloadableImage = function(props, children) {
  const { preloadSrc, _cast, _containerCast, onload, id, className, style, ...rest } = props;
  let redrawImage;
  let fullImage;

  const thumb = ['img', {
    src: preloadSrc,
    _redraw: (e) => redrawImage = e,
    width: 1000,
    height: 1000,
  }];
  const full = ['img', {
    style: { display: 'none' },
    _cast: (e) => {
      _cast && _cast(e);
      fullImage = e
    },
    onload: () => {
      onload && onload();
      redrawImage(fullImage);
      fullImage.style.removeProperty('display');
    },
    width: 1600,
    height: 1600,
    ...rest,
  }];

  return ['.container', { id, className, _cast: _containerCast }, [thumb, full]];
}

var BackgroundImage = function(props, children) {
  const { src, ...rest } = props;
  const pixel = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
  return ['img.background', { width: 1, height: 1, src: pixel, style: { backgroundImage: `url("${src}")` }, ...rest }];
}

var PreloadableBackgroundImage = function(props, children) {
  const { preloadSrc, _cast, _containerCast, onload, id, className, style, _tweak, ...rest } = props;
  let tweakImage;
  let fullImage;

  const thumb = [BackgroundImage, {
    src: preloadSrc,
    _cast,
    _tweak: (e) => {
      _tweak && _tweak(e);
      tweakImage = e;
    }
  }];
  const full = ['img', {
    style: { display: 'none' },
    _cast: (e) => {
      _cast && _cast(e);
      fullImage = e
    },
    onload: () => {
      onload && onload();
      tweakImage([{ style: { backgroundImage: `url("${props.src}")` } }]);
    },
    ...rest,
  }];

  return ['.container', { id, className, _cast: _containerCast }, [thumb, full]];
}