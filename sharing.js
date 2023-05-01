function getText(nickname, forcedEng, noHashtag) {
  if ((!navigator.languages.includes('ru') && forcedEng !== false) || forcedEng) {
    return `I chose ${nickname}'s Starlight, your turn!${!noHashtag ? ' #ChooseYourStarlight' : ''}`;
  } else {
    return encodeURIComponent(`Я выбрал Старлайт от ${nickname}, твоя очередь!${!noHashtag ? ' #ChooseYourStarlight' : ''}`);
  }
}

function onTwitterShareClick(cell) {
  if (cell === RandomItem) {
    cell = Data[(randomCurrentIndex % (Data.length - 1)) + 1];
  }

  const { twitter, t, artist } = cell;
  const url = encodeURIComponent('https://a.stsyn.art/sg/' + convertString(artist));
  const nickname = twitter ? `@${t}` : artist;
  const text = getText(nickname, true, true);
  const link = `https://twitter.com/intent/tweet?text=${text}&url=${url}&hashtags=ChooseYourStarlight`;

  window.open(link);
}

function onVkShareClick(cell) {
  if (cell === RandomItem) {
    cell = Data[(randomCurrentIndex % (Data.length - 1)) + 1];
  }

  const { artist } = cell;
  const url = encodeURIComponent('https://a.stsyn.art/sg/' + convertString(artist));
  const text = getText(artist, false, true);
  const link = `https://vk.com/share.php?url=${url}&title=${text}`;

  window.open(link);
}

function onTelegramShareClick(cell) {
  if (cell === RandomItem) {
    cell = Data[(randomCurrentIndex % (Data.length - 1)) + 1];
  }

  const { artist } = cell;
  const url = encodeURIComponent('https://a.stsyn.art/sg/' + convertString(artist));
  const text = getText(artist);
  const link = `https://t.me/share/url?url=${url}&text=${text}`;

  window.open(link);
}

function onFacebookShareClick(cell) {
  if (cell === RandomItem) {
    cell = Data[(randomCurrentIndex % (Data.length - 1)) + 1];
  }

  const { artist } = cell;
  const url = encodeURIComponent('https://a.stsyn.art/sg/' + convertString(artist));
  const text = getText(artist);
  const link = `https://www.facebook.com/sharer.php?s=100&p[url]=${url}&p[summary]=${text}`;

  window.open(link);
}

function onTumblrShareClick(cell) {
  if (cell === RandomItem) {
    cell = Data[(randomCurrentIndex % (Data.length - 1)) + 1];
  }

  const { artist } = cell;
  const url = encodeURIComponent('https://a.stsyn.art/sg/' + convertString(artist));
  const text = getText(artist, true, true);
  const link = `https://www.tumblr.com/widgets/share/tool?posttype=link&title=Choose+your+Starlight!&caption=${text}&content=${url}&tags=ChooseYourStarlight&canonicalUrl=${url}&shareSource=tumblr_share_button`;

  window.open(link);
}

function onOkShareClick(cell) {
  if (cell === RandomItem) {
    cell = Data[(randomCurrentIndex % (Data.length - 1)) + 1];
  }

  const { artist } = cell;
  const url = encodeURIComponent('https://a.stsyn.art/sg/' + convertString(artist));
  const text = getText(artist, false);
  const link = `https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&st.title=${text.replace(/%20/g, '+')}&st.shareUrl=${url}`;

  window.open(link);
}

function onCopyClick(cell) {
  if (cell === RandomItem) {
    cell = Data[(randomCurrentIndex % (Data.length - 1)) + 1];
  }

  const { artist } = cell;
  const url ='https://a.stsyn.art/sg/' + convertString(artist);
  navigator.clipboard.writeText(url).then(() => alert('Link copied!'));
}