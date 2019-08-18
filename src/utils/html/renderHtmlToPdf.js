import React from 'react';
import jsdom, { JSDOM } from 'jsdom';
import { renderToFile, Document, Page } from '../../node';
import domNodeToReactComponentTree from './domNodeToComponentTree';
import createPdfElement from './createPdfElement';

const HREF =
  '../topic-page/static/protocols-plus/neuroscience_sanger-sequencing.html';

const HtmlPdfWraper = ({ node, global }) => {
  console.log(node.outerHTML);
  const PdfDomTree = domNodeToReactComponentTree({
    node,
    global,
    React: {
      createElement: createPdfElement,
    },
    blacklist: ['script', 'svg'],
  });
  return (
    <Document>
      <Page wrap>
        <PdfDomTree />
      </Page>
    </Document>
  );
};

const loadDomFromHtml = (href, { outputConsole = console, ...options } = {}) =>
  new Promise((resolve, reject) => {
    const virtualConsole = new jsdom.VirtualConsole();
    virtualConsole.sendTo(outputConsole);
    const dom = JSDOM.fromFile(href, {
      ...options,
      beforeParse(window) {
        window.addEventListener('load', () => resolve(dom));
        window.addEventListener('error', error => reject({ dom, error }));
      },
      virtualConsole,
    });
  });

const renderHtmlToPdf = async (
  href = HREF,
  options = {
    //runScripts: 'dangerously',
    resources: 'usable',
  },
) => {
  let dom;
  try {
    dom = await loadDomFromHtml(href, options);
  } catch (err) {
    const { error } = err;
    ({ dom } = err);
    console.error(error);
  }
  await renderToFile(
    <HtmlPdfWraper global={dom.window} node={dom.window.document.body} />,
    './output.pdf',
  );
  dom.window.close();
};

renderHtmlToPdf().catch(console.error);
