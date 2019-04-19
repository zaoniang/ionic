/**
 * Removes any 'on' event handlers
 * strips javascript from 'href' props
 */
export const sanitizeDOMString = (untrustedString: string): string => {
  const whitelistedAttribs = ['class', 'id', 'href', 'src'];
  const range = document.createRange();
  const documentFragment = range.createContextualFragment(untrustedString);

  Array.from(documentFragment.children).forEach(childEl => {
    for (const attributeName of childEl.getAttributeNames()) {

      // remove non-whitelisted attribs
      if (!whitelistedAttribs.includes(attributeName.toLowerCase())) {
        childEl.removeAttribute(attributeName);
        continue;
      }

      // clean up any whitelisted attribs
      // that attempt to do any JS funny-business
      const attributeValue = childEl.getAttribute(attributeName);

      /* tslint:disable-next-line */
      if (attributeValue !== null && attributeValue.toLowerCase().includes('javascript:')) {
        childEl.removeAttribute(attributeName);
      }
    }
  });

  return new XMLSerializer().serializeToString(documentFragment);
};
