var SmallThumb = (props) => {
  const { data, onclick } = props;

  return (
    [ImageThumb, {
      className: 'spoiler grid-image',
      onclick,
      src: data.largeThumbSrc,
      onload: data.onSmallThumbLoad,
      preloadSrc: data.smallThumbSrc,
      _containerCast: (e) => data.smallThumbElement = e,
    }]
  );
}

var MainGrid = (props) => {
  const { _cast, _redraw, withThumb, all, onCellClick, onscroll, onclick } = props;
  return (
    [Grid, { _cast, _redraw, onscroll, onclick }, all.map((data) =>
      [GridCell, [
        withThumb ? [SmallThumb, { onclick: () => onCellClick(data), data }] : null,
      ]],
    )]
  );
}

var LargeThumb = (props) => {
  const { data, fullIsTheSame, _tweak, onLargeThumbClick } = props;
  return (
    [ImageThumb, {
      large: true,
      src: fullIsTheSame ? data.largeThumbSrc : data.screenViewSrc,
      preloadSrc: data.largeThumbSrc,
      onload: data.onLargeThumbLoad,
      onclick: onLargeThumbClick,
      _tweak,
    }]
  );
}

var Artist = (props) => {
  const { artist, vk, twitter } = props.data;

  return (
    ['.description', [
      ['strong.name', artist],
      ['.links', [
        vk ? ['a.vk', { href: vk, target: '_blank' }] : null,
        twitter ? ['a.twitter', { href: twitter, target: '_blank' }] : null,
        ['a.share', { onclick: props.onShareClick }]
      ]],
    ]]
  );
}

var Sidebar = (props) => {
  const { current, _largeThumbTweak, onLargeThumbClick, onShareClick, ...rest } = props;

  return (
    ['.sidebar', rest, [
      [LargeThumb, { data: current, _tweak: _largeThumbTweak, onLargeThumbClick }],
      [Artist, { data: current, onShareClick }],
    ]]
  );
}

var Progressbar = (props) => {
  const { _tweak } = props;

  return (
    ['.progressbar', [
      ['.progress', { _tweak, style: 'width: 0' }],
    ]]
  );
}

var Share = (props) => {
  const { _redraw, cell, onClose,
    onTwitterShareClick, onVkShareClick, onTelegramShareClick, onFacebookShareClick, onTumblrShareClick, onOkShareClick, onCopyClick
  } = props;

  return (
    ['.share-popup', { _redraw, className: cell ? 'visible' : '', onclick: onClose }, [
      ['.share-content', { onclick: (e) => e.stopPropagation() }, [
        ['.share-header', 'Share'],
        ['.share-links', [
          ['a.vk', { onclick: () => onVkShareClick(cell) }],
          ['a.twitter', {  onclick: () => onTwitterShareClick(cell) }],
          ['a.telegram', {  onclick: () => onTelegramShareClick(cell) }],
          ['a.facebook', {  onclick: () => onFacebookShareClick(cell) }],
          ['a.tumblr', {  onclick: () => onTumblrShareClick(cell) }],
          ['a.ok', {  onclick: () => onOkShareClick(cell) }],
          ['a.copy', {  onclick: () => onCopyClick(cell) }],
        ]],
      ]],
    ]]
  );
}